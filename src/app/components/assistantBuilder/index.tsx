"use client";

import React, { useState, useEffect, useRef } from "react";
import Header from "../header";

const AssistantBuilder = () => {
  // Fetch a list of available models
  const [models, setModels] = useState([]);

  useEffect(() => {
    const fetchModels = async () => {
      const res = await fetch("/api/models");
      const data = await res.json();
      setModels(data);
    };
    fetchModels();
  }, []);

  return (
    <div className="h-full max-w-full flex-1 flex-col overflow-hidden flex">
      <Header />
      <main className="flex-1 overflow-y-auto">
        <div className="w-[680px] p-2 mx-auto flex flex-col gap-4 w-[680px] p-2 mx-auto">
          <form className="flex flex-col gap-4">
            <label htmlFor="model">Select a model:</label>
            <select name="model" id="model">
              {models.map((model: any, index) => (
                <option key={index} value={model.id}>
                  {model.name}
                </option>
              ))}
            </select>
            <button type="submit">Create Assistant</button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default AssistantBuilder;
