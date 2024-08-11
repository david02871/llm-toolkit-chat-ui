import { NextApiRequest, NextApiResponse } from "next";
import openai from "@/app/openai";

export const runtime = "nodejs";

// Get a list of available models
export async function GET(req: NextApiRequest, res: NextApiResponse) {
  const models = await openai.models.list();
  return res.json(models);
}
