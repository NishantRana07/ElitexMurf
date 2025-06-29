"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Send,
  Bot,
  User,
  Loader2,
  Mic,
  Square,
  Play,
} from "lucide-react"
import { useApp } from "@/lib/context"
import { useToast } from "@/hooks/use-toast"

interface ChatMessage {
  id: string
  text: string
  isUser: boolean
  audioUrl?: string
  timestamp: Date
}

declare global {
  interface Window {
    SpeechRecognition: any
    webkitSpeechRecognition: any
  }
}

export default function ChatWidgetPage() {
  const { agents } = useApp()
  const { toast } = useToast()
  const [isClient, setIsClient] = useState(false)
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentAudioUrl, setCurrentAudioUrl] = useState("")
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [interimTranscript, setInterimTranscript] = useState("")

  // Refs
  const audioRef = useRef<HTMLAudioElement>(null)
  const recognitionRef = useRef<any>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Get agent from URL params
  const agentId = typeof window !== 'undefined' ? window.location.pathname.split('/').pop() : ''
  const agent = agents.find(a => a.id === agentId)

  // Initialize Google GenAI
  const ai = new (window as any).GoogleGenerativeAI("YOUR_GEMINI_API_KEY")

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Initialize conversation
  useEffect(() => {
    if (!agent) return

    const firstMessage: ChatMessage = {
      id: "first-message",
      text: agent.firstMessage,
      isUser: false,
      timestamp: new Date(),
    }
    setMessages([firstMessage])
  }, [agent])

  // Auto-scroll to bottom
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight
    }
  }, [messages])

  // Initialize speech recognition
  const initializeSpeechRecognition = () => {
    if (typeof window === 'undefined') return

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      toast({
        title: "Speech Recognition Not Supported",
        description: "Your browser doesn't support speech recognition.",
        variant: "destructive",
      })
      return
    }

    recognitionRef.current = new SpeechRecognition()
    recognitionRef.current.continuous = true
    recognitionRef.current.interimResults = true
    recognitionRef.current.lang = 'en-US'

    recognitionRef.current.onstart = () => {
      setIsListening(true)
    }

    recognitionRef.current.onresult = (event: any) => {
      let finalTranscript = ''
      let interimTranscript = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          finalTranscript += transcript
        } else {
          interimTranscript += transcript
        }
      }

      setTranscript(finalTranscript)
      setInterimTranscript(interimTranscript)

      if (finalTranscript) {
        setInput(finalTranscript)
        if (silenceTimeoutRef.current) {
          clearTimeout(silenceTimeoutRef.current)
        }
        silenceTimeoutRef.current = setTimeout(() => {
          if (finalTranscript.trim()) {
            handleSendMessage()
          }
        }, 1000)
      }
    }

    recognitionRef.current.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error)
      setIsListening(false)
    }

    recognitionRef.current.onend = () => {
      setIsListening(false)
    }
  }

  // Toggle listening
  const toggleListening = () => {
    if (!recognitionRef.current) {
      initializeSpeechRecognition()
    }
    
    if (isListening) {
      recognitionRef.current?.stop()
    } else {
      try {
        recognitionRef.current?.start()
      } catch (error) {
        console.error('Error starting speech recognition:', error)
      }
    }
  }

  // Sanitize AI response
  const sanitizeResponse = (text: string): string => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/`(.*?)`/g, '$1')
      .replace(/```[\s\S]*?```/g, '')
      .replace(/\[(.*?)\]\(.*?\)/g, '$1')
      .replace(/^#+\s*/gm, '')
      .replace(/^\s*[-*+]\s*/gm, '')
      .replace(/^\s*\d+\.\s*/gm, '')
      .replace(/^\s*>\s*/gm, '')
      .replace(/\n{3,}/g, '\n\n')
      .replace(/\s+/g, ' ')
      .trim()
  }

  // Generate AI response
  async function generateAIResponse(userInput: string) {
    try {
      const model = ai.getGenerativeModel({ model: "gemini-2.0-flash-exp" })
      
      const chat = model.startChat({
        history: [
          {
            role: "user",
            parts: [{ text: agent?.prompt || "You are a helpful AI assistant." }],
          },
          {
            role: "model",
            parts: [{ text: agent?.firstMessage || "Hello! How can I help you today?" }],
          },
        ],
      })

      const result = await chat.sendMessage(userInput)
      const response = await result.response
      return sanitizeResponse(response.text())
    } catch (error) {
      console.error("Error generating AI response:", error)
      throw error
    }
  }

  // Convert text to speech
  async function convertToSpeech(outputText: string) {
    try {
      const response = await fetch("/api/text-to-speech", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: outputText,
          voiceId: agent?.voiceId || "en-US-terrell",
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to convert text to speech")
      }

      const data = await response.json()
      return data.audioUrl
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

      setTimeout(() => {
        handlePlayAudio(audioUrl)
      }, 500)
    } catch (error) {
      console.error("Error sending message:", error)
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      })
      setIsGenerating(false)
      setIsGeneratingAudio(false)
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

  if (!isClient) {
    return (
      <div className="h-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-white mx-auto mb-4" />
          <h1 className="text-xl font-bold text-white">Loading chat...</h1>
        </div>
      </div>
    )
  }

  if (!agent) {
    return (
      <div className="h-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <Card className="bg-black/40 border-red-500/20 backdrop-blur-xl max-w-md">
          <CardContent className="p-6 text-center">
            <Bot className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-white text-lg font-semibold mb-2">Agent Not Found</h3>
            <p className="text-gray-300">The requested agent could not be found.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="h-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col">
      {/* Header */}
      <CardHeader className="border-b border-white/10 flex-shrink-0 bg-black/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div>
              <CardTitle className="text-white text-lg">{agent.name}</CardTitle>
              <p className="text-gray-400 text-sm">{agent.description}</p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-purple-500/20 text-purple-300">
            {agent.category}
          </Badge>
        </div>
      </CardHeader>

      {/* Messages */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
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
                <Bot className="w-4 h-4 text-white" />
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
                <div className="mt-2 flex items-center gap-2">
                  <Button
                    onClick={() => handlePlayAudio(message.audioUrl)}
                    size="sm"
                    variant="outline"
                    className="border-white/20 text-gray-300 hover:bg-white/10 bg-transparent"
                  >
                    <Play className="w-3 h-3 mr-1" />
                    Play
                  </Button>
                </div>
              )}
            </div>
            {message.isUser && (
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
        ))}
        {isGenerating && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-white/10 text-gray-100 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Thinking...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-white/10 p-4 flex-shrink-0 bg-black/20">
        {/* Voice input indicator */}
        {(isListening || interimTranscript) && (
          <div className="mb-3 p-3 bg-purple-500/20 border border-purple-500/30 rounded-lg">
            <div className="flex items-center gap-2 text-purple-300 text-sm">
              <Mic className="w-4 h-4 animate-pulse" />
              <span>Listening...</span>
              {interimTranscript && (
                <span className="text-white">"{interimTranscript}"</span>
              )}
            </div>
          </div>
        )}
        
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message or use voice input..."
            className="flex-1 bg-white/5 border-white/20 text-white placeholder-gray-400 resize-none min-h-[40px] max-h-[120px]"
            rows={1}
          />
          <Button
            onClick={toggleListening}
            disabled={isGenerating}
            variant="outline"
            className={`border-white/20 text-gray-300 hover:bg-white/10 bg-transparent flex-shrink-0 ${
              isListening ? 'bg-red-500/20 border-red-500/30 text-red-300' : ''
            }`}
          >
            {isListening ? (
              <Square className="w-4 h-4" />
            ) : (
              <Mic className="w-4 h-4" />
            )}
          </Button>
          <Button
            onClick={handleSendMessage}
            disabled={!input.trim() || isGenerating}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 flex-shrink-0"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
        className="hidden"
      />
    </div>
  )
} 