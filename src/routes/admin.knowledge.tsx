import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { BookOpen, FileText, Plus, Trash2, Save, X } from "lucide-react";
import {
  listKnowledge, createKnowledge, updateKnowledge, deleteKnowledge,
  listDocuments, createDocument, updateDocument, deleteDocument,
} from "@/lib/admin-ai.functions";

export const Route = createFileRoute("/admin/knowledge")({
  ssr: false,
  component: KnowledgePage,
});

type Mode = "assistant" | "student";
type Know = { id: string; mode: Mode; category: string; title: string; content: string; is_active: boolean };
type Doc = { id: string; mode: Mode; title: string; doc_type: string; extracted_text: string | null; is_active: boolean };

const emptyKnow = { mode: "assistant" as Mode, category: "general", title: "", content: "", is_active: true };
const emptyDoc = { mode: "assistant" as Mode, title: "", doc_type: "document", extracted_text: "", is_active: true };

function KnowledgePage() {
  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold">Knowledge base</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Everything BALO AI is allowed to say. The Assistant answers only from Assistant entries; the
          Student tutor only from Student entries and syllabi.
        </p>
      </div>
      <KnowledgeSection />
      <DocumentsSection />
    </div>
  );
}

function ModeBadge({ mode }: { mode: Mode }) {
  return (
    <span className={`text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full ${
      mode === "assistant" ? "bg-primary/10 text-primary" : "bg-accent/20 text-accent-foreground"
    }`}>{mode}</span>
  );
}

function KnowledgeSection() {
  const listFn = useServerFn(listKnowledge);
  const createFn = useServerFn(createKnowledge);
  const updateFn = useServerFn(updateKnowledge);
  const delFn = useServerFn(deleteKnowledge);
  const [items, setItems] = useState<Know[]>([]);
  const [editing, setEditing] = useState<Know | null>(null);
  const [creating, setCreating] = useState<typeof emptyKnow | null>(null);
  const [filter, setFilter] = useState<"all" | Mode>("all");

  const load = async () => setItems((await listFn()) as Know[]);
  useEffect(() => { load(); }, []);

  const shown = items.filter((i) => filter === "all" || i.mode === filter);

  const form = (
    value: any,
    setValue: (v: any) => void,
    onSave: () => void,
    onCancel: () => void,
  ) => (
    <div className="rounded-2xl border border-primary/40 bg-card p-5 space-y-3">
      <div className="grid gap-3 sm:grid-cols-3">
        <select value={value.mode} onChange={(e) => setValue({ ...value, mode: e.target.value })}
          className="rounded-md border border-input bg-background px-3 py-2 text-sm">
          <option value="assistant">Assistant (about BALO)</option>
          <option value="student">Student (academic)</option>
        </select>
        <input value={value.category} onChange={(e) => setValue({ ...value, category: e.target.value })}
          placeholder="Category" className="rounded-md border border-input bg-background px-3 py-2 text-sm" />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={value.is_active}
            onChange={(e) => setValue({ ...value, is_active: e.target.checked })} /> Active
        </label>
      </div>
      <input value={value.title} onChange={(e) => setValue({ ...value, title: e.target.value })}
        placeholder="Title" className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
      <textarea value={value.content} onChange={(e) => setValue({ ...value, content: e.target.value })}
        rows={6} placeholder="Verified information BALO AI may use…"
        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
      <div className="flex gap-2">
        <button onClick={onSave} className="inline-flex items-center gap-1.5 rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm">
          <Save className="size-4" /> Save
        </button>
        <button onClick={onCancel} className="inline-flex items-center gap-1.5 rounded-md border border-border px-4 py-2 text-sm">
          <X className="size-4" /> Cancel
        </button>
      </div>
    </div>
  );

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-lg font-bold">
          <BookOpen className="size-4 text-primary" /> Entries ({shown.length})
        </h2>
        <div className="flex items-center gap-2">
          <select value={filter} onChange={(e) => setFilter(e.target.value as any)}
            className="rounded-md border border-input bg-background px-3 py-1.5 text-sm">
            <option value="all">All modes</option>
            <option value="assistant">Assistant</option>
            <option value="student">Student</option>
          </select>
          <button onClick={() => setCreating({ ...emptyKnow })}
            className="inline-flex items-center gap-1.5 rounded-md bg-primary text-primary-foreground px-3 py-1.5 text-sm">
            <Plus className="size-4" /> New entry
          </button>
        </div>
      </div>

      {creating && form(creating, setCreating, async () => {
        await createFn({ data: creating });
        setCreating(null); load();
      }, () => setCreating(null))}

      <div className="space-y-3">
        {shown.map((it) =>
          editing?.id === it.id ? (
            <div key={it.id}>
              {form(editing, setEditing, async () => {
                const { id, mode, category, title, content, is_active } = editing!;
                await updateFn({ data: { id, mode, category, title, content, is_active } });
                setEditing(null); load();
              }, () => setEditing(null))}
            </div>
          ) : (
            <div key={it.id} className="rounded-2xl border border-border bg-card p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <ModeBadge mode={it.mode} />
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{it.category}</span>
                    {!it.is_active && <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">Hidden</span>}
                  </div>
                  <div className="mt-1 font-semibold text-sm">{it.title}</div>
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{it.content}</p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <button onClick={() => setEditing(it)} className="text-xs text-muted-foreground hover:text-foreground">Edit</button>
                  <button onClick={async () => { await delFn({ data: { id: it.id } }); load(); }}
                    className="text-muted-foreground hover:text-destructive"><Trash2 className="size-4" /></button>
                </div>
              </div>
            </div>
          ),
        )}
      </div>
    </section>
  );
}

