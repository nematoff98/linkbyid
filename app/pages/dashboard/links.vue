<script setup lang="ts">
import LinkForm from '~/components/dashboard/LinkForm.vue'
import LinkCard from '~/components/dashboard/LinkCard.vue'
import { linksService } from '~/services/links.service'
import type { DashboardLink } from '~/types/dashboard'
import { getApiErrorMessage } from '~/utils/apiError'

definePageMeta({ layout: 'dashboard' })

const { links, profile, currentUserId, profileLoading, loadMyProfile } = useDashboardData()
const editingLink = ref<DashboardLink | null>(null)
const loading = ref(false)
const saveLoading = ref(false)
const deletingId = ref('')
const pageError = ref('')
const page = ref(1)
const limit = ref(10)
const totalPages = ref(1)
const formResetKey = ref(0)
const showUsernameWarning = computed(() => !profileLoading.value && !profile.value.username?.trim())

const loadLinks = async () => {
  loading.value = true
  pageError.value = ''
  try {
    const response = await linksService.getMyLinks(page.value, limit.value)
    links.value = response.items
    totalPages.value = response.total_pages || 1
  } catch (error) {
    pageError.value = getApiErrorMessage(error)
  } finally {
    loading.value = false
  }
}

const saveLink = async (payload: {
  url: string
  title?: string
  customCode?: string
  description?: string
  imageUrl?: string
  image?: File | null
}) => {
  if (!currentUserId.value) {
    await loadMyProfile(true).catch(() => {})
  }
  if (!currentUserId.value) {
    pageError.value = 'Profile data could not be loaded. Please sign in again.'
    return
  }
  if (!profile.value.username?.trim()) {
    await loadMyProfile(true).catch(() => {})
  }
  if (!editingLink.value && !profile.value.username?.trim()) {
    pageError.value = 'Set a username on the Profile page first.'
    return
  }
  saveLoading.value = true
  pageError.value = ''
  const isCreating = !editingLink.value
  try {
    if (editingLink.value) await linksService.updateLink(editingLink.value.id, payload)
    else await linksService.createLink({ ...payload, userId: currentUserId.value })
    await loadLinks()
    if (isCreating) formResetKey.value += 1
    editingLink.value = null
  } catch (error) {
    pageError.value = getApiErrorMessage(error)
  } finally { saveLoading.value = false }
}

const removeLink = async (id: string) => {
  deletingId.value = id
  pageError.value = ''
  try {
    await linksService.deleteLink(id)
    if (links.value.length === 1 && page.value > 1) page.value -= 1
    await loadLinks()
  } catch (error) {
    pageError.value = getApiErrorMessage(error)
  } finally { deletingId.value = '' }
}

const startEdit = (link: DashboardLink) => { editingLink.value = link }
const cancelEdit = () => { editingLink.value = null }
const prevPage = async () => { if (page.value > 1) { page.value -= 1; await loadLinks() } }
const nextPage = async () => { if (page.value < totalPages.value) { page.value += 1; await loadLinks() } }

onMounted(() => {
  void loadLinks()
})
</script>

<template>
  <div>
    <div
      v-if="showUsernameWarning"
      class="mb-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200"
    >
      Set your username on the <NuxtLink to="/dashboard/profile" class="font-medium underline">Profile</NuxtLink> page before adding links.
    </div>
    <LinkForm :key="`link-form-${formResetKey}-${editingLink?.id || 'new'}`" :initial-link="editingLink" :loading="saveLoading" @save="saveLink" @cancel="cancelEdit" />
    <p v-if="pageError" class="mt-3 text-sm text-red-600">{{ pageError }}</p>

    <section class="mt-6 space-y-3">
      <h2 class="text-base font-semibold text-neutral-900 dark:text-white">Your Links</h2>
      <div v-if="loading || saveLoading" class="rounded-xl border border-neutral-200 bg-white p-4 text-sm text-neutral-500 dark:border-white/10 dark:bg-neutral-900 dark:text-neutral-400">Loading links...</div>
      <div v-else-if="links.length === 0" class="rounded-xl border border-dashed border-neutral-300 bg-white p-6 text-center text-sm text-neutral-500 dark:border-white/20 dark:bg-neutral-900 dark:text-neutral-400">
        No links yet. Add your first product link above.
      </div>
      <template v-else>
        <LinkCard v-for="link in links" :key="link.id" :link="link" @edit="startEdit" @delete="removeLink" />
        <p v-if="deletingId" class="text-xs text-neutral-500 dark:text-neutral-400">Deleting link...</p>
      </template>
      <div class="flex items-center justify-end gap-2 pt-2">
        <button type="button" class="rounded-lg border border-neutral-200 px-3 py-1.5 text-sm disabled:opacity-50 dark:border-white/10" :disabled="page <= 1 || loading" @click="prevPage">Prev</button>
        <span class="text-xs text-neutral-500 dark:text-neutral-400">Page {{ page }} / {{ totalPages }}</span>
        <button type="button" class="rounded-lg border border-neutral-200 px-3 py-1.5 text-sm disabled:opacity-50 dark:border-white/10" :disabled="page >= totalPages || loading" @click="nextPage">Next</button>
      </div>
    </section>
  </div>
</template>
