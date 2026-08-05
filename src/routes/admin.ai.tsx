import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { Sparkles, Save, Plus, Trash2, GraduationCap, MessagesSquare, Activity } from "lucide-react";
import {
  listAiSettings, updateAiSettings, listCurriculum, upsertCurriculumItem,
  deleteCurriculumItem, listAiActivity,
} from "@/lib/admin-ai.functions";

export const Route = createFileRoute("/admin/ai")({
  ssr: false,
  component: AdminAiPage,
});

type Setting = { id: string; mode: "assistant" | "student"; is_enabled: boolean; system_instructions: string };
type Item = { id: string; name: string; sort_order: number; is_active: boolean };

function AdminAiPage() {
  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold">BALO AI</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Switch each AI mode on or off, tune how it behaves, and manage the classes and subjects the
          Student tutor supports.
        </p>
      </div>
      <ModesSection />
      <CurriculumSection />
      <ActivitySection />
    </div>
  );
}

function ModesSection() {
  const listFn = useServerFn(listAiSettings);
  const saveFn = useServerFn(updateAiSettings);
  const [rows, setRows] = useState<Setting[]>([]);
  const [draft, setDraft] = useState<Record<string, Setting>>({});
  const [busy, setBusy] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    listFn().then((r) => {
      const list = r as Setting[];
      setRows(list);
      setDraft(Object.fromEntries(list.map((s) => [s.id, s])));
    });
  }, [listFn]);

  const save = async (s: Setting) => {
    setBusy(s.id);
    try {
      await saveFn({ data: { id: s.id, is_enabled: s.is_enabled, system_instructions: s.system_instructions } });
      setToast(`${s.mode === "assistant" ? "Assistant" : "Student"} mode saved`);
      setTimeout(() => setToast(null), 2500);
    } finally {
      setBusy(null);
    }
  };

  return (
    <section className="space-y-4">
      <h2 className="flex items-center gap-2 text-lg font-bold">
        <Sparkles className="size-4 text-primary" /> Modes &amp; behaviour
      </h2>
      {toast && <div className="rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 px-3 py-2 text-sm">{toast}</div>}
      <div className="grid gap-5 lg:grid-cols-2">
        {rows.map((row) => {
          const d = draft[row.id] ?? row;
          return (
            <div key={row.id} className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-semibold">
                  {row.mode === "assistant" ? <MessagesSquare className="size-4" /> : <GraduationCap className="size-4" />}
                  {row.mode === "assistant" ? "Assistant mode" : "Student mode"}
                </div>
                <label className="flex items-center gap-2 text-xs">
                  <input
                    type="checkbox"
                    checked={d.is_enabled}
                    onChange={(e) => setDraft((p) => ({ ...p, [row.id]: { ...d, is_enabled: e.target.checked } }))}
                  />
                  {d.is_enabled ? "Enabled" : "Disabled"}
                </label>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {row.mode === "assistant"
                  ? "Answers about BALO using the knowledge base, notices and announcements."
                  : "ICSE tutor for students, using syllabi and academic documents."}
              </p>
              <textarea
                value={d.system_instructions}
                onChange={(e) => setDraft((p) => ({ ...p, [row.id]: { ...d, system_instructions: e.target.value } }))}
                rows={10}
                className="mt-3 w-full rounded-xl border border-input bg-background px-3 py-2 text-xs font-mono leading-relaxed"
              />
              <button
                onClick={() => save(d)}
                disabled={busy === row.id}
                className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium disabled:opacity-50"
              >
                <Save className="size-4" /> {busy === row.id ? "Saving…" : "Save"}
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function CurriculumSection() {
  const listFn = useServerFn(listCurriculum);
  const upsertFn = useServerFn(upsertCurriculumItem);
  const delFn = useServerFn(deleteCurriculumItem);
  const [classes, setClasses] = useState<Item[]>([]);
  const [subjects, setSubjects] = useState<Item[]>([]);
  const [newClass, setNewClass] = useState("");
  const [newSubject, setNewSubject] = useState("");

  const load = async () => {
    const r = await listFn();
    setClasses(r.classes as Item[]);
    setSubjects(r.subjects as Item[]);
  };
  useEffect(() => { load(); }, []);

  const add = async (kind: "class" | "subject", name: string, count: number) => {
    if (!name.trim()) return;
    await upsertFn({ data: { kind, name: name.trim(), sort_order: count + 1, is_active: true } });
    kind === "class" ? setNewClass("") : setNewSubject("");
    load();
  };

  const toggle = async (kind: "class" | "subject", item: Item) => {
    await upsertFn({ data: { kind, id: item.id, name: item.name, sort_order: item.sort_order, is_active: !item.is_active } });
    load();
  };

  const remove = async (kind: "class" | "subject", id: string) => {
    await delFn({ data: { kind, id } });
    load();
  };

  const panel = (
    kind: "class" | "subject",
    label: string,
    items: Item[],
    value: string,
    setValue: (v: string) => void,
  ) => (
    <div className="rounded-2xl border border-border bg-card p-5">
      <h3 className="font-semibold">{label}</h3>
      <div className="mt-3 flex gap-2">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={kind === "class" ? "e.g. Class 9" : "e.g. Mathematics"}
          className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm"
        />
        <button
          onClick={() => add(kind, value, items.length)}
          className="inline-flex items-center gap-1 rounded-md bg-primary text-primary-foreground px-3 py-2 text-sm"
        >
          <Plus className="size-4" /> Add
        </button>
      </div>
      <ul className="mt-3 divide-y divide-border">
        {items.map((it) => (
          <li key={it.id} className="flex items-center justify-between py-2 text-sm">
            <span className={it.is_active ? "" : "text-muted-foreground line-through"}>{it.name}</span>
            <span className="flex items-center gap-2">
              <button onClick={() => toggle(kind, it)} className="text-xs text-muted-foreground hover:text-foreground">
                {it.is_active ? "Hide" : "Show"}
              </button>
              <button onClick={() => remove(kind, it.id)} className="text-muted-foreground hover:text-destructive">
                <Trash2 className="size-4" />
              </button>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <section className="space-y-4">
      <h2 className="flex items-center gap-2 text-lg font-bold">
        <GraduationCap className="size-4 text-primary" /> Supported curriculum
      </h2>
      <div className="grid gap-5 lg:grid-cols-2">
        {panel("class", "Classes", classes, newClass, setNewClass)}
        {panel("subject", "Subjects", subjects, newSubject, setNewSubject)}
      </div>
    </section>
  );
}

function ActivitySection() {
  const listFn = useServerFn(listAiActivity);
  const [data, setData] = useState<{ conversations: any[]; recent: any[] } | null>(null);
  useEffect(() => { listFn().then(setData); }, [listFn]);

  const assistant = data?.conversations.filter((c) => c.mode === "assistant").length ?? 0;
  const student = data?.conversations.filter((c) => c.mode === "student").length ?? 0;

  return (
    <section className="space-y-4">
      <h2 className="flex items-center gap-2 text-lg font-bold">
        <Activity className="size-4 text-primary" /> Usage
      </h2>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="text-3xl font-bold">{assistant}</div>
          <div className="text-xs text-muted-foreground mt-1">Assistant conversations</div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="text-3xl font-bold">{student}</div>
          <div className="text-xs text-muted-foreground mt-1">Student conversations</div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="text-3xl font-bold">{data?.recent.length ?? 0}</div>
          <div className="text-xs text-muted-foreground mt-1">Recent messages shown</div>
        </div>
      </div>
      <div className="rounded-2xl border border-border bg-card divide-y divide-border max-h-96 overflow-y-auto">
        {(data?.recent ?? []).map((m) => (
          <div key={m.id} className="px-4 py-3">
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-muted-foreground">
              <span>{m.mode}</span>·<span>{m.role}</span>·
              <span>{new Date(m.created_at).toLocaleString()}</span>
            </div>
            <p className="mt-1 text-xs line-clamp-3">{m.content}</p>
          </div>
        ))}
        {data && data.recent.length === 0 && (
          <p className="px-4 py-6 text-sm text-muted-foreground">No AI conversations yet.</p>
        )}
      </div>
    </section>
  );
}
