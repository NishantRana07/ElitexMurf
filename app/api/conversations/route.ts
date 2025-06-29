import { type NextRequest, NextResponse } from "next/server"
import { Conversation, ChatMessage } from "@/lib/types"

// In-memory storage for demo purposes
// In production, this would be a database
let conversations: Conversation[] = []

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const agentId = searchParams.get('agentId')

    let filteredConversations = conversations

    if (agentId) {
      filteredConversations = conversations.filter(c => c.agentId === agentId)
    }

    // Return conversation summaries (without full messages for performance)
    const conversationSummaries = filteredConversations.map(conv => ({
      id: conv.id,
      agentId: conv.agentId,
      startedAt: conv.startedAt,
      messageCount: conv.messageCount,
      lastMessageAt: conv.messages[conv.messages.length - 1]?.timestamp || conv.startedAt,
    }))

    return NextResponse.json({ success: true, data: conversationSummaries })
  } catch (error) {
    console.error("Error fetching conversations:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch conversations" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { agentId, messages } = body

    if (!agentId || !messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      )
    }

    const newConversation: Conversation = {
      id: Date.now().toString(),
      agentId,
      messages: messages.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp || Date.now()),
      })),
      startedAt: new Date().toISOString(),
      messageCount: messages.length,
    }

    conversations.push(newConversation)

    return NextResponse.json({ success: true, data: { id: newConversation.id } }, { status: 201 })
  } catch (error) {
    console.error("Error creating conversation:", error)
    return NextResponse.json(
      { success: false, error: "Failed to create conversation" },
      { status: 500 }
    )
  }
} 