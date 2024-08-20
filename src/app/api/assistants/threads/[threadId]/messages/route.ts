import openai from "@/app/openai"
import { NextRequest, NextResponse } from "next/server"

export const runtime = "nodejs"

interface Params {
  params: {
    threadId: string
  }
}

// Send a new message to a thread
export async function POST(
  request: NextRequest,
  { params: { threadId } }: Params,
): Promise<NextResponse> {
  const { content } = await request.json()

  await openai.beta.threads.messages.create(threadId, {
    role: "user",
    content: content,
  })

  const stream = openai.beta.threads.runs.stream(threadId, {
    assistant_id: process.env.OPENAI_ASSISTANT_ID ?? "",
  })

  // @ts-ignore
  return new Response(stream.toReadableStream())
}
