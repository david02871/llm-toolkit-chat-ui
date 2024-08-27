"use client"

import React, { useState, useEffect, useRef } from "react"
import { RequiredActionFunctionToolCall } from "openai/resources/beta/threads/runs/runs"
import Message from "./message"
import AssistantThread from "@/app/hooks/assistant-thread"
import UserInput from "./userInput"
import Header from "../header"
import usePersistentState from "@/app/hooks/usePersistedState"

const Chat = () => {
  const [inputDisabled, setInputDisabled] = useState(false)
  const [userInput, setUserInput] = useState("")
  const [currentAssistant, setCurrentAssistant] = usePersistentState(
    "currentAssistant",
    "",
  )

  const functionCallHandler = async (
    functionCall: RequiredActionFunctionToolCall,
  ) => {
    const response = (await fetch(`/api/assistants/handle-function-call`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(functionCall),
    })) as any

    if (response) {
      let data = await response.json()
      if (data.message) {
        return data.message
      }
    }

    return "There was an unknown error"
  }

  const handleRunCompleted = async (threadId: string) => {
    setInputDisabled(false)
  }

  const { messages, setMessages, sendMessage } = AssistantThread(
    functionCallHandler,
    handleRunCompleted,
    currentAssistant,
  )

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

  return (
    <div className="h-full max-w-full flex-1 flex-col overflow-hidden flex">
      <Header
        currentAssistant={currentAssistant}
        setCurrentAssistant={setCurrentAssistant}
      />
      <main className="flex-1 overflow-y-auto">
        <div className="w-[680px] p-2 mx-auto flex flex-col gap-4">
          {messages.map((msg: any, index: number) => (
            <Message key={index} role={msg.role} text={msg.text} />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </main>
      <UserInput
        handleSubmit={handleSubmit}
        isDisabled={inputDisabled}
        userInput={userInput}
        setUserInput={setUserInput}
      />

      <button onClick={runScripts}>Run Scripts</button>
    </div>
  )
}

export default Chat
