<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import ProfileForm from '~/components/dashboard/ProfileForm.vue'
import PublicProfilePreview from '~/components/dashboard/PublicProfilePreview.vue'
import { useDashboardData } from '~/composables/useDashboardData'
import { profileService } from '~/services/profile.service'
import type { ProfileSettings } from '~/types/dashboard'

definePageMeta({ layout: 'dashboard' })

const { profile, currentUserId, loadMyProfile } = useDashboardData()
const saved = ref(false)
const draftProfile = ref<ProfileSettings>({ ...profile.value })
const profileLoading = ref(false)
const saveLoading = ref(false)
const pageError = ref('')

watch(profile, (value) => {
  draftProfile.value = { ...value }
}, { deep: true })

const getApiErrorMessage = (error: unknown) => {
  const fallback = 'So‘rov bajarilmadi. Iltimos qayta urinib ko‘ring.'
  if (!error || typeof error !== 'object') return fallback
  const data = (error as { data?: Record<string, unknown> }).data
  const rootMessage = data?.message
  const nestedError = data?.error as Record<string, unknown> | undefined
  const nestedMessage = nestedError?.message
  if (Array.isArray(nestedMessage) && nestedMessage.length > 0) return nestedMessage.join(', ')
  if (typeof nestedMessage === 'string' && nestedMessage.trim()) return nestedMessage
  if (typeof rootMessage === 'string' && rootMessage.trim()) return rootMessage
  if (Array.isArray(rootMessage) && rootMessage.length > 0) return rootMessage.join(', ')
  if (data?.error && typeof data.error === 'string') return data.error
  if (error instanceof Error) return error.message
  return fallback
}

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

const loadProfile = async (withLoading = true) => {
  if (withLoading) profileLoading.value = true
  pageError.value = ''
  try {
    await loadMyProfile(true)
    draftProfile.value = { ...profile.value }
  } catch (error) {
    pageError.value = getApiErrorMessage(error)
  } finally {
    if (withLoading) profileLoading.value = false
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

onMounted(loadProfile)
</script>

<template>
  <div>
    <p v-if="profileLoading" class="mb-3 text-sm text-neutral-500 dark:text-neutral-400">Profil ma'lumotlari yuklanmoqda...</p>
    <p v-if="pageError" class="mb-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">{{ pageError }}</p>
    <div class="grid grid-cols-1 gap-5 xl:grid-cols-2">
      <div :class="saveLoading ? 'pointer-events-none opacity-70' : ''">
        <ProfileForm :model-value="draftProfile" :loading="saveLoading" @save="saveProfile" @change="updatePreview" />
      </div>
      <PublicProfilePreview :profile="draftProfile" />
    </div>
    <p v-if="saved" class="mt-3 text-sm text-emerald-600">Profile saved.</p>
  </div>
</template>
