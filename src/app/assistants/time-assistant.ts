import { AssistantCreateParams } from "openai/src/resources/beta/assistants.js"
import { FunctionResponse, FunctionMap, Assistant } from "./index"

const name = "Example assistant"
const description = `You can get the current time and date.`
const instructions = `Use this tool to get the current time and date.`

const assistantParams: AssistantCreateParams = {
  model: "gpt-4o",
  name,
  description,
  instructions,
  tools: [
    {
      type: "function",
      function: {
        name: "getCurrentTime__Clock",
        description: "This tool retrieves the current time and date.",
      },
    },
  ],
}

async function getCurrentTime(): Promise<FunctionResponse> {
  const currentTime = new Date().toLocaleTimeString()
  const currentDate = new Date().toLocaleDateString()
  return {
    result: JSON.stringify({
      time: currentTime,
      date: currentDate,
    }),
  }
}

const functionMap: FunctionMap = {
  getCurrentTime__Clock: getCurrentTime,
}

export default {
  name,
  assistantParams,
  functionMap,
} as Assistant
