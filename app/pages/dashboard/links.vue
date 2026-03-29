<script setup lang="ts">
import DashboardLayout from '~/components/dashboard/DashboardLayout.vue'
import LinkForm from '~/components/dashboard/LinkForm.vue'
import LinkCard from '~/components/dashboard/LinkCard.vue'
import type { DashboardLink } from '~/types/dashboard'

const { links, upsertLink, deleteLink } = useDashboardData()
const editingLink = ref<DashboardLink | null>(null)
const saveLoading = ref(false)
const pageError = ref('')

const saveLink = async (payload: Omit<DashboardLink, 'id' | 'clicks' | 'createdAt'>) => {
  saveLoading.value = true
  pageError.value = ''
  try {
    await new Promise(resolve => setTimeout(resolve, 450))
    upsertLink(payload, editingLink.value?.id)
    editingLink.value = null
  } catch {
    pageError.value = 'Failed to save link. Please try again.'
  } finally { saveLoading.value = false }
}

const startEdit = (link: DashboardLink) => { editingLink.value = link }
const cancelEdit = () => { editingLink.value = null }
</script>

<template>
  <DashboardLayout title="Manage Links">
    <LinkForm :initial-link="editingLink" :loading="saveLoading" @save="saveLink" @cancel="cancelEdit" />
    <p v-if="pageError" class="mt-3 text-sm text-red-600">{{ pageError }}</p>

    <section class="mt-6 space-y-3">
      <h2 class="text-base font-semibold text-neutral-900 dark:text-white">Your Links</h2>
      <div v-if="saveLoading" class="rounded-xl border border-neutral-200 bg-white p-4 text-sm text-neutral-500 dark:border-white/10 dark:bg-neutral-900 dark:text-neutral-400">Saving changes...</div>
      <div v-else-if="links.length === 0" class="rounded-xl border border-dashed border-neutral-300 bg-white p-6 text-center text-sm text-neutral-500 dark:border-white/20 dark:bg-neutral-900 dark:text-neutral-400">
        No links yet. Add your first product link above.
      </div>
      <LinkCard v-for="link in links" v-else :key="link.id" :link="link" @edit="startEdit" @delete="deleteLink" />
    </section>
  </DashboardLayout>
</template>
