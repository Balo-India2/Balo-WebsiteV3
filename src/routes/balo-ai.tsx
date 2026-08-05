import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Send, ImagePlus, GraduationCap, MessagesSquare, RotateCcw, Loader2, Sparkles, X,
} from "lucide-react";
import baloAiLogo from "@/assets/balo-ai-logo.png";
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

function AnimatedLogo() {
  return (
    <div className="relative grid place-items-center">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          aria-hidden
          className="absolute rounded-full border border-primary/25"
          style={{ width: 96 + i * 46, height: 96 + i * 46 }}
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: [0.05, 0.45, 0.05], scale: [0.9, 1.06, 0.9] }}
          transition={{ duration: 4.2, repeat: Infinity, delay: i * 0.55, ease: "easeInOut" }}
        />
      ))}
      <motion.span
        aria-hidden
        className="absolute size-28 rounded-full bg-primary/25 blur-2xl"
        animate={{ opacity: [0.35, 0.7, 0.35], scale: [0.95, 1.1, 0.95] }}
        transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.img
        src={baloAiLogo}
        alt="BALO AI logo"
        width={112}
        height={112}
        initial={{ scale: 0.4, opacity: 0, rotate: -25 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 130, damping: 12 }}
        className="relative size-24 sm:size-28 drop-shadow-xl"
      />
    </div>
  );
}

