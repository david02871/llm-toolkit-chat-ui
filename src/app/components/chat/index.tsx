"use client";

import React, { useState, useEffect, useRef } from "react";
import { RequiredActionFunctionToolCall } from "openai/resources/beta/threads/runs/runs";
import Message from "./message";
import AssistantThread from "@/app/hooks/assistant-thread";
import UserInput from "./userInput";
import Header from "../header";
import usePersistentState from "@/app/hooks/usePersistedState";

const Chat = () => {
  const [inputDisabled, setInputDisabled] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [currentAssistant, setCurrentAssistant] = usePersistentState(
    "currentAssistant",
    ""
  );

  const functionCallHandler = async (
    functionCall: RequiredActionFunctionToolCall
  ) => {
    // {
    //   id: 'call_wUlEFlpUphSxLnvlThDg1IYa',
    //   type: 'function',
    //   function: {
    //     name: 'get_weather',
    //     arguments: '{"location":"London, UK","unit":"c"}'
    //   }
    // }

    console.log(functionCall);
    // if (call?.function?.name !== "get_weather") return;
    // const args = JSON.parse(call.function.arguments);
    return "Hello world";
  };

  const { messages, setMessages, sendMessage } = AssistantThread(
    functionCallHandler,
    () => setInputDisabled(false)
  );

  // Automatically scroll to bottom of chat
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (!userInput.trim()) return;
    sendMessage(userInput);
    setMessages((prevMessages: any) => [
      ...prevMessages,
      { role: "user", text: userInput },
    ]);
    setUserInput("");
    setInputDisabled(true);
    scrollToBottom();
  };

  return (
    <div className="h-full max-w-full flex-1 flex-col overflow-hidden flex">
      <Header
        currentAssistant={currentAssistant}
        setCurrentAssistant={setCurrentAssistant}
      />
      <main className="flex-1 overflow-y-auto">
        <div className="w-[680px] p-2 mx-auto flex flex-col gap-4 w-[680px] p-2 mx-auto">
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
    </div>
  );
};

export default Chat;
