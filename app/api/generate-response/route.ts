import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI({
  apiKey: process.env.GOOGLE_AI_API_KEY || "",
})

export async function POST(request: NextRequest) {
  if (!process.env.GOOGLE_AI_API_KEY) {
    console.error("Missing GOOGLE_AI_API_KEY environment variable")
    return NextResponse.json({ error: "Server misconfiguration: missing API key" }, { status: 500 })
  }

  try {
    const { message } = await request.json()

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" })

    const prompt = `You are a friendly and talkative AI assistant. Respond to the user's message in a conversational and engaging way. Keep your responses informative but not too long (2-3 sentences max). Here's the user's message: ${message}`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    return NextResponse.json({ text })
  } catch (error) {
    console.error("Error generating response:", error)
    return NextResponse.json({ error: "Failed to generate response" }, { status: 500 })
  }
}
