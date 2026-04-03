<script setup lang="ts">
import { Plus } from '@element-plus/icons-vue'
import type { TicketBlockPayload, TicketListItem } from '~/types/ticket'
import TicketImageAttachmentRow from '~/components/dashboard/TicketImageAttachmentRow.vue'
import { TICKET_IMAGE_MAX_BYTES, ticketImageSizeWarning } from '~/constants/ticket'
import { ticketsService } from '~/services/tickets.service'
import { getApiErrorMessage } from '~/utils/apiError'

definePageMeta({ layout: 'dashboard', middleware: ['dashboard-pro'] })

const items = ref<TicketListItem[]>([])
const page = ref(1)
const limit = ref(10)
const total = ref(0)
const loading = ref(false)
const pageError = ref('')

const subject = ref('')
const message = ref('')
const imageRows = ref<{ url: string; alt: string; uploading?: boolean }[]>([])
const createLoading = ref(false)
const removeImageLoadingIdx = ref<number | null>(null)

const totalPages = computed(() => Math.max(1, Math.ceil(total.value / limit.value)))

const loadTickets = async () => {
  loading.value = true
  pageError.value = ''
  try {
    const res = await ticketsService.list(page.value, limit.value)
    items.value = res.items
    total.value = res.total
  } catch (error) {
    pageError.value = getApiErrorMessage(error)
  } finally {
    loading.value = false
  }
}

const onPickImages = async (e: Event) => {
  const input = e.target as HTMLInputElement
  const files = input.files
  if (!files?.length) return
  const skippedNames: string[] = []
  let uploadErr = ''
  for (const file of Array.from(files)) {
    if (file.size > TICKET_IMAGE_MAX_BYTES) {
      skippedNames.push(file.name)
      continue
    }
    const row = { url: '', alt: '', uploading: true }
    imageRows.value.push(row)
    const idx = imageRows.value.length - 1
    try {
      const url = await ticketsService.uploadImage(file)
      imageRows.value[idx] = { url, alt: '', uploading: false }
    } catch (error) {
      imageRows.value.splice(idx, 1)
      uploadErr = getApiErrorMessage(error, 'Image upload failed.')
    }
  }
  input.value = ''
  const sizeWarn = ticketImageSizeWarning(skippedNames)
  if (uploadErr || sizeWarn) {
    pageError.value = [uploadErr, sizeWarn].filter(Boolean).join(' ')
  }
}

const removeImageRow = async (idx: number) => {
  const row = imageRows.value[idx]
  if (!row || row.uploading) return
  const url = row.url.trim()
  if (!url) {
    imageRows.value.splice(idx, 1)
    return
  }
  removeImageLoadingIdx.value = idx
  pageError.value = ''
  try {
    await ticketsService.deleteUploadedImage(url)
    imageRows.value.splice(idx, 1)
  } catch (error) {
    pageError.value = getApiErrorMessage(error, 'Could not remove image.')
  } finally {
    removeImageLoadingIdx.value = null
  }
}

const buildBlocks = (): TicketBlockPayload[] => {
  const blocks: TicketBlockPayload[] = []
  const text = message.value.trim()
  if (text) blocks.push({ type: 'text', text })
  for (const row of imageRows.value) {
    if (!row.url.trim()) continue
    blocks.push({ type: 'image', url: row.url, alt: row.alt.trim() || undefined })
  }
  return blocks
}

const createTicket = async () => {
  const sub = subject.value.trim()
  const blocks = buildBlocks()
  if (!sub) {
    pageError.value = 'Please enter a subject.'
    return
  }
  if (blocks.length === 0) {
    pageError.value = 'Add a message or at least one image.'
    return
  }
  createLoading.value = true
  pageError.value = ''
  try {
    await ticketsService.create({ subject: sub, blocks })
    subject.value = ''
    message.value = ''
    imageRows.value = []
    page.value = 1
    await loadTickets()
  } catch (error) {
    pageError.value = getApiErrorMessage(error)
  } finally {
    createLoading.value = false
  }
}

const prevPage = async () => {
  if (page.value <= 1) return
  page.value -= 1
  await loadTickets()
}

const nextPage = async () => {
  if (page.value >= totalPages.value) return
  page.value += 1
  await loadTickets()
}

const formatDate = (iso: string) => {
  try {
    return new Date(iso).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
  } catch {
    return iso
  }
}

const subjectLabel = (t: TicketListItem) => (t.subject?.trim() ? t.subject : '(No subject)')

onMounted(loadTickets)
</script>

