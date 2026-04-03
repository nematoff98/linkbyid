<script setup lang="ts">
import TicketImageAttachmentRow from '~/components/dashboard/TicketImageAttachmentRow.vue'
import TicketBlocks from '~/components/dashboard/TicketBlocks.vue'
import { TICKET_IMAGE_MAX_BYTES, ticketImageSizeWarning } from '~/constants/ticket'
import type { TicketBlockPayload, TicketDetail } from '~/types/ticket'
import { ticketsService } from '~/services/tickets.service'
import { getApiErrorMessage } from '~/utils/apiError'

definePageMeta({ layout: 'dashboard', middleware: ['dashboard-pro'] })

const route = useRoute()
const ticketId = computed(() => String(route.params.id || ''))

const ticket = ref<TicketDetail | null>(null)
const loading = ref(true)
const pageError = ref('')

const replyText = ref('')
const replyImages = ref<{ url: string; alt: string; uploading?: boolean }[]>([])
const replyLoading = ref(false)
const closeLoading = ref(false)
const removeReplyImageLoadingIdx = ref<number | null>(null)

const loadTicket = async () => {
  const id = ticketId.value
  if (!id) return
  loading.value = true
  pageError.value = ''
  try {
    ticket.value = await ticketsService.getById(id)
  } catch (error) {
    pageError.value = getApiErrorMessage(error, 'Could not load ticket.')
    ticket.value = null
  } finally {
    loading.value = false
  }
}

watch(ticketId, () => {
  void loadTicket()
})

const onPickReplyImages = async (e: Event) => {
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
    replyImages.value.push(row)
    const idx = replyImages.value.length - 1
    try {
      const url = await ticketsService.uploadImage(file)
      replyImages.value[idx] = { url, alt: '', uploading: false }
    } catch (error) {
      replyImages.value.splice(idx, 1)
      uploadErr = getApiErrorMessage(error, 'Image upload failed.')
    }
  }
  input.value = ''
  const sizeWarn = ticketImageSizeWarning(skippedNames)
  if (uploadErr || sizeWarn) {
    pageError.value = [uploadErr, sizeWarn].filter(Boolean).join(' ')
  }
}

const removeReplyImage = async (idx: number) => {
  const row = replyImages.value[idx]
  if (!row || row.uploading) return
  const url = row.url.trim()
  if (!url) {
    replyImages.value.splice(idx, 1)
    return
  }
  removeReplyImageLoadingIdx.value = idx
  pageError.value = ''
  try {
    await ticketsService.deleteUploadedImage(url)
    replyImages.value.splice(idx, 1)
  } catch (error) {
    pageError.value = getApiErrorMessage(error, 'Could not remove image.')
  } finally {
    removeReplyImageLoadingIdx.value = null
  }
}

const buildReplyBlocks = (): TicketBlockPayload[] => {
  const blocks: TicketBlockPayload[] = []
  const text = replyText.value.trim()
  if (text) blocks.push({ type: 'text', text })
  for (const row of replyImages.value) {
    if (!row.url.trim()) continue
    blocks.push({ type: 'image', url: row.url, alt: row.alt.trim() || undefined })
  }
  return blocks
}

const sendReply = async () => {
  const id = ticketId.value
  const blocks = buildReplyBlocks()
  if (blocks.length === 0) {
    pageError.value = 'Write a message or attach an image.'
    return
  }
  if (!id) return
  replyLoading.value = true
  pageError.value = ''
  try {
    await ticketsService.addMessage(id, blocks)
    replyText.value = ''
    replyImages.value = []
    await loadTicket()
  } catch (error) {
    pageError.value = getApiErrorMessage(error)
  } finally {
    replyLoading.value = false
  }
}

const closeTicket = async () => {
  const id = ticketId.value
  if (!id || ticket.value?.status !== 'open') return
  closeLoading.value = true
  pageError.value = ''
  try {
    await ticketsService.close(id)
    await loadTicket()
  } catch (error) {
    pageError.value = getApiErrorMessage(error)
  } finally {
    closeLoading.value = false
  }
}

const formatDate = (iso: string) => {
  try {
    return new Date(iso).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
  } catch {
    return iso
  }
}

onMounted(loadTicket)
</script>

