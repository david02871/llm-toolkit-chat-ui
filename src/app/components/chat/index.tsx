"use client";

import React, { useState, useEffect, useRef } from "react";
import styles from "./chat.module.css";
import { RequiredActionFunctionToolCall } from "openai/resources/beta/threads/runs/runs";
import Message from "./message";
import AssistantThread from "@/app/hooks/assistant-thread";

type ChatProps = {
  functionCallHandler?: (
    toolCall: RequiredActionFunctionToolCall
  ) => Promise<string>;
};

const Chat = ({
  functionCallHandler = () => Promise.resolve(""), // default to return empty string
}: ChatProps) => {
  const [userInput, setUserInput] = useState("");
  const [inputDisabled, setInputDisabled] = useState(false);

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

  const handleInputChange = (event: any) => {
    setUserInput(event.target.value);
  };

  const handleKeyDown = (event: any) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault(); // Prevents newline from being added
      handleSubmit(event);
    }
  };

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"; // Reset the height
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Set it to the scroll height
    }
  }, [userInput]); // Run effect every time the input value changes

  return (
    <div className="flex-grow p-6 flex flex-col justify-between">
      <div className="flex-grow">
        <h1 className="text-2xl font-bold mb-8">🧙‍♂️ GPT 4o</h1>
        <div className={styles.messages}>
          {messages.map((msg: any, index: number) => (
            <Message key={index} role={msg.role} text={msg.text} />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
      {/* Centered Input Field and Submit Button Area */}
      <div className="w-full max-w-[800px] mx-auto">
        <div className="flex items-center bg-[#3b3b3b] p-2 rounded-3xl">
          <button className="bg-transparent text-white p-2">
            {/* Attach button, placeholder for icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.172 7l-6.586 6.586a1 1 0 01-1.414 0L2 8.828V21h18V3H8.828l4.243 4.243a1 1 0 010 1.414L7 15.172M15.172 7L7 15.172"
              />
            </svg>
          </button>
          <textarea
            ref={textareaRef}
            value={userInput}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Message ChatGPT"
            className="flex-grow text-white p-2 focus:outline-none resize-none bg-[#3b3b3b]"
            rows={1}
            style={{
              minHeight: "40px",
              maxHeight: "200px",
              overflowY: "auto",
            }}
          />
          <button
            className="ml-3 bg-[#4b4b4b] p-3 rounded-full hover:bg-[#5b5b5b]"
            onClick={handleSubmit}
            disabled={inputDisabled}
          >
            {/* Send button with up arrow */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="h-4 w-4 text-white"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 10l7-7m0 0l7 7m-7-7v18"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
