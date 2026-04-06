<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import type { ProfileSettings } from '~/types/dashboard'
import avatarIcon from '~/assets/icons/avatar.svg'

const props = defineProps<{ modelValue: ProfileSettings; loading?: boolean }>()
interface SaveProfilePayload {
  profile: ProfileSettings
  avatarFile: File | null
}
const emit = defineEmits<{
  (e: 'save', payload: SaveProfilePayload): void
  (e: 'change', payload: ProfileSettings): void
  /** Blob URL while a file is selected (not saved); `null` when preview cleared. */
  (e: 'avatar-preview', url: string | null): void
}>()

function emitAvatarPreview() {
  emit('avatar-preview', avatarPreview.value || null)
}

const profileForm = reactive({ ...props.modelValue })
const formError = ref('')
const avatarFile = ref<File | null>(null)
const avatarPreview = ref('')
const avatarSrc = computed(() => avatarPreview.value || profileForm.avatar || '')
const hasCustomAvatar = computed(() => Boolean(avatarPreview.value || profileForm.avatar))

const ALLOWED_AVATAR_MIME = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
const ALLOWED_AVATAR_EXT = /\.(jpe?g|png|webp|gif)$/i

function isAllowedAvatarFile(file: File): boolean {
  if (file.type && ALLOWED_AVATAR_MIME.has(file.type)) return true
  return ALLOWED_AVATAR_EXT.test(file.name)
}

watch(() => props.modelValue, (value) => {
  Object.assign(profileForm, value)
  const av = (value.avatar ?? '').trim()
  if (avatarFile.value && av) {
    if (avatarPreview.value?.startsWith('blob:')) URL.revokeObjectURL(avatarPreview.value)
    avatarFile.value = null
    avatarPreview.value = ''
    emitAvatarPreview()
  }
}, { deep: true, immediate: true })
watch(profileForm, () => emit('change', { ...profileForm }), { deep: true })

const onAvatarChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  if (!isAllowedAvatarFile(file)) {
    formError.value = 'Allowed: JPG, JPEG, PNG, WebP, or GIF (max 3 MB).'
    input.value = ''
    return
  }
  if (file.size > 3 * 1024 * 1024) {
    formError.value = 'Avatar must be 3MB or smaller.'
    input.value = ''
    return
  }
  formError.value = ''
  avatarFile.value = file
  if (avatarPreview.value?.startsWith('blob:')) URL.revokeObjectURL(avatarPreview.value)
  avatarPreview.value = URL.createObjectURL(file)
  profileForm.avatar = ''
  input.value = ''
  emitAvatarPreview()
}

const onAvatarUrlInput = () => {
  if (avatarPreview.value?.startsWith('blob:')) URL.revokeObjectURL(avatarPreview.value)
  avatarFile.value = null
  avatarPreview.value = ''
  emitAvatarPreview()
}

const onAvatarError = (event: Event) => {
  const target = event.target as HTMLImageElement
  if (target.src === avatarIcon) return
  if (avatarPreview.value?.startsWith('blob:')) URL.revokeObjectURL(avatarPreview.value)
  avatarPreview.value = ''
  profileForm.avatar = ''
  emitAvatarPreview()
}

const submit = () => {
  if (!profileForm.username.trim()) {
    formError.value = 'Username is required.'
    return
  }
  formError.value = ''
  emit('save', { profile: { ...profileForm }, avatarFile: avatarFile.value })
}
</script>

<template>
  <form class="space-y-4 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-neutral-900" @submit.prevent="submit">
    <div class="flex items-center gap-4">
      <div class="h-16 w-16 overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
        <img v-if="hasCustomAvatar" :src="avatarSrc" alt="Avatar preview" class="h-full w-full object-cover" @error="onAvatarError">
        <img v-else :src="avatarIcon" alt="Default avatar icon" class="h-full w-full scale-75 object-contain">
      </div>
      <label class="cursor-pointer rounded-xl border border-neutral-200 px-3 py-2 text-sm hover:bg-neutral-50 dark:border-white/10 dark:hover:bg-white/10">
        Upload avatar
        <input
          type="file"
          class="hidden"
          accept=".jpg,.jpeg,.png,.webp,.gif,image/jpeg,image/png,image/webp,image/gif"
          @change="onAvatarChange"
        >
      </label>
    </div>
    <input v-model="profileForm.username" type="text" placeholder="Username" class="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm dark:border-white/10 dark:bg-neutral-800">
    <input v-model="profileForm.avatar" type="url" placeholder="Avatar URL (https://...)" class="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm dark:border-white/10 dark:bg-neutral-800" @input="onAvatarUrlInput">
    <textarea v-model="profileForm.bio" rows="3" placeholder="Bio" class="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm dark:border-white/10 dark:bg-neutral-800" />
    <p v-if="formError" class="text-xs text-red-600">{{ formError }}</p>
    <button type="submit" :disabled="props.loading" class="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-70">{{ props.loading ? 'Saving...' : 'Save profile' }}</button>
  </form>
</template>
