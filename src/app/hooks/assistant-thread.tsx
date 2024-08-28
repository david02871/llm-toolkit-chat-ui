import { useEffect, useState } from "react"
import assistantStreamHandler from "./assistant-stream-handler"
import { AssistantStreamEvent } from "openai/resources/beta/assistants.mjs"
import { RequiredActionFunctionToolCall } from "openai/resources/beta/threads/runs/runs"

type FunctionCallHandler = (
  call: RequiredActionFunctionToolCall,
) => Promise<string>

export type MessageType = {
  timestamp: string
  role: "user" | "assistant" | "code"
  text: string
}

export type ToolCallType = {
  timestamp: string
  toolCallId: string
  name: string
  args: string
  output: null
}

const AssistantThread = (
  functionCallHandler: FunctionCallHandler,
  handleRunCompleted: (threadId: string) => void,
  assistantId: string,
) => {
  const [messages, setMessages] = useState<MessageType[]>([])
  const [toolCalls, setToolCalls] = useState<ToolCallType[]>([])
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
    let timestamp = Date.now()
    setMessages((prevMessages: any[]) => [
      ...prevMessages,
      { timestamp, role, text },
    ])
  }

  const appendToolCall = (toolCallId: string, name: string, args: string) => {
    let timestamp = Date.now()
    setToolCalls((prevToolCalls: any[]) => [
      ...prevToolCalls,
      { toolCallId, timestamp, name, args, output: null },
    ])
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

    const actionToolCalls =
      event.data.required_action.submit_tool_outputs.tool_calls

    actionToolCalls.forEach((actionToolCall) => {
      if (actionToolCall.type == "function") {
        appendToolCall(
          actionToolCall.id,
          actionToolCall.function.name,
          actionToolCall.function.arguments,
        )
      }
    })

    const toolCallOutputs = await Promise.all(
      actionToolCalls.map(async (actionToolCall: any) => {
        const result = await functionCallHandler(actionToolCall)
        return { output: result, tool_call_id: actionToolCall.id }
      }),
    )

    toolCallOutputs.forEach((toolCallOutput) => {
      setToolCalls((prevToolCalls: any[]) => {
        return prevToolCalls.map((toolCall: any) => {
          if (toolCall.toolCallId === toolCallOutput.tool_call_id) {
            return {
              ...toolCall,
              output: toolCallOutput.output,
            }
          } else {
            return toolCall
          }
        })
      })
    })

    submitActionResult(runId, toolCallOutputs)
  }

  const handlePendingTasks = async (
    threadId: string,
    handleSystemStreamEventsCallback: any,
  ) => {
    const response = await fetch(
      `/api/assistants/threads/${threadId}/handle-pending-tasks`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          assistantId,
        }),
      },
    )

    const responseBody = await response.body

    if (response.headers.get("Content-Type") === "application/json") {
      // NOP
    } else {
      handleSystemStreamEventsCallback(responseBody)
    }
  }

  const handleSystemStreamEvents = assistantStreamHandler({
    handleRunCompleted,
    appendMessage,
    appendToLastMessage,
    annotateLastMessage,
    handleRequiresAction,
    handlePendingTasks,
  })

  const sendMessage = async (text: string) => {
    appendMessage("user", text)

    const response = await fetch(
      `/api/assistants/threads/${threadId}/messages`,
      {
        method: "POST",
        body: JSON.stringify({
          content: text,
          assistantId,
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

  return { messages, toolCalls, sendMessage }
}

export default AssistantThread
