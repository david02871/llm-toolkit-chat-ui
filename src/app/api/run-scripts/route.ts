import { NextRequest, NextResponse } from "next/server"

export const runtime = "nodejs"

export async function GET(req: NextRequest, res: NextResponse) {
  return NextResponse.json({}, { status: 200 })
}
