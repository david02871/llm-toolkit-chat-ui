"use client"

import React from "react"
import UserMessage from "./userMessage"
import AssistantMessage from "./assistantMessage"
import CodeMessage from "./codeMessage"

type MessageProps = {
  role: "user" | "assistant" | "code"
  text: string
}

const Message = ({ role, text }: MessageProps) => {
  switch (role) {
    case "user":
      return <UserMessage text={text} />
    case "assistant":
      return <AssistantMessage text={text} />
    case "code":
      return <CodeMessage text={text} />
    default:
      return null
  }
}

export default Message
