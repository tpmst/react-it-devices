// ThemeSelector.tsx
import React from "react";
import { useTheme } from "./themeContext";
import { DarkMode, LightMode } from "@mui/icons-material";

const ThemeSelector: React.FC = () => {
  const { theme, toggleTheme } = useTheme(); // Access theme and toggle function

  return (
    <button
      onClick={toggleTheme}
      className="px-4 py-2 bg-[#1e293b] text-white rounded hover:text-gray-300 flex items-center"
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
