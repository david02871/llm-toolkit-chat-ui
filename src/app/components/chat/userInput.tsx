"use client"

import React, { useState, useEffect, useRef } from "react"

type UserInputProps = {
  handleSubmit: (e: React.SyntheticEvent) => void
  isDisabled: boolean
  userInput: string
  setUserInput: (value: string) => void
}

const UserInput = ({
  handleSubmit,
  isDisabled,
  userInput,
  setUserInput,
}: UserInputProps) => {
  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserInput(event.target.value)
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault() // Prevents newline from being added
      handleSubmit(event)
    }
  }

  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto" // Reset the height
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px` // Set it to the scroll height
    }
  }, [userInput]) // Run effect every time the input value changes

  return (
    <div className="w-full pb-6 bg-background-primary flex justify-center">
      <form
        onSubmit={handleSubmit}
        className="flex items-center bg-background-surface p-2 rounded-3xl max-w-[700px] w-full"
      >
        <textarea
          ref={textareaRef}
          value={userInput}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Message ChatGPT"
          className="flex-grow p-2 focus:outline-none resize-none bg-background-surface"
          rows={1}
          style={{
            minHeight: "40px",
            maxHeight: "200px",
            overflowY: "auto",
          }}
        />
        <button
          type="submit"
          className={`ml-3 bg-text-secondary p-3 rounded-full ${isDisabled ? "" : "hover:bg-text-primary"}`}
          disabled={isDisabled}
          style={{
            cursor: isDisabled ? "not-allowed" : "pointer",
            opacity: isDisabled ? 0.3 : 1,
          }}
        >
          {/* Send button with up arrow */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="h-4 w-4 dark:text-black text-white"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        </button>
      </form>
    </div>
  )
}

export default UserInput