function DocumentsSection() {
  const listFn = useServerFn(listDocuments);
  const createFn = useServerFn(createDocument);
  const updateFn = useServerFn(updateDocument);
  const delFn = useServerFn(deleteDocument);
  const [items, setItems] = useState<Doc[]>([]);
  const [draft, setDraft] = useState<any | null>(null);
  const [busy, setBusy] = useState(false);

  const load = async () => setItems((await listFn()) as Doc[]);
  useEffect(() => { load(); }, []);

  const readFile = async (file: File | undefined) => {
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) return alert("Please use a text file under 2 MB.");
    const text = await file.text();
    setDraft((p: any) => ({ ...(p ?? emptyDoc), title: p?.title || file.name.replace(/\.[^.]+$/, ""), extracted_text: text.slice(0, 200000) }));
  };

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-lg font-bold">
          <FileText className="size-4 text-primary" /> Documents &amp; syllabi ({items.length})
        </h2>
        <button onClick={() => setDraft({ ...emptyDoc })}
          className="inline-flex items-center gap-1.5 rounded-md bg-primary text-primary-foreground px-3 py-1.5 text-sm">
          <Plus className="size-4" /> Add document
        </button>
      </div>
      <p className="text-xs text-muted-foreground">
        Paste the text of a syllabus, rule book or circular, or upload a .txt / .md / .csv file. BALO AI reads
        this text directly, so anything you add here becomes an official source.
      </p>

      {draft && (
        <div className="rounded-2xl border border-primary/40 bg-card p-5 space-y-3">
          <div className="grid gap-3 sm:grid-cols-3">
            <select value={draft.mode} onChange={(e) => setDraft({ ...draft, mode: e.target.value })}
              className="rounded-md border border-input bg-background px-3 py-2 text-sm">
              <option value="assistant">Assistant (about BALO)</option>
              <option value="student">Student (syllabus / academic)</option>
            </select>
            <input value={draft.doc_type} onChange={(e) => setDraft({ ...draft, doc_type: e.target.value })}
              placeholder="Type e.g. syllabus" className="rounded-md border border-input bg-background px-3 py-2 text-sm" />
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={draft.is_active}
                onChange={(e) => setDraft({ ...draft, is_active: e.target.checked })} /> Active
            </label>
          </div>
          <input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })}
            placeholder="Document title" className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
          <input type="file" accept=".txt,.md,.csv,text/plain"
            onChange={(e) => readFile(e.target.files?.[0] ?? undefined)}
            className="block text-xs" />
          <textarea value={draft.extracted_text} onChange={(e) => setDraft({ ...draft, extracted_text: e.target.value })}
            rows={8} placeholder="Document text…"
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs font-mono" />
          <div className="flex gap-2">
            <button
              disabled={busy}
              onClick={async () => {
                setBusy(true);
                try {
                  const payload = {
                    mode: draft.mode, title: draft.title, doc_type: draft.doc_type,
                    extracted_text: draft.extracted_text, is_active: draft.is_active,
                  };
                  if (draft.id) await updateFn({ data: { ...payload, id: draft.id } });
                  else await createFn({ data: payload });
                  setDraft(null); load();
                } finally { setBusy(false); }
              }}
              className="inline-flex items-center gap-1.5 rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm disabled:opacity-50">
              <Save className="size-4" /> {busy ? "Saving…" : "Save"}
            </button>
            <button onClick={() => setDraft(null)} className="inline-flex items-center gap-1.5 rounded-md border border-border px-4 py-2 text-sm">
              <X className="size-4" /> Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {items.map((d) => (
          <div key={d.id} className="rounded-2xl border border-border bg-card p-4 flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <ModeBadge mode={d.mode} />
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{d.doc_type}</span>
                {!d.is_active && <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">Hidden</span>}
              </div>
              <div className="mt-1 font-semibold text-sm">{d.title}</div>
              <p className="mt-1 text-xs text-muted-foreground">
                {(d.extracted_text ?? "").length.toLocaleString()} characters of text
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <button onClick={() => setDraft({ ...d, extracted_text: d.extracted_text ?? "" })}
                className="text-xs text-muted-foreground hover:text-foreground">Edit</button>
              <button onClick={async () => { await delFn({ data: { id: d.id } }); load(); }}
                className="text-muted-foreground hover:text-destructive"><Trash2 className="size-4" /></button>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-sm text-muted-foreground">No documents yet.</p>}
      </div>
    </section>
  );
}
