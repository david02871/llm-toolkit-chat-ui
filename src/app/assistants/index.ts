import openai from "@/app/openai"
import timeAssistant from "./custom-assistants/time-assistant"

const assistants = [timeAssistant]

export async function createAssistants() {
  const existingAssistants = await openai.beta.assistants.list()

  for (const assistant of assistants) {
    const existingAssistant = existingAssistants.data.find(
      (a) => a.name === assistant.name,
    )

    if (existingAssistant) {
      await openai.beta.assistants.del(existingAssistant.id)
    }

    await openai.beta.assistants.create(assistant.assistantParams)
  }
}

export async function getFunctionMapByAssistantId(assistantId: string) {
  const existingAssistants = await openai.beta.assistants.list()
  const existingAssistant = existingAssistants.data.find(
    (a) => a.id === assistantId,
  )

  const assistant = assistants.find((a) => a.name === existingAssistant?.name)
  return assistant?.functionMap as any
}
