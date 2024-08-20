"use client"

import Chat from "@/app/components/chat"
import Sidebar from "./components/sidebar"

export default function Home() {
  return (
    <div className="flex h-screen w-screen">
      <Sidebar />
      <Chat />
    </div>
  )
}
