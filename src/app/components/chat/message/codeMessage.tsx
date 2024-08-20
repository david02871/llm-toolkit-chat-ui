"use client"

import React from "react"

const CodeMessage = ({ text }: { text: string }) => {
  return (
    <div className="rounded-3xl px-5 py-2.5 overflow-scroll prose">
      {text.split("\n").map((line, index) => (
        <div key={index}>
          <span>{`${index + 1}. `}</span>
          {line}
        </div>
      ))}
    </div>
  )
}

export default CodeMessage
