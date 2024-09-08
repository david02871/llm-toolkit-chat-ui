import { AssistantCreateParams } from "openai/src/resources/beta/assistants.js"

const name = "Time assistant"
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
        name: "get_current_time",
        description: "This tool retrieves the current time and date.",
      },
    },
  ],
}

async function getCurrentTime({}) {
  const currentTime = new Date().toLocaleTimeString()
  const currentDate = new Date().toLocaleDateString()
  return `The current time is ${currentTime} and the current date is ${currentDate}.`
}

const functionMap = {
  get_current_time: getCurrentTime,
}

export default {
  name,
  assistantParams,
  functionMap,
}
