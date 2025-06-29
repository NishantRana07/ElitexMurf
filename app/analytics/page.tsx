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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-purple-400 mx-auto mb-4" />
          <p className="text-gray-300">Loading analytics...</p>
        </div>
      </div>
    )
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
                  Back to Dashboard
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
                <span className="text-xl font-bold text-white">Elite AI Analytics</span>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleRefresh}
                className="border-white/20 text-gray-300 hover:bg-white/10 bg-transparent"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button
                variant="outline"
                onClick={handleExport}
                className="border-white/20 text-gray-300 hover:bg-white/10 bg-transparent"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Analytics Dashboard</h1>
          <p className="text-gray-300 text-lg">Track performance and insights for your AI agents</p>
        </div>

        {/* Time Range Selector */}
        <div className="mb-6 flex items-center gap-4">
          <div className="flex gap-2">
            {["1d", "7d", "30d", "90d"].map((range) => (
              <Button
                key={range}
                variant={timeRange === range ? "default" : "outline"}
                onClick={() => setTimeRange(range)}
                className={
                  timeRange === range
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0"
                    : "border-white/20 text-gray-300 hover:bg-white/10 bg-transparent"
                }
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-black/40 border-white/10 backdrop-blur-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Conversations</p>
                  <p className="text-2xl font-bold text-white">
                    {analytics?.totalConversations || 0}
                  </p>
                  <p className="text-green-400 text-sm">+12% from last week</p>
                </div>
                <MessageCircle className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-white/10 backdrop-blur-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Messages</p>
                  <p className="text-2xl font-bold text-white">
                    {analytics?.totalMessages || 0}
                  </p>
                  <p className="text-green-400 text-sm">+8% from last week</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-white/10 backdrop-blur-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Avg Response Time</p>
                  <p className="text-2xl font-bold text-white">
                    {analytics?.averageResponseTime || 0}s
                  </p>
                  <p className="text-green-400 text-sm">-5% from last week</p>
                </div>
                <Activity className="h-8 w-8 text-orange-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-white/10 backdrop-blur-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Most Used Agent</p>
                  <p className="text-lg font-bold text-white truncate">
                    {analytics?.mostUsedAgent || "N/A"}
                  </p>
                  <p className="text-purple-400 text-sm">Top performer</p>
                </div>
                <Bot className="h-8 w-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Daily Activity Chart */}
          <Card className="bg-black/40 border-white/10 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Daily Activity
              </CardTitle>
              <CardDescription className="text-gray-300">
                Conversations and messages over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-300">Chart visualization would go here</p>
                  <p className="text-gray-500 text-sm">Using a charting library like Recharts</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Voice Usage Chart */}
          <Card className="bg-black/40 border-white/10 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Volume2 className="w-5 h-5" />
                Voice Usage
              </CardTitle>
              <CardDescription className="text-gray-300">
                Distribution of voice usage across agents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics?.voiceUsage ? (
                  Object.entries(analytics.voiceUsage).map(([voiceId, count]) => (
                    <div key={voiceId} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-purple-400 rounded-full" />
                        <span className="text-white text-sm">{voiceId}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                            style={{
                              width: `${(count / Math.max(...Object.values(analytics.voiceUsage))) * 100}%`,
                            }}
                          />
                        </div>
                        <span className="text-gray-300 text-sm">{count}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <PieChart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-300">No voice usage data available</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="bg-black/40 border-white/10 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-white">Recent Activity</CardTitle>
            <CardDescription className="text-gray-300">
              Latest conversations and interactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics?.dailyStats?.slice(-5).reverse().map((stat, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-black/20 rounded-lg border border-white/10">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-medium">{stat.date}</p>
                      <p className="text-gray-300 text-sm">
                        {stat.conversations} conversations • {stat.messages} messages
                      </p>
                    </div>
                  </div>
                  <Badge className="bg-green-100/10 text-green-300 border-green-500/30">
                    Active
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 