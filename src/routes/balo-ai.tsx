import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Send, ImagePlus, GraduationCap, MessagesSquare, RotateCcw, Loader2, Sparkles, X,
} from "lucide-react";
import { BaloAiMark } from "@/components/BaloAiMark";
import baloAiAnimation from "@/assets/balo-ai-animation.mp4";

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

/**
 * Intro animation shown when the BALO AI page opens: the uploaded BALO AI
 * animation video plays once, then fades into the static logo.
 */
function IntroAnimation({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const timer = window.setTimeout(onDone, 2200);
    return () => window.clearTimeout(timer);
  }, [onDone]);

  return (
    <motion.div
      className="fixed inset-0 z-[60] grid place-items-center bg-background"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col items-center">
        <video
          src={baloAiAnimation}
          autoPlay
          muted
          playsInline
          preload="auto"
          onLoadedMetadata={(event) => {
            event.currentTarget.playbackRate = 1.5;
          }}
          onEnded={onDone}
          onError={onDone}
          className="w-56 max-w-[70vw] rounded-3xl sm:w-72"
        />
      </div>
    </motion.div>
  );
}

function AnimatedLogo() {
  return (
    <div className="relative grid place-items-center">
      <motion.span
        aria-hidden
        className="absolute size-24 rounded-full bg-primary/25 blur-2xl"
        animate={{ opacity: [0.35, 0.65, 0.35] }}
        transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 140, damping: 14 }}
        className="relative"
      >
        <BaloAiMark className="size-20 drop-shadow-xl sm:size-24" />
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
      transition={{ duration: 0.22, ease: "easeOut" }}
      className={`flex gap-2.5 ${isUser ? "justify-end" : "justify-start"}`}
    >
      {!isUser && (
        <BaloAiMark className="mt-1 size-7 shrink-0" />
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
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const canUpload = chat.mode === "student";
  const started = chat.messages.length > 0;
  // Play the BALO AI logo animation each time the page is opened.
  const [intro, setIntro] = useState(true);
  const [studentPledge, setStudentPledge] = useState(false);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end", behavior: "smooth" });
  }, [chat.messages, chat.busy]);

  return (
    <main className="relative flex h-[100dvh] flex-col overflow-hidden bg-background">
      <AnimatePresence>
        {intro && <IntroAnimation key="intro" onDone={() => setIntro(false)} />}
      </AnimatePresence>

      {/* Ambient background */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 size-[38rem] -translate-x-1/2 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute top-1/3 -right-32 size-[26rem] rounded-full bg-accent/15 blur-3xl" />
      </div>

      {/* Scrollable area — the composer below stays fixed */}
      <div
        ref={scrollRef}
        className="relative flex-1 overflow-y-auto overscroll-contain px-4 pt-8 sm:px-6"
      >
        <div className="mx-auto w-full max-w-4xl pb-6">
        {/* Hero */}
        <motion.header
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={`flex flex-col items-center text-center ${started ? "pb-4" : "pb-8"}`}
        >
          <AnimatedLogo />
          <h1 className="mt-5 font-display text-3xl font-bold sm:text-4xl">
            BALO <span className="text-primary">AI</span>
          </h1>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground sm:text-base">
            I am BALO AI — the official assistant of BALO English Medium School in{" "}
            <strong>Assistant</strong> mode, and in <strong>Student</strong> mode I help BALO&apos;s
            students study from the books and syllabus used at school, understand their textbooks and
            practise previous year questions across the ICSE curriculum.
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
            <div className="mt-4 w-full max-w-2xl">
              <div className="grid gap-2 sm:grid-cols-3">
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
              <label className="mt-3 flex cursor-pointer items-start gap-2 rounded-xl border border-border bg-card/80 p-3 text-left text-xs leading-relaxed text-muted-foreground">
                <input
                  type="checkbox"
                  checked={studentPledge}
                  onChange={(event) => setStudentPledge(event.target.checked)}
                  className="mt-0.5 size-4 shrink-0 accent-primary"
                />
                <span>I confirm that I will not exploit BALO AI to do my work or cheat. Being caught cheating may result in school punishment.</span>
              </label>
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
                  onClick={() => chat.mode !== "student" || studentPledge ? chat.send(s) : undefined}
                  disabled={chat.mode === "student" && !studentPledge}
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
        </div>
      </div>

      {/* Composer — fixed at the bottom, never scrolls away */}
      {!chat.modeOff && (
        <div className="relative z-20 shrink-0 border-t border-border/60 bg-background/95 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-md sm:px-6">
          <div className="mx-auto w-full max-w-4xl">
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
                   disabled={chat.busy || (chat.mode === "student" && !studentPledge) || (!chat.input.trim() && !(chat.image && canUpload))}
                  className="shrink-0 grid size-11 place-items-center rounded-2xl bg-primary text-primary-foreground transition hover:brightness-110 disabled:opacity-40"
                >
                  <Send className="size-4" />
                </button>
              </form>
            </div>
            <p className="mt-2 text-center text-[11px] text-muted-foreground">
               {chat.mode === "student" && !studentPledge ? "Accept the learning pledge to begin · " : "BALO AI answers from official school information · "}
              <Link to="/" className="underline hover:text-foreground">Back to website</Link>
            </p>
          </div>
        </div>
      )}
    </main>

  );
}
