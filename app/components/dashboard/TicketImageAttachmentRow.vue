<script setup lang="ts">
import { Close } from '@element-plus/icons-vue'

defineProps<{
  imageUrl: string
  removing?: boolean
  removeDisabled?: boolean
}>()

const alt = defineModel<string>('alt', { default: '' })

const emit = defineEmits<{ remove: [] }>()

const onRemove = () => {
  emit('remove')
}
</script>

<template>
  <div class="flex flex-wrap items-center gap-2 rounded-lg border border-neutral-200 p-2 dark:border-white/10">
    <div class="relative h-12 w-12 shrink-0">
      <img :src="imageUrl" alt="" class="h-12 w-12 rounded object-cover">
      <button
        type="button"
        class="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-white shadow-md ring-2 ring-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50 dark:ring-neutral-900"
        aria-label="Remove image"
        title="Remove image"
        :disabled="removeDisabled"
        @click="onRemove"
      >
        <el-icon class="!text-xs"><Close /></el-icon>
      </button>
    </div>
    <el-input v-model="alt" class="min-w-[8rem] flex-1" placeholder="Caption (optional)" size="small" />
    <button
      type="button"
      class="text-xs text-red-600 hover:underline disabled:cursor-not-allowed disabled:opacity-50"
      :disabled="removeDisabled"
      @click="onRemove"
    >
      {{ removing ? 'Removing…' : 'Remove' }}
    </button>
  </div>
</template>
