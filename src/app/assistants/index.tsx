import openai from "@/app/openai"
import { AssistantCreateParams } from "openai/src/resources/beta/assistants.js"
import timeAssistant from "./time-assistant"
import pythonAssistant from "./python-assistant"

const allAssistants: Assistant[] = [timeAssistant, pythonAssistant]

export async function createAssistants() {
  const existingAssistants = await openai.beta.assistants.list()

  for (const assistant of allAssistants) {
    const existingAssistant = existingAssistants.data.find(
      (a) => a.name === assistant.name,
    )

    if (existingAssistant) {
      await openai.beta.assistants.del(existingAssistant.id)
    }

    await openai.beta.assistants.create(assistant.assistantParams)
  }
}

export async function getAssistantById(assistantId: string) {
  const existingAssistants = await openai.beta.assistants.list()
  const existingAssistant = existingAssistants.data.find(
    (a) => a.id === assistantId,
  )

  const assistant = allAssistants.find(
    (a) => a.name === existingAssistant?.name,
  )

  return assistant
}

export async function getFunctionMap(
  assistantId: string,
): Promise<FunctionMap | undefined> {
  const assistant = await getAssistantById(assistantId)
  if (!assistant) {
    console.error(`Assistant not found for id: ${assistantId}`)
    return {}
  }
  return assistant.functionMap
}

export interface FunctionResponse {
  result: string
}

export interface FunctionMap {
  [key: string]: Function
}

export interface Assistant {
  name: string
  assistantParams: AssistantCreateParams
  functionMap: FunctionMap
}
