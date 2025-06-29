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
    if (!formData.voiceId) return

    setIsPreviewingVoice(true)
    // Simulate voice preview
    setTimeout(() => {
      setIsPreviewingVoice(false)
    }, 2000)
  }

  const handleSave = () => {
    // Save logic here
    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost" className="text-gray-400 hover:text-white hover:bg-white/10">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
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
                <h1 className="text-2xl font-bold text-white">Create New Agent</h1>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="border-white/20 text-gray-300 hover:bg-white/10 bg-transparent">
                <Play className="w-4 h-4 mr-2" />
                Test
              </Button>
              <Button
                onClick={handleSave}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Agent
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card className="bg-black/40 border-white/10 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Bot className="w-5 h-5" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-300">
                    Agent Name
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Stress-Buster Buddy"
                    className="bg-black/20 border-white/20 text-white placeholder:text-gray-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-gray-300">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Brief description of what your agent does..."
                    className="bg-black/20 border-white/20 text-white placeholder:text-gray-500 min-h-[80px]"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Personality & Behavior */}
            <Card className="bg-black/40 border-white/10 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Wand2 className="w-5 h-5" />
                  Personality & Behavior
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-gray-300">Quick Templates</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {promptTemplates.map((template, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        onClick={() => handleTemplateSelect(index)}
                        className={`text-left h-auto p-3 ${
                          selectedTemplate === index
                            ? "border-purple-500 bg-purple-500/10 text-purple-300"
                            : "border-white/20 text-gray-300 hover:bg-white/10"
                        }`}
                      >
                        <div>
                          <div className="font-medium">{template.name}</div>
                          <div className="text-xs opacity-70 mt-1">{template.firstMessage.substring(0, 50)}...</div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="prompt" className="text-gray-300">
                    System Prompt
                  </Label>
                  <Textarea
                    id="prompt"
                    value={formData.prompt}
                    onChange={(e) => setFormData((prev) => ({ ...prev, prompt: e.target.value }))}
                    placeholder="Define your agent's personality, role, and behavior..."
                    className="bg-black/20 border-white/20 text-white placeholder:text-gray-500 min-h-[120px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="firstMessage" className="text-gray-300">
                    First Message
                  </Label>
                  <Textarea
                    id="firstMessage"
                    value={formData.firstMessage}
                    onChange={(e) => setFormData((prev) => ({ ...prev, firstMessage: e.target.value }))}
                    placeholder="The greeting message users will see first..."
                    className="bg-black/20 border-white/20 text-white placeholder:text-gray-500 min-h-[80px]"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Voice Configuration */}
            <Card className="bg-black/40 border-white/10 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Volume2 className="w-5 h-5" />
                  Voice Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-gray-300">Voice Selection</Label>
                  <Select
                    value={formData.voiceId}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, voiceId: value }))}
                  >
                    <SelectTrigger className="bg-black/20 border-white/20 text-white">
                      <SelectValue placeholder="Choose a voice..." />
                    </SelectTrigger>
                    <SelectContent className="bg-black/90 border-white/20">
                      {voiceOptions.map((voice) => (
                        <SelectItem key={voice.id} value={voice.id} className="text-white hover:bg-white/10">
                          <div className="flex items-center justify-between w-full">
                            <div>
                              <div className="font-medium">{voice.name}</div>
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
                      className="border-white/20 text-gray-300 hover:bg-white/10 bg-transparent"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      {isPreviewingVoice ? "Playing..." : "Preview Voice"}
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-300">Speed ({formData.rate})</Label>
                    <input
                      type="range"
                      min="-50"
                      max="50"
                      value={formData.rate}
                      onChange={(e) => setFormData((prev) => ({ ...prev, rate: Number.parseInt(e.target.value) }))}
                      className="w-full accent-purple-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-300">Pitch ({formData.pitch})</Label>
                    <input
                      type="range"
                      min="-50"
                      max="50"
                      value={formData.pitch}
                      onChange={(e) => setFormData((prev) => ({ ...prev, pitch: Number.parseInt(e.target.value) }))}
                      className="w-full accent-purple-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-300">Variation ({formData.variation})</Label>
                    <input
                      type="range"
                      min="0"
                      max="5"
                      value={formData.variation}
                      onChange={(e) => setFormData((prev) => ({ ...prev, variation: Number.parseInt(e.target.value) }))}
                      className="w-full accent-purple-500"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Preview Panel */}
          <div className="space-y-6">
            <Card className="bg-black/40 border-white/10 backdrop-blur-xl sticky top-6">
              <CardHeader>
                <CardTitle className="text-white">Live Preview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-black/20 rounded-lg p-4 border border-white/10">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="text-white font-medium">{formData.name || "Your Agent"}</div>
                      <div className="text-xs text-gray-400">
                        {formData.voiceId
                          ? voiceOptions.find((v) => v.id === formData.voiceId)?.name
                          : "No voice selected"}
                      </div>
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3 border-l-4 border-purple-500">
                    <p className="text-gray-300 text-sm">
                      {formData.firstMessage || "Your first message will appear here..."}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm text-gray-400">Configuration Summary:</div>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Speed:</span>
                      <span className="text-gray-300">{formData.rate > 0 ? `+${formData.rate}` : formData.rate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Pitch:</span>
                      <span className="text-gray-300">
                        {formData.pitch > 0 ? `+${formData.pitch}` : formData.pitch}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Variation:</span>
                      <span className="text-gray-300">{formData.variation}/5</span>
                    </div>
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
