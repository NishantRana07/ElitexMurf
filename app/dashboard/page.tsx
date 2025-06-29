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
  Loader2,
  AlertCircle,
  Filter,
  RotateCcw,
  Check,
  Code,
  Menu,
  X,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useApp } from "@/lib/context"
import { useToast } from "@/hooks/use-toast"

export default function Dashboard() {
  const { agents, isLoading, error, deleteAgent, updateAgent, loadAgents } = useApp()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { toast } = useToast()

  // Load agents on component mount
  useEffect(() => {
    loadAgents()
  }, [loadAgents])

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

  const handleDeleteAgent = async (agentId: string) => {
    if (!confirm("Are you sure you want to delete this agent? This action cannot be undone.")) {
      return
    }

    setIsDeleting(agentId)
    try {
      const success = await deleteAgent(agentId)
      if (success) {
        toast({
          title: "Agent deleted",
          description: "The agent has been successfully deleted.",
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to delete the agent. Please try again.",
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
      setIsDeleting(null)
    }
  }

  const handleToggleActive = async (agent: any) => {
    try {
      const success = await updateAgent(agent.id, { isActive: !agent.isActive })
      if (success) {
        toast({
          title: "Agent updated",
          description: `Agent ${agent.isActive ? 'deactivated' : 'activated'} successfully.`,
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update agent status.",
        variant: "destructive",
      })
    }
  }

  const handleCopyAgentId = (agentId: string) => {
    navigator.clipboard.writeText(agentId)
    toast({
      title: "Copied!",
      description: "Agent ID copied to clipboard.",
    })
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center mobile-container">
        <Card className="bg-black/40 border-red-500/20 backdrop-blur-xl max-w-md w-full">
          <CardContent className="p-4 sm:p-6 text-center">
            <AlertCircle className="h-8 w-8 sm:h-12 sm:w-12 text-red-400 mx-auto mb-3 sm:mb-4" />
            <h3 className="text-white text-base sm:text-lg font-semibold mb-2">Error Loading Dashboard</h3>
            <p className="text-gray-300 mb-4 mobile-text">{error}</p>
            <Button onClick={() => loadAgents()} className="bg-gradient-to-r from-purple-600 to-pink-600 touch-button">
              <RotateCcw className="w-4 h-4 mr-2" />
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="border-b border-white/10 bg-black/20 backdrop-blur-xl sticky top-0 z-50">
        <div className="mobile-container mx-auto py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <Image
                src="/elite-ai-logo.png"
                alt="Elite AI"
                width={32}
                height={24}
                className="w-6 h-5 sm:w-8 sm:h-6 object-contain"
              />
              <span className="text-lg sm:text-xl font-bold text-white">Elite AI</span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-4 sm:gap-6">
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
            
            {/* Desktop Buttons */}
            <div className="hidden md:flex gap-2 sm:gap-3">
              <Button 
                onClick={() => loadAgents()} 
                disabled={isLoading}
                variant="outline" 
                className="border-white/20 text-gray-300 hover:bg-white/10 bg-transparent touch-button"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <RotateCcw className="w-4 h-4" />
                )}
              </Button>
              <Button variant="outline" className="border-white/20 text-gray-300 hover:bg-white/10 bg-transparent touch-button">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <Link href="/create">
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 touch-button">
                  <Plus className="w-4 h-4 mr-2" />
                  New Agent
                </Button>
              </Link>
            </div>
            
            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-white hover:bg-white/10 touch-button"
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
          
          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-white/10 pt-4">
              <div className="flex flex-col gap-4">
                <Link 
                  href="/" 
                  className="text-gray-300 hover:text-white transition-colors py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Home
                </Link>
                <Link 
                  href="/dashboard" 
                  className="text-white font-medium py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link 
                  href="/create" 
                  className="text-gray-300 hover:text-white transition-colors py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Create
                </Link>
                <div className="flex flex-col gap-3 pt-2">
                  <Button 
                    onClick={() => {
                      loadAgents()
                      setIsMobileMenuOpen(false)
                    }} 
                    disabled={isLoading}
                    variant="outline" 
                    className="w-full border-white/20 text-gray-300 hover:bg-white/10 bg-transparent touch-button"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <RotateCcw className="w-4 h-4" />
                    )}
                    Refresh
                  </Button>
                  <Button variant="outline" className="w-full border-white/20 text-gray-300 hover:bg-white/10 bg-transparent touch-button">
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Button>
                  <Link href="/create">
                    <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 touch-button">
                      <Plus className="w-4 h-4 mr-2" />
                      New Agent
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      <div className="mobile-container mx-auto py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="mobile-heading font-bold text-white mb-2">AI Agent Dashboard</h1>
          <p className="mobile-text text-gray-300">Manage and monitor your intelligent AI agents</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <Card className="bg-black/40 border-white/10 backdrop-blur-xl">
            <CardContent className="p-3 sm:p-6 text-center">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-1 sm:mb-2">{stats.totalAgents}</div>
              <div className="text-gray-300 text-xs sm:text-sm lg:text-base">Total Agents</div>
            </CardContent>
          </Card>
          <Card className="bg-black/40 border-white/10 backdrop-blur-xl">
            <CardContent className="p-3 sm:p-6 text-center">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-1 sm:mb-2">{stats.activeAgents}</div>
              <div className="text-gray-300 text-xs sm:text-sm lg:text-base">Active Agents</div>
            </CardContent>
          </Card>
          <Card className="bg-black/40 border-white/10 backdrop-blur-xl">
            <CardContent className="p-3 sm:p-6 text-center">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-1 sm:mb-2">{stats.totalConversations}</div>
              <div className="text-gray-300 text-xs sm:text-sm lg:text-base">Conversations</div>
            </CardContent>
          </Card>
          <Card className="bg-black/40 border-white/10 backdrop-blur-xl">
            <CardContent className="p-3 sm:p-6 text-center">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-1 sm:mb-2">{stats.avgResponseTime}</div>
              <div className="text-gray-300 text-xs sm:text-sm lg:text-base">Avg Response</div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search agents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-black/40 border-white/10 text-white placeholder-gray-400 touch-button"
            />
          </div>
          <div className="flex gap-2 sm:gap-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-black/40 border border-white/10 text-white rounded-md px-3 py-2 text-sm touch-button"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <Button
              variant="outline"
              className="border-white/20 text-gray-300 hover:bg-white/10 bg-transparent touch-button"
            >
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Agents Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-white" />
          </div>
        ) : filteredAgents.length === 0 ? (
          <Card className="bg-black/40 border-white/10 backdrop-blur-xl">
            <CardContent className="p-8 text-center">
              <Bot className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-white text-lg font-semibold mb-2">No Agents Found</h3>
              <p className="text-gray-300 mb-4 mobile-text">
                {searchTerm || selectedCategory !== "All"
                  ? "No agents match your search criteria."
                  : "Create your first AI agent to get started."}
              </p>
              <Link href="/create">
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 touch-button">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Agent
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredAgents.map((agent) => (
              <Card key={agent.id} className="bg-black/40 border-white/10 backdrop-blur-xl hover:bg-black/50 transition-all duration-300">
                <CardHeader className="pb-3 sm:pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-white text-lg sm:text-xl mb-2">{agent.name}</CardTitle>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge
                          variant={agent.isActive ? "default" : "secondary"}
                          className={agent.isActive ? "bg-green-500/20 text-green-300 border-green-500/30" : "bg-gray-500/20 text-gray-300 border-gray-500/30"}
                        >
                          {agent.isActive ? "Active" : "Inactive"}
                        </Badge>
                        <Badge variant="outline" className="border-purple-500/30 text-purple-300">
                          {agent.category}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-1 sm:gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleCopyAgentId(agent.id)}
                        className="text-gray-400 hover:text-white touch-button"
                      >
                        <Copy className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteAgent(agent.id)}
                        disabled={isDeleting === agent.id}
                        className="text-red-400 hover:text-red-300 touch-button"
                      >
                        {isDeleting === agent.id ? (
                          <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 sm:space-y-4">
                  <CardDescription className="text-gray-300 mobile-text leading-relaxed">
                    {agent.description}
                  </CardDescription>
                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <div className="flex items-center gap-1">
                      <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span>{agent.conversations} conversations</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Volume2 className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span>{agent.voiceId}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 sm:gap-3">
                    <Button
                      size="sm"
                      onClick={() => handleToggleActive(agent)}
                      variant={agent.isActive ? "outline" : "default"}
                      className={`flex-1 touch-button ${
                        agent.isActive
                          ? "border-red-500/30 text-red-300 hover:bg-red-500/10"
                          : "bg-green-500/20 text-green-300 border-green-500/30 hover:bg-green-500/30"
                      }`}
                    >
                      {agent.isActive ? "Deactivate" : "Activate"}
                    </Button>
                    <Link href={`/chat/${agent.id}`} className="flex-1">
                      <Button size="sm" className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 touch-button">
                        <Play className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                        Chat
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
