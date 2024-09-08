"use client"

import React, { useState, useEffect } from "react"
import ThemeToggleButton from "./ui/themeToggleButton"
import { TitleSelect, TitleSelectItem } from "./ui/TitleSelect"
import { ReloadIcon } from "@radix-ui/react-icons"

type HeaderProps = {
  currentAssistant: string
  setCurrentAssistant: (assistant: string) => void
}

const Header = ({ currentAssistant, setCurrentAssistant }: HeaderProps) => {
  const [assistants, setAssistants] = useState([])

  useEffect(() => {
    const fetchAssistants = async () => {
      const response = await fetch("/api/assistants")
      let fetchedAssistants = await response.json()
      setAssistants(fetchedAssistants)
    }
    fetchAssistants()
  }, [setAssistants, setCurrentAssistant])

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
                assistants.map((assistant: any) => (
                  <TitleSelectItem key={assistant.id} value={assistant.id}>
                    {assistant.name || "Untitled Assistant"}
                  </TitleSelectItem>
                ))}
            </TitleSelect>
          )}
          <button
            onClick={() => {/* Refresh functionality will be added later */}}
            className="p-2 rounded-full bg-background-primary text-text-primary hover:bg-background-surface"
            aria-label="Refresh assistants"
          >
            <ReloadIcon className="w-5 h-5" />
          </button>
        </div>
        <ThemeToggleButton />
      </div>
    </div>
  )
}

export default Header
