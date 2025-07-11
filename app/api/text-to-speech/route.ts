import { type NextRequest, NextResponse } from "next/server"
import axios from "axios"

export async function POST(request: NextRequest) {
  try {
    const { text, voiceId } = await request.json()

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 })
    }

    const data = {
      text: text,
      voiceId: voiceId || "en-US-terrell",
    }

    const response = await axios.post("https://api.murf.ai/v1/speech/generate", data, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "api-key": process.env.MURF_API_KEY || "ap2_212a8c26-44b3-46ae-872a-735aa2c74974",
      },
    })

    return NextResponse.json({ audioUrl: response.data.audioFile })
  } catch (error) {
    console.error("Error converting text to speech:", error)
    return NextResponse.json({ error: "Failed to convert text to speech" }, { status: 500 })
  }
}
