"use client"

import type React from "react"
import { useState, useEffect, useRef, useCallback } from "react"
import { GoogleGenAI } from "@google/genai"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Play,
  Pause,
  Send,
  Volume2,
  Loader2,
  User,
  Bot,
  Mic,
  MicOff,
  Square,
  ArrowLeft,
  Settings,
  VolumeX,
  RotateCcw,
  Sparkles,
  MessageCircle,
  Plus,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { useParams } from "next/navigation"
import Image from "next/image"

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

// Mock agent data - in production, fetch from JSON blob
const mockAgents = {
  "1": {
    name: "Stress-Buster Buddy",
    prompt:
      "You are a talkative, empathetic assistant bot. Your main job is to help people reduce stress by chatting with them, giving them calming advice, jokes, or friendly motivation. You talk in a relaxed, human tone, like a good friend who really listens. Keep your responses conversational and not too long (2-3 sentences max).",
    firstMessage: "Hey there 😊 I'm your little stress-buster buddy! What's on your mind today?",
    voiceId: "en-US-terrell",
    category: "Wellness",
    description: "Your empathetic companion for stress relief and mental wellness support",
  },
  "2": {
    name: "Creative Artist",
    prompt:
      "You are an inspiring and knowledgeable artist assistant. You help people with creative projects, art techniques, and provide artistic inspiration. You're passionate about all forms of art and love to encourage creativity. Keep your responses conversational and not too long (2-3 sentences max).",
    firstMessage:
      "Hello, creative soul! 🎨 I'm here to help spark your artistic journey. What are you working on today?",
    voiceId: "en-US-natalie",
    category: "Creative",
    description: "Your inspiring guide for artistic projects and creative inspiration",
  },
}

declare global {
  interface Window {
    SpeechRecognition: any
    webkitSpeechRecognition: any
  }
}

