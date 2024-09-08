import { NextRequest, NextResponse } from "next/server"
import { createAssistants } from "@/app/assistants"
import openai from "@/app/openai"

export const runtime = "nodejs"

export async function GET(req: NextRequest, res: NextResponse) {
  const assistantsResponse = await openai.beta.assistants.list()
  const assistants = assistantsResponse.data
  return NextResponse.json(assistants, { status: 200 })
}

export async function POST(req: NextRequest, res: NextResponse) {
  await createAssistants()
  return NextResponse.json({ message: "Assistants created" }, { status: 200 })
}
