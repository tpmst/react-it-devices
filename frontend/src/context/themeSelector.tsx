// ThemeSelector.tsx
import React from "react";
import { useTheme } from "./themeContext";
import { DarkMode, LightMode } from "@mui/icons-material";

const ThemeSelector: React.FC = () => {
  const { theme, toggleTheme } = useTheme(); // Access theme and toggle function

  return (
    <button
      onClick={toggleTheme}
      className="px-4 py-2 bg-transparent text-[#444444] rounded flex items-center hover:bg-[#dfddcd] dark:hover:bg-[#2a3a53] dark:text-white"
    >
      {theme === "light" ? (
        <DarkMode className="" />
      ) : (
        <LightMode className="" />
      )}
    </button>
  );
};

export default ThemeSelector;
