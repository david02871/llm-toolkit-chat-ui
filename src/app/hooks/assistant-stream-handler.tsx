import { AssistantStream } from "openai/lib/AssistantStream.mjs"
import { AssistantStreamEvent } from "openai/resources/beta/assistants.mjs"

type AssistantStreamProps = {
  handleRunCompleted: (threadId: string) => void
  appendMessage: (role: string, text: string) => void
  appendToLastMessage: (text: string) => void
  annotateLastMessage: (annotations: any) => void
  handleRequiresAction: (
    event: AssistantStreamEvent.ThreadRunRequiresAction,
  ) => void

  handlePendingTasks: (threadId: string, assistantStreamHandler: any) => void
}

const assistantStreamHandler = ({
  handleRunCompleted,
  appendMessage,
  appendToLastMessage,
  annotateLastMessage,
  handleRequiresAction,
  handlePendingTasks,
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
    //     {
    //   index: 0,
    //   id: 'call_wUlEFlpUphSxLnvlThDg1IYa',
    //   type: 'function',
    //   function: { name: 'get_weather', arguments: '', output: null }
    // }
    if (toolCall.type == "code_interpreter") {
      return
    }

    // appendMessage("assistant", JSON.stringify(toolCall, null, 2))
  }

  // toolCallDelta - log delta and snapshot for the tool call
  const toolCallDelta = (delta: any) => {
    if (delta.type != "code_interpreter") {
      return
    }
    if (!delta.code_interpreter.input) {
      return
    }
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
    stream.on("event", (event: AssistantStreamEvent) => {
      if (event.event === "thread.run.requires_action") {
        handleRequiresAction(event)
      }
      if (event.event === "thread.run.completed") {
        handleRunCompleted(event.data.thread_id)
        handlePendingTasks(event.data.thread_id, assistantStreamEventHandler)
      }
      if (event.event === "thread.run.failed") {
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
