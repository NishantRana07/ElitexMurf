import { type NextRequest, NextResponse } from "next/server"
import { Voice } from "@/lib/types"

const voiceOptions: Voice[] = [
  { id: "en-US-terrell", name: "Terrell", style: "Conversational", accent: "American", gender: "Male", language: "en-US" },
  { id: "en-US-natalie", name: "Natalie", style: "Inspirational", accent: "American", gender: "Female", language: "en-US" },
  { id: "en-US-ken", name: "Ken", style: "Energetic", accent: "American", gender: "Male", language: "en-US" },
  { id: "en-US-julia", name: "Julia", style: "Warm", accent: "American", gender: "Female", language: "en-US" },
  { id: "en-US-miles", name: "Miles", style: "Professional", accent: "American", gender: "Male", language: "en-US" },
  { id: "en-GB-oliver", name: "Oliver", style: "Sophisticated", accent: "British", gender: "Male", language: "en-GB" },
  { id: "en-AU-sarah", name: "Sarah", style: "Friendly", accent: "Australian", gender: "Female", language: "en-AU" },
  { id: "es-MX-valeria", name: "Valeria", style: "Expressive", accent: "Mexican", gender: "Female", language: "es-MX" },
  { id: "fr-FR-pierre", name: "Pierre", style: "Elegant", accent: "French", gender: "Male", language: "fr-FR" },
  { id: "de-DE-anna", name: "Anna", style: "Clear", accent: "German", gender: "Female", language: "de-DE" },
  { id: "it-IT-marco", name: "Marco", style: "Passionate", accent: "Italian", gender: "Male", language: "it-IT" },
  { id: "pt-BR-carla", name: "Carla", style: "Warm", accent: "Brazilian", gender: "Female", language: "pt-BR" },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const language = searchParams.get('language')
    const gender = searchParams.get('gender')
    const style = searchParams.get('style')

    let filteredVoices = voiceOptions

    if (language) {
      filteredVoices = filteredVoices.filter(voice => voice.language === language)
    }

    if (gender) {
      filteredVoices = filteredVoices.filter(voice => voice.gender === gender)
    }

    if (style) {
      filteredVoices = filteredVoices.filter(voice => voice.style.toLowerCase().includes(style.toLowerCase()))
    }

    return NextResponse.json({ success: true, data: filteredVoices })
  } catch (error) {
    console.error("Error fetching voices:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch voices" },
      { status: 500 }
    )
  }
} 