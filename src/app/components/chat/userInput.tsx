"use client";

import React, { useState, useEffect, useRef } from "react";

type UserInputProps = {
  handleSubmit: (e: any) => void;
  isDisabled: boolean;
  userInput: string;
  setUserInput: (value: string) => void;
};

const UserInput = ({
  handleSubmit,
  isDisabled,
  userInput,
  setUserInput,
}: UserInputProps) => {
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
    <div className="w-full pb-6 bg-background-primary flex justify-center">
      <div className="flex items-center bg-background-surface p-2 rounded-3xl max-w-[700px] w-full">
        <button className="bg-transparent text-text-primary p-2">
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
          className="flex-grow p-2 focus:outline-none resize-none bg-background-surface"
          rows={1}
          style={{
            minHeight: "40px",
            maxHeight: "200px",
            overflowY: "auto",
          }}
        />
        <button
          className={`ml-3 bg-text-secondary p-3 rounded-full ${isDisabled ? "" : "hover:bg-text-primary"}`}
          onClick={handleSubmit}
          disabled={isDisabled}
          style={{ cursor: isDisabled ? "not-allowed" : "pointer", opacity: isDisabled ? 0.3 : 1 }}
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
      </div>
    </div>
  );
};

export default UserInput;