<template>
  <div>
    <p v-if="pageError" class="mb-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">{{ pageError }}</p>

    <section class="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-neutral-900">
      <h2 class="text-base font-semibold text-neutral-900 dark:text-white">New ticket</h2>
      <p class="mt-1 text-sm text-neutral-500 dark:text-neutral-400">Describe your issue; you can attach screenshots.</p>
      <div class="mt-4 space-y-3">
        <div>
          <label class="mb-1 block text-xs font-medium text-neutral-600 dark:text-neutral-300">Subject</label>
          <el-input v-model="subject" placeholder="Short summary" maxlength="200" show-word-limit />
        </div>
        <div>
          <label class="mb-1 block text-xs font-medium text-neutral-600 dark:text-neutral-300">Message</label>
          <el-input v-model="message" type="textarea" :rows="4" placeholder="What happened? Steps to reproduce?" />
        </div>
        <div>
          <label class="mb-1 block text-xs font-medium text-neutral-600 dark:text-neutral-300">Images (optional, max 1.5 MB each)</label>
          <input
            type="file"
            accept="image/*"
            multiple
            class="block w-full text-sm text-neutral-600 file:mr-3 file:rounded-lg file:border-0 file:bg-indigo-50 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-indigo-700 hover:file:bg-indigo-100 dark:text-neutral-400 dark:file:bg-indigo-500/20 dark:file:text-indigo-200"
            @change="onPickImages"
          >
          <ul v-if="imageRows.length" class="mt-2 space-y-2">
            <li v-for="(row, idx) in imageRows" :key="`${row.url}-${idx}`">
              <span v-if="row.uploading" class="block rounded-lg border border-neutral-200 p-2 text-xs text-neutral-500 dark:border-white/10">Uploading…</span>
              <TicketImageAttachmentRow
                v-else
                :image-url="row.url"
                v-model:alt="row.alt"
                :removing="removeImageLoadingIdx === idx"
                :remove-disabled="removeImageLoadingIdx !== null"
                @remove="removeImageRow(idx)"
              />
            </li>
          </ul>
        </div>
        <el-button type="primary" :loading="createLoading" @click="createTicket">
          <el-icon class="mr-1"><Plus /></el-icon>
          Submit ticket
        </el-button>
      </div>
    </section>

    <section class="mt-8">
      <h2 class="text-base font-semibold text-neutral-900 dark:text-white">Your tickets</h2>
      <div v-if="loading" class="mt-4 rounded-xl border border-neutral-200 bg-white p-4 text-sm text-neutral-500 dark:border-white/10 dark:bg-neutral-900 dark:text-neutral-400">Loading…</div>
      <div v-else-if="items.length === 0" class="mt-4 rounded-xl border border-dashed border-neutral-300 bg-white p-6 text-center text-sm text-neutral-500 dark:border-white/20 dark:bg-neutral-900 dark:text-neutral-400">
        No tickets yet.
      </div>
      <ul v-else class="mt-4 space-y-2">
        <li v-for="t in items" :key="t.id">
          <NuxtLink
            :to="`/dashboard/tickets/${t.id}`"
            class="flex flex-col gap-1 rounded-xl border border-neutral-200 bg-white p-4 transition hover:border-indigo-300 hover:shadow-sm dark:border-white/10 dark:bg-neutral-900 dark:hover:border-indigo-500/40 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p class="font-medium text-neutral-900 dark:text-white">{{ subjectLabel(t) }}</p>
              <p class="text-xs text-neutral-500 dark:text-neutral-400">Updated {{ formatDate(t.lastMessageAt || t.updatedAt) }}</p>
            </div>
            <span
              class="inline-flex w-fit shrink-0 rounded-lg px-2 py-0.5 text-xs font-semibold capitalize"
              :class="t.status === 'open'
                ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-200'
                : 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300'"
            >{{ t.status }}</span>
          </NuxtLink>
        </li>
      </ul>
      <div v-if="items.length" class="mt-4 flex items-center justify-end gap-2">
        <button type="button" class="rounded-lg border border-neutral-200 px-3 py-1.5 text-sm disabled:opacity-50 dark:border-white/10" :disabled="page <= 1 || loading" @click="prevPage">Prev</button>
        <span class="text-xs text-neutral-500 dark:text-neutral-400">Page {{ page }} / {{ totalPages }}</span>
        <button type="button" class="rounded-lg border border-neutral-200 px-3 py-1.5 text-sm disabled:opacity-50 dark:border-white/10" :disabled="page >= totalPages || loading" @click="nextPage">Next</button>
      </div>
    </section>
  </div>
</template>
