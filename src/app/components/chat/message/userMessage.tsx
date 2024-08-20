"use client"

import React from "react"

const UserMessage = ({ text }: { text: string }) => {
  return (
    <div className="flex justify-end">
      <div className="max-w-[70%] rounded-3xl bg-background-surface px-5 py-2.5 overflow-hidden">
        {text}
      </div>
    </div>
  )
}

export default UserMessage
