import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import {
  Megaphone,
  Bell,
  Plus,
  Pencil,
  Trash2,
  Save,
  X,
  CheckCircle2,
  Clock,
  EyeOff,
} from "lucide-react";
import {
  listAllAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  listAllNotices,
  createNotice,
  updateNotice,
  deleteNotice,
} from "@/lib/admin.functions";

export const Route = createFileRoute("/admin/")({
  ssr: false,
  component: AdminDashboard,
});

type Announcement = { id: string; message: string; is_published: boolean; publish_at: string };
type Notice = {
  id: string;
  title: string;
  body: string;
  is_published: boolean;
  publish_at: string;
};

function toLocalInputValue(iso: string) {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
function fromLocalInput(v: string) {
  return new Date(v).toISOString();
}

function StatusPill({ item }: { item: { is_published: boolean; publish_at: string } }) {
  const future = new Date(item.publish_at).getTime() > Date.now();
  if (!item.is_published)
    return (
      <span className="inline-flex items-center gap-1 text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
        <EyeOff className="size-3" /> Draft
      </span>
    );
  if (future)
    return (
      <span className="inline-flex items-center gap-1 text-xs bg-amber-500/15 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded-full">
        <Clock className="size-3" /> Scheduled
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 text-xs bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-full">
      <CheckCircle2 className="size-3" /> Live
    </span>
  );
}

function AdminDashboard() {
  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage the scrolling announcements marquee and the Notice Board.
        </p>
      </div>
      <AnnouncementsSection />
      <NoticesSection />
    </div>
  );
}

