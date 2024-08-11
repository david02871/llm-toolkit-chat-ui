import { NextApiRequest, NextApiResponse } from "next";
import openai from "@/app/openai";

export const runtime = "nodejs";

// Create a new assistant
export async function POST(req: NextApiRequest, res: NextApiResponse) {
  const { model, name, description, instructions } = req.body;

  const assistant = await openai.beta.assistants.create({
    model,
    name,
    description,
    instructions,
    tools: [],
  });

  return res.json({ assistantId: assistant.id });
}