function Bubble({ m }: { m: Msg }) {
  const isUser = m.role === "user";
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className={`flex gap-2.5 ${isUser ? "justify-end" : "justify-start"}`}
    >
      {!isUser && (
        <img src={baloAiLogo} alt="" width={28} height={28} className="mt-1 size-7 shrink-0" />
      )}
      <div
        className={`max-w-[min(46rem,86%)] rounded-3xl px-4 py-3 text-sm sm:text-[0.95rem] leading-relaxed shadow-sm ${
          isUser
            ? "bg-primary text-primary-foreground rounded-br-md"
            : "bg-card border border-border rounded-bl-md"
        }`}
      >
        {m.image && (
          <img
            src={m.image}
            alt="Uploaded question"
            className="mb-2 max-h-56 w-auto rounded-xl border border-border/40"
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

function BaloAiPage() {
  const chat = useBaloChat(true);
  const endRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const canUpload = chat.mode === "student";
  const started = chat.messages.length > 0;

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end", behavior: "smooth" });
  }, [chat.messages, chat.busy]);

  useEffect(() => {
    chat.inputRef.current?.focus();
  }, [chat.mode, chat.inputRef]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      {/* Ambient background */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 size-[38rem] -translate-x-1/2 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute top-1/3 -right-32 size-[26rem] rounded-full bg-accent/15 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-screen w-full max-w-4xl flex-col px-4 pt-10 pb-6 sm:px-6">
        {/* Hero */}
        <motion.header
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={`flex flex-col items-center text-center ${started ? "pb-4" : "pb-8"}`}
        >
          <AnimatedLogo />
          <h1 className="mt-6 font-display text-3xl font-bold sm:text-4xl">
            BALO <span className="text-primary">AI</span>
          </h1>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground sm:text-base">
            Your school companion — official BALO answers in <strong>Assistant</strong> mode, and a
            patient ICSE tutor in <strong>Student</strong> mode.
          </p>

          {/* Mode switch */}
          <div className="mt-6 inline-flex rounded-full border border-border bg-card/80 p-1 shadow-sm backdrop-blur">
            {(["assistant", "student"] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => chat.setMode(m)}
                className={`relative inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
                  chat.mode === m
                    ? "bg-primary text-primary-foreground shadow"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {m === "assistant" ? <MessagesSquare className="size-4" /> : <GraduationCap className="size-4" />}
                {m === "assistant" ? "Assistant" : "Student"}
              </button>
            ))}
          </div>

          {chat.mode === "student" && (
            <div className="mt-4 grid w-full max-w-2xl gap-2 sm:grid-cols-3">
              <select
                value={chat.classLabel}
                onChange={(e) => chat.setClassLabel(e.target.value)}
                className="rounded-xl border border-input bg-card px-3 py-2 text-sm"
              >
                <option value="">Choose class…</option>
                {chat.classes.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <select
                value={chat.subject}
                onChange={(e) => chat.setSubject(e.target.value)}
                className="rounded-xl border border-input bg-card px-3 py-2 text-sm"
              >
                <option value="">Choose subject…</option>
                {chat.subjects.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <input
                value={chat.topic}
                onChange={(e) => chat.setTopic(e.target.value)}
                placeholder="Topic / chapter (optional)"
                className="rounded-xl border border-input bg-card px-3 py-2 text-sm"
              />
            </div>
          )}
        </motion.header>

        {/* Conversation */}
        <section className="flex-1">
          {chat.modeOff ? (
            <div className="rounded-3xl border border-border bg-card/70 p-10 text-center text-sm text-muted-foreground">
              This mode is currently switched off by the school. Please try again later.
            </div>
          ) : !started ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {STARTERS[chat.mode].map((s, i) => (
                <motion.button
                  key={s}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.06, duration: 0.35 }}
                  onClick={() => chat.send(s)}
                  className="group flex items-start gap-3 rounded-2xl border border-border bg-card/80 p-4 text-left text-sm backdrop-blur transition hover:border-primary/50 hover:shadow-md"
                >
                  <Sparkles className="mt-0.5 size-4 shrink-0 text-primary transition group-hover:scale-110" />
                  <span>{s}</span>
                </motion.button>
              ))}
            </div>
          ) : (
            <div className="space-y-4 pb-4">
              <AnimatePresence initial={false}>
                {chat.messages.map((m, i) => <Bubble key={i} m={m} />)}
              </AnimatePresence>
              {chat.busy && (
                <div className="flex items-center gap-2 pl-10 text-xs text-muted-foreground">
                  <Loader2 className="size-3.5 animate-spin" /> BALO AI is thinking…
                </div>
              )}
              <div ref={endRef} />
            </div>
          )}

          {chat.error && (
            <div className="mt-4 rounded-2xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {chat.error}
            </div>
          )}
        </section>

        {/* Composer */}
        {!chat.modeOff && (
          <div className="sticky bottom-4 mt-6">
            <div className="rounded-3xl border border-border bg-card/90 p-3 shadow-xl backdrop-blur">
              {canUpload && chat.image && (
                <div className="mb-2 flex items-center gap-2 px-1">
                  <img src={chat.image} alt="Attached" className="size-14 rounded-xl border border-border object-cover" />
                  <button
                    onClick={() => chat.setImage(null)}
                    className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive"
                  >
                    <X className="size-3.5" /> Remove
                  </button>
                </div>
              )}
              <form
                onSubmit={(e) => { e.preventDefault(); chat.send(chat.input); }}
                className="flex items-end gap-2"
              >
                {canUpload && (
                  <>
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => { chat.pickImage(e.target.files?.[0]); e.currentTarget.value = ""; }}
                    />
                    <button
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      title="Upload a photo of your question"
                      className="shrink-0 rounded-2xl border border-border p-2.5 hover:bg-muted"
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
                    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); chat.send(chat.input); }
                  }}
                  placeholder={chat.mode === "assistant" ? "Ask anything about BALO…" : "Ask a study question…"}
                  className="max-h-32 flex-1 resize-none bg-transparent px-2 py-2.5 text-sm outline-none"
                />
                <button
                  type="button"
                  onClick={chat.reset}
                  title="Clear this conversation"
                  className="shrink-0 rounded-2xl border border-border p-2.5 hover:bg-muted"
                >
                  <RotateCcw className="size-4" />
                </button>
                <button
                  type="submit"
                  disabled={chat.busy || (!chat.input.trim() && !(chat.image && canUpload))}
                  className="shrink-0 grid size-11 place-items-center rounded-2xl bg-primary text-primary-foreground transition hover:brightness-110 disabled:opacity-40"
                >
                  <Send className="size-4" />
                </button>
              </form>
            </div>
            <p className="mt-2 text-center text-[11px] text-muted-foreground">
              BALO AI answers from official school information ·{" "}
              <Link to="/" className="underline hover:text-foreground">Back to website</Link>
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
