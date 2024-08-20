import { NextRequest, NextResponse } from "next/server"
import openai from "@/app/openai"

export const runtime = "nodejs"

export async function GET(req: NextRequest, res: NextResponse) {
  const assistantsResponse = await openai.beta.assistants.list()
  const assistants = assistantsResponse.data
  console.log(assistants)
  return NextResponse.json(assistants, { status: 200 })
}
