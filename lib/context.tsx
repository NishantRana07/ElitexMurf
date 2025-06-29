"use client"

import React, { createContext, useContext, useReducer, useEffect, ReactNode, useCallback } from 'react'
import { Agent, User, Conversation, Analytics } from './types'
import { storage } from './storage'
import { api } from './api'

// State interface
interface AppState {
  user: User | null
  agents: Agent[]
  conversations: Conversation[]
  analytics: Analytics | null
  isLoading: boolean
  error: string | null
  settings: {
    theme: 'light' | 'dark' | 'system'
    autoMode: boolean
    voicePreview: boolean
    notifications: boolean
  }
}

// Action types
type AppAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_AGENTS'; payload: Agent[] }
  | { type: 'ADD_AGENT'; payload: Agent }
  | { type: 'UPDATE_AGENT'; payload: { id: string; updates: Partial<Agent> } }
  | { type: 'DELETE_AGENT'; payload: string }
  | { type: 'SET_CONVERSATIONS'; payload: Conversation[] }
  | { type: 'ADD_CONVERSATION'; payload: Conversation }
  | { type: 'SET_ANALYTICS'; payload: Analytics }
  | { type: 'UPDATE_ANALYTICS'; payload: Partial<Analytics> }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<AppState['settings']> }
  | { type: 'CLEAR_DATA' }

// Initial state
const initialState: AppState = {
  user: null,
  agents: [
    {
      id: "1",
      name: "Stress-Buster Buddy",
      description: "Your empathetic companion for stress relief and mental wellness support",
      category: "Wellness",
      voiceId: "en-US-terrell",
      isActive: true,
      conversations: 127,
      lastUsed: "2 hours ago",
      prompt: "You are a talkative, empathetic assistant bot. Your main job is to help people reduce stress by chatting with them, giving them calming advice, jokes, or friendly motivation. You talk in a relaxed, human tone, like a good friend who really listens.",
      firstMessage: "Hey there 😊 I'm your little stress-buster buddy! What's on your mind today?",
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z",
    },
    {
      id: "2",
      name: "Creative Artist",
      description: "Your inspiring guide for artistic projects and creative inspiration",
      category: "Creative",
      voiceId: "en-US-natalie",
      isActive: true,
      conversations: 89,
      lastUsed: "1 day ago",
      prompt: "You are an inspiring and knowledgeable artist assistant. You help people with creative projects, art techniques, and provide artistic inspiration. You're passionate about all forms of art and love to encourage creativity.",
      firstMessage: "Hello, creative soul! 🎨 I'm here to help spark your artistic journey. What are you working on today?",
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z",
    },
    {
      id: "3",
      name: "Fitness Coach",
      description: "Your motivational trainer for achieving health and fitness goals",
      category: "Health",
      voiceId: "en-US-ken",
      isActive: false,
      conversations: 45,
      lastUsed: "3 days ago",
      prompt: "You are an energetic and motivational fitness coach. You provide workout advice, nutrition tips, and keep people motivated on their fitness journey. You're encouraging but also realistic about goals.",
      firstMessage: "Hey champion! 💪 Ready to crush your fitness goals today? Let's get moving!",
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z",
    },
    {
      id: "4",
      name: "Study Buddy",
      description: "Your patient learning companion for academic success",
      category: "Education",
      voiceId: "en-US-julia",
      isActive: true,
      conversations: 203,
      lastUsed: "5 minutes ago",
      prompt: "You are a helpful and patient study companion. You help students with learning, provide study tips, explain concepts clearly, and keep them motivated. You make learning fun and engaging.",
      firstMessage: "Hi there, scholar! 📚 Ready to dive into some learning? What subject are we tackling today?",
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z",
    },
  ],
  conversations: [],
  analytics: {
    totalConversations: 456,
    totalMessages: 2847,
    averageResponseTime: 0.8,
    mostUsedAgent: "Stress-Buster Buddy",
    voiceUsage: {
      "en-US-terrell": 234,
      "en-US-natalie": 156,
      "en-US-ken": 45,
      "en-US-julia": 21,
    },
    dailyStats: [
      { date: "2024-01-01", conversations: 12, messages: 89, uniqueUsers: 8 },
      { date: "2024-01-02", conversations: 18, messages: 134, uniqueUsers: 12 },
      { date: "2024-01-03", conversations: 15, messages: 112, uniqueUsers: 10 },
      { date: "2024-01-04", conversations: 22, messages: 167, uniqueUsers: 15 },
      { date: "2024-01-05", conversations: 19, messages: 145, uniqueUsers: 13 },
      { date: "2024-01-06", conversations: 25, messages: 189, uniqueUsers: 18 },
      { date: "2024-01-07", conversations: 28, messages: 203, uniqueUsers: 20 },
    ],
  },
  isLoading: false,
  error: null,
  settings: {
    theme: 'system',
    autoMode: true,
    voicePreview: true,
    notifications: true,
  },
}

