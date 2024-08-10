import React, { useState, useEffect, useRef } from "react";

const Header = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');

    if (storedTheme) {
      document.documentElement.classList.add(storedTheme);
      setTheme(storedTheme as 'light' | 'dark');
    } else {
      // If no theme is stored, default to dark mode
      document.documentElement.classList.add('dark');
      setTheme('dark');
    }
  }, []);

  const toggleTheme = () => {
    if (theme === "light") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setTheme("dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setTheme("light");
    }
  };

  return (
    <header className="text-text-secondary p-4 h-[60px] w-full">
      <h1 className="text-2xl font-bold mb-8">🧙‍♂️ GPT 4o</h1>
      {/* Add a button or any other element to toggle the theme */}
      <button
        onClick={toggleTheme}
        style={{ position: "absolute", top: 20, right: 20 }}
      >
        {theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
      </button>
    </header>
  );
};

export default Header;