<template>
  <div>
    <div class="mb-4 flex flex-wrap items-center gap-3">
      <NuxtLink to="/dashboard/tickets" class="text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-400">← Back to tickets</NuxtLink>
    </div>

    <p v-if="pageError" class="mb-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">{{ pageError }}</p>

    <div v-if="loading" class="text-sm text-neutral-500 dark:text-neutral-400">Loading ticket…</div>

    <template v-else-if="ticket">
      <header class="mb-6 flex flex-col gap-3 border-b border-neutral-200 pb-4 dark:border-white/10 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 class="text-xl font-semibold text-neutral-900 dark:text-white">{{ ticket.subject?.trim() || '(No subject)' }}</h1>
          <p class="mt-1 text-xs text-neutral-500 dark:text-neutral-400">Created {{ formatDate(ticket.createdAt) }} · Updated {{ formatDate(ticket.updatedAt) }}</p>
        </div>
        <div class="flex flex-wrap items-center gap-2">
          <span
            class="inline-flex rounded-lg px-2.5 py-1 text-xs font-semibold capitalize"
            :class="ticket.status === 'open'
              ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-200'
              : 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300'"
          >{{ ticket.status }}</span>
          <el-button
            v-if="ticket.status === 'open'"
            type="danger"
            plain
            size="small"
            :loading="closeLoading"
            @click="closeTicket"
          >
            Close ticket
          </el-button>
        </div>
      </header>

      <section class="space-y-4">
        <article
          v-for="msg in ticket.messages"
          :key="msg.id"
          class="rounded-2xl border p-4 shadow-sm"
          :class="msg.authorRole === 'admin'
            ? 'border-indigo-200 bg-indigo-50/80 dark:border-indigo-500/30 dark:bg-indigo-500/10'
            : 'border-neutral-200 bg-white dark:border-white/10 dark:bg-neutral-900'"
        >
          <div class="mb-3 flex flex-wrap items-center justify-between gap-2">
            <span class="text-xs font-semibold uppercase tracking-wide text-neutral-600 dark:text-neutral-300">
              {{ msg.authorRole === 'admin' ? 'Support' : 'You' }}
            </span>
            <time class="text-xs text-neutral-500 dark:text-neutral-400" :datetime="msg.createdAt">{{ formatDate(msg.createdAt) }}</time>
          </div>
          <TicketBlocks :blocks="msg.blocks" />
        </article>
        <p v-if="!ticket.messages?.length" class="rounded-xl border border-dashed border-neutral-300 p-4 text-sm text-neutral-500 dark:border-white/20 dark:text-neutral-400">No messages yet.</p>
      </section>

      <section v-if="ticket.status === 'open'" class="mt-8 rounded-2xl border border-neutral-200 bg-white p-5 dark:border-white/10 dark:bg-neutral-900">
        <h2 class="text-base font-semibold text-neutral-900 dark:text-white">Reply</h2>
        <div class="mt-3 space-y-3">
          <el-input v-model="replyText" type="textarea" :rows="4" placeholder="Your message" />
          <div>
            <label class="mb-1 block text-xs font-medium text-neutral-600 dark:text-neutral-300">Attach images (max 1.5 MB each)</label>
            <input
              type="file"
              accept="image/*"
              multiple
              class="block w-full text-sm text-neutral-600 file:mr-3 file:rounded-lg file:border-0 file:bg-indigo-50 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-indigo-700 hover:file:bg-indigo-100 dark:text-neutral-400 dark:file:bg-indigo-500/20 dark:file:text-indigo-200"
              @change="onPickReplyImages"
            >
            <ul v-if="replyImages.length" class="mt-2 space-y-2">
              <li v-for="(row, idx) in replyImages" :key="`${row.url}-${idx}`">
                <span v-if="row.uploading" class="block rounded-lg border border-neutral-200 p-2 text-xs text-neutral-500 dark:border-white/10">Uploading…</span>
                <TicketImageAttachmentRow
                  v-else
                  :image-url="row.url"
                  v-model:alt="row.alt"
                  :removing="removeReplyImageLoadingIdx === idx"
                  :remove-disabled="removeReplyImageLoadingIdx !== null"
                  @remove="removeReplyImage(idx)"
                />
              </li>
            </ul>
          </div>
          <el-button type="primary" :loading="replyLoading" @click="sendReply">Send reply</el-button>
        </div>
      </section>

      <p v-else class="mt-8 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-600 dark:border-white/10 dark:bg-neutral-800/50 dark:text-neutral-300">
        This ticket is closed. Open a new ticket if you need more help.
      </p>
    </template>
  </div>
</template>
