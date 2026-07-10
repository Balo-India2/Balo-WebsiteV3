import { useEffect, useState } from "react";
import { useLiveNotices, type PublicNotice } from "@/lib/public-content";

const SEEN_KEY = "balo.notices.seen";
const NOTIFY_KEY = "balo.notices.notify";

function readSeen(): string[] {
  try {
    const raw = localStorage.getItem(SEEN_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}
function writeSeen(ids: string[]) {
  try {
    localStorage.setItem(SEEN_KEY, JSON.stringify(ids));
  } catch {
    return;
  }
}

function maybeNotify(items: PublicNotice[]) {
  if (typeof window === "undefined") return;
  if (localStorage.getItem(NOTIFY_KEY) !== "1") return;
  if (!("Notification" in window) || Notification.permission !== "granted") return;
  const seen = new Set(readSeen());
  for (const n of items) {
    if (!seen.has(n.id)) {
      try {
        new Notification(n.title, { body: n.body });
      } catch {
        continue;
      }
    }
  }
}

/** Hook: returns the live list of published notices. */
export function useNotices() {
  return useLiveNotices();
}

/** True when there's at least one live notice the user hasn't opened yet. */
export function useUnreadNotices() {
  const notices = useLiveNotices();
  const [unread, setUnread] = useState(false);
  useEffect(() => {
    const seen = new Set(readSeen());
    setUnread(notices.some((n) => !seen.has(n.id)));
    maybeNotify(notices);
    const handler = () => {
      const s = new Set(readSeen());
      setUnread(notices.some((n) => !s.has(n.id)));
    };
    window.addEventListener("balo:notices-seen", handler);
    return () => window.removeEventListener("balo:notices-seen", handler);
  }, [notices]);
  return unread;
}

/** Called by the Notice page once the user has viewed the list. */
export function markAllNoticesSeen(ids: string[]) {
  writeSeen(ids);
  window.dispatchEvent(new Event("balo:notices-seen"));
}

/** UI hook: whether the user has opted in to browser notifications for new notices. */
export function useNotifyPreference(): [boolean, (v: boolean) => void] {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    setEnabled(localStorage.getItem(NOTIFY_KEY) === "1");
  }, []);
  const setValue = (v: boolean) => {
    localStorage.setItem(NOTIFY_KEY, v ? "1" : "0");
    setEnabled(v);
    if (v && typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "default") Notification.requestPermission();
    }
  };
  return [enabled, setValue];
}
