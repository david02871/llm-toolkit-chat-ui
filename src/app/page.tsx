"use client";

import styles from "./page.module.css";
import { RequiredActionFunctionToolCall } from "openai/resources/beta/threads/runs/runs";
import Chat from "@/app/components/chat";

export default function Home() {
  const functionCallHandler = async (call: RequiredActionFunctionToolCall) => {
    // if (call?.function?.name !== "get_weather") return;
    // const args = JSON.parse(call.function.arguments);
    return "Hello world"
  };

  return (
    <div className="flex h-screen bg-[#1e1e1e] text-white">
      {/* Sidebar */}
      <div className="w-1/4 bg-[#2b2b2b] p-4 flex flex-col justify-between">
        <div>
          <div className="mb-4">
            <h1 className="text-xl font-bold">ChatGPT 4.0</h1>
          </div>
          <div className="space-y-4">
            <button className="w-full text-left hover:bg-[#3b3b3b] p-2 rounded">
              ChatGPT
            </button>
            <button className="w-full text-left hover:bg-[#3b3b3b] p-2 rounded">
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
        <button className="w-full text-left hover:bg-[#3b3b3b] p-2 rounded">
          Add Team workspace
        </button>
      </div>
      <Chat functionCallHandler={functionCallHandler} />
    </div>
  );
}
