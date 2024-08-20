import openai from "@/app/openai"
import { NextRequest, NextResponse } from "next/server"

export const runtime = "nodejs"

interface Params {
  params: {
    threadId: string
  }
}

interface RequestBody {
  content: string
  assistantId: string
}

// Send a new message to a thread
export async function POST(
  request: NextRequest,
  { params: { threadId } }: Params,
): Promise<NextResponse> {
  // Parse the request body with type casting
  const { content, assistantId }: RequestBody = await request.json()

  await openai.beta.threads.messages.create(threadId, {
    role: "user",
    content,
  })

  const stream = openai.beta.threads.runs.stream(threadId, {
    assistant_id: assistantId,
  })

  // @ts-ignore
  return new Response(stream.toReadableStream())
}
