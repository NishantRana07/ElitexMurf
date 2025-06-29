import { type NextRequest, NextResponse } from "next/server"
import { Agent } from "@/lib/types"

// In-memory storage for demo purposes
// In production, this would be a database
let agents: Agent[] = [
  {
    id: "1",
    name: "Stress-Buster Buddy",
    description: "Your empathetic companion for stress relief and mental wellness support",
    category: "Wellness",
    voiceId: "en-US-terrell",
    isActive: true,
    conversations: 127,
    lastUsed: "2 hours ago",
    prompt: "You are a talkative, empathetic assistant bot. Your main job is to help people reduce stress by chatting with them, giving them calming advice, jokes, or friendly motivation. You talk in a relaxed, human tone, like a good friend who really listens.",
    firstMessage: "Hey there 😊 I'm your little stress-buster buddy! What's on your mind today?",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
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
    prompt: "You are an inspiring and knowledgeable artist assistant. You help people with creative projects, art techniques, and provide artistic inspiration. You're passionate about all forms of art and love to encourage creativity.",
    firstMessage: "Hello, creative soul! 🎨 I'm here to help spark your artistic journey. What are you working on today?",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
]

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const agent = agents.find(a => a.id === params.id)
    
    if (!agent) {
      return NextResponse.json(
        { success: false, error: "Agent not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: agent })
  } catch (error) {
    console.error("Error fetching agent:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch agent" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const agentIndex = agents.findIndex(a => a.id === params.id)
    
    if (agentIndex === -1) {
      return NextResponse.json(
        { success: false, error: "Agent not found" },
        { status: 404 }
      )
    }

    const updatedAgent = {
      ...agents[agentIndex],
      ...body,
      updatedAt: new Date().toISOString(),
    }

    agents[agentIndex] = updatedAgent

    return NextResponse.json({ success: true, data: updatedAgent })
  } catch (error) {
    console.error("Error updating agent:", error)
    return NextResponse.json(
      { success: false, error: "Failed to update agent" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const agentIndex = agents.findIndex(a => a.id === params.id)
    
    if (agentIndex === -1) {
      return NextResponse.json(
        { success: false, error: "Agent not found" },
        { status: 404 }
      )
    }

    agents.splice(agentIndex, 1)

    return NextResponse.json({ success: true, message: "Agent deleted successfully" })
  } catch (error) {
    console.error("Error deleting agent:", error)
    return NextResponse.json(
      { success: false, error: "Failed to delete agent" },
      { status: 500 }
    )
  }
} 