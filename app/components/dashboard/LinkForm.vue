<script setup lang="ts">
import type { LinkFormPayload } from '~/services/links.service'
import type { DashboardLink } from '~/types/dashboard'
import { fetchLinkPreview, normalizeLinkPreview } from '~/services/linkPreview.service'

const props = defineProps<{ initialLink?: DashboardLink | null; loading?: boolean }>()
const emit = defineEmits<{ (e: 'save', payload: Omit<LinkFormPayload, 'userId'>): void; (e: 'cancel'): void }>()

const api = useApi()

const form = reactive({ customCode: '', url: '', title: '', description: '', imageUrl: '' })
const imageFile = ref<File | null>(null)
const imagePreview = ref('')
const metadataLoading = ref(false)
const metadataError = ref('')
const partialWarning = ref('')
const formError = ref('')

let partialWarningTimer: ReturnType<typeof setTimeout> | null = null

const clearPartialWarningTimer = () => {
  if (partialWarningTimer) {
    clearTimeout(partialWarningTimer)
    partialWarningTimer = null
  }
}

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

const hasFetchableUrl = computed(() => {
  const u = form.url.trim()
  if (!u) return false
  try {
    const parsed = new URL(u)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
})

const onImageUpload = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  if (!allowed.includes(file.type)) return (formError.value = 'Use JPEG, PNG, WebP, or GIF.')
  if (file.size > 5 * 1024 * 1024) return (formError.value = 'Image must be 5MB or smaller.')
  formError.value = ''
  imageFile.value = file
  imagePreview.value = URL.createObjectURL(file)
  form.imageUrl = ''
}

const applyMetadata = async () => {
  if (!hasFetchableUrl.value) return
  metadataLoading.value = true
  metadataError.value = ''
  partialWarning.value = ''
  clearPartialWarningTimer()
  try {
    const raw = await fetchLinkPreview(api, form.url.trim())
    const meta = normalizeLinkPreview(raw)
    const t = meta.title.trim()
    const d = meta.description.trim()
    const img = meta.imageUrl.trim()
    const hasAny = Boolean(t || d || img)
    if (!hasAny) {
      metadataError.value = 'Could not fetch metadata. Please fill in manually.'
      return
    }
    if (t) form.title = t
    if (d) form.description = d
    if (img && !imageFile.value) {
      form.imageUrl = img
      imagePreview.value = ''
    }
    const hasAll = Boolean(t && d && img)
    if (!hasAll) {
      partialWarning.value = 'Could not fetch complete metadata. Some fields may be empty.'
      partialWarningTimer = setTimeout(() => {
        partialWarning.value = ''
        partialWarningTimer = null
      }, 4500)
    }
  } catch {
    metadataError.value = 'Could not fetch metadata. Please fill in manually.'
  } finally {
    metadataLoading.value = false
  }
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

onUnmounted(() => clearPartialWarningTimer())
</script>

<template>
  <form class="space-y-3 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-neutral-900" @submit.prevent="submit">
    <div class="grid grid-cols-1 gap-3 md:grid-cols-2">
      <input v-model="form.customCode" type="text" placeholder="Custom code (optional)" class="rounded-xl border border-neutral-200 px-3 py-2 text-sm dark:border-white/10 dark:bg-neutral-800">
      <div class="flex gap-2">
        <input v-model="form.url" type="url" placeholder="https://example.com" class="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm dark:border-white/10 dark:bg-neutral-800">
        <button
          type="button"
          class="shrink-0 rounded-xl border border-neutral-200 px-3 text-sm hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:hover:bg-white/10"
          :disabled="!hasFetchableUrl || metadataLoading || props.loading"
          @click="applyMetadata"
        >
          {{ metadataLoading ? 'Fetching…' : 'Fetch' }}
        </button>
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
    <p v-if="partialWarning" class="text-xs text-amber-700 dark:text-amber-300">{{ partialWarning }}</p>
    <p v-if="metadataError || formError" class="text-xs text-red-600 dark:text-red-400">{{ metadataError || formError }}</p>
    <div class="flex items-center gap-2">
      <button type="submit" class="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-indigo-500" :disabled="props.loading">Save link</button>
      <button v-if="props.initialLink" type="button" class="rounded-xl border border-neutral-200 px-4 py-2 text-sm dark:border-white/10" @click="emit('cancel')">Cancel</button>
    </div>
  </form>
</template>
