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

export async function GET() {
  try {
    return NextResponse.json({ success: true, data: agents })
  } catch (error) {
    console.error("Error fetching agents:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch agents" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, category, voiceId, prompt, firstMessage } = body

    if (!name || !description || !category || !voiceId || !prompt || !firstMessage) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      )
    }

    const newAgent: Agent = {
      id: Date.now().toString(),
      name,
      description,
      category,
      voiceId,
      isActive: true,
      conversations: 0,
      lastUsed: "Never",
      prompt,
      firstMessage,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    agents.push(newAgent)

    return NextResponse.json({ success: true, data: newAgent }, { status: 201 })
  } catch (error) {
    console.error("Error creating agent:", error)
    return NextResponse.json(
      { success: false, error: "Failed to create agent" },
      { status: 500 }
    )
  }
} 