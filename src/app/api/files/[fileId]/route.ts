import fs from "fs"
import openai from "@/app/openai"
import { NextRequest, NextResponse } from "next/server"
import { MessageCreateParams } from "openai/resources/beta/threads/messages"

export const runtime = "nodejs"

interface Params {
  params: {
    fileId: string
  }
}

// Send a new message to a thread
export async function GET(
  request: NextRequest,
  { params: { fileId } }: Params,
): Promise<NextResponse> {
  try {
    const response = await openai.files.content(fileId)
    const image_data = await response.arrayBuffer()
    const image_data_buffer = Buffer.from(image_data)

    // Set the appropriate headers
    return new NextResponse(image_data_buffer, {
      headers: {
        "Content-Type": "image/jpeg", // or 'image/png', 'image/gif', etc.
        "Content-Length": image_data_buffer.length.toString(),
      },
    })
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ error: "Failed to fetch and serve the image." }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    )
  }
}
