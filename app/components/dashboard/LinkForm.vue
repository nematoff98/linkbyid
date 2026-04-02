<script setup lang="ts">
import type { LinkFormPayload } from '~/services/links.service'
import type { DashboardLink } from '~/types/dashboard'

const props = defineProps<{ initialLink?: DashboardLink | null; loading?: boolean }>()
const emit = defineEmits<{ (e: 'save', payload: Omit<LinkFormPayload, 'userId'>): void; (e: 'cancel'): void }>()

const form = reactive({ customCode: '', url: '', title: '', description: '', imageUrl: '' })
const imageFile = ref<File | null>(null)
const imagePreview = ref('')
const metadataLoading = ref(false)
const metadataError = ref('')
const formError = ref('')

watch(() => props.initialLink, (link) => {
  form.customCode = link?.code || ''
  form.url = link?.url || ''
  form.title = link?.title || ''
  form.description = link?.description || ''
  form.imageUrl = link?.image || ''
  imageFile.value = null
  imagePreview.value = ''
  formError.value = ''
}, { immediate: true })

const imageSource = computed(() => imagePreview.value || form.imageUrl)
const onImageUrlInput = () => { imageFile.value = null; imagePreview.value = '' }

const onImageUpload = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  if (!allowed.includes(file.type)) return (formError.value = 'Image format: JPEG, PNG, WebP yoki GIF bo‘lishi kerak.')
  if (file.size > 5 * 1024 * 1024) return (formError.value = 'Image hajmi 5MB dan oshmasligi kerak.')
  formError.value = ''
  imageFile.value = file
  imagePreview.value = URL.createObjectURL(file)
  form.imageUrl = ''
}

const applyMetadata = async () => {
  if (!form.url.trim()) return
  metadataLoading.value = true
  metadataError.value = ''
  try {
    if (!form.url.startsWith('http')) throw new Error('Invalid URL')
    const host = new URL(form.url).hostname.replace('www.', '')
    await new Promise(resolve => setTimeout(resolve, 450))
    const meta = { title: `Product from ${host}`, description: `Auto-fetched metadata for ${host}`, image: `https://picsum.photos/seed/${encodeURIComponent(host)}/300/200` }
    form.title ||= meta.title
    form.description ||= meta.description
    if (!imageFile.value && !form.imageUrl) form.imageUrl = meta.image
  } catch (error) {
    metadataError.value = error instanceof Error ? error.message : 'Metadata fetch failed'
  } finally { metadataLoading.value = false }
}

const submit = () => {
  if (!form.url.trim()) {
    formError.value = 'URL is required.'
    return
  }
  formError.value = ''
  emit('save', {
    url: form.url.trim(),
    title: form.title.trim() || undefined,
    customCode: form.customCode.trim(),
    description: form.description.trim(),
    imageUrl: imageFile.value ? '' : form.imageUrl.trim(),
    image: imageFile.value
  })
}
</script>

<template>
  <form class="space-y-3 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-neutral-900" @submit.prevent="submit">
    <div class="grid grid-cols-1 gap-3 md:grid-cols-2">
      <input v-model="form.customCode" type="text" placeholder="Custom code (optional)" class="rounded-xl border border-neutral-200 px-3 py-2 text-sm dark:border-white/10 dark:bg-neutral-800">
      <div class="flex gap-2">
        <input v-model="form.url" type="url" placeholder="https://example.com" class="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm dark:border-white/10 dark:bg-neutral-800">
        <button type="button" class="rounded-xl border border-neutral-200 px-3 text-sm hover:bg-neutral-50 dark:border-white/10 dark:hover:bg-white/10" :disabled="metadataLoading" @click="applyMetadata">{{ metadataLoading ? '...' : 'Fetch' }}</button>
      </div>
      <input v-model="form.title" type="text" placeholder="Title" class="rounded-xl border border-neutral-200 px-3 py-2 text-sm dark:border-white/10 dark:bg-neutral-800">
      <input v-model="form.imageUrl" type="url" placeholder="Image URL (https://...)" class="rounded-xl border border-neutral-200 px-3 py-2 text-sm dark:border-white/10 dark:bg-neutral-800" @input="onImageUrlInput">
    </div>
    <div class="flex items-center gap-3">
      <img v-if="imageSource" :src="imageSource" alt="Link image preview" class="h-12 w-12 rounded-lg object-cover">
      <label class="cursor-pointer rounded-xl border border-neutral-200 px-3 py-2 text-sm hover:bg-neutral-50 dark:border-white/10 dark:hover:bg-white/10">
        Upload image
        <input type="file" class="hidden" accept="image/*" @change="onImageUpload">
      </label>
    </div>
    <textarea v-model="form.description" rows="2" placeholder="Description" class="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm dark:border-white/10 dark:bg-neutral-800" />
    <p v-if="metadataError || formError" class="text-xs text-red-600">{{ metadataError || formError }}</p>
    <div class="flex items-center gap-2">
      <button type="submit" class="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-indigo-500" :disabled="props.loading">Save link</button>
      <button v-if="props.initialLink" type="button" class="rounded-xl border border-neutral-200 px-4 py-2 text-sm dark:border-white/10" @click="emit('cancel')">Cancel</button>
    </div>
  </form>
</template>
