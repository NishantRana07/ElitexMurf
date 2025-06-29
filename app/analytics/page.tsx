"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  TrendingUp,
  MessageCircle,
  Bot,
  Volume2,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  Loader2,
  RefreshCw,
  Download,
  ArrowLeft,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useApp } from "@/lib/context"
import { useToast } from "@/hooks/use-toast"

export default function AnalyticsPage() {
  const { analytics, isLoading } = useApp()
  const { toast } = useToast()
  const [timeRange, setTimeRange] = useState("7d")

  const handleRefresh = () => {
    // In a real app, this would load new analytics data
    toast({
      title: "Refreshed",
      description: "Analytics data has been updated.",
    })
  }

  const handleExport = () => {
    // In a real app, this would export data to CSV/JSON
    toast({
      title: "Export Started",
      description: "Your analytics data is being prepared for download.",
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center mobile-container">
        <div className="text-center">
          <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-purple-400 mx-auto mb-3 sm:mb-4" />
          <p className="text-gray-300 mobile-text">Loading analytics...</p>
        </div>
      </div>
    )
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
                  Back to Dashboard
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
                <span className="text-lg sm:text-xl font-bold text-white">Elite AI Analytics</span>
              </div>
            </div>
            <div className="flex gap-2 sm:gap-3">
              <Button
                variant="outline"
                onClick={handleRefresh}
                className="border-white/20 text-gray-300 hover:bg-white/10 bg-transparent touch-button"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button
                variant="outline"
                onClick={handleExport}
                className="border-white/20 text-gray-300 hover:bg-white/10 bg-transparent touch-button"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="mobile-container mx-auto py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="mobile-heading font-bold text-white mb-2">Analytics Dashboard</h1>
          <p className="mobile-text text-gray-300">Track performance and insights for your AI agents</p>
        </div>

        {/* Time Range Selector */}
        <div className="mb-4 sm:mb-6">
          <div className="flex flex-wrap gap-2">
            {["1d", "7d", "30d", "90d"].map((range) => (
              <Button
                key={range}
                variant={timeRange === range ? "default" : "outline"}
                onClick={() => setTimeRange(range)}
                className={`touch-button ${
                  timeRange === range
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0"
                    : "border-white/20 text-gray-300 hover:bg-white/10 bg-transparent"
                }`}
              >
                {range === "1d" && "Today"}
                {range === "7d" && "7 Days"}
                {range === "30d" && "30 Days"}
                {range === "90d" && "90 Days"}
              </Button>
            ))}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <Card className="bg-black/40 border-white/10 backdrop-blur-xl">
            <CardContent className="p-3 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-xs sm:text-sm">Total Conversations</p>
                  <p className="text-lg sm:text-2xl font-bold text-white">
                    {analytics?.totalConversations || 0}
                  </p>
                  <p className="text-green-400 text-xs sm:text-sm">+12% from last week</p>
                </div>
                <MessageCircle className="h-6 w-6 sm:h-8 sm:w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-white/10 backdrop-blur-xl">
            <CardContent className="p-3 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-xs sm:text-sm">Total Messages</p>
                  <p className="text-lg sm:text-2xl font-bold text-white">
                    {analytics?.totalMessages || 0}
                  </p>
                  <p className="text-green-400 text-xs sm:text-sm">+8% from last week</p>
                </div>
                <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-white/10 backdrop-blur-xl">
            <CardContent className="p-3 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-xs sm:text-sm">Avg Response Time</p>
                  <p className="text-lg sm:text-2xl font-bold text-white">
                    {analytics?.averageResponseTime || 0}s
                  </p>
                  <p className="text-green-400 text-xs sm:text-sm">-5% from last week</p>
                </div>
                <Activity className="h-6 w-6 sm:h-8 sm:w-8 text-orange-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-white/10 backdrop-blur-xl">
            <CardContent className="p-3 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-xs sm:text-sm">Most Used Agent</p>
                  <p className="text-base sm:text-lg font-bold text-white truncate">
                    {analytics?.mostUsedAgent || "N/A"}
                  </p>
                  <p className="text-purple-400 text-xs sm:text-sm">Top performer</p>
                </div>
                <Bot className="h-6 w-6 sm:h-8 sm:w-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8">
          {/* Daily Activity Chart */}
          <Card className="bg-black/40 border-white/10 backdrop-blur-xl">
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="text-white mobile-text">Daily Activity</CardTitle>
              <CardDescription className="text-gray-300 mobile-text">
                Conversation volume over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-48 sm:h-64 bg-black/20 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <BarChart3 className="h-8 w-8 mx-auto mb-2" />
                  <p className="mobile-text">Chart visualization</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Agent Performance */}
          <Card className="bg-black/40 border-white/10 backdrop-blur-xl">
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="text-white mobile-text">Agent Performance</CardTitle>
              <CardDescription className="text-gray-300 mobile-text">
                Top performing agents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: "Stress Relief Assistant", conversations: 156, growth: "+15%" },
                  { name: "Creative Artist", conversations: 89, growth: "+8%" },
                  { name: "Fitness Coach", conversations: 67, growth: "+12%" },
                  { name: "Study Buddy", conversations: 45, growth: "+5%" },
                ].map((agent, index) => (
                  <div key={index} className="flex items-center justify-between p-2 sm:p-3 bg-black/20 rounded-lg">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <div>
                        <p className="text-white mobile-text font-medium">{agent.name}</p>
                        <p className="text-gray-400 text-xs sm:text-sm">{agent.conversations} conversations</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-green-500/20 text-green-300">
                      {agent.growth}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Voice Usage */}
          <Card className="bg-black/40 border-white/10 backdrop-blur-xl">
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="text-white mobile-text flex items-center gap-2">
                <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />
                Voice Usage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { voice: "Terrell", usage: "45%", color: "bg-blue-500" },
                  { voice: "Natalie", usage: "32%", color: "bg-purple-500" },
                  { voice: "Ken", usage: "18%", color: "bg-green-500" },
                  { voice: "Julia", usage: "5%", color: "bg-orange-500" },
                ].map((item, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-300">{item.voice}</span>
                      <span className="text-white">{item.usage}</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className={`${item.color} h-2 rounded-full`}
                        style={{ width: item.usage }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="bg-black/40 border-white/10 backdrop-blur-xl">
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="text-white mobile-text flex items-center gap-2">
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { time: "2 min ago", action: "New conversation started", agent: "Stress Relief" },
                  { time: "5 min ago", action: "Agent activated", agent: "Creative Artist" },
                  { time: "12 min ago", action: "Voice preview generated", agent: "Fitness Coach" },
                  { time: "18 min ago", action: "Agent updated", agent: "Study Buddy" },
                ].map((activity, index) => (
                  <div key={index} className="flex items-center gap-3 p-2 sm:p-3 bg-black/20 rounded-lg">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-white mobile-text">{activity.action}</p>
                      <p className="text-gray-400 text-xs sm:text-sm">{activity.agent}</p>
                    </div>
                    <span className="text-gray-500 text-xs">{activity.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 