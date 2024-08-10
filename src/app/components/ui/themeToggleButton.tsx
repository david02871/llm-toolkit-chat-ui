"use client";

// Based on https://codepen.io/RefractedColor/pen/mdWZRPQ

import React, { useEffect, useState } from "react";
import styles from "./themeToggleButton.module.css";

const ThemeToggleButton = () => {
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");

    if (storedTheme) {
      document.documentElement.classList.add(storedTheme);
      setTheme(storedTheme as "light" | "dark");
    } else {
      // If no theme is stored, default to dark mode
      document.documentElement.classList.add("dark");
      setTheme("dark");
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
    <div>
      <div
        className={`${styles.tdnn} ${
          theme === "light" ? styles.day : ""
        } flex-none`}
        onClick={toggleTheme}
      >
        <div
          className={`${styles.moon} ${theme === "light" ? styles.sun : ""}`}
        ></div>
      </div>
    </div>
  );
};

export default ThemeToggleButton;
