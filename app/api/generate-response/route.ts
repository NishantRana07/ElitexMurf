import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI({
  apiKey: process.env.GOOGLE_AI_API_KEY || "AIzaSyCEUw8hi5QajCQ6vaBwZ-93v48JoWDx8u8",
})

export async function POST(request: NextRequest) {
  try {
    const { message, agentPrompt } = await request.json()

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" })

    const prompt = agentPrompt || `You are a friendly and talkative AI assistant. Respond to the user's message in a conversational and engaging way. Keep your responses informative but not too long (2-3 sentences max). Here's the user's message: ${message}`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    return NextResponse.json({ text })
  } catch (error) {
    console.error("Error generating response:", error)
    
    // Provide more specific error messages
    let errorMessage = "Failed to generate response"
    if (error instanceof Error) {
      if (error.message.includes("API key")) {
        errorMessage = "Invalid API key. Please check your Google AI API key."
      } else if (error.message.includes("quota")) {
        errorMessage = "API quota exceeded. Please try again later."
      } else if (error.message.includes("model")) {
        errorMessage = "Model not available. Please try a different model."
      } else {
        errorMessage = error.message
      }
    }
    
    return NextResponse.json({ 
      error: errorMessage,
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}
