"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Plus,
  Search,
  Bot,
  Play,
  Settings,
  Trash2,
  Copy,
  MessageCircle,
  Volume2,
  TrendingUp,
  Sparkles,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface Agent {
  id: string
  name: string
  description: string
  category: string
  voiceId: string
  isActive: boolean
  conversations: number
  lastUsed: string
  avatar?: string
}

// Default agents fallback
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
  },
]

export default function Dashboard() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [isLoading, setIsLoading] = useState(true)

  // Fetch agents from JSON blob with fallback
  useEffect(() => {
    const fetchAgents = async () => {
      try {
        setIsLoading(true)
        // Try to fetch from JSON blob URL
        const response = await fetch("https://api.example.com/agents")
        if (response.ok) {
          const data = await response.json()
          setAgents(data.agents || defaultAgents)
        } else {
          throw new Error("API not available")
        }
      } catch (error) {
        console.log("Using default agents:", error)
        // Fallback to default agents
        setAgents(defaultAgents)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAgents()
  }, [])

  const categories = ["All", ...Array.from(new Set(agents.map((agent) => agent.category)))]

  const filteredAgents = agents.filter((agent) => {
    const matchesSearch =
      agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "All" || agent.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const stats = {
    totalAgents: agents.length,
    activeAgents: agents.filter((a) => a.isActive).length,
    totalConversations: agents.reduce((sum, a) => sum + a.conversations, 0),
    avgResponseTime: "0.8s",
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
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
            <div className="hidden md:flex items-center gap-6">
              <Link href="/" className="text-gray-300 hover:text-white transition-colors">
                Home
              </Link>
              <Link href="/dashboard" className="text-white font-medium">
                Dashboard
              </Link>
              <Link href="/create" className="text-gray-300 hover:text-white transition-colors">
                Create
              </Link>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="border-white/20 text-gray-300 hover:bg-white/10 bg-transparent">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <Link href="/create">
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0">
                  <Plus className="w-4 h-4 mr-2" />
                  New Agent
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">AI Agent Dashboard</h1>
          <p className="text-gray-300 text-lg">Manage and monitor your intelligent AI agents</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-black/40 border-white/10 backdrop-blur-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Agents</p>
                  <p className="text-2xl font-bold text-white">{stats.totalAgents}</p>
                </div>
                <Bot className="h-8 w-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-white/10 backdrop-blur-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Active Agents</p>
                  <p className="text-2xl font-bold text-white">{stats.activeAgents}</p>
                </div>
                <Sparkles className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-white/10 backdrop-blur-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Conversations</p>
                  <p className="text-2xl font-bold text-white">{stats.totalConversations}</p>
                </div>
                <MessageCircle className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-white/10 backdrop-blur-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Avg Response</p>
                  <p className="text-2xl font-bold text-white">{stats.avgResponseTime}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search agents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-black/20 border-white/20 text-white placeholder:text-gray-500"
            />
          </div>
          <div className="flex gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className={
                  selectedCategory === category
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0"
                    : "border-white/20 text-gray-300 hover:bg-white/10 bg-transparent"
                }
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Agents Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="bg-black/40 border-white/10 backdrop-blur-xl animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-600 rounded mb-4"></div>
                  <div className="h-3 bg-gray-700 rounded mb-2"></div>
                  <div className="h-3 bg-gray-700 rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAgents.map((agent) => (
              <Card
                key={agent.id}
                className="bg-black/40 border-white/10 backdrop-blur-xl hover:bg-black/50 transition-all duration-300 hover:scale-105"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                        <Bot className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-white text-lg">{agent.name}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge
                            className={`text-xs ${
                              agent.category === "Wellness"
                                ? "bg-green-100/10 text-green-300 border-green-500/30"
                                : agent.category === "Creative"
                                  ? "bg-purple-100/10 text-purple-300 border-purple-500/30"
                                  : agent.category === "Health"
                                    ? "bg-blue-100/10 text-blue-300 border-blue-500/30"
                                    : "bg-yellow-100/10 text-yellow-300 border-yellow-500/30"
                            }`}
                          >
                            {agent.category}
                          </Badge>
                          <Badge
                            className={`text-xs ${
                              agent.isActive
                                ? "bg-green-100/10 text-green-300 border-green-500/30"
                                : "bg-gray-100/10 text-gray-300 border-gray-500/30"
                            }`}
                          >
                            {agent.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white hover:bg-white/10">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-300 mb-4 leading-relaxed">{agent.description}</CardDescription>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Conversations</span>
                      <span className="text-white font-medium">{agent.conversations}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Last Used</span>
                      <span className="text-white font-medium">{agent.lastUsed}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Voice</span>
                      <span className="text-white font-medium">{agent.voiceId}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Link href={`/chat/${agent.id}`} className="flex-1">
                      <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0">
                        <Play className="w-4 h-4 mr-2" />
                        Chat
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-white/20 text-gray-300 hover:bg-white/10 bg-transparent"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-white/20 text-gray-300 hover:bg-white/10 bg-transparent hover:text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {filteredAgents.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <Bot className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No agents found</h3>
            <p className="text-gray-400 mb-6">Try adjusting your search or create a new agent</p>
            <Link href="/create">
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0">
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Agent
              </Button>
            </Link>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/create">
              <Card className="bg-black/40 border-white/10 backdrop-blur-xl hover:bg-black/50 transition-all duration-300 hover:scale-105 cursor-pointer">
                <CardContent className="p-6 text-center">
                  <Plus className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                  <h3 className="text-white font-semibold mb-2">Create New Agent</h3>
                  <p className="text-gray-400 text-sm">Build a custom AI agent with advanced voice capabilities</p>
                </CardContent>
              </Card>
            </Link>

            <Card className="bg-black/40 border-white/10 backdrop-blur-xl hover:bg-black/50 transition-all duration-300 hover:scale-105 cursor-pointer">
              <CardContent className="p-6 text-center">
                <Volume2 className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                <h3 className="text-white font-semibold mb-2">Voice Library</h3>
                <p className="text-gray-400 text-sm">Explore premium voices powered by Murf AI technology</p>
              </CardContent>
            </Card>

            <Card className="bg-black/40 border-white/10 backdrop-blur-xl hover:bg-black/50 transition-all duration-300 hover:scale-105 cursor-pointer">
              <CardContent className="p-6 text-center">
                <TrendingUp className="h-12 w-12 text-green-400 mx-auto mb-4" />
                <h3 className="text-white font-semibold mb-2">Analytics</h3>
                <p className="text-gray-400 text-sm">Track performance and optimize your AI agents</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
