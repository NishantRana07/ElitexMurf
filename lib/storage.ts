"use client"

import { Agent, User, Conversation, Analytics } from './types'

const STORAGE_KEYS = {
  AGENTS: 'elite_ai_agents',
  USER: 'elite_ai_user',
  CONVERSATIONS: 'elite_ai_conversations',
  ANALYTICS: 'elite_ai_analytics',
  SETTINGS: 'elite_ai_settings',
} as const

class StorageManager {
  private isAvailable(): boolean {
    if (typeof window === 'undefined') return false
    try {
      const test = '__storage_test__'
      localStorage.setItem(test, test)
      localStorage.removeItem(test)
      return true
    } catch {
      return false
    }
  }

  private getItem<T>(key: string): T | null {
    if (!this.isAvailable()) return null
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : null
    } catch (error) {
      console.error(`Error reading from localStorage (${key}):`, error)
      return null
    }
  }

  private setItem<T>(key: string, value: T): boolean {
    if (!this.isAvailable()) return false
    try {
      localStorage.setItem(key, JSON.stringify(value))
      return true
    } catch (error) {
      console.error(`Error writing to localStorage (${key}):`, error)
      return false
    }
  }

  // Agents
  getAgents(): Agent[] {
    return this.getItem<Agent[]>(STORAGE_KEYS.AGENTS) || []
  }

  saveAgents(agents: Agent[]): boolean {
    return this.setItem(STORAGE_KEYS.AGENTS, agents)
  }

  addAgent(agent: Agent): boolean {
    const agents = this.getAgents()
    agents.push(agent)
    return this.saveAgents(agents)
  }

  updateAgent(agentId: string, updates: Partial<Agent>): boolean {
    const agents = this.getAgents()
    const index = agents.findIndex(a => a.id === agentId)
    if (index === -1) return false
    
    agents[index] = { ...agents[index], ...updates, updatedAt: new Date().toISOString() }
    return this.saveAgents(agents)
  }

  deleteAgent(agentId: string): boolean {
    const agents = this.getAgents()
    const filtered = agents.filter(a => a.id !== agentId)
    return this.saveAgents(filtered)
  }

  // User
  getUser(): User | null {
    return this.getItem<User>(STORAGE_KEYS.USER)
  }

  saveUser(user: User): boolean {
    return this.setItem(STORAGE_KEYS.USER, user)
  }

  clearUser(): boolean {
    if (!this.isAvailable()) return false
    try {
      localStorage.removeItem(STORAGE_KEYS.USER)
      return true
    } catch (error) {
      console.error('Error clearing user:', error)
      return false
    }
  }

  // Conversations
  getConversations(): Conversation[] {
    return this.getItem<Conversation[]>(STORAGE_KEYS.CONVERSATIONS) || []
  }

  saveConversations(conversations: Conversation[]): boolean {
    return this.setItem(STORAGE_KEYS.CONVERSATIONS, conversations)
  }

  addConversation(conversation: Conversation): boolean {
    const conversations = this.getConversations()
    conversations.push(conversation)
    return this.saveConversations(conversations)
  }

  updateConversation(conversationId: string, updates: Partial<Conversation>): boolean {
    const conversations = this.getConversations()
    const index = conversations.findIndex(c => c.id === conversationId)
    if (index === -1) return false
    
    conversations[index] = { ...conversations[index], ...updates }
    return this.saveConversations(conversations)
  }

  // Analytics
  getAnalytics(): Analytics | null {
    return this.getItem<Analytics>(STORAGE_KEYS.ANALYTICS)
  }

  saveAnalytics(analytics: Analytics): boolean {
    return this.setItem(STORAGE_KEYS.ANALYTICS, analytics)
  }

  updateAnalytics(updates: Partial<Analytics>): boolean {
    const analytics = this.getAnalytics() || {
      totalConversations: 0,
      totalMessages: 0,
      averageResponseTime: 0,
      mostUsedAgent: '',
      voiceUsage: {},
      dailyStats: []
    }
    
    const updated = { ...analytics, ...updates }
    return this.saveAnalytics(updated)
  }

  // Settings
  getSettings(): Record<string, any> {
    return this.getItem<Record<string, any>>(STORAGE_KEYS.SETTINGS) || {}
  }

  saveSettings(settings: Record<string, any>): boolean {
    return this.setItem(STORAGE_KEYS.SETTINGS, settings)
  }

  // Utility methods
  clearAll(): boolean {
    if (!this.isAvailable()) return false
    try {
      Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key))
      return true
    } catch (error) {
      console.error('Error clearing all storage:', error)
      return false
    }
  }

  exportData(): Record<string, any> {
    const data: Record<string, any> = {}
    Object.entries(STORAGE_KEYS).forEach(([key, value]) => {
      data[key] = this.getItem(value)
    })
    return data
  }

  importData(data: Record<string, any>): boolean {
    try {
      Object.entries(data).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          this.setItem(key, value)
        }
      })
      return true
    } catch (error) {
      console.error('Error importing data:', error)
      return false
    }
  }
}

export const storage = new StorageManager()
export { STORAGE_KEYS } 