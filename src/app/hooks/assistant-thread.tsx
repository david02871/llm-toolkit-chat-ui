import React, { useEffect, useState } from "react"
import assistantStreamHandler from "./assistant-stream-handler"
import { AssistantStreamEvent } from "openai/resources/beta/assistants.mjs"
import { RequiredActionFunctionToolCall } from "openai/resources/beta/threads/runs/runs"

type FunctionCallHandler = (
  call: RequiredActionFunctionToolCall,
) => Promise<string>

const AssistantThread = (
  functionCallHandler: FunctionCallHandler,
  handleRunCompleted: () => void,
) => {
  const [messages, setMessages] = useState<any>([])
  const [threadId, setThreadId] = useState("")

  // create a new threadID when chat component created
  useEffect(() => {
    const createThread = async () => {
      const res = await fetch(`/api/assistants/threads`, {
        method: "POST",
      })
      const data = await res.json()
      setThreadId(data.threadId)
    }
    createThread()
  }, [])

  const appendToLastMessage = (text: string) => {
    setMessages((prevMessages: any[]) => {
      const lastMessage = prevMessages[prevMessages.length - 1]
      const updatedLastMessage = {
        ...lastMessage,
        text: lastMessage.text + text,
      }
      return [...prevMessages.slice(0, -1), updatedLastMessage]
    })
  }

  const appendMessage = (role: string, text: string) => {
    setMessages((prevMessages: any[]) => [...prevMessages, { role, text }])
  }

  const annotateLastMessage = (annotations: any[]) => {
    setMessages((prevMessages: any[]) => {
      const lastMessage = prevMessages[prevMessages.length - 1]
      const updatedLastMessage = {
        ...lastMessage,
      }
      annotations.forEach((annotation) => {
        if (annotation.type === "file_path") {
          updatedLastMessage.text = updatedLastMessage.text.replaceAll(
            annotation.text,
            `/api/files/${annotation.file_path.file_id}`,
          )
        }
      })
      return [...prevMessages.slice(0, -1), updatedLastMessage]
    })
  }

  // handleRequiresAction - handle function call
  const handleRequiresAction = async (
    event: AssistantStreamEvent.ThreadRunRequiresAction,
  ) => {
    const runId = event.data.id

    if (event?.data?.required_action?.submit_tool_outputs == null) {
      return
    }

    const toolCalls = event.data.required_action.submit_tool_outputs.tool_calls
    // loop over tool calls and call function handler
    const toolCallOutputs = await Promise.all(
      //       {
      //   id: 'call_wUlEFlpUphSxLnvlThDg1IYa',
      //   type: 'function',
      //   function: {
      //     name: 'get_weather',
      //     arguments: '{"location":"London, UK","unit":"c"}'
      //   }
      // }
      toolCalls.map(async (toolCall: any) => {
        console.log(toolCall)
        const result = await functionCallHandler(toolCall)
        // Hello World
        console.log(result)
        return { output: result, tool_call_id: toolCall.id }
      }),
    )
    submitActionResult(runId, toolCallOutputs)
  }

  const handleSystemStreamEvents = assistantStreamHandler({
    handleRunCompleted,
    appendMessage,
    appendToLastMessage,
    annotateLastMessage,
    handleRequiresAction,
  })

  const sendMessage = async (text: string) => {
    const response = await fetch(
      `/api/assistants/threads/${threadId}/messages`,
      {
        method: "POST",
        body: JSON.stringify({
          content: text,
        }),
      },
    )

    const responseBody = (await response.body) as ReadableStream<any>
    handleSystemStreamEvents(responseBody)
  }

  const submitActionResult = async (runId: string, toolCallOutputs: any) => {
    const response = await fetch(
      `/api/assistants/threads/${threadId}/actions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          runId: runId,
          toolCallOutputs: toolCallOutputs,
        }),
      },
    )

    handleSystemStreamEvents(response.body as ReadableStream<any>)
  }

  return { messages, setMessages, sendMessage }
}

export default AssistantThread