// Reducer
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    
    case 'SET_ERROR':
      return { ...state, error: action.payload }
    
    case 'SET_USER':
      return { ...state, user: action.payload }
    
    case 'SET_AGENTS':
      return { ...state, agents: action.payload }
    
    case 'ADD_AGENT':
      return { ...state, agents: [...state.agents, action.payload] }
    
    case 'UPDATE_AGENT':
      return {
        ...state,
        agents: state.agents.map(agent =>
          agent.id === action.payload.id
            ? { ...agent, ...action.payload.updates }
            : agent
        ),
      }
    
    case 'DELETE_AGENT':
      return {
        ...state,
        agents: state.agents.filter(agent => agent.id !== action.payload),
      }
    
    case 'SET_CONVERSATIONS':
      return { ...state, conversations: action.payload }
    
    case 'ADD_CONVERSATION':
      return { ...state, conversations: [...state.conversations, action.payload] }
    
    case 'SET_ANALYTICS':
      return { ...state, analytics: action.payload }
    
    case 'UPDATE_ANALYTICS':
      return {
        ...state,
        analytics: state.analytics
          ? { ...state.analytics, ...action.payload }
          : null,
      }
    
    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: { ...state.settings, ...action.payload },
      }
    
    case 'CLEAR_DATA':
      return initialState
    
    default:
      return state
  }
}

// Context
interface AppContextType extends AppState {
  dispatch: React.Dispatch<AppAction>
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  loadAgents: () => Promise<void>
  createAgent: (agentData: Omit<Agent, 'id' | 'createdAt' | 'updatedAt'>) => Promise<boolean>
  updateAgent: (id: string, updates: Partial<Agent>) => Promise<boolean>
  deleteAgent: (id: string) => Promise<boolean>
  loadConversations: (agentId?: string) => Promise<void>
  saveConversation: (conversation: Omit<Conversation, 'id'>) => Promise<boolean>
  loadAnalytics: () => Promise<void>
  updateSettings: (settings: Partial<AppState['settings']>) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

// Provider component
interface AppProviderProps {
  children: ReactNode
}

export function AppProvider({ children }: AppProviderProps) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  // Load initial data from storage
  useEffect(() => {
    const loadInitialData = () => {
      try {
        // Load user
        const user = storage.getUser()
        if (user) {
          dispatch({ type: 'SET_USER', payload: user })
        }

        // Load agents
        const agents = storage.getAgents()
        if (agents.length > 0) {
          dispatch({ type: 'SET_AGENTS', payload: agents })
        }

        // Load conversations
        const conversations = storage.getConversations()
        if (conversations.length > 0) {
          dispatch({ type: 'SET_CONVERSATIONS', payload: conversations })
        }

        // Load analytics
        const analytics = storage.getAnalytics()
        if (analytics) {
          dispatch({ type: 'SET_ANALYTICS', payload: analytics })
        }

        // Load settings
        const settings = storage.getSettings()
        if (settings) {
          dispatch({ type: 'UPDATE_SETTINGS', payload: settings })
        }
      } catch (error) {
        console.error('Error loading initial data:', error)
        dispatch({ type: 'SET_ERROR', payload: 'Failed to load saved data' })
      }
    }

    loadInitialData()
  }, [])

  // Save data to storage when state changes
  useEffect(() => {
    if (state.user) {
      storage.saveUser(state.user)
    }
  }, [state.user])

  useEffect(() => {
    storage.saveAgents(state.agents)
  }, [state.agents])

  useEffect(() => {
    storage.saveConversations(state.conversations)
  }, [state.conversations])

  useEffect(() => {
    if (state.analytics) {
      storage.saveAnalytics(state.analytics)
    }
  }, [state.analytics])

  useEffect(() => {
    storage.saveSettings(state.settings)
  }, [state.settings])

  // Actions
  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    dispatch({ type: 'SET_LOADING', payload: true })
    dispatch({ type: 'SET_ERROR', payload: null })

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const user: User = {
        id: '1',
        email,
        name: email.split('@')[0],
        plan: 'free',
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      }

      dispatch({ type: 'SET_USER', payload: user })
      return true
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Login failed' })
      return false
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }, [])

  const logout = useCallback(() => {
    storage.clearUser()
    dispatch({ type: 'CLEAR_DATA' })
  }, [])

  const loadAgents = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true })
    try {
      // Load from local storage instead of external API
      const agents = storage.getAgents()
      
      // If no agents in storage, add some default ones
      if (agents.length === 0) {
        const defaultAgents: Agent[] = [
          {
            id: "1",
            name: "Stress-Buster Buddy",
            description: "Your empathetic companion for stress relief and mental wellness support",
            category: "Wellness",
            voiceId: "en-US-terrell",
            isActive: true,
            conversations: 127,
            lastUsed: "2 hours ago",
            prompt: "You are a talkative, empathetic assistant bot. Your main job is to help people reduce stress by chatting with them, giving them calming advice, jokes, or friendly motivation. You talk in a relaxed, human tone, like a good friend who really listens.",
            firstMessage: "Hey there 😊 I'm your little stress-buster buddy! What's on your mind today?",
            createdAt: "2024-01-01T00:00:00Z",
            updatedAt: "2024-01-01T00:00:00Z",
          },
          {
            id: "2",
            name: "Creative Artist",
            description: "Your inspiring guide for artistic projects and creative inspiration",
            category: "Creative",
            voiceId: "en-US-natalie",
            isActive: true,
            conversations: 89,
            lastUsed: "1 day ago",
            prompt: "You are an inspiring and knowledgeable artist assistant. You help people with creative projects, art techniques, and provide artistic inspiration. You're passionate about all forms of art and love to encourage creativity.",
            firstMessage: "Hello, creative soul! 🎨 I'm here to help spark your artistic journey. What are you working on today?",
            createdAt: "2024-01-01T00:00:00Z",
            updatedAt: "2024-01-01T00:00:00Z",
          },
          {
            id: "3",
            name: "Fitness Coach",
            description: "Your motivational trainer for achieving health and fitness goals",
            category: "Health",
            voiceId: "en-US-ken",
            isActive: false,
            conversations: 45,
            lastUsed: "3 days ago",
            prompt: "You are an energetic and motivational fitness coach. You provide workout advice, nutrition tips, and keep people motivated on their fitness journey. You're encouraging but also realistic about goals.",
            firstMessage: "Hey champion! 💪 Ready to crush your fitness goals today? Let's get moving!",
            createdAt: "2024-01-01T00:00:00Z",
            updatedAt: "2024-01-01T00:00:00Z",
          },
          {
            id: "4",
            name: "Study Buddy",
            description: "Your patient learning companion for academic success",
            category: "Education",
            voiceId: "en-US-julia",
            isActive: true,
            conversations: 203,
            lastUsed: "5 minutes ago",
            prompt: "You are a helpful and patient study companion. You help students with learning, provide study tips, explain concepts clearly, and keep them motivated. You make learning fun and engaging.",
            firstMessage: "Hi there, scholar! 📚 Ready to dive into some learning? What subject are we tackling today?",
            createdAt: "2024-01-01T00:00:00Z",
            updatedAt: "2024-01-01T00:00:00Z",
          },
        ]
        
        // Save default agents to storage
        storage.saveAgents(defaultAgents)
        dispatch({ type: 'SET_AGENTS', payload: defaultAgents })
      } else {
        dispatch({ type: 'SET_AGENTS', payload: agents })
      }
    } catch (error) {
      console.error('Error loading agents:', error)
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load agents' })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }, [])

  const createAgent = useCallback(async (agentData: Omit<Agent, 'id' | 'createdAt' | 'updatedAt'>): Promise<boolean> => {
    try {
      const newAgent: Agent = {
        ...agentData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      
      // Add to state
      dispatch({ type: 'ADD_AGENT', payload: newAgent })
      
      // Save to storage
      const currentAgents = storage.getAgents()
      const updatedAgents = [...currentAgents, newAgent]
      storage.saveAgents(updatedAgents)
      
      return true
    } catch (error) {
      console.error('Error creating agent:', error)
      dispatch({ type: 'SET_ERROR', payload: 'Failed to create agent' })
      return false
    }
  }, [])

  const updateAgent = useCallback(async (id: string, updates: Partial<Agent>): Promise<boolean> => {
    try {
      dispatch({ type: 'UPDATE_AGENT', payload: { id, updates } })
      return true
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update agent' })
      return false
    }
  }, [])

  const deleteAgent = useCallback(async (id: string): Promise<boolean> => {
    try {
      dispatch({ type: 'DELETE_AGENT', payload: id })
      return true
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to delete agent' })
      return false
    }
  }, [])

  const loadConversations = useCallback(async (agentId?: string) => {
    dispatch({ type: 'SET_LOADING', payload: true })
    try {
      const response = await api.getConversations(agentId)
      if (response.success && response.data) {
        // Convert API response to Conversation format
        const conversations: Conversation[] = response.data.map(conv => ({
          id: conv.id,
          agentId: conv.agentId,
          messages: [],
          startedAt: new Date(conv.startedAt),
        }))
        dispatch({ type: 'SET_CONVERSATIONS', payload: conversations })
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load conversations' })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }, [])

  const saveConversation = useCallback(async (conversation: Omit<Conversation, 'id'>): Promise<boolean> => {
    try {
      const newConversation: Conversation = {
        ...conversation,
        id: Date.now().toString(),
      }
      dispatch({ type: 'ADD_CONVERSATION', payload: newConversation })
      return true
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to save conversation' })
      return false
    }
  }, [])

  const loadAnalytics = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true })
    try {
      // Load from local storage instead of external API
      const analytics = storage.getAnalytics()
      
      // If no analytics in storage, create default ones
      if (!analytics) {
        const defaultAnalytics = {
          totalConversations: 456,
          totalMessages: 2847,
          averageResponseTime: 0.8,
          mostUsedAgent: "Stress-Buster Buddy",
          voiceUsage: {
            "en-US-terrell": 234,
            "en-US-natalie": 156,
            "en-US-ken": 45,
            "en-US-julia": 21,
          },
          dailyStats: [
            { date: "2024-01-01", conversations: 12, messages: 89, uniqueUsers: 8 },
            { date: "2024-01-02", conversations: 18, messages: 134, uniqueUsers: 12 },
            { date: "2024-01-03", conversations: 15, messages: 112, uniqueUsers: 10 },
            { date: "2024-01-04", conversations: 22, messages: 167, uniqueUsers: 15 },
            { date: "2024-01-05", conversations: 19, messages: 145, uniqueUsers: 13 },
            { date: "2024-01-06", conversations: 25, messages: 189, uniqueUsers: 18 },
            { date: "2024-01-07", conversations: 28, messages: 203, uniqueUsers: 20 },
          ],
        }
        
        // Save default analytics to storage
        storage.saveAnalytics(defaultAnalytics)
        dispatch({ type: 'SET_ANALYTICS', payload: defaultAnalytics })
      } else {
        dispatch({ type: 'SET_ANALYTICS', payload: analytics })
      }
    } catch (error) {
      console.error('Error loading analytics:', error)
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load analytics' })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }, [])

  const updateSettings = useCallback((settings: Partial<AppState['settings']>) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: settings })
  }, [])

  const value: AppContextType = {
    ...state,
    dispatch,
    login,
    logout,
    loadAgents,
    createAgent,
    updateAgent,
    deleteAgent,
    loadConversations,
    saveConversation,
    loadAnalytics,
    updateSettings,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

// Hook to use the context
export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
} 