import { NextRequest, NextResponse } from "next/server"
import civicrmAssistant from "@/app/assistants/civicrm-assistant"

export const runtime = "nodejs"

export async function GET(req: NextRequest, res: NextResponse) {
  let result = await civicrmAssistant.createCiviCrmAssistant()
  console.log(result)
  return NextResponse.json({}, { status: 200 })
}
