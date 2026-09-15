import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { copy } from "@/lib/copy";
import type { Locale } from "@/lib/physics";

const STORAGE_KEY = "newton-durian-locale";
type LocaleContextValue = { locale: Locale; setLocale: (locale: Locale) => void; t: (typeof copy)["th"] };
const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("th");
  useEffect(() => { const saved = window.localStorage.getItem(STORAGE_KEY); if (saved === "th" || saved === "en") setLocaleState(saved); }, []);
  useEffect(() => { document.documentElement.lang = locale; document.title = copy[locale].docTitle; }, [locale]);
  const setLocale = useCallback((next: Locale) => { setLocaleState(next); window.localStorage.setItem(STORAGE_KEY, next); }, []);
  const value = useMemo(() => ({ locale, setLocale, t: copy[locale] }), [locale, setLocale]);
  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
  return ctx;
}
