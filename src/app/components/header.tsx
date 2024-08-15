import React, { useState, useEffect } from "react";
import ThemeToggleButton from "./ui/themeToggleButton";
import CreateAssistantDialog from "./createAssistantDialog";
import { TitleSelect, TitleSelectItem } from "./ui/TitleSelect";

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
