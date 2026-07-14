"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { I18nextProvider } from "react-i18next";
import i18n from "../i18n";

const AppContext = createContext();

export function AppProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("apex-theme") || "dark";
    }
    return "dark";
  });

  const [language, setLanguage] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("apex-language") || "en";
    }
    return "en";
  });

  // Sync theme to document element and persist to localStorage
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("apex-theme", theme);
  }, [theme]);

  const updateLanguage = (newLang) => {
    const nextLang = typeof newLang === "function" ? newLang(language) : newLang;
    if (i18n.language !== nextLang) {
      i18n.changeLanguage(nextLang);
    }
    localStorage.setItem("apex-language", nextLang);
    setLanguage(nextLang);
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const toggleLanguage = () => {
    updateLanguage(language === "en" ? "hi" : "en");
  };

  // Custom t function to allow component-level fallbacks (e.g., t("KEY") || "Fallback")
  const t = (key) => {
    if (!i18n.exists(key)) {
      return undefined;
    }
    return i18n.t(key);
  };

  return (
    <I18nextProvider i18n={i18n}>
      <AppContext.Provider
        value={{
          theme,
          toggleTheme,
          language,
          setLanguage: updateLanguage,
          toggleLanguage,
          t,
        }}
      >
        {children}
      </AppContext.Provider>
    </I18nextProvider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
