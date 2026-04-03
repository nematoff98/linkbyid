/** Block sent to POST /tickets or POST /tickets/:id/messages */
export type TicketBlockPayload =
  | { type: 'text'; text: string; url?: string; alt?: string }
  | { type: 'image'; url: string; alt?: string }

/** Block returned from API (may include extra fields) */
export type TicketBlock = {
  type: string
  text?: string
  url?: string
  alt?: string
}

export type TicketStatus = 'open' | 'closed'

export interface TicketListItem {
  id: string
  userId: string
  subject: string | null
  status: TicketStatus
  createdAt: string
  updatedAt: string
  lastMessageAt: string | null
}

export interface TicketMessage {
  id: string
  authorRole: 'user' | 'admin'
  authorUserId: string
  blocks: TicketBlock[]
  createdAt: string
}

export interface TicketDetail {
  id: string
  userId: string
  subject: string | null
  status: TicketStatus
  createdAt: string
  updatedAt: string
  messages: TicketMessage[]
}
