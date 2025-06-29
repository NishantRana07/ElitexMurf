import { type NextRequest, NextResponse } from "next/server"

// Mock analytics data
const mockAnalytics = {
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
    { date: "2024-01-01", conversations: 12, messages: 89 },
    { date: "2024-01-02", conversations: 18, messages: 134 },
    { date: "2024-01-03", conversations: 15, messages: 112 },
    { date: "2024-01-04", conversations: 22, messages: 167 },
    { date: "2024-01-05", conversations: 19, messages: 145 },
    { date: "2024-01-06", conversations: 25, messages: 189 },
    { date: "2024-01-07", conversations: 28, messages: 203 },
  ],
}

export async function GET() {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    return NextResponse.json({ success: true, data: mockAnalytics })
  } catch (error) {
    console.error("Error fetching analytics:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch analytics" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { conversationId, agentId, messageCount, duration } = body

    // In a real application, this would update the analytics in a database
    console.log("Analytics update:", { conversationId, agentId, messageCount, duration })

    return NextResponse.json({ success: true, message: "Analytics updated" })
  } catch (error) {
    console.error("Error updating analytics:", error)
    return NextResponse.json(
      { success: false, error: "Failed to update analytics" },
      { status: 500 }
    )
  }
} 