<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import type { ProfileSettings } from '~/types/dashboard'

const props = defineProps<{ modelValue: ProfileSettings }>()
const emit = defineEmits<{
  (e: 'save', payload: ProfileSettings): void
  (e: 'change', payload: ProfileSettings): void
}>()

const profileForm = reactive({ ...props.modelValue })
const formError = ref('')

watch(() => props.modelValue, (value) => Object.assign(profileForm, value), { immediate: true })
watch(profileForm, () => emit('change', { ...profileForm }), { deep: true })

const onAvatarChange = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  profileForm.avatar = URL.createObjectURL(file)
}

const submit = () => {
  if (!profileForm.username.trim()) {
    formError.value = 'Username is required.'
    return
  }
  formError.value = ''
  emit('save', { ...profileForm })
}
</script>

<template>
  <form class="space-y-4 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-neutral-900" @submit.prevent="submit">
    <div class="flex items-center gap-4">
      <img :src="profileForm.avatar" alt="Avatar preview" class="h-16 w-16 rounded-full object-cover">
      <label class="cursor-pointer rounded-xl border border-neutral-200 px-3 py-2 text-sm hover:bg-neutral-50 dark:border-white/10 dark:hover:bg-white/10">
        Upload avatar
        <input type="file" class="hidden" accept="image/*" @change="onAvatarChange">
      </label>
    </div>
    <input v-model="profileForm.username" type="text" placeholder="Username" class="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm dark:border-white/10 dark:bg-neutral-800">
    <textarea v-model="profileForm.bio" rows="3" placeholder="Bio" class="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm dark:border-white/10 dark:bg-neutral-800" />
    <p v-if="formError" class="text-xs text-red-600">{{ formError }}</p>
    <button type="submit" class="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-indigo-500">Save profile</button>
  </form>
</template>
