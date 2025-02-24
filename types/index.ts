export type HelpRequest = {
  id: number
  name: string
  description: string
  category: string
  deadline: Date
  userId: string
  userName: string
  email: string
  phone: string
  whatsapp: string
  status: "pending" | "offered" | "accepted" | "completed" | "cancelled"
  helper: string | null
  helperName: string | null | undefined
}

export type NotificationType = 
  | "help_offer" 
  | "help_accepted" 
  | "help_denied" 
  | "request_cancelled" 
  | "help_request_cancelled"
  | "deadline_reminder"
  | "new_request"

export type Notification = {
  id: string
  requestId: number
  helperId: string
  recipientId: string
  message: string
  type: NotificationType
  createdAt: Date
  read: boolean
}

export type User = {
  id: string
  name: string
  email: string
  avatar?: string
}

export type NewRequestInput = {
  name: string
  description: string
  category: string
  duration: number
  email: string
  phone: string
  whatsapp: string
}