export default function ChatPage() {
  const params = useParams()
  const agentId = params.id as string
  const agent = mockAgents[agentId as keyof typeof mockAgents]

  const audioRef = useRef<HTMLAudioElement>(null)
  const recognitionRef = useRef<any>(null)
  const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const restartTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [chatHistory, setChatHistory] = useState<GeminiMessage[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentAudioUrl, setCurrentAudioUrl] = useState("")
  const [isAutoMode, setIsAutoMode] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [interimTranscript, setInterimTranscript] = useState("")
  const [isPaused, setIsPaused] = useState(false)
  const [recognitionState, setRecognitionState] = useState<"idle" | "starting" | "listening" | "processing">("idle")
  const [audioLevel, setAudioLevel] = useState(0)

  const { toast } = useToast()

  // Initialize Google GenAI
  const ai = new GoogleGenAI({ apiKey: "AIzaSyDMaMEBq6Y3P68jSiVHq2Be8x8seI9AT8k" })

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Initialize conversation history
  useEffect(() => {
    if (!agent) return

    const initialHistory: GeminiMessage[] = [
      { role: "system", parts: [agent.prompt] },
      { role: "model", parts: [agent.firstMessage] },
    ]
    setChatHistory(initialHistory)

    const firstDisplayMessage: ChatMessage = {
      id: "first-message",
      text: agent.firstMessage,
      isUser: false,
      timestamp: new Date(),
    }
    setMessages([firstDisplayMessage])
  }, [agent])

  // Cleanup function
  const cleanup = useCallback(() => {
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current)
      silenceTimeoutRef.current = null
    }
    if (restartTimeoutRef.current) {
      clearTimeout(restartTimeoutRef.current)
      restartTimeoutRef.current = null
    }
  }, [])

  // Initialize Speech Recognition with robust error handling
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition()
        recognitionRef.current.continuous = false
        recognitionRef.current.interimResults = true
        recognitionRef.current.lang = "en-US"
        recognitionRef.current.maxAlternatives = 1

        recognitionRef.current.onstart = () => {
          console.log("🎤 Speech recognition started")
          setIsListening(true)
          setRecognitionState("listening")
        }

        recognitionRef.current.onresult = (event: any) => {
          let finalTranscript = ""
          let interim = ""

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcriptPart = event.results[i][0].transcript
            if (event.results[i].isFinal) {
              finalTranscript += transcriptPart
            } else {
              interim += transcriptPart
            }
          }

          setInterimTranscript(interim)

          // Clear existing silence timeout
          if (silenceTimeoutRef.current) {
            clearTimeout(silenceTimeoutRef.current)
            silenceTimeoutRef.current = null
          }

          if (finalTranscript.trim()) {
            setTranscript((prev) => (prev + " " + finalTranscript).trim())

            // Set a timeout to process the speech after silence
            silenceTimeoutRef.current = setTimeout(() => {
              handleSpeechEnd()
            }, 1200) // Optimized to 1.2 seconds
          }
        }

        recognitionRef.current.onerror = (event: any) => {
          const { error } = event
          console.error("❌ Speech recognition error:", error)

          setIsListening(false)
          setRecognitionState("idle")

          switch (error) {
            case "no-speech":
              if (isAutoMode && !isPaused) {
                scheduleRestart(800)
              }
              break
            case "not-allowed":
              toast({
                title: "Microphone Access Required",
                description: "Please allow microphone access to use voice features.",
                variant: "destructive",
              })
              setIsAutoMode(false)
              break
            case "network":
              toast({
                title: "Network Error",
                description: "Speech recognition failed. Retrying...",
                variant: "destructive",
              })
              if (isAutoMode && !isPaused) {
                scheduleRestart(2000)
              }
              break
            case "aborted":
              break
            default:
              if (isAutoMode && !isPaused) {
                scheduleRestart(1000)
              }
          }
        }

        recognitionRef.current.onend = () => {
          console.log("🔚 Speech recognition ended")
          setIsListening(false)
          setRecognitionState("idle")
          setInterimTranscript("")

          if (isAutoMode && !isPaused && !isGenerating && !isGeneratingAudio && !isPlaying) {
            scheduleRestart(400)
          }
        }
      } else {
        toast({
          title: "Speech Recognition Not Supported",
          description: "Your browser doesn't support speech recognition.",
          variant: "destructive",
        })
      }
    }

    return cleanup
  }, [isAutoMode, isPaused, isGenerating, isGeneratingAudio, isPlaying, cleanup])

  // Schedule restart with debouncing
  const scheduleRestart = useCallback(
    (delay: number) => {
      if (restartTimeoutRef.current) {
        clearTimeout(restartTimeoutRef.current)
      }

      restartTimeoutRef.current = setTimeout(() => {
        if (isAutoMode && !isPaused && !isListening && !isGenerating && !isGeneratingAudio && !isPlaying) {
          startListening()
        }
      }, delay)
    },
    [isAutoMode, isPaused, isListening, isGenerating, isGeneratingAudio, isPlaying],
  )

  // Handle speech end
  const handleSpeechEnd = useCallback(() => {
    const fullTranscript = transcript.trim()
    if (fullTranscript && isAutoMode && !isPaused) {
      console.log("🎯 Processing speech:", fullTranscript)
      setRecognitionState("processing")
      setTranscript("")
      setInterimTranscript("")
      handleAutoMessage(fullTranscript)
    }
  }, [transcript, isAutoMode, isPaused])

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
    const MurfAPI = "ap2_6eec6eb9-a077-468c-9686-85a469391066"

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

  // Handle automated message processing
  async function handleAutoMessage(userInput: string) {
    if (!userInput.trim()) return

    stopListening()

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: userInput,
      isUser: true,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setIsGenerating(true)

    try {
      const aiResponse = await generateAIResponse(userInput)

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

      handlePlayAudio(audioUrl)
    } catch (error) {
      console.error("Error in handleAutoMessage:", error)
      setIsGenerating(false)
      setIsGeneratingAudio(false)
      toast({
        title: "Error",
        description: "Failed to generate response. Please try again.",
        variant: "destructive",
      })

      if (isAutoMode && !isPaused) {
        scheduleRestart(2000)
      }
    }
  }

  // Handle manual message sending
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
      }, 300)
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

  // Start listening
  function startListening() {
    if (!recognitionRef.current || isListening || !isAutoMode || isPaused || recognitionState !== "idle") return

    try {
      console.log("🎤 Starting speech recognition...")
      setRecognitionState("starting")
      recognitionRef.current.start()
    } catch (error: any) {
      console.error("Error starting speech recognition:", error)
      setRecognitionState("idle")

      if (error.name === "InvalidStateError") {
        scheduleRestart(800)
      } else {
        if (isAutoMode && !isPaused) {
          scheduleRestart(1500)
        }
      }
    }
  }

  // Stop listening
  function stopListening() {
    cleanup()

    if (recognitionRef.current && (isListening || recognitionState !== "idle")) {
      try {
        recognitionRef.current.stop()
      } catch (error) {
        console.error("Error stopping speech recognition:", error)
      }
    }
    setIsListening(false)
    setRecognitionState("idle")
    setInterimTranscript("")
  }

  // Toggle auto mode
  function toggleAutoMode() {
    if (isAutoMode) {
      setIsAutoMode(false)
      setIsPaused(false)
      stopListening()
      setTranscript("")
      toast({
        title: "Auto Mode Disabled",
        description: "Switched to manual mode.",
      })
    } else {
      setIsAutoMode(true)
      setIsPaused(false)
      toast({
        title: "Auto Mode Enabled",
        description: "Speak naturally to start a conversation.",
      })
      setTimeout(() => startListening(), 300)
    }
  }

  // Toggle pause
  function togglePause() {
    if (!isAutoMode) return

    if (isPaused) {
      setIsPaused(false)
      setTranscript("")
      setInterimTranscript("")
      toast({
        title: "Resumed",
        description: "Voice recognition resumed.",
      })
      setTimeout(() => startListening(), 300)
    } else {
      setIsPaused(true)
      stopListening()
      setTranscript("")
      setInterimTranscript("")
      toast({
        title: "Paused",
        description: "Voice recognition paused.",
      })
    }
  }

  // Reset conversation
  function resetConversation() {
    if (!agent) return

    const initialHistory: GeminiMessage[] = [
      { role: "system", parts: [agent.prompt] },
      { role: "model", parts: [agent.firstMessage] },
    ]
    setChatHistory(initialHistory)

    const firstDisplayMessage: ChatMessage = {
      id: "first-message-" + Date.now(),
      text: agent.firstMessage,
      isUser: false,
      timestamp: new Date(),
    }
    setMessages([firstDisplayMessage])
    setTranscript("")
    setInterimTranscript("")

    toast({
      title: "Conversation Reset",
      description: "Started a fresh conversation!",
    })
  }

  // Handle audio playback
  function handlePlayAudio(audioUrl?: string) {
    if (!audioRef.current) return
    const audio = audioRef.current
    const srcToPlay = audioUrl || currentAudioUrl
    if (!srcToPlay) return

    audio.pause()
    audio.currentTime = 0

    if (audio.src !== srcToPlay) {
      audio.src = srcToPlay
      audio.load()
    }

    const playWhenReady = () => {
      audio.removeEventListener("canplaythrough", playWhenReady)
      audio
        .play()
        .then(() => {
          setIsPlaying(true)
        })
        .catch((e) => {
          console.warn("Audio play interrupted:", e)
        })
    }

    audio.addEventListener("canplaythrough", playWhenReady, { once: true })
  }

  function handlePauseAudio() {
    if (audioRef.current) {
      audioRef.current.pause()
      setIsPlaying(false)
    }
  }

  // Audio event handlers
  useEffect(() => {
    const audio = audioRef.current
    if (audio) {
      const handleEnded = () => {
        setIsPlaying(false)
        if (isAutoMode && !isPaused) {
          scheduleRestart(800)
        }
      }

      const handlePause = () => setIsPlaying(false)
      const handlePlay = () => setIsPlaying(true)

      audio.addEventListener("ended", handleEnded)
      audio.addEventListener("pause", handlePause)
      audio.addEventListener("play", handlePlay)

      return () => {
        audio.removeEventListener("ended", handleEnded)
        audio.removeEventListener("pause", handlePause)
        audio.removeEventListener("play", handlePlay)
      }
    }
  }, [isAutoMode, isPaused, scheduleRestart])

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
          <h1 className="text-2xl font-bold text-white mb-4">Agent Not Found</h1>
          <Link href="/dashboard">
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Enhanced Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost" className="text-gray-400 hover:text-white hover:bg-white/10">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <Image
                  src="/elite-ai-logo.png"
                  alt="Elite AI"
                  width={32}
                  height={24}
                  className="w-8 h-6 object-contain"
                />
                <div>
                  <h1 className="text-xl font-bold text-white">{agent.name}</h1>
                  <div className="flex items-center gap-2">
                    <Badge
                      className={`text-xs ${
                        agent.category === "Wellness"
                          ? "bg-green-100/10 text-green-300 border-green-500/30"
                          : "bg-purple-100/10 text-purple-300 border-purple-500/30"
                      }`}
                    >
                      {agent.category}
                    </Badge>
                    {isAutoMode && (
                      <Badge
                        className={`text-xs ${isPaused ? "bg-yellow-100/10 text-yellow-300 border-yellow-500/30" : "bg-green-100/10 text-green-300 border-green-500/30"}`}
                      >
                        {isPaused ? "Paused" : "Auto Mode"}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={resetConversation}
                className="border-white/20 text-gray-300 hover:bg-white/10 bg-transparent"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
              <Button variant="outline" className="border-white/20 text-gray-300 hover:bg-white/10 bg-transparent">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Chat Area */}
          <div className="lg:col-span-3">
            <Card className="bg-black/40 border-white/10 backdrop-blur-xl shadow-2xl h-[calc(100vh-12rem)]">
              <CardHeader className="border-b border-white/10">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center gap-2">
                    <MessageCircle className="h-5 w-5" />
                    Chat with {agent.name}
                  </CardTitle>
                  <div className="flex gap-2">
                    {isAutoMode && (
                      <Button
                        onClick={togglePause}
                        variant="outline"
                        size="sm"
                        className={`border-white/20 hover:bg-white/10 ${
                          isPaused ? "text-yellow-400 border-yellow-400/30" : "text-green-400 border-green-400/30"
                        }`}
                      >
                        {isPaused ? <Play className="h-3 w-3" /> : <Pause className="h-3 w-3" />}
                        {isPaused ? "Resume" : "Pause"}
                      </Button>
                    )}
                    <Button
                      onClick={toggleAutoMode}
                      size="sm"
                      className={`flex items-center gap-2 ${
                        isAutoMode ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
                      }`}
                    >
                      {isAutoMode ? <Square className="h-3 w-3" /> : <Mic className="h-3 w-3" />}
                      {isAutoMode ? "Stop Auto" : "Auto Mode"}
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-0 flex flex-col h-full">
                {/* Enhanced Status Indicator */}
                {isAutoMode && (
                  <div className="p-4 border-b border-white/10">
                    <div className="flex items-center justify-center">
                      <div
                        className={`inline-flex items-center gap-3 px-4 py-2 rounded-full transition-all duration-300 ${
                          isPaused
                            ? "bg-yellow-100/10 text-yellow-400 border border-yellow-500/30"
                            : recognitionState === "listening"
                              ? "bg-green-100/10 text-green-400 border border-green-500/30"
                              : recognitionState === "processing"
                                ? "bg-blue-100/10 text-blue-400 border border-blue-500/30"
                                : isGenerating
                                  ? "bg-blue-100/10 text-blue-400 border border-blue-500/30"
                                  : isGeneratingAudio
                                    ? "bg-purple-100/10 text-purple-400 border border-purple-500/30"
                                    : isPlaying
                                      ? "bg-orange-100/10 text-orange-400 border border-orange-500/30"
                                      : "bg-gray-100/10 text-gray-400 border border-gray-500/30"
                        }`}
                      >
                        {isPaused ? (
                          <Pause className="h-4 w-4" />
                        ) : recognitionState === "listening" ? (
                          <Mic className="h-4 w-4 animate-pulse" />
                        ) : recognitionState === "processing" || isGenerating ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : isGeneratingAudio ? (
                          <Volume2 className="h-4 w-4 animate-pulse" />
                        ) : isPlaying ? (
                          <Play className="h-4 w-4" />
                        ) : (
                          <MicOff className="h-4 w-4" />
                        )}
                        <span className="text-sm font-medium">
                          {isPaused
                            ? "Paused - Click resume to continue"
                            : recognitionState === "listening"
                              ? "Listening... speak naturally"
                              : recognitionState === "processing"
                                ? "Processing speech..."
                                : isGenerating
                                  ? "AI is thinking..."
                                  : isGeneratingAudio
                                    ? "Generating voice..."
                                    : isPlaying
                                      ? "AI is speaking..."
                                      : "Ready to listen..."}
                        </span>
                      </div>
                    </div>

                    {/* Live Transcript Display */}
                    {(transcript || interimTranscript) && (
                      <div className="mt-3 bg-black/30 rounded-lg p-3 border border-white/10">
                        <div className="text-sm text-gray-300">
                          <span className="text-green-400 font-medium">You're saying:</span>{" "}
                          <span className="text-white">{transcript}</span>
                          <span className="text-gray-400 italic">{interimTranscript}</span>
                          {recognitionState === "listening" && <span className="animate-pulse text-green-400">|</span>}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.isUser ? "justify-end" : "justify-start"} animate-in slide-in-from-bottom-2 duration-300`}
                    >
                      <div
                        className={`flex items-start gap-3 max-w-xs lg:max-w-md ${message.isUser ? "flex-row-reverse" : "flex-row"}`}
                      >
                        <div
                          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                            message.isUser
                              ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                              : "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                          }`}
                        >
                          {message.isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                        </div>
                        <div
                          className={`px-4 py-3 rounded-2xl transition-all duration-300 hover:scale-[1.02] ${
                            message.isUser
                              ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-br-md"
                              : "bg-white/10 text-gray-100 shadow-lg rounded-bl-md border border-white/20 backdrop-blur-sm"
                          }`}
                        >
                          <p className="text-sm leading-relaxed">{message.text}</p>
                          <div className="flex items-center justify-between mt-2">
                            <p className="text-xs opacity-70">{message.timestamp.toLocaleTimeString()}</p>
                            {!message.isUser && message.audioUrl && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="p-1 h-auto hover:bg-white/10 text-gray-300 ml-2"
                                onClick={() => handlePlayAudio(message.audioUrl)}
                              >
                                <Play className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Manual Input Area */}
                {!isAutoMode && (
                  <div className="p-4 border-t border-white/10">
                    <div className="flex gap-3">
                      <Textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type your message... (Press Enter to send)"
                        className="flex-1 min-h-[60px] max-h-32 resize-none bg-black/20 border-white/20 text-white placeholder:text-gray-500 focus:border-purple-500"
                        disabled={isGenerating || isGeneratingAudio}
                      />
                      <Button
                        onClick={handleSendMessage}
                        disabled={isGenerating || isGeneratingAudio || !input.trim()}
                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 px-6"
                      >
                        {isGenerating || isGeneratingAudio ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Send className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Agent Info */}
            <Card className="bg-black/40 border-white/10 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white text-lg flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Agent Info
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Description</p>
                  <p className="text-white text-sm">{agent.description}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Voice</p>
                  <p className="text-white text-sm">{agent.voiceId}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Messages</p>
                  <p className="text-white text-sm">{chatHistory.length - 2} exchanges</p>
                </div>
              </CardContent>
            </Card>

            {/* Audio Controls */}
            <Card className="bg-black/40 border-white/10 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white text-lg flex items-center gap-2">
                  <Volume2 className="h-5 w-5" />
                  Audio Controls
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  onClick={() => handlePlayAudio()}
                  disabled={!currentAudioUrl || isPlaying}
                  className="w-full border-white/20 text-gray-300 hover:bg-white/10"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Play Last Response
                </Button>
                <Button
                  variant="outline"
                  onClick={handlePauseAudio}
                  disabled={!isPlaying}
                  className="w-full border-white/20 text-gray-300 hover:bg-white/10 bg-transparent"
                >
                  <VolumeX className="h-4 w-4 mr-2" />
                  Stop Audio
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-black/40 border-white/10 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  onClick={resetConversation}
                  className="w-full border-white/20 text-gray-300 hover:bg-white/10 bg-transparent"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset Chat
                </Button>
                <Link href="/create">
                  <Button
                    variant="outline"
                    className="w-full border-white/20 text-gray-300 hover:bg-white/10 bg-transparent"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Agent
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer Info */}
        <div className="text-center text-xs text-gray-500 mt-6">
          💬 Powered by Elite AI • 🎤 Murf Voice Technology • 🧠 Google Gemini • 🏆 Hackathon 2024
        </div>
      </div>

      {/* Hidden Audio Element */}
      <audio ref={audioRef} className="hidden" />
    </div>
  )
}
