import { NextRequest, NextResponse } from "next/server";
import openai from "@/app/openai";

export const runtime = "nodejs";

// Create a new assistant
export async function POST(req: NextRequest, res: NextResponse) {
  const { model, name, description, instructions } = req.body;

  const assistant = await openai.beta.assistants.create({
    model,
    name,
    description,
    instructions,
    tools: [],
  });

  return NextResponse.json({ assistantId: assistant.id }, { status: 200 });
}

export async function GET(req: NextRequest, res: NextResponse) {
  const assistantsResponse = await openai.beta.assistants.list();
  const assistants = assistantsResponse.data;
  console.log(assistants);
  return NextResponse.json(assistants, { status: 200 });
}
