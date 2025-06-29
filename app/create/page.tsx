"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Bot, Play, Save, Wand2, Volume2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { useApp } from "@/lib/context"
import { useToast } from "@/hooks/use-toast"

const voiceOptions = [
  { id: "en-US-terrell", name: "Terrell", style: "Conversational", accent: "American", gender: "Male" },
  { id: "en-US-natalie", name: "Natalie", style: "Inspirational", accent: "American", gender: "Female" },
  { id: "en-US-ken", name: "Ken", style: "Energetic", accent: "American", gender: "Male" },
  { id: "en-US-julia", name: "Julia", style: "Warm", accent: "American", gender: "Female" },
  { id: "en-US-miles", name: "Miles", style: "Professional", accent: "American", gender: "Male" },
  { id: "en-GB-oliver", name: "Oliver", style: "Sophisticated", accent: "British", gender: "Male" },
  { id: "en-AU-sarah", name: "Sarah", style: "Friendly", accent: "Australian", gender: "Female" },
  { id: "es-MX-valeria", name: "Valeria", style: "Expressive", accent: "Mexican", gender: "Female" },
]

const promptTemplates = [
  {
    name: "Stress Relief Assistant",
    prompt:
      "You are a talkative, empathetic assistant bot. Your main job is to help people reduce stress by chatting with them, giving them calming advice, jokes, or friendly motivation. You talk in a relaxed, human tone, like a good friend who really listens.",
    firstMessage: "Hey there 😊 I'm your little stress-buster buddy! What's on your mind today?",
  },
  {
    name: "Creative Artist",
    prompt:
      "You are an inspiring and knowledgeable artist assistant. You help people with creative projects, art techniques, and provide artistic inspiration. You're passionate about all forms of art and love to encourage creativity.",
    firstMessage:
      "Hello, creative soul! 🎨 I'm here to help spark your artistic journey. What are you working on today?",
  },
  {
    name: "Fitness Coach",
    prompt:
      "You are an energetic and motivational fitness coach. You provide workout advice, nutrition tips, and keep people motivated on their fitness journey. You're encouraging but also realistic about goals.",
    firstMessage: "Hey champion! 💪 Ready to crush your fitness goals today? Let's get moving!",
  },
  {
    name: "Study Buddy",
    prompt:
      "You are a helpful and patient study companion. You help students with learning, provide study tips, explain concepts clearly, and keep them motivated. You make learning fun and engaging.",
    firstMessage: "Hi there, scholar! 📚 Ready to dive into some learning? What subject are we tackling today?",
  },
  {
    name: "Business Mentor",
    prompt:
      "You are a wise and experienced business mentor. You provide strategic advice, help with decision-making, and guide entrepreneurs through challenges. You're professional yet approachable.",
    firstMessage:
      "Hello, entrepreneur! 💼 I'm here to help you navigate your business journey. What challenge can we tackle together?",
  },
]

