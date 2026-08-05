import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "en" | "hi" | "bn";

const dict: Record<string, Record<Lang, string>> = {
  "nav.home":           { en: "Home", hi: "होम", bn: "হোম" },
  "nav.about":          { en: "About", hi: "हमारे बारे में", bn: "আমাদের সম্পর্কে" },
  "nav.facilities":     { en: "Facilities", hi: "सुविधाएँ", bn: "সুবিধাসমূহ" },
  "nav.subjects":       { en: "Academics", hi: "शिक्षा", bn: "শিক্ষাক্রম" },
  "nav.extracurricular":{ en: "Extracurricular", hi: "सहायक गतिविधियाँ", bn: "অতিরিক্ত কার্যক্রম" },
  "nav.events":         { en: "Notice & Events", hi: "सूचना और इवेंट्स", bn: "নোটিশ ও ইভেন্টস" },
  "nav.gallery":        { en: "Gallery", hi: "गैलरी", bn: "গ্যালারি" },
  "nav.life":           { en: "Life at BALO", hi: "बालो में जीवन", bn: "বালোতে জীবন" },
  "nav.staff":          { en: "Staff", hi: "स्टाफ", bn: "স্টাফ" },
  "nav.tour":           { en: "Virtual Tour", hi: "वर्चुअल टूर", bn: "ভার্চুয়াল টুর" },
  "nav.rules":          { en: "Rules", hi: "नियम", bn: "নিয়মাবলী" },
  "nav.calendar":       { en: "Calendar", hi: "कैलेंडर", bn: "ক্যালেন্ডার" },
  "nav.welfare":        { en: "Welfare Society", hi: "वेलफेयर सोसाइटी", bn: "ওয়েলফেয়ার সোসাইটি" },
  "nav.enquiry":        { en: "Enquiry", hi: "पूछताछ", bn: "অনুসন্ধান" },
  "nav.developers":     { en: "Developers", hi: "डेवलपर्स", bn: "ডেভেলপারস" },
  "nav.contact":        { en: "Contact", hi: "संपर्क", bn: "যোগাযোগ" },
  "nav.donate":         { en: "Donate", hi: "दान करें", bn: "দান করুন" },
  "lang.label":         { en: "Language", hi: "भाषा", bn: "ভাষা" },
};

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (key: string) => string };

const LangCtx = createContext<Ctx>({ lang: "en", setLang: () => {}, t: (k) => k });

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("balo.lang") as Lang | null;
      if (saved === "en" || saved === "hi" || saved === "bn") setLangState(saved);
    } catch {}
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    try { localStorage.setItem("balo.lang", l); } catch {}
  };

  const t = (key: string) => dict[key]?.[lang] ?? dict[key]?.en ?? key;

  return <LangCtx.Provider value={{ lang, setLang, t }}>{children}</LangCtx.Provider>;
}

export const useLang = () => useContext(LangCtx);
