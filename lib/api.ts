import { ApiResponse, Agent, ChatMessage } from './types'

const API_BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

class ApiClient {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${API_BASE_URL}/api${endpoint}`
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.error || `HTTP ${response.status}: ${response.statusText}`,
        }
      }

      return {
        success: true,
        data,
      }
    } catch (error) {
      console.error(`API request failed (${endpoint}):`, error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      }
    }
  }

  // AI Response Generation
  async generateResponse(message: string, agentPrompt?: string): Promise<ApiResponse<{ text: string }>> {
    return this.request<{ text: string }>('/generate-response', {
      method: 'POST',
      body: JSON.stringify({ message, agentPrompt }),
    })
  }

  // Text-to-Speech
  async convertToSpeech(text: string, voiceId: string): Promise<ApiResponse<{ audioUrl: string }>> {
    return this.request<{ audioUrl: string }>('/text-to-speech', {
      method: 'POST',
      body: JSON.stringify({ text, voiceId }),
    })
  }

  // Agent Management
  async getAgents(): Promise<ApiResponse<Agent[]>> {
    return this.request<Agent[]>('/agents')
  }

  async createAgent(agent: Omit<Agent, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Agent>> {
    return this.request<Agent>('/agents', {
      method: 'POST',
      body: JSON.stringify(agent),
    })
  }

  async updateAgent(agentId: string, updates: Partial<Agent>): Promise<ApiResponse<Agent>> {
    return this.request<Agent>(`/agents/${agentId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    })
  }

  async deleteAgent(agentId: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/agents/${agentId}`, {
      method: 'DELETE',
    })
  }

  // Conversation Management
  async saveConversation(conversation: {
    agentId: string
    messages: ChatMessage[]
  }): Promise<ApiResponse<{ id: string }>> {
    return this.request<{ id: string }>('/conversations', {
      method: 'POST',
      body: JSON.stringify(conversation),
    })
  }

  async getConversations(agentId?: string): Promise<ApiResponse<Array<{
    id: string
    agentId: string
    startedAt: string
    messageCount: number
  }>>> {
    const params = agentId ? `?agentId=${agentId}` : ''
    return this.request<Array<{
      id: string
      agentId: string
      startedAt: string
      messageCount: number
    }>>(`/conversations${params}`)
  }

  // Analytics
  async getAnalytics(): Promise<ApiResponse<{
    totalConversations: number
    totalMessages: number
    averageResponseTime: number
    mostUsedAgent: string
    voiceUsage: Record<string, number>
    dailyStats: Array<{
      date: string
      conversations: number
      messages: number
    }>
  }>> {
    return this.request('/analytics')
  }

  // Voice Management
  async getVoices(): Promise<ApiResponse<Array<{
    id: string
    name: string
    style: string
    accent: string
    gender: string
    language: string
  }>>> {
    return this.request('/voices')
  }

  // Health Check
  async healthCheck(): Promise<ApiResponse<{ status: string; timestamp: string }>> {
    return this.request('/health')
  }
}

export const api = new ApiClient() 