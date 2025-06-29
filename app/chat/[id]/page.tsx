"use client"

import type React from "react"
import { useState, useEffect, useRef, useCallback } from "react"
import { GoogleGenAI } from "@google/genai"
import axios from "axios"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { useParams } from "next/navigation"
import Image from "next/image"
import { useApp } from "@/lib/context"

interface ChatMessage {
  id: string
  text: string
  isUser: boolean
  audioUrl?: string
  timestamp: Date
}

interface GeminiMessage {
  role: "system" | "user" | "model"
  parts: string[]
}

declare global {
  interface Window {
    SpeechRecognition: any
    webkitSpeechRecognition: any
  }
}

export default function ChatPage() {
  const params = useParams()
  const { toast } = useToast()
  const { agents } = useApp()

  // Refs
  const audioRef = useRef<HTMLAudioElement>(null)
  const recognitionRef = useRef<any>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)

  // State
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [chatHistory, setChatHistory] = useState<GeminiMessage[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentAudioUrl, setCurrentAudioUrl] = useState("")
  const [isAutoMode, setIsAutoMode] = useState(false)
  const [isListening, setIsListening] = useState(false)

  // Get agent data
  const agentId = params.id as string
  const agent = agents.find(a => a.id === agentId)

  // Initialize Google GenAI
  const ai = new GoogleGenAI({ apiKey: "AIzaSyCEUw8hi5QajCQ6vaBwZ-93v48JoWDx8u8" })

  // System prompt and first message
  const systemPrompt = agent?.prompt || "You are a talkative, empathetic assistant bot. Your main job is to help people reduce stress by chatting with them, giving them calming advice, jokes, or friendly motivation. You talk in a relaxed, human tone, like a good friend who really listens. Keep your responses conversational and not too long (2-3 sentences max)."

  const firstMessage = agent?.firstMessage || "Hey there 😊 I'm your little stress-buster buddy! What's on your mind today?"

  // Initialize conversation history
  useEffect(() => {
    const initialHistory: GeminiMessage[] = [
      { role: "system", parts: [systemPrompt] },
      { role: "model", parts: [firstMessage] },
    ]
    setChatHistory(initialHistory)

    // Add first message to display
    const firstDisplayMessage: ChatMessage = {
      id: "first-message",
      text: firstMessage,
      isUser: false,
      timestamp: new Date(),
    }
    setMessages([firstDisplayMessage])
  }, [systemPrompt, firstMessage])

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Generate AI response
  async function generateAIResponse(userInput: string) {
    try {
      const updatedHistory = [...chatHistory, { role: "user" as const, parts: [userInput] }]

      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash-exp",
        contents: updatedHistory.map((msg) => ({
          role: msg.role === "system" ? "user" : msg.role,
          parts: msg.parts.map((part) => ({ text: part })),
        })),
      })

      const aiResponse = response.text
      const finalHistory = [...updatedHistory, { role: "model" as const, parts: [aiResponse] }]
      setChatHistory(finalHistory)

      return aiResponse
    } catch (error) {
      console.error("Error generating AI response:", error)
      throw error
    }
  }

  // Convert text to speech
  async function convertToSpeech(outputText: string) {
    const MurfAPI = "ap2_212a8c26-44b3-46ae-872a-735aa2c74974"

    const data = {
      text: outputText,
      voiceId: agent?.voiceId || "en-US-terrell",
    }

    try {
      const response = await axios.post("https://api.murf.ai/v1/speech/generate", data, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "api-key": MurfAPI,
        },
      })

      return response.data.audioFile
    } catch (error) {
      console.error("Error converting to speech:", error)
      throw error
    }
  }

  // Handle send message
  async function handleSendMessage() {
    if (!input.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: input,
      isUser: true,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    const currentInput = input
    setInput("")
    setIsGenerating(true)

    try {
      const aiResponse = await generateAIResponse(currentInput)

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        isUser: false,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, aiMessage])
      setIsGenerating(false)
      setIsGeneratingAudio(true)

      const audioUrl = await convertToSpeech(aiResponse)

      setMessages((prev) => prev.map((msg) => (msg.id === aiMessage.id ? { ...msg, audioUrl } : msg)))
      setCurrentAudioUrl(audioUrl)
      setIsGeneratingAudio(false)

      // Auto-play the response
      setTimeout(() => {
        handlePlayAudio(audioUrl)
      }, 500)
    } catch (error) {
      setIsGenerating(false)
      setIsGeneratingAudio(false)
      toast({
        title: "Error",
        description: "Failed to generate response. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Handle audio playback
  function handlePlayAudio(audioUrl?: string) {
    if (!audioRef.current) return

    const url = audioUrl || currentAudioUrl
    if (!url) return

    audioRef.current.src = url
    setCurrentAudioUrl(url)

    const playWhenReady = () => {
      audioRef.current?.play().catch((error) => {
        console.error("Error playing audio:", error)
        setIsPlaying(false)
      })
    }

    if (audioRef.current.readyState >= 2) {
      playWhenReady()
    } else {
      audioRef.current.addEventListener("canplay", playWhenReady, { once: true })
    }
  }

  function handleKeyPress(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (!agent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Agent not found</h1>
          <Link href="/dashboard" className="text-purple-400 hover:text-purple-300">
            Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Simple Navigation */}
      <nav className="border-b border-white/10 bg-black/20 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Image
                src="/elite-ai-logo.png"
                alt="Elite AI"
                width={32}
                height={24}
                className="w-8 h-6 object-contain"
              />
              <span className="text-xl font-bold text-white">Elite AI</span>
            </div>
            <div className="flex gap-3">
              <Link href="/dashboard" className="text-gray-300 hover:text-white transition-colors">
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-8">
        {/* Chat Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="text-gray-300 hover:text-white transition-colors">
                ← Back
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-white">{agent.name}</h1>
                <p className="text-gray-300">{agent.description}</p>
              </div>
            </div>
            <div className="text-sm text-gray-400">
              {agent.category}
            </div>
          </div>
        </div>

        {/* Chat Container */}
        <div className="bg-black/40 border border-white/10 backdrop-blur-xl rounded-lg h-[600px] flex flex-col">
          {/* Messages */}
          <div
            ref={messagesContainerRef}
            className="flex-1 overflow-y-auto p-6 space-y-4"
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.isUser ? "justify-end" : "justify-start"
                }`}
              >
                {!message.isUser && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                    🤖
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.isUser
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                      : "bg-white/10 text-gray-100"
                  }`}
                >
                  <p className="text-sm break-words">{message.text}</p>
                  {message.audioUrl && !message.isUser && (
                    <div className="mt-2">
                      <button
                        onClick={() => handlePlayAudio(message.audioUrl)}
                        className="text-xs bg-white/20 hover:bg-white/30 px-2 py-1 rounded transition-colors"
                      >
                        🔊 Play
                      </button>
                    </div>
                  )}
                </div>
                {message.isUser && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                    👤
                  </div>
                )}
              </div>
            ))}
            {isGenerating && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                  🤖
                </div>
                <div className="bg-white/10 text-gray-100 rounded-lg p-3">
                  <p className="text-sm">Thinking...</p>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t border-white/10 p-4">
            <div className="flex gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 bg-black/20 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 resize-none"
                rows={1}
              />
              <button
                onClick={handleSendMessage}
                disabled={isGenerating || !input.trim()}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isGenerating ? "..." : "Send"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
      />
    </div>
  )
}
