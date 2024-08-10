import React from "react";
import ThemeToggleButton from "./ui/themeToggleButton";
const Header = () => {
  return (
    <header className="flex text-text-secondary p-4 h-[60px] w-full flex-row justify-between">
      <h1 className="text-2xl font-bold mb-8">🧙‍♂️ GPT 4o</h1>
      <ThemeToggleButton />
    </header>
  );
};

export default Header;
