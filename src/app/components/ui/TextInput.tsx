"use client"

import React from "react"

interface TextInputProps {
  id: string
  label: string
  placeholder?: string
}

const TextInput: React.FC<TextInputProps> = ({ id, label, placeholder }) => (
  <div className="flex flex-col">
    <label htmlFor={id} className="text-text-primary font-semibold mb-1">
      {label}
    </label>
    <input
      type="text"
      id={id}
      name={id}
      className="p-3 border rounded-md bg-background-surface border-border-medium"
      placeholder={placeholder}
    />
  </div>
)

export default TextInput
