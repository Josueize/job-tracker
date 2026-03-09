import { createContext, useContext, useState } from "react";

export const ThemeContext = createContext({
  dark: true,
  toggleTheme: () => {},
  bg: "#0a0a0f",
  surface: "#111118",
  surface2: "#0d0d14",
  border: "#1e1e2e",
  text: "#e2e8f0",
  textMuted: "#555570",
  inputBg: "#0d0d14",
});

export function ThemeProvider({ children }) {
  const [dark, setDark] = useState(true);
  const toggleTheme = () => setDark(!dark);

  const theme = {
    dark,
    toggleTheme,
    bg: dark ? "#0a0a0f" : "#f0f2f8",
    surface: dark ? "#111118" : "#ffffff",
    surface2: dark ? "#0d0d14" : "#f8f9fc",
    border: dark ? "#1e1e2e" : "#e2e8f0",
    text: dark ? "#e2e8f0" : "#1a1a2e",
    textMuted: dark ? "#555570" : "#8892a4",
    inputBg: dark ? "#0d0d14" : "#ffffff",
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}