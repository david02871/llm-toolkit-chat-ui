"use client"

import React from "react"

const Sidebar = () => {
  return (
    <div className="h-full w-[260px] p-4 flex flex-col justify-between bg-background-sidebar">
      <div>
        <div className="mb-4">
          <h1 className="text-xl font-bold">ChatGPT 4.0</h1>
        </div>
        <div className="space-y-4">
          <button className="w-full text-left hover:bg-background-sidebar-surface p-2 rounded">
            ChatGPT
          </button>
          <button className="w-full text-left hover:bg-background-sidebar-surface p-2 rounded">
            ChatGPT
          </button>
        </div>
        <div className="mt-8">
          <h2 className="text-lg font-semibold">Section</h2>
          <div className="space-y-2 mt-2">
            <p>1</p>
            <p>2</p>
          </div>
        </div>
      </div>
      <button className="w-full text-left hover:bg-background-sidebar-surface p-2 rounded">
        Add Team workspace
      </button>
    </div>
  )
}

export default Sidebar