function AnnouncementsSection() {
  const listFn = useServerFn(listAllAnnouncements);
  const createFn = useServerFn(createAnnouncement);
  const updateFn = useServerFn(updateAnnouncement);
  const deleteFn = useServerFn(deleteAnnouncement);
  const [items, setItems] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Announcement | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      setItems((await listFn()) as Announcement[]);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
  }, []);
  const flash = (t: string) => {
    setToast(t);
    setTimeout(() => setToast(null), 2200);
  };

  return (
    <section className="rounded-3xl border border-border bg-card p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Megaphone className="size-5 text-primary" />
          <h2 className="text-xl font-bold">Announcements (marquee)</h2>
        </div>
        <button
          onClick={() => setShowNew(true)}
          className="inline-flex items-center gap-1.5 rounded-md bg-primary text-primary-foreground px-3 py-1.5 text-sm font-medium"
        >
          <Plus className="size-4" /> New
        </button>
      </div>
      {toast && <div className="text-sm text-emerald-600 mb-3">{toast}</div>}
      {loading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : items.length === 0 ? (
        <p className="text-sm text-muted-foreground">No announcements yet.</p>
      ) : (
        <ul className="divide-y divide-border">
          {items.map((a) => (
            <li key={a.id} className="py-3 flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <StatusPill item={a} />
                  <span className="text-xs text-muted-foreground">
                    {new Date(a.publish_at).toLocaleString()}
                  </span>
                </div>
                <p className="text-sm">{a.message}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => setEditing(a)} className="p-1.5 rounded-md hover:bg-muted">
                  <Pencil className="size-4" />
                </button>
                <button
                  onClick={async () => {
                    if (confirm("Delete this announcement?")) {
                      await deleteFn({ data: { id: a.id } });
                      flash("Deleted.");
                      load();
                    }
                  }}
                  className="p-1.5 rounded-md hover:bg-muted text-destructive"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      {(showNew || editing) && (
        <AnnouncementForm
          initial={editing}
          onClose={() => {
            setShowNew(false);
            setEditing(null);
          }}
          onSave={async (v) => {
            if (editing) {
              await updateFn({ data: { id: editing.id, ...v } });
              flash("Updated.");
            } else {
              await createFn({ data: v });
              flash("Created.");
            }
            setShowNew(false);
            setEditing(null);
            load();
          }}
        />
      )}
    </section>
  );
}

function AnnouncementForm({
  initial,
  onClose,
  onSave,
}: {
  initial: Announcement | null;
  onClose: () => void;
  onSave: (v: { message: string; is_published: boolean; publish_at: string }) => Promise<void>;
}) {
  const [message, setMessage] = useState(initial?.message ?? "");
  const [isPublished, setIsPublished] = useState(initial?.is_published ?? true);
  const [when, setWhen] = useState(
    initial ? toLocalInputValue(initial.publish_at) : toLocalInputValue(new Date().toISOString()),
  );
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  return (
    <div className="fixed inset-0 z-50 bg-black/50 grid place-items-center p-4" onClick={onClose}>
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={async (e) => {
          e.preventDefault();
          setBusy(true);
          setErr(null);
          try {
            await onSave({
              message: message.trim(),
              is_published: isPublished,
              publish_at: fromLocalInput(when),
            });
          } catch (x: unknown) {
            setErr(x instanceof Error ? x.message : "Save failed.");
          } finally {
            setBusy(false);
          }
        }}
        className="w-full max-w-lg bg-card rounded-2xl border border-border p-6 space-y-4"
      >
        <div className="flex items-center justify-between">
          <h3 className="font-bold">{initial ? "Edit announcement" : "New announcement"}</h3>
          <button type="button" onClick={onClose}>
            <X className="size-5" />
          </button>
        </div>
        <label className="block">
          <span className="text-xs font-semibold text-muted-foreground">Message</span>
          <textarea
            required
            maxLength={500}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
        </label>
        <label className="block">
          <span className="text-xs font-semibold text-muted-foreground">Publish at</span>
          <input
            type="datetime-local"
            required
            value={when}
            onChange={(e) => setWhen(e.target.value)}
            className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}
          />
          Publish (uncheck to save as draft)
        </label>
        {err && <p className="text-sm text-destructive">{err}</p>}
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-border px-3 py-1.5 text-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={busy}
            className="inline-flex items-center gap-1.5 rounded-md bg-primary text-primary-foreground px-3 py-1.5 text-sm font-medium disabled:opacity-50"
          >
            <Save className="size-4" /> {busy ? "Saving…" : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}

function NoticesSection() {
  const listFn = useServerFn(listAllNotices);
  const createFn = useServerFn(createNotice);
  const updateFn = useServerFn(updateNotice);
  const deleteFn = useServerFn(deleteNotice);
  const [items, setItems] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Notice | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      setItems((await listFn()) as Notice[]);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
  }, []);
  const flash = (t: string) => {
    setToast(t);
    setTimeout(() => setToast(null), 2200);
  };

  return (
    <section className="rounded-3xl border border-border bg-card p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Bell className="size-5 text-primary" />
          <h2 className="text-xl font-bold">Notices (Notice Board)</h2>
        </div>
        <button
          onClick={() => setShowNew(true)}
          className="inline-flex items-center gap-1.5 rounded-md bg-primary text-primary-foreground px-3 py-1.5 text-sm font-medium"
        >
          <Plus className="size-4" /> New
        </button>
      </div>
      {toast && <div className="text-sm text-emerald-600 mb-3">{toast}</div>}
      {loading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : items.length === 0 ? (
        <p className="text-sm text-muted-foreground">No notices yet.</p>
      ) : (
        <ul className="divide-y divide-border">
          {items.map((n) => (
            <li key={n.id} className="py-3 flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <StatusPill item={n} />
                  <span className="text-xs text-muted-foreground">
                    {new Date(n.publish_at).toLocaleString()}
                  </span>
                </div>
                <p className="font-semibold">{n.title}</p>
                <p className="text-sm text-muted-foreground line-clamp-2">{n.body}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => setEditing(n)} className="p-1.5 rounded-md hover:bg-muted">
                  <Pencil className="size-4" />
                </button>
                <button
                  onClick={async () => {
                    if (confirm("Delete this notice?")) {
                      await deleteFn({ data: { id: n.id } });
                      flash("Deleted.");
                      load();
                    }
                  }}
                  className="p-1.5 rounded-md hover:bg-muted text-destructive"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      {(showNew || editing) && (
        <NoticeForm
          initial={editing}
          onClose={() => {
            setShowNew(false);
            setEditing(null);
          }}
          onSave={async (v) => {
            if (editing) {
              await updateFn({ data: { id: editing.id, ...v } });
              flash("Updated.");
            } else {
              await createFn({ data: v });
              flash("Created.");
            }
            setShowNew(false);
            setEditing(null);
            load();
          }}
        />
      )}
    </section>
  );
}

function NoticeForm({
  initial,
  onClose,
  onSave,
}: {
  initial: Notice | null;
  onClose: () => void;
  onSave: (v: {
    title: string;
    body: string;
    is_published: boolean;
    publish_at: string;
  }) => Promise<void>;
}) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [body, setBody] = useState(initial?.body ?? "");
  const [isPublished, setIsPublished] = useState(initial?.is_published ?? true);
  const [when, setWhen] = useState(
    initial ? toLocalInputValue(initial.publish_at) : toLocalInputValue(new Date().toISOString()),
  );
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  return (
    <div className="fixed inset-0 z-50 bg-black/50 grid place-items-center p-4" onClick={onClose}>
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={async (e) => {
          e.preventDefault();
          setBusy(true);
          setErr(null);
          try {
            await onSave({
              title: title.trim(),
              body: body.trim(),
              is_published: isPublished,
              publish_at: fromLocalInput(when),
            });
          } catch (x: unknown) {
            setErr(x instanceof Error ? x.message : "Save failed.");
          } finally {
            setBusy(false);
          }
        }}
        className="w-full max-w-lg bg-card rounded-2xl border border-border p-6 space-y-4 max-h-[90vh] overflow-auto"
      >
        <div className="flex items-center justify-between">
          <h3 className="font-bold">{initial ? "Edit notice" : "New notice"}</h3>
          <button type="button" onClick={onClose}>
            <X className="size-5" />
          </button>
        </div>
        <label className="block">
          <span className="text-xs font-semibold text-muted-foreground">Title</span>
          <input
            required
            maxLength={200}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
        </label>
        <label className="block">
          <span className="text-xs font-semibold text-muted-foreground">Body</span>
          <textarea
            required
            maxLength={2000}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={5}
            className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
        </label>
        <label className="block">
          <span className="text-xs font-semibold text-muted-foreground">Publish at</span>
          <input
            type="datetime-local"
            required
            value={when}
            onChange={(e) => setWhen(e.target.value)}
            className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}
          />
          Publish (uncheck to save as draft)
        </label>
        {err && <p className="text-sm text-destructive">{err}</p>}
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-border px-3 py-1.5 text-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={busy}
            className="inline-flex items-center gap-1.5 rounded-md bg-primary text-primary-foreground px-3 py-1.5 text-sm font-medium disabled:opacity-50"
          >
            <Save className="size-4" /> {busy ? "Saving…" : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}
