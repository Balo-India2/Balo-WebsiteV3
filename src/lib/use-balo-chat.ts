import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type Mode = "assistant" | "student";
export type Msg = { role: "user" | "assistant"; content: string; image?: string | null };

export const STARTERS: Record<Mode, string[]> = {
  assistant: [
    "Who built this website?",
    "Tell me about BALO's history and founder",
    "What facilities does the school have?",
    "Any notices for parents right now?",
  ],
  student: [
    "Explain photosynthesis simply",
    "Solve: 2x + 5 = 17, step by step",
    "Help me revise the water cycle",
    "Help me understand calculus",
  ],
};

type ClassRow = { id: string; name: string };
type SubjectRow = { name: string; class_id: string | null };

export function useBaloChat(_active = true) {
  const [mode, setMode] = useState<Mode>("assistant");
  const [input, setInput] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [msgs, setMsgs] = useState<Record<Mode, Msg[]>>({ assistant: [], student: [] });
  const [enabled, setEnabled] = useState<Record<Mode, boolean>>({ assistant: true, student: true });
  const [classRows, setClassRows] = useState<ClassRow[]>([]);
  const [subjectRows, setSubjectRows] = useState<SubjectRow[]>([]);
  const [classLabel, setClassLabel] = useState("");
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const current = msgs[mode];

  // Forget any key from older builds that restored chats after reopen.
  useEffect(() => {
    try {
      localStorage.removeItem("balo.ai.session");
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    let alive = true;
    (async () => {
      const [{ data: s }, { data: c }, { data: sub }] = await Promise.all([
        supabase.from("ai_settings").select("mode, is_enabled"),
        supabase.from("ai_classes").select("id, name").eq("is_active", true).order("sort_order"),
        supabase.from("ai_subjects").select("name, class_id").eq("is_active", true).order("sort_order"),
      ]);
      if (!alive) return;
      if (s) {
        const next = { assistant: true, student: true };
        for (const row of s) next[row.mode as Mode] = row.is_enabled;
        setEnabled(next);
      }
      setClassRows((c ?? []) as ClassRow[]);
      setSubjectRows((sub ?? []) as SubjectRow[]);
    })();
    return () => { alive = false; };
  }, []);

  const selectedClassId = classRows.find((c) => c.name === classLabel)?.id ?? null;
  const subjects = useMemo(() => {
    const rows = selectedClassId
      ? subjectRows.filter((r) => r.class_id === selectedClassId)
      : subjectRows;
    return Array.from(new Set(rows.map((r) => r.name)));
  }, [selectedClassId, subjectRows]);

  useEffect(() => {
    if (subject && !subjects.includes(subject)) setSubject("");
  }, [subjects, subject]);

  const pickImage = useCallback((file: File | undefined | null) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) return setError("Please choose an image file.");
    if (file.size > 5 * 1024 * 1024) return setError("Image must be under 5 MB.");
    const reader = new FileReader();
    reader.onload = () => setImage(String(reader.result));
    reader.readAsDataURL(file);
  }, []);

  const send = useCallback(
    async (text: string) => {
      const question = text.trim();
      const sentImage = mode === "student" ? image : null;
      if ((!question && !sentImage) || busy) return;
      setError(null);
      setBusy(true);

      const prior = msgs[mode]
        .filter((m) => m.content && (m.role === "user" || m.role === "assistant"))
        .slice(-10)
        .map((m) => ({ role: m.role, content: m.content }));

      const outgoing: Msg = { role: "user", content: question || "(image)", image: sentImage };
      setMsgs((p) => ({ ...p, [mode]: [...p[mode], outgoing, { role: "assistant", content: "" }] }));
      setInput("");
      setImage(null);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mode,
            message: question,
            history: prior,
            imageDataUrl: sentImage,
            classLabel: mode === "student" ? classLabel : null,
            subject: mode === "student" ? subject : null,
            topic: mode === "student" ? topic : null,
          }),
        });

        const raw = await res.text();
        let payload: {
          answer?: string;
          error?: string;
          engine?: string;
        } = {};
        try {
          payload = raw ? JSON.parse(raw) : {};
        } catch {
          payload = {};
        }

        if (!res.ok) {
          throw new Error(payload.error || "BALO AI could not answer that. Please try again.");
        }

        const answer = (payload.answer ?? "").trim();
        if (!answer) {
          throw new Error(payload.error || "BALO AI could not answer that. Please try again.");
        }

        setMsgs((p) => {
          const list = [...p[mode]];
          list[list.length - 1] = { role: "assistant", content: answer };
          return { ...p, [mode]: list };
        });
      } catch (e: any) {
        setError(e?.message ?? "Something went wrong.");
        setMsgs((p) => {
          const list = [...p[mode]];
          if (list.length && list[list.length - 1]!.role === "assistant" && !list[list.length - 1]!.content) list.pop();
          return { ...p, [mode]: list };
        });
      } finally {
        setBusy(false);
      }
    },
    [busy, classLabel, image, msgs, mode, subject, topic],
  );

  const reset = useCallback(() => {
    setMsgs((p) => ({ ...p, [mode]: [] }));
    setError(null);
  }, [mode]);

  return {
    mode, setMode,
    input, setInput,
    image, setImage, pickImage,
    busy, error,
    messages: current,
    enabled,
    modeOff: !enabled[mode],
    classes: classRows.map((c) => c.name),
    subjects,
    classLabel, setClassLabel,
    subject, setSubject,
    topic, setTopic,
    send, reset,
    inputRef,
  };
}
