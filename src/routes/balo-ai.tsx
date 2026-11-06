import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Send,
  ImagePlus,
  GraduationCap,
  MessagesSquare,
  RotateCcw,
  ArrowLeft,
  X,
} from "lucide-react";
import { BaloAiMark } from "@/components/BaloAiMark";
import { BaloAiWordmark } from "@/components/BaloAiWordmark";
import { useBaloChat, STARTERS, type Mode, type Msg } from "@/lib/use-balo-chat";

export const Route = createFileRoute("/balo-ai")({
  head: () => ({
    meta: [
      { title: "BALO AI — Ask anything about Balo English Medium School" },
      {
        name: "description",
        content:
          "BALO AI answers your questions about Balo English Medium School and tutors students through the ICSE syllabus, class by class.",
      },
      { property: "og:title", content: "BALO AI — School assistant & ICSE study tutor" },
      {
        property: "og:description",
        content:
          "Chat with BALO AI: school information, notices and events in Assistant mode, and step-by-step ICSE tutoring in Student mode.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BaloAiPage,
});

const ease = [0.22, 1, 0.36, 1] as const;

function ModeSwitch({
  mode,
  onChange,
}: {
  mode: Mode;
  onChange: (mode: Mode) => void;
}) {
  return (
    <div className="relative inline-flex rounded-full bg-muted/70 p-0.5">
      {(["assistant", "student"] as Mode[]).map((item) => {
        const active = mode === item;
        return (
          <button
            key={item}
            type="button"
            onClick={() => onChange(item)}
            className={`relative inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors sm:px-3.5 sm:text-sm ${
              active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {active && (
              <motion.span
                layoutId="balo-ai-mode"
                className="absolute inset-0 rounded-full bg-card shadow-sm ring-1 ring-border/70"
                transition={{ type: "spring", stiffness: 420, damping: 34 }}
              />
            )}
            <span className="relative inline-flex items-center gap-1.5">
              {item === "assistant" ? (
                <MessagesSquare className="hidden size-3.5 sm:block" />
              ) : (
                <GraduationCap className="hidden size-3.5 sm:block" />
              )}
              {item === "assistant" ? "Assistant" : "Student"}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function HeroLogo() {
  return (
    <div className="relative grid place-items-center">
      <motion.span
        aria-hidden
        className="absolute size-40 rounded-full bg-secondary/30 blur-3xl sm:size-48"
        animate={{ opacity: [0.35, 0.7, 0.35], scale: [0.94, 1.06, 0.94] }}
        transition={{ duration: 4.8, repeat: 3, ease: "easeInOut" }}
      />
      <motion.div
        initial={{ scale: 0.78, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 130, damping: 16 }}
        className="relative"
      >
        <BaloAiMark className="size-24 sm:size-28" alt="BALO AI" />
      </motion.div>
    </div>
  );
}

function Bubble({ m }: { m: Msg }) {
  const isUser = m.role === "user";
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease }}
      className={`flex gap-2.5 ${isUser ? "justify-end" : "justify-start"}`}
    >
      {!isUser && <BaloAiMark className="mt-0.5 size-7 shrink-0" />}
      <div
        className={`max-w-[min(42rem,86%)] px-4 py-3 text-sm leading-relaxed sm:text-[0.95rem] ${
          isUser
            ? "rounded-3xl rounded-br-md bg-primary text-primary-foreground"
            : "rounded-3xl rounded-bl-md bg-card/90 ring-1 ring-border/70"
        }`}
      >
        {m.image && (
          <img
            src={m.image}
            alt="Uploaded question"
            className="mb-2 max-h-52 w-auto rounded-2xl"
          />
        )}
        {isUser ? (
          <p className="whitespace-pre-wrap">{m.content}</p>
        ) : (
          <div className="balo-md">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.content}</ReactMarkdown>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function Typing() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-end gap-2.5"
    >
      <BaloAiMark className="size-7 shrink-0" />
      <div className="flex items-center gap-1 rounded-3xl rounded-bl-md bg-card/90 px-3.5 py-3 ring-1 ring-border/70">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="size-1.5 rounded-full bg-foreground/45"
            animate={{ y: [0, -3.5, 0], opacity: [0.35, 1, 0.35] }}
            transition={{ duration: 0.85, repeat: Infinity, delay: i * 0.14, ease: "easeInOut" }}
          />
        ))}
      </div>
    </motion.div>
  );
}

function BaloAiPage() {
  const chat = useBaloChat(true);
  const endRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const canUpload = chat.mode === "student";
  const started = chat.messages.length > 0;
  const [studentPledge, setStudentPledge] = useState(false);
  const blocked = chat.mode === "student" && !studentPledge;

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end", behavior: "smooth" });
  }, [chat.messages, chat.busy]);

  useEffect(() => {
    const el = chat.inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 128)}px`;
  }, [chat.input, chat.inputRef]);

  const selectClass =
    "h-9 rounded-full border-0 bg-muted/70 px-3 text-xs font-medium outline-none ring-1 ring-transparent transition focus:bg-card focus:ring-primary/30 sm:text-sm";

  return (
    <main className="relative flex h-[100dvh] flex-col overflow-hidden bg-background">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 left-1/2 size-[28rem] -translate-x-1/2 rounded-full bg-secondary/15 blur-3xl" />
        <div className="absolute bottom-0 right-0 size-[22rem] rounded-full bg-primary/10 blur-3xl" />
      </div>

      <header className="relative z-10 shrink-0 border-b border-border/40 bg-background/75 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-3xl items-center gap-2 px-3 sm:h-16 sm:px-5">
          <Link
            to="/"
            aria-label="Back to website"
            className="grid size-9 shrink-0 place-items-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
          </Link>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <BaloAiMark className="size-8 shrink-0 sm:size-9" alt="" />
              <BaloAiWordmark size="sm" />
            </div>
            <div className="mt-0.5 hidden pl-10 text-[10px] uppercase tracking-[0.18em] text-muted-foreground sm:block sm:pl-11">
              Balo English Medium School
            </div>
          </div>

          <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
            <ModeSwitch mode={chat.mode} onChange={chat.setMode} />
            {started && (
              <button
                type="button"
                onClick={chat.reset}
                title="New conversation"
                aria-label="New conversation"
                className="grid size-9 place-items-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground"
              >
                <RotateCcw className="size-3.5" />
              </button>
            )}
          </div>
        </div>
      </header>

      <AnimatePresence initial={false}>
        {chat.mode === "student" && (
          <motion.div
            key="student-bar"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease }}
            className="relative z-10 shrink-0 overflow-hidden border-b border-border/40 bg-background/60"
          >
            <div className="mx-auto flex max-w-3xl flex-wrap items-center gap-2 px-3 py-2.5 sm:px-5">
              <select
                value={chat.classLabel}
                onChange={(e) => chat.setClassLabel(e.target.value)}
                className={selectClass}
              >
                <option value="">Class</option>
                {chat.classes.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <select
                value={chat.subject}
                onChange={(e) => chat.setSubject(e.target.value)}
                className={selectClass}
              >
                <option value="">Subject</option>
                {chat.subjects.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <input
                value={chat.topic}
                onChange={(e) => chat.setTopic(e.target.value)}
                placeholder="Topic (optional)"
                className={`${selectClass} min-w-[8rem] flex-1`}
              />
              <label className="flex min-w-[12rem] flex-1 cursor-pointer items-start gap-2 text-[11px] leading-snug text-muted-foreground sm:text-xs">
                <input
                  type="checkbox"
                  checked={studentPledge}
                  onChange={(event) => setStudentPledge(event.target.checked)}
                  className="mt-0.5 size-3.5 shrink-0 accent-primary"
                />
                <span>I will not use BALO AI to cheat.</span>
              </label>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="balo-ai-scroll relative min-h-0 flex-1 overflow-y-auto overscroll-contain">
        <AnimatePresence mode="wait">
          {chat.modeOff ? (
            <motion.div
              key="off"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid min-h-full place-items-center px-4"
            >
              <p className="max-w-sm text-center text-sm text-muted-foreground">
                This mode is currently switched off by the school. Please try again later.
              </p>
            </motion.div>
          ) : !started ? (
            <motion.div
              key={`empty-${chat.mode}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4, ease }}
              className="mx-auto flex min-h-full w-full max-w-2xl flex-col items-center justify-center px-4 py-10"
            >
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08, duration: 0.4, ease }}
                className="flex items-center gap-4 sm:gap-5"
              >
                <HeroLogo />
                <h1>
                  <BaloAiWordmark size="lg" />
                </h1>
              </motion.div>
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4, ease }}
                className="mt-2 max-w-md text-center text-sm text-muted-foreground sm:text-[15px]"
              >
                {chat.mode === "assistant"
                  ? "Ask anything about BALO English Medium School."
                  : "Study help from the books and syllabus used at school."}
              </motion.p>

              <div className="mt-8 flex w-full flex-wrap justify-center gap-2">
                {STARTERS[chat.mode].map((s, i) => (
                  <motion.button
                    key={s}
                    type="button"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.28 + i * 0.05, duration: 0.35, ease }}
                    onClick={() => {
                      if (!blocked) chat.send(s);
                    }}
                    disabled={blocked}
                    className="rounded-full bg-card/80 px-4 py-2 text-left text-[13px] text-foreground/80 ring-1 ring-border/70 transition hover:bg-card hover:text-foreground hover:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {s}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={`chat-${chat.mode}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="mx-auto w-full max-w-2xl space-y-4 px-4 py-6 sm:px-5"
            >
              {chat.messages.map((m, i) =>
                m.role === "assistant" && !m.content ? null : <Bubble key={i} m={m} />,
              )}
              {chat.busy && <Typing />}
              {chat.error && (
                <div className="rounded-2xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  {chat.error}
                </div>
              )}
              <div ref={endRef} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {!chat.modeOff && (
        <div className="relative z-10 shrink-0 bg-gradient-to-t from-background via-background to-transparent px-3 pb-[max(0.85rem,env(safe-area-inset-bottom))] pt-2 sm:px-5">
          <div className="mx-auto w-full max-w-2xl">
            {canUpload && chat.image && (
              <div className="mb-2 flex items-center gap-2 px-1">
                <img
                  src={chat.image}
                  alt="Attached"
                  className="size-12 rounded-xl object-cover ring-1 ring-border"
                />
                <button
                  type="button"
                  onClick={() => chat.setImage(null)}
                  className="inline-flex items-center gap-1 text-xs text-muted-foreground transition hover:text-destructive"
                >
                  <X className="size-3.5" /> Remove
                </button>
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!blocked) chat.send(chat.input);
              }}
              className="flex items-end gap-1.5 rounded-[1.6rem] bg-card/90 p-1.5 shadow-soft ring-1 ring-border/70 backdrop-blur-md"
            >
              {canUpload && (
                <>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      chat.pickImage(e.target.files?.[0]);
                      e.currentTarget.value = "";
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    title="Upload a photo of your question"
                    className="grid size-10 shrink-0 place-items-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground"
                  >
                    <ImagePlus className="size-4" />
                  </button>
                </>
              )}
              <textarea
                ref={chat.inputRef}
                rows={1}
                value={chat.input}
                onChange={(e) => chat.setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    if (!blocked) chat.send(chat.input);
                  }
                }}
                placeholder={
                  blocked
                    ? "Accept the learning pledge to begin…"
                    : chat.mode === "assistant"
                      ? "Ask anything about BALO…"
                      : "Ask a study question…"
                }
                className="max-h-32 min-h-10 flex-1 resize-none bg-transparent px-3 py-2.5 text-sm outline-none placeholder:text-muted-foreground/70"
              />
              <button
                type="submit"
                disabled={
                  chat.busy || blocked || (!chat.input.trim() && !(chat.image && canUpload))
                }
                aria-label="Send"
                className="grid size-10 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground transition hover:scale-105 hover:brightness-110 disabled:scale-100 disabled:opacity-35"
              >
                <Send className="size-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
