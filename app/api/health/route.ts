import { type NextRequest, NextResponse } from "next/server"

export async function GET() {
  try {
    const healthData = {
      status: "healthy",
      timestamp: new Date().toISOString(),
      version: "1.0.0",
      services: {
        googleAI: "operational",
        murfAI: "operational",
        database: "operational",
      },
      uptime: process.uptime(),
      memory: process.memoryUsage(),
    }

    return NextResponse.json({ success: true, data: healthData })
  } catch (error) {
    console.error("Health check failed:", error)
    return NextResponse.json(
      { 
        success: false, 
        error: "Health check failed",
        status: "unhealthy",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
} 