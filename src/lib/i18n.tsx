import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "en" | "hi" | "bn";

const dict: Record<string, Record<Lang, string>> = {
  "nav.home": { en: "Home", hi: "होम", bn: "হোম" },
  "nav.about": { en: "About", hi: "हमारे बारे में", bn: "আমাদের সম্পর্কে" },
  "nav.facilities": { en: "Facilities", hi: "सुविधाएँ", bn: "সুবিধাসমূহ" },
  "nav.subjects": { en: "Academics", hi: "शिक्षा", bn: "শিক্ষাক্রম" },
  "nav.extracurricular": {
    en: "Extracurricular",
    hi: "सहायक गतिविधियाँ",
    bn: "অতিরিক্ত কার্যক্রম",
  },
  "nav.events": { en: "Notice & Events", hi: "सूचना और इवेंट्स", bn: "নোটিশ ও ইভেন্টস" },
  "nav.developers": { en: "Developers", hi: "डेवलपर्स", bn: "ডেভেলপারস" },
  "nav.contact": { en: "Contact", hi: "संपर्क", bn: "যোগাযোগ" },
  "nav.donate": { en: "Donate", hi: "दान करें", bn: "দান করুন" },
  "lang.label": { en: "Language", hi: "भाषा", bn: "ভাষা" },
};

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (key: string) => string };

const LangCtx = createContext<Ctx>({ lang: "en", setLang: () => {}, t: (k) => k });

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("balo.lang") as Lang | null;
      if (saved === "en" || saved === "hi" || saved === "bn") setLangState(saved);
    } catch {
      setLangState("en");
    }
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem("balo.lang", l);
    } catch {
      return;
    }
  };

  const t = (key: string) => dict[key]?.[lang] ?? dict[key]?.en ?? key;

  return <LangCtx.Provider value={{ lang, setLang, t }}>{children}</LangCtx.Provider>;
}

export const useLang = () => useContext(LangCtx);
