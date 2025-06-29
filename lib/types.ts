// Core Types
export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  createdAt: string
  updatedAt: string
}

export interface Agent {
  id: string
  name: string
  description: string
  category: string
  voiceId: string
  isActive: boolean
  conversations: number
  lastUsed: string
  prompt: string
  firstMessage: string
  createdAt: string
  updatedAt: string
}

export interface ChatMessage {
  id: string
  text: string
  isUser: boolean
  audioUrl?: string
  timestamp: Date
}

export interface Conversation {
  id: string
  agentId: string
  messages: ChatMessage[]
  startedAt: string
  endedAt?: string
  messageCount: number
}

export interface Analytics {
  totalConversations: number
  totalMessages: number
  averageResponseTime: number
  mostUsedAgent: string
  voiceUsage: Record<string, number>
  dailyStats: Array<{
    date: string
    conversations: number
    messages: number
    uniqueUsers?: number
  }>
}

export interface Voice {
  id: string
  name: string
  style: string
  accent: string
  gender: string
  language: string
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
}

// Form Types
export interface CreateAgentForm {
  name: string
  description: string
  category: string
  voiceId: string
  prompt: string
  firstMessage: string
}

export interface UpdateAgentForm extends Partial<CreateAgentForm> {
  isActive?: boolean
}

// Settings Types
export interface AppSettings {
  theme: 'light' | 'dark' | 'system'
  autoMode: boolean
  voicePreview: boolean
  notifications: boolean
}

// Chat Types
export interface ChatState {
  messages: ChatMessage[]
  isGenerating: boolean
  isGeneratingAudio: boolean
  isPlaying: boolean
  isListening: boolean
  isAutoMode: boolean
  currentAudioUrl: string
}

// Speech Recognition Types
export interface SpeechRecognitionState {
  state: 'idle' | 'starting' | 'listening' | 'processing'
  transcript: string
  interimTranscript: string
  audioLevel: number
}

// Error Types
export interface AppError {
  code: string
  message: string
  details?: any
}

// Navigation Types
export interface NavigationItem {
  label: string
  href: string
  icon?: React.ComponentType<{ className?: string }>
  badge?: string | number
}

// Component Props Types
export interface CardProps {
  title: string
  description?: string
  children?: React.ReactNode
  className?: string
}

export interface ButtonProps {
  variant?: 'default' | 'outline' | 'ghost' | 'destructive'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  children: React.ReactNode
  onClick?: () => void
  className?: string
}

// Utility Types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}