export default function CreateAgent() {
  const router = useRouter()
  const { createAgent } = useApp()
  const { toast } = useToast()
  const [isCreating, setIsCreating] = useState(false)
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    prompt: "",
    firstMessage: "",
    voiceId: "",
    style: "",
    rate: 0,
    pitch: 0,
    variation: 1,
  })

  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null)
  const [isPreviewingVoice, setIsPreviewingVoice] = useState(false)

  const handleTemplateSelect = (index: number) => {
    const template = promptTemplates[index]
    setSelectedTemplate(index)
    setFormData((prev) => ({
      ...prev,
      prompt: template.prompt,
      firstMessage: template.firstMessage,
      name: template.name,
      description: `AI assistant specialized in ${template.name.toLowerCase()}`,
    }))
  }

  const handleVoicePreview = async () => {
    if (!formData.voiceId || !formData.firstMessage) {
      toast({
        title: "Missing Information",
        description: "Please select a voice and add a first message to preview.",
        variant: "destructive",
      })
      return
    }

    setIsPreviewingVoice(true)
    try {
      const response = await fetch('/api/text-to-speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: formData.firstMessage,
          voiceId: formData.voiceId,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate voice preview')
      }

      const data = await response.json()
      if (data.audioUrl) {
        // Create audio element and play
        const audio = new Audio(data.audioUrl)
        audio.play()
        
        toast({
          title: "Voice Preview",
          description: "Playing voice preview...",
        })
      }
    } catch (error) {
      console.error("Voice preview error:", error)
      toast({
        title: "Voice Preview Error",
        description: "Failed to generate voice preview. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsPreviewingVoice(false)
    }
  }

  const handleSave = async () => {
    if (!formData.name || !formData.description || !formData.prompt || !formData.firstMessage || !formData.voiceId) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    setIsCreating(true)
    try {
      const success = await createAgent({
        name: formData.name,
        description: formData.description,
        category: "Custom",
        voiceId: formData.voiceId,
        isActive: true,
        conversations: 0,
        lastUsed: "Never",
        prompt: formData.prompt,
        firstMessage: formData.firstMessage,
      })

      if (success) {
        toast({
          title: "Agent Created",
          description: "Your new agent has been created successfully!",
        })
        router.push("/dashboard")
      } else {
        toast({
          title: "Error",
          description: "Failed to create agent. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      })
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-xl">
        <div className="mobile-container mx-auto py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <Link href="/dashboard">
                <Button variant="ghost" className="text-gray-400 hover:text-white hover:bg-white/10 touch-button">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div className="flex items-center gap-2 sm:gap-3">
                <Image
                  src="/elite-ai-logo.png"
                  alt="Elite AI"
                  width={32}
                  height={24}
                  className="w-6 h-5 sm:w-8 sm:h-6 object-contain"
                />
                <h1 className="mobile-heading font-bold text-white">Create New Agent</h1>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <Button 
                onClick={handleVoicePreview}
                disabled={isPreviewingVoice || !formData.voiceId || !formData.firstMessage}
                variant="outline" 
                className="border-white/20 text-gray-300 hover:bg-white/10 bg-transparent touch-button"
              >
                {isPreviewingVoice ? (
                  <>
                    <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Testing...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Test Voice
                  </>
                )}
              </Button>
              <Button
                onClick={handleSave}
                disabled={isCreating}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 touch-button"
              >
                {isCreating ? (
                  <>
                    <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Agent
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="mobile-container mx-auto py-4 sm:py-6 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Basic Information */}
            <Card className="bg-black/40 border-white/10 backdrop-blur-xl">
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="text-white flex items-center gap-2 mobile-text">
                  <Bot className="w-4 h-4 sm:w-5 sm:h-5" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-300 mobile-text">
                    Agent Name
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Stress-Buster Buddy"
                    className="bg-black/20 border-white/20 text-white placeholder:text-gray-500 touch-button mobile-text"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-gray-300 mobile-text">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Brief description of what your agent does..."
                    className="bg-black/20 border-white/20 text-white placeholder:text-gray-500 min-h-[80px] mobile-text touch-button"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Personality & Behavior */}
            <Card className="bg-black/40 border-white/10 backdrop-blur-xl">
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="text-white flex items-center gap-2 mobile-text">
                  <Wand2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  Personality & Behavior
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                <div className="space-y-2">
                  <Label className="text-gray-300 mobile-text">Quick Templates</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {promptTemplates.map((template, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        onClick={() => handleTemplateSelect(index)}
                        className={`text-left h-auto p-2 sm:p-3 touch-button ${
                          selectedTemplate === index
                            ? "border-purple-500 bg-purple-500/10 text-purple-300"
                            : "border-white/20 text-gray-300 hover:bg-white/10"
                        }`}
                      >
                        <div>
                          <div className="font-medium mobile-text">{template.name}</div>
                          <div className="text-xs opacity-70 mt-1">{template.firstMessage.substring(0, 50)}...</div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="prompt" className="text-gray-300 mobile-text">
                    System Prompt
                  </Label>
                  <Textarea
                    id="prompt"
                    value={formData.prompt}
                    onChange={(e) => setFormData((prev) => ({ ...prev, prompt: e.target.value }))}
                    placeholder="Define your agent's personality, role, and behavior..."
                    className="bg-black/20 border-white/20 text-white placeholder:text-gray-500 min-h-[120px] mobile-text touch-button"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="firstMessage" className="text-gray-300 mobile-text">
                    First Message
                  </Label>
                  <Textarea
                    id="firstMessage"
                    value={formData.firstMessage}
                    onChange={(e) => setFormData((prev) => ({ ...prev, firstMessage: e.target.value }))}
                    placeholder="The greeting message users will see first..."
                    className="bg-black/20 border-white/20 text-white placeholder:text-gray-500 min-h-[80px] mobile-text touch-button"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Voice Configuration */}
            <Card className="bg-black/40 border-white/10 backdrop-blur-xl">
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="text-white flex items-center gap-2 mobile-text">
                  <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  Voice Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                <div className="space-y-2">
                  <Label className="text-gray-300 mobile-text">Voice Selection</Label>
                  <Select
                    value={formData.voiceId}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, voiceId: value }))}
                  >
                    <SelectTrigger className="bg-black/20 border-white/20 text-white touch-button mobile-text">
                      <SelectValue placeholder="Choose a voice..." />
                    </SelectTrigger>
                    <SelectContent className="bg-black/90 border-white/20">
                      {voiceOptions.map((voice) => (
                        <SelectItem key={voice.id} value={voice.id} className="text-white hover:bg-white/10">
                          <div className="flex items-center justify-between w-full">
                            <div>
                              <div className="font-medium mobile-text">{voice.name}</div>
                              <div className="text-xs text-gray-400">
                                {voice.accent} • {voice.gender}
                              </div>
                            </div>
                            <Badge variant="secondary" className="ml-2 bg-purple-500/20 text-purple-300">
                              {voice.style}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formData.voiceId && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleVoicePreview}
                      disabled={isPreviewingVoice}
                      className="mt-2 border-white/20 text-gray-300 hover:bg-white/10 bg-transparent touch-button"
                    >
                      {isPreviewingVoice ? (
                        <>
                          <div className="w-3 h-3 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          Testing...
                        </>
                      ) : (
                        <>
                          <Play className="w-3 h-3 mr-2" />
                          Preview Voice
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4 sm:space-y-6">
            {/* Voice Options */}
            <Card className="bg-black/40 border-white/10 backdrop-blur-xl">
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="text-white mobile-text">Available Voices</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {voiceOptions.map((voice) => (
                    <div
                      key={voice.id}
                      className={`p-2 sm:p-3 rounded-lg border cursor-pointer transition-colors ${
                        formData.voiceId === voice.id
                          ? "border-purple-500 bg-purple-500/10"
                          : "border-white/10 hover:bg-white/5"
                      }`}
                      onClick={() => setFormData((prev) => ({ ...prev, voiceId: voice.id }))}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-white mobile-text">{voice.name}</div>
                          <div className="text-xs text-gray-400">
                            {voice.accent} • {voice.gender}
                          </div>
                        </div>
                        <Badge variant="secondary" className="bg-purple-500/20 text-purple-300">
                          {voice.style}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Tips */}
            <Card className="bg-black/40 border-white/10 backdrop-blur-xl">
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="text-white mobile-text">Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm text-gray-300">
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p>Use clear, specific prompts to define your agent's personality</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p>Test your voice selection before saving</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p>Keep the first message friendly and engaging</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
