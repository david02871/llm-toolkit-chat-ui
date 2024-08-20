import React, { useState, useEffect, useRef } from "react";
import SelectInput from "./ui/SelectInput";
import TextInput from "./ui/TextInput";
import TextArea from "./ui/TextArea";
import { createAssistant } from "../actions/createAssistant";

type PopupDialogProps = {
  onClose: () => void;
  setCurrentAssistant: (assistantId: string) => void;
};

const CreateAssistantDialog = ({
  onClose,
  setCurrentAssistant,
}: PopupDialogProps) => {
  const [models, setModels] = useState<any>([]);

  useEffect(() => {
    const fetchModels = async () => {
      const response = await fetch("/api/models");
      const fetchedModels = await response.json();
      setModels(fetchedModels);
    };
    fetchModels();
  }, []);

  const handleFormSubmit = async (formData: FormData) => {
    try {
      const assistantId = await createAssistant(formData); // Call the server action
      setCurrentAssistant(assistantId); // Update the state in the client
      window.location.reload();
    } catch (error) {
      console.error("Failed to create assistant", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-background-surface p-8 rounded-lg w-[600px] h-[80vh] shadow-lg overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4 text-text-primary">
          Create Assistant
        </h2>
        <form className="flex flex-col gap-6" action={handleFormSubmit}>
          <SelectInput
            id="model"
            label="Select Model"
            options={models.map((model: any) => ({
              id: model.id,
              label: model.name,
            }))}
          />
          <TextInput
            id="name"
            label="Name"
            placeholder="The name of the assistant"
          />
          <TextArea
            id="description"
            label="Description"
            placeholder="Enter description"
            rows={4}
          />
          <TextArea
            id="instructions"
            label="Instructions"
            placeholder="Enter instructions"
            rows={4}
          />
          <div className="flex flex-col gap-3 sm:flex-row-reverse mt-5 sm:mt-4">
            <button
              className="inline-flex items-center justify-center border border-transparent rounded-full text-sm font-medium leading-5 min-h-[38px] px-3.5 py-2 bg-black text-white dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-300"
              type="submit"
            >
              Save
            </button>
            <button
              className="inline-flex items-center justify-center border border-gray-500 rounded-full text-sm font-medium leading-5 min-h-[38px] px-3.5 py-2 bg-transparent text-gray-500 hover:bg-gray-100 dark:bg-gray-500 dark:text-white dark:hover:bg-gray-600"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAssistantDialog;
