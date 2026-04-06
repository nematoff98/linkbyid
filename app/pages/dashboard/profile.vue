<script setup lang="ts">
import { DocumentCopy } from '@element-plus/icons-vue'
import { computed, ref, watch } from 'vue'
import ProfileForm from '~/components/dashboard/ProfileForm.vue'
import PublicProfilePreview from '~/components/dashboard/PublicProfilePreview.vue'
import { useDashboardData } from '~/composables/useDashboardData'
import { profileService } from '~/services/profile.service'
import type { ProfileSettings } from '~/types/dashboard'
import { getApiErrorMessage } from '~/utils/apiError'

definePageMeta({ layout: 'dashboard' })

const { profile, currentUserId, loadMyProfile, profileLoading: dashboardProfileLoading } = useDashboardData()
const saved = ref(false)
const draftProfile = ref<ProfileSettings>({ ...profile.value })
/** Local spinner for explicit refresh in loadProfile() */
const profileLoading = ref(false)
const saveLoading = ref(false)
const pageError = ref('')

const config = useRuntimeConfig()
const requestURL = useRequestURL()

const publicSiteOrigin = computed(() => {
  const fromEnv = String(config.public.siteUrl || '').trim().replace(/\/+$/, '')
  if (fromEnv) return fromEnv
  if (import.meta.client && typeof window !== 'undefined') return window.location.origin
  return `${requestURL.protocol}//${requestURL.host}`
})

/** Uses saved username from API only — updates after Save, not while typing in the form. */
const publicProfileUrl = computed(() => {
  const u = profile.value.username?.trim()
  if (!u) return ''
  return `${publicSiteOrigin.value}/u/${encodeURIComponent(u)}`
})

const copiedPublicUrl = ref(false)
let copiedPublicUrlTimer: ReturnType<typeof setTimeout> | undefined

const copyPublicProfileUrl = async () => {
  const url = publicProfileUrl.value
  if (!url) return
  try {
    await navigator.clipboard.writeText(url)
    copiedPublicUrl.value = true
    if (copiedPublicUrlTimer) clearTimeout(copiedPublicUrlTimer)
    copiedPublicUrlTimer = setTimeout(() => {
      copiedPublicUrl.value = false
    }, 2000)
  } catch {
    pageError.value = 'Could not copy link. Check browser permissions.'
  }
}

watch(profile, (value) => {
  draftProfile.value = { ...value }
}, { deep: true, immediate: true })

const normalizeAvatarUrl = (value: string) => {
  const trimmed = value.trim()
  if (!trimmed) return ''
  try {
    const parsed = new URL(trimmed)
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') return trimmed
    return ''
  } catch {
    return ''
  }
}

const saveProfile = async (payload: { profile: ProfileSettings; avatarFile: File | null }) => {
  if (!currentUserId.value) return
  const cleanUsername = payload.profile.username?.trim() || ''
  if (!cleanUsername) {
    pageError.value = 'Username is required.'
    return
  }
  saveLoading.value = true
  pageError.value = ''
  try {
    await profileService.updateProfile(currentUserId.value, {
      username: cleanUsername,
      bio: payload.profile.bio,
      avatarUrl: payload.avatarFile ? '' : normalizeAvatarUrl(payload.profile.avatar),
      avatar: payload.avatarFile
    })
    await loadMyProfile(true)
    draftProfile.value = { ...profile.value }
    pendingAvatarPreview.value = null
    saved.value = true
    setTimeout(() => { saved.value = false }, 1500)
  } catch (error) {
    pageError.value = getApiErrorMessage(error)
  } finally {
    saveLoading.value = false
  }
}

const updatePreview = (payload: ProfileSettings) => {
  draftProfile.value = payload
}

/** Blob URL from ProfileForm — show in PublicProfilePreview before Save. */
const pendingAvatarPreview = ref<string | null>(null)

const onAvatarPreview = (url: string | null) => {
  pendingAvatarPreview.value = url
}

const previewProfile = computed(() => ({
  ...draftProfile.value,
  avatar: pendingAvatarPreview.value || draftProfile.value.avatar
}))

const profileDataReady = computed(
  () => !dashboardProfileLoading.value && !profileLoading.value
)

/** Saved profile has no username — user must set it before sharing /u/… */
const showUsernameRequiredBanner = computed(
  () => profileDataReady.value && !profile.value.username?.trim()
)
</script>

<template>
  <div>
    <p v-if="dashboardProfileLoading || profileLoading" class="mb-3 text-sm text-neutral-500 dark:text-neutral-400">Loading profile…</p>

    <div
      v-if="showUsernameRequiredBanner"
      role="alert"
      class="mb-4 rounded-2xl border border-amber-300/90 bg-amber-50 px-4 py-3 text-sm text-amber-950 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-100"
    >
      <p class="font-semibold text-amber-900 dark:text-amber-50">Set your username first</p>
      <p class="mt-1 text-amber-900/90 dark:text-amber-100/90">
        Choose a unique username below and click <span class="font-medium">Save profile</span>. Your public page
        (<span class="font-mono text-xs">/u/username</span>) and share link only work after you save a username.
      </p>
    </div>

    <p v-if="pageError" class="mb-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">{{ pageError }}</p>

    <section
      v-if="publicProfileUrl"
      class="mb-5 rounded-2xl border border-indigo-200/80 bg-gradient-to-br from-indigo-50/90 to-white p-4 shadow-sm dark:border-indigo-500/25 dark:from-indigo-950/40 dark:to-neutral-900 dark:shadow-none sm:p-5"
    >
      <p class="text-xs font-semibold uppercase tracking-wide text-indigo-700 dark:text-indigo-300">Your public page</p>
      <p class="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
        Share this link in your bio — visitors open it and search by code.
      </p>
      <div class="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
        <a
          :href="publicProfileUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="min-w-0 flex-1 truncate rounded-xl border border-neutral-200 bg-white px-3 py-2.5 font-mono text-sm text-indigo-700 underline-offset-2 hover:underline dark:border-white/15 dark:bg-neutral-950 dark:text-indigo-300"
          :title="publicProfileUrl"
        >
          {{ publicProfileUrl }}
        </a>
        <button
          type="button"
          class="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-indigo-200 bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-500 dark:border-indigo-400/40 dark:bg-indigo-500 dark:hover:bg-indigo-400"
          :aria-label="copiedPublicUrl ? 'Copied' : 'Copy public profile URL'"
          @click="copyPublicProfileUrl"
        >
          <el-icon class="text-base"><DocumentCopy /></el-icon>
          <span>{{ copiedPublicUrl ? 'Copied' : 'Copy' }}</span>
        </button>
      </div>
    </section>

    <div class="grid grid-cols-1 gap-5 xl:grid-cols-2">
      <div :class="saveLoading ? 'pointer-events-none opacity-70' : ''">
        <ProfileForm
          :model-value="draftProfile"
          :loading="saveLoading"
          @save="saveProfile"
          @change="updatePreview"
          @avatar-preview="onAvatarPreview"
        />
      </div>
      <PublicProfilePreview :profile="previewProfile" />
    </div>
    <p v-if="saved" class="mt-3 text-sm text-emerald-600">Profile saved.</p>
  </div>
</template>
