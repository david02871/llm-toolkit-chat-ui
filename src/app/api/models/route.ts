import { NextResponse, NextRequest } from "next/server"
import openai from "@/app/openai"

export const runtime = "nodejs"

export async function GET(request: NextRequest) {
  const modelsResponse = await openai.models.list()
  const models = modelsResponse.data
  // sort by created, desc
  models.sort((a: any, b: any) => {
    return b.created - a.created
  })
  return NextResponse.json(models, { status: 200 })
}
