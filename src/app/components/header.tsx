import React, { useState, useEffect } from "react";
import ThemeToggleButton from "./ui/themeToggleButton";
import CreateAssistantDialog from "./createAssistantDialog";

type HeaderProps = {
  currentAssistant: string;
  setCurrentAssistant: (assistant: string) => void;
};

const Header = ({ currentAssistant, setCurrentAssistant }: HeaderProps) => {
  const [assistants, setAssistants] = useState([]);
  const [assistantDialogOpen, setAssistantDialogOpen] = useState(false);

  useEffect(() => {
    const fetchAssistants = async () => {
      const response = await fetch("/api/assistants");
      let fetchedAssistants = await response.json();
      setAssistants(fetchedAssistants);
    };
    fetchAssistants();
  }, [setAssistants, setCurrentAssistant]);

  const handleAssistantChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === "new") {
      setAssistantDialogOpen(true);
      return;
    }

    setCurrentAssistant(e.target.value);
  };

  return (
    <div>
      <header className="flex text-text-secondary p-4 h-[60px] w-full flex-row justify-between">
        <div className="flex flex-row items-center justify-start">
          <h1 className="text-2xl font-bold">🧙‍♂️</h1>
          <select
            id="model-select"
            className="text-2xl font-bold p-3 h-[60px] rounded-md bg-background-primary cursor-pointer focus:outline-none focus:ring-0"
            value={currentAssistant}
            onChange={handleAssistantChange}
          >
            <option value="" disabled>
              Select Assistant
            </option>
            <option value="new" className="text-sm font-normal bg-red-400">
              ➕ Create New Assistant
            </option>
            {assistants.length > 0 &&
              assistants.map((assistant: any, index) => (
                <option
                  key={index}
                  value={assistant.id}
                  className="text-sm font-normal"
                >
                  {assistant.name}
                </option>
              ))}
          </select>
        </div>
        <ThemeToggleButton />
      </header>
      {assistantDialogOpen && (
        <CreateAssistantDialog onClose={() => setAssistantDialogOpen(false)} />
      )}
    </div>
  );
};

export default Header;
