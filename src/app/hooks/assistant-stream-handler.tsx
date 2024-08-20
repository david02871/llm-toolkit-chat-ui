import { AssistantStream } from "openai/lib/AssistantStream.mjs"
import { AssistantStreamEvent } from "openai/resources/beta/assistants.mjs"

type AssistantStreamProps = {
  handleRunCompleted: () => void
  appendMessage: (role: string, text: string) => void
  appendToLastMessage: (text: string) => void
  annotateLastMessage: (annotations: any) => void
  handleRequiresAction: (
    event: AssistantStreamEvent.ThreadRunRequiresAction,
  ) => void
}

const assistantStreamHandler = ({
  handleRunCompleted,
  appendMessage,
  appendToLastMessage,
  annotateLastMessage,
  handleRequiresAction,
}: AssistantStreamProps) => {
  // textCreated - create new assistant message
  const handleTextCreated = () => {
    appendMessage("assistant", "")
  }

  // textDelta - append text to last assistant message
  const handleTextDelta = (delta: any) => {
    if (delta.value != null) {
      appendToLastMessage(delta.value)
    }
    if (delta.annotations != null) {
      annotateLastMessage(delta.annotations)
    }
  }

  // imageFileDone - show image in chat
  const handleImageFileDone = (image: { file_id: string }) => {
    appendToLastMessage(`\n![${image.file_id}](/api/files/${image.file_id})\n`)
  }

  // toolCallCreated - log new tool call
  const toolCallCreated = (toolCall: { type: string }) => {
    console.log(toolCall)
    //     {
    //   index: 0,
    //   id: 'call_wUlEFlpUphSxLnvlThDg1IYa',
    //   type: 'function',
    //   function: { name: 'get_weather', arguments: '', output: null }
    // }
    if (toolCall.type != "code_interpreter") return
    appendMessage("code", "")
  }

  // toolCallDelta - log delta and snapshot for the tool call
  const toolCallDelta = (delta: any, snapshot: any) => {
    console.log(delta)
    if (delta.type != "code_interpreter") return
    if (!delta.code_interpreter.input) return
    appendToLastMessage(delta.code_interpreter.input)
  }

  const assistantStreamEventHandler = (readableStream: ReadableStream<any>) => {
    const stream = AssistantStream.fromReadableStream(readableStream)

    // messages
    stream.on("textCreated", handleTextCreated)
    stream.on("textDelta", handleTextDelta)

    // image
    stream.on("imageFileDone", handleImageFileDone)

    // code interpreter
    stream.on("toolCallCreated", toolCallCreated)
    stream.on("toolCallDelta", toolCallDelta)

    // events without helpers yet (e.g. requires_action and run.done)
    stream.on("event", (event) => {
      if (event.event === "thread.run.requires_action") {
        {
          //   event: 'thread.run.requires_action',
          //   data: {
          //     id: 'run_CRHJW6Fgj3d4ZzIQVZvR8YEB',
          //     object: 'thread.run',
          //     created_at: 1723332568,
          //     assistant_id: 'asst_G2qyXHnesja8vePPT7y9Wkps',
          //     thread_id: 'thread_1ENSAyhGfB6jMwzS0OnA41so',
          //     status: 'requires_action',
          //     started_at: 1723332571,
          //     expires_at: 1723333168,
          //     cancelled_at: null,
          //     failed_at: null,
          //     completed_at: null,
          //     required_action: {
          //       type: 'submit_tool_outputs',
          //       submit_tool_outputs: {
          //         tool_calls: [
          //           {
          //             id: 'call_wUlEFlpUphSxLnvlThDg1IYa',
          //             type: 'function',
          //             function: {
          //               name: 'get_weather',
          //               arguments: '{"location":"London, UK","unit":"c"}'
          //             }
          //           }
          //         ]
          //       }
          //     },
          //     last_error: null,
          //     model: 'gpt-4o',
          //     instructions: null,
          //     tools: [
          //       {
          //         type: 'function',
          //         function: {
          //           name: 'get_weather',
          //           description: 'Determine weather in my location',
          //           parameters: {
          //             type: 'object',
          //             properties: {
          //               location: {
          //                 type: 'string',
          //                 description: 'The city and state e.g. San Francisco, CA'
          //               },
          //               unit: { type: 'string', enum: [ 'c', 'f' ] }
          //             },
          //             required: [ 'location', 'unit' ],
          //             additionalProperties: false
          //           }
          //         }
          //       }
          //     ],
          //     tool_resources: { code_interpreter: { file_ids: [] } },
          //     metadata: {},
          //     temperature: 1,
          //     top_p: 1,
          //     max_completion_tokens: null,
          //     max_prompt_tokens: null,
          //     truncation_strategy: { type: 'auto', last_messages: null },
          //     incomplete_details: null,
          //     usage: null,
          //     response_format: { type: 'text' },
          //     tool_choice: 'auto',
          //     parallel_tool_calls: true
          //   }
        }
        console.log(event)
        handleRequiresAction(event)
      }
      if (event.event === "thread.run.completed") {
        handleRunCompleted()
      }
      if (event.event === "thread.run.failed") {
        console.error(event)
        appendMessage(
          "assistant",
          `The run failed. ${event?.data?.last_error?.code || ""} ${
            event?.data?.last_error?.message
          }`,
        )
      }
    })
  }

  return assistantStreamEventHandler
}

export default assistantStreamHandler
