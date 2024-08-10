"use client";

import { RequiredActionFunctionToolCall } from "openai/resources/beta/threads/runs/runs";
import Chat from "@/app/components/chat";
import Sidebar from "./components/sidebar";

export default function Home() {
  const functionCallHandler = async (call: RequiredActionFunctionToolCall) => {
    // if (call?.function?.name !== "get_weather") return;
    // const args = JSON.parse(call.function.arguments);
    return "Hello world"
  };

  return (
    <div className="flex h-screen w-screen bg-[#1e1e1e] text-white">
      <Sidebar />
      <Chat functionCallHandler={functionCallHandler} />
    </div>
  );
}
