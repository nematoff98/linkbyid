<script setup lang="ts">
import type { DashboardLink } from '~/types/dashboard'

const props = defineProps<{ initialLink?: DashboardLink | null; loading?: boolean }>()
const emit = defineEmits<{ (e: 'save', payload: Omit<DashboardLink, 'id' | 'clicks' | 'createdAt'>): void; (e: 'cancel'): void }>()
const { fetchMetadata, generateCode } = useDashboardData()

const form = reactive({ code: '', url: '', title: '', description: '', image: '' })
const metadataLoading = ref(false)
const metadataError = ref('')
const formError = ref('')

watch(() => props.initialLink, (link) => {
  form.code = link?.code || ''
  form.url = link?.url || ''
  form.title = link?.title || ''
  form.description = link?.description || ''
  form.image = link?.image || ''
  formError.value = ''
}, { immediate: true })

const applyMetadata = async () => {
  if (!form.url.trim()) return
  metadataLoading.value = true
  metadataError.value = ''
  try {
    const meta = await fetchMetadata(form.url)
    form.title ||= meta.title
    form.description ||= meta.description
    form.image ||= meta.image
  } catch (error) {
    metadataError.value = error instanceof Error ? error.message : 'Metadata fetch failed'
  } finally { metadataLoading.value = false }
}

const submit = () => {
  if (!form.url.trim() || !form.title.trim()) {
    formError.value = 'URL and title are required.'
    return
  }
  formError.value = ''
  emit('save', { code: form.code || generateCode(), url: form.url, title: form.title, description: form.description, image: form.image })
}
</script>

<template>
  <form class="space-y-3 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-neutral-900" @submit.prevent="submit">
    <div class="grid grid-cols-1 gap-3 md:grid-cols-2">
      <input v-model="form.code" type="text" placeholder="Code (optional)" class="rounded-xl border border-neutral-200 px-3 py-2 text-sm dark:border-white/10 dark:bg-neutral-800">
      <div class="flex gap-2">
        <input v-model="form.url" type="url" placeholder="https://example.com" class="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm dark:border-white/10 dark:bg-neutral-800">
        <button type="button" class="rounded-xl border border-neutral-200 px-3 text-sm hover:bg-neutral-50 dark:border-white/10 dark:hover:bg-white/10" :disabled="metadataLoading" @click="applyMetadata">{{ metadataLoading ? '...' : 'Fetch' }}</button>
      </div>
      <input v-model="form.title" type="text" placeholder="Title" class="rounded-xl border border-neutral-200 px-3 py-2 text-sm dark:border-white/10 dark:bg-neutral-800">
      <input v-model="form.image" type="url" placeholder="Image URL" class="rounded-xl border border-neutral-200 px-3 py-2 text-sm dark:border-white/10 dark:bg-neutral-800">
    </div>
    <textarea v-model="form.description" rows="2" placeholder="Description" class="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm dark:border-white/10 dark:bg-neutral-800" />
    <p v-if="metadataError || formError" class="text-xs text-red-600">{{ metadataError || formError }}</p>
    <div class="flex items-center gap-2">
      <button type="submit" class="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-indigo-500" :disabled="props.loading">Save link</button>
      <button v-if="props.initialLink" type="button" class="rounded-xl border border-neutral-200 px-4 py-2 text-sm dark:border-white/10" @click="emit('cancel')">Cancel</button>
    </div>
  </form>
</template>
