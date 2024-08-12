"use client";

import React, { useState, useEffect, useRef } from "react";

type PopupDialogProps = {
  onClose: () => void;
};

const CreateAssistantDialog = ({ onClose }: PopupDialogProps) => {
  const [models, setModels] = useState([]);

  useEffect(() => {
    const fetchModels = async () => {
      const response = await fetch("/api/models");
      const fetchedModels = await response.json();
      setModels(fetchedModels);
    };
    fetchModels();
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-background-surface p-8 rounded-lg w-[600px] h-[80vh] shadow-lg overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4 text-text-primary">
          Form Dialog
        </h2>
        <p className="text-sm text-gray-400 mb-6">
          Please fill out the form below and click Submit when you&apos;re done.
        </p>
        <form className="flex flex-col gap-6">
          <div className="flex flex-col">
            <label
              htmlFor="model-select"
              className="text-text-primary font-semibold mb-1"
            >
              Select Model
            </label>
            <select
              id="model-select"
              className="p-3 border rounded-md bg-background-surface border-border-medium focus:border-blue-600 focus:ring-blue-600"
            >
              {models.map((model: any, index) => (
                <option key={index} value={model.id}>
                  {model.id}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col">
            <label
              htmlFor="name"
              className="text-text-primary font-semibold mb-1"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              className="p-3 border rounded-md bg-background-surface border-border-medium focus:border-blue-600 focus:ring-blue-600"
              placeholder="Enter your name"
            />
          </div>
          <div className="flex flex-col">
            <label
              htmlFor="description"
              className="text-text-primary font-semibold mb-1"
            >
              Description
            </label>
            <textarea
              id="description"
              className="p-3 border rounded-md bg-background-surface border-border-medium focus:border-blue-600 focus:ring-blue-600"
              placeholder="Enter description"
              rows={4}
            ></textarea>
          </div>
          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              className="bg-gray-500 text-white p-3 rounded-full hover:bg-gray-700 transition-colors"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-800 transition-colors"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAssistantDialog;
