import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { translations, interpolate } from "../i18n/translations";

const STORAGE_KEY = "bake-ease-lang";
const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && translations[saved]) return saved;
    return "en";
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, language);
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = useCallback((code) => {
    if (translations[code]) setLanguageState(code);
  }, []);

  const t = useCallback(
    (key, vars) => {
      const str =
        translations[language]?.[key] ??
        translations.en[key] ??
        key;
      return interpolate(str, vars);
    },
    [language],
  );

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return ctx;
}
