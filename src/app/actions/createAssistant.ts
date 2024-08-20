"use server";

import openai from "@/app/openai";

export async function createAssistant(formData: FormData) {
  const model = formData.get("model")?.toString() ?? "";
  const name = formData.get("name")?.toString() ?? "";
  const description = formData.get("description")?.toString() ?? "";
  const instructions = formData.get("instructions")?.toString() ?? "";

  const assistant = await openai.beta.assistants.create({
    model,
    name,
    description,
    instructions,
    tools: [],
  });

  return assistant.id; // Return the created assistant's ID
}
