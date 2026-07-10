import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type PublicAnnouncement = {
  id: string;
  message: string;
  publish_at: string;
};

export type PublicNotice = {
  id: string;
  title: string;
  body: string;
  publish_at: string;
};

// Shared singleton subscription per table to avoid duplicate channel .on() calls
// when multiple components mount the hook.
let annCache: PublicAnnouncement[] = [];
const annSubs = new Set<(v: PublicAnnouncement[]) => void>();
let annChannel: ReturnType<typeof supabase.channel> | null = null;
let annLoaded = false;

async function loadAnn() {
  const nowIso = new Date().toISOString();
  const { data } = await supabase
    .from("announcements")
    .select("id, message, publish_at")
    .eq("is_published", true)
    .lte("publish_at", nowIso)
    .order("publish_at", { ascending: false })
    .limit(20);
  annCache = (data as PublicAnnouncement[] | null) ?? [];
  annSubs.forEach((cb) => cb(annCache));
}

function ensureAnnChannel() {
  if (annChannel) return;
  annChannel = supabase
    .channel(`ann-${Math.random().toString(36).slice(2)}`)
    .on("postgres_changes", { event: "*", schema: "public", table: "announcements" }, () =>
      loadAnn(),
    )
    .subscribe();
}

export function useLiveAnnouncements() {
  const [items, setItems] = useState<PublicAnnouncement[]>(annCache);
  useEffect(() => {
    annSubs.add(setItems);
    ensureAnnChannel();
    if (!annLoaded) {
      annLoaded = true;
      loadAnn();
    } else setItems(annCache);
    return () => {
      annSubs.delete(setItems);
    };
  }, []);
  return items;
}

let notCache: PublicNotice[] = [];
const notSubs = new Set<(v: PublicNotice[]) => void>();
let notChannel: ReturnType<typeof supabase.channel> | null = null;
let notLoaded = false;

async function loadNot() {
  const nowIso = new Date().toISOString();
  const { data } = await supabase
    .from("notices")
    .select("id, title, body, publish_at")
    .eq("is_published", true)
    .lte("publish_at", nowIso)
    .order("publish_at", { ascending: false })
    .limit(50);
  notCache = (data as PublicNotice[] | null) ?? [];
  notSubs.forEach((cb) => cb(notCache));
}

function ensureNotChannel() {
  if (notChannel) return;
  notChannel = supabase
    .channel(`not-${Math.random().toString(36).slice(2)}`)
    .on("postgres_changes", { event: "*", schema: "public", table: "notices" }, () => loadNot())
    .subscribe();
}

export function useLiveNotices() {
  const [items, setItems] = useState<PublicNotice[]>(notCache);
  useEffect(() => {
    notSubs.add(setItems);
    ensureNotChannel();
    if (!notLoaded) {
      notLoaded = true;
      loadNot();
    } else setItems(notCache);
    return () => {
      notSubs.delete(setItems);
    };
  }, []);
  return items;
}
