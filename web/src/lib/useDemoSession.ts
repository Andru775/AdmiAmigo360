"use client";

import { useSyncExternalStore } from "react";

import { resolveSupabaseSession } from "@/lib/auth";
import { readSession, type SessionUser } from "@/lib/demoAuth";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";
import { isSupabaseConfigured } from "@/lib/supabase/env";

type SessionSnapshot = {
  session: SessionUser | null;
  isLoading: boolean;
};

let snapshot: SessionSnapshot = {
  session: null,
  isLoading: isSupabaseConfigured(),
};

const listeners = new Set<() => void>();
let initialized = false;
let syncPromise: Promise<void> | null = null;

function emit() {
  listeners.forEach((listener) => listener());
}

function updateSnapshot(nextSnapshot: SessionSnapshot) {
  snapshot = nextSnapshot;
  emit();
}

async function syncSession() {
  if (syncPromise) {
    return syncPromise;
  }

  syncPromise = (async () => {
    const nextSession = isSupabaseConfigured() ? await resolveSupabaseSession() : readSession();
    updateSnapshot({
      session: nextSession,
      isLoading: false,
    });
  })().finally(() => {
    syncPromise = null;
  });

  return syncPromise;
}

function ensureInitialized() {
  if (initialized || typeof window === "undefined") {
    return;
  }

  initialized = true;
  const localSession = readSession();

  updateSnapshot({
    session: localSession,
    isLoading: isSupabaseConfigured(),
  });

  if (!isSupabaseConfigured()) {
    updateSnapshot({
      session: localSession,
      isLoading: false,
    });
    return;
  }

  const supabase = getSupabaseBrowserClient();

  if (!supabase) {
    updateSnapshot({
      session: localSession,
      isLoading: false,
    });
    return;
  }

  void syncSession();

  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange(() => {
    void syncSession();
  });

  const unsubscribe = () => {
    subscription.unsubscribe();
  };

  window.addEventListener("beforeunload", unsubscribe, { once: true });
}

function subscribe(listener: () => void) {
  ensureInitialized();
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot() {
  ensureInitialized();
  return snapshot;
}

export function useSessionState() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

export function useDemoSession() {
  return useSessionState().session;
}
