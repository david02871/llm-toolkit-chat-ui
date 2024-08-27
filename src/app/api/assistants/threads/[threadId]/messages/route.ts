import openai from "@/app/openai"
import { NextRequest, NextResponse } from "next/server"
import { MessageCreateParams } from "openai/resources/beta/threads/messages"

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
  let params = {
    role: "user",
    content,
  } as MessageCreateParams

  await openai.beta.threads.messages.create(threadId, params)

  const stream = openai.beta.threads.runs.stream(threadId, {
    assistant_id: assistantId,
  })

  // @ts-ignore
  return new Response(stream.toReadableStream())
}
