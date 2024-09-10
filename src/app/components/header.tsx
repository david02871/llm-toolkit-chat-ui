"use client"

import React, { useState, useEffect } from "react"
import ThemeToggleButton from "./ui/themeToggleButton"
import { TitleSelect, TitleSelectItem } from "./ui/TitleSelect"
import { ReloadIcon } from "@radix-ui/react-icons"

type HeaderProps = {
  currentAssistant: string
  setCurrentAssistant: (assistant: string) => void
}

type Assistant = {
  id: string
  name: string
}

const Header = ({ currentAssistant, setCurrentAssistant }: HeaderProps) => {
  const [assistants, setAssistants] = useState<Assistant[]>([])
  const [isRefreshing, setIsRefreshing] = useState(false)

  const fetchAssistants = async () => {
    const response = await fetch("/api/assistants")
    let fetchedAssistants = await response.json()
    setAssistants(fetchedAssistants)
  }

  useEffect(() => {
    fetchAssistants()
  }, [])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      await fetch("/api/assistants", { method: "POST" })
      await fetchAssistants()
    } catch (error) {
      console.error("Error refreshing assistants:", error)
    } finally {
      setIsRefreshing(false)
    }
  }

  return (
    <div>
      <div className="flex text-text-secondary p-4 h-[60px] w-full flex-row justify-between">
        <div className="flex flex-row items-center justify-start">
          <h1 className="text-2xl font-bold">🧙‍♂️</h1>
          {assistants && (
            <TitleSelect
              placeholder="Select assistant"
              value={currentAssistant}
              onValueChange={setCurrentAssistant}
            >
              {assistants.length > 0 &&
                assistants.map((assistant: Assistant) => (
                  <TitleSelectItem key={assistant.id} value={assistant.id}>
                    {assistant.name || "Untitled Assistant"}
                  </TitleSelectItem>
                ))}
            </TitleSelect>
          )}
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className={`p-2 rounded-full bg-background-primary text-text-secondary hover:bg-background-surface ${
              isRefreshing ? "opacity-50 cursor-not-allowed" : ""
            }`}
            aria-label="Refresh assistants"
          >
            <ReloadIcon
              className={`w-5 h-5 ${isRefreshing ? "animate-spin" : ""}`}
            />
          </button>
        </div>
        <ThemeToggleButton />
      </div>
    </div>
  )
}

export default Header
