import { AssistantCreateParams } from "openai/src/resources/beta/assistants.js"
import { FunctionResponse, FunctionMap, Assistant } from "./index"

const name = "LLM Toolkit Code assistant"
const description = `You can generage and execute Python or Bash code in a sandbox`
const instructions = `Use this tool to generate and execute Python code which runs in a sandbox environment.
  When displaying any images generated by the execute_code tool,
  use markdown and the following url format: /api/files/?file_name=the_chart.jpeg

  All images should be in .jpeg format.

  Missing python modules can be installed using pip through bash code blocks. For example: "pip install matplotlib"
`

const assistantParams: AssistantCreateParams = {
  model: "gpt-4o",
  name,
  description,
  instructions,
  tools: [
    {
      type: "function",
      function: {
        name: "executeCode__CONFIRM",
        description:
          "Executes code in a safe sandbox. Use python or bash. Use print() to return python output. Files should be read from and written to the current directory `Path.cwd()`.",
        parameters: {
          type: "object",
          properties: {
            code__Code: {
              type: "string",
              description:
                "The code to execute. Do not include markdown as this will be added automatically",
            },
            language: {
              type: "string",
              description: "python or bash",
            },
          },
          required: ["code", "language"],
          strict: true,
        },
      },
    },
  ],
}

const executeCode = async ({
  code__Code,
  language,
}: {
  code__Code: string
  language: string
}): Promise<FunctionResponse> => {
  const response = await fetch("http://localhost:3001/execute", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ code: code__Code, language }),
  })

  let data = await response.json()
  return {
    result: JSON.stringify(data),
  }
}

const functionMap: FunctionMap = {
  executeCode__CONFIRM: executeCode,
}

export default {
  name,
  assistantParams,
  functionMap,
} as Assistant
