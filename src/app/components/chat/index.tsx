"use client"

import React, { useState, useEffect, useRef } from "react"
import { RequiredActionFunctionToolCall } from "openai/resources/beta/threads/runs/runs"
import Message from "./message"
import AssistantThread, {
  MessageType,
  ToolCallType,
} from "@/app/hooks/assistant-thread"
import UserInput from "./userInput"
import Header from "../header"
import usePersistentState from "@/app/hooks/usePersistedState"
import ToolCall from "./ToolCall"
import { FunctionResponse } from "@/app/assistants"
const Chat = () => {
  const [inputDisabled, setInputDisabled] = useState(false)
  const [userInput, setUserInput] = useState("")
  const [currentAssistant, setCurrentAssistant] = usePersistentState(
    "currentAssistant",
    "",
  )

  const functionCallHandler = async (
    functionCall: RequiredActionFunctionToolCall,
  ): Promise<FunctionResponse> => {
    const response = (await fetch(`/api/assistants/handle-function-call`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ functionCall, currentAssistant }),
    })) as any

    if (response) {
      let data = await response.json()
      if (data) {
        return data as FunctionResponse
      }
    }

    return {
      result: "There was an unknown error",
    }
  }

  const handleRunCompleted = async (threadId: string) => {
    setInputDisabled(false)
  }

  const {
    messages,
    toolCalls,
    sendMessage,
    hasPendingToolCalls,
    confirmPendingToolCalls,
    cancelToolCalls,
  } = AssistantThread(functionCallHandler, handleRunCompleted, currentAssistant)

  // Automatically scroll to bottom of chat
  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = (e: any) => {
    e.preventDefault()
    if (!userInput.trim()) return
    sendMessage(userInput)
    setUserInput("")
    setInputDisabled(true)
    scrollToBottom()
  }

  const runScripts = async () => {
    const response = await fetch("/api/run-scripts")
  }

  const allMessages = [...messages, ...toolCalls].sort(
    (a: any, b: any) => a.timestamp - b.timestamp,
  ) as (MessageType | ToolCallType)[]

  return (
    <div className="h-full max-w-full flex-1 flex-col overflow-hidden flex">
      <Header
        currentAssistant={currentAssistant}
        setCurrentAssistant={setCurrentAssistant}
      />
      <main className="flex-1 overflow-y-auto">
        <div className="w-[680px] p-2 mx-auto flex flex-col gap-4">
          {allMessages.map((message, index) =>
            "toolCallId" in message ? (
              <ToolCall
                name={message.name}
                args={message.args}
                output={message.output}
                cancelled={message.cancelled}
                key={message.toolCallId}
              />
            ) : (
              <Message key={index} role={message.role} text={message.text} />
            ),
          )}

          <div ref={messagesEndRef} />
        </div>
      </main>
      {hasPendingToolCalls ? (
        <div className="p-4 flex justify-center space-x-4">
          <button
            onClick={confirmPendingToolCalls}
            className="px-4 py-2 bg-green-500 dark:bg-green-600 text-white rounded hover:bg-green-600 dark:hover:bg-green-700 transition-colors"
          >
            Run Tools
          </button>
          <button
            onClick={cancelToolCalls}
            className="px-4 py-2 bg-red-500 dark:bg-red-600 text-white rounded hover:bg-red-600 dark:hover:bg-red-700 transition-colors"
          >
            Cancel
          </button>
        </div>
      ) : (
        <UserInput
          handleSubmit={handleSubmit}
          isDisabled={inputDisabled}
          userInput={userInput}
          setUserInput={setUserInput}
        />
      )}

      {/* <button onClick={runScripts}>Run Scripts</button> */}
    </div>
  )
}

export default Chat
