"use client";

import { createBrowserClient } from "@supabase/ssr";

import { assertSupabaseConfigured, isSupabaseConfigured } from "@/lib/supabase/env";

let browserClient: ReturnType<typeof createBrowserClient> | null = null;

export function getSupabaseBrowserClient() {
  if (!isSupabaseConfigured()) {
    return null;
  }

  if (!browserClient) {
    const { supabaseUrl, supabaseAnonKey } = assertSupabaseConfigured();
    browserClient = createBrowserClient(supabaseUrl, supabaseAnonKey);
  }

  return browserClient;
}

export async function getSupabaseAccessToken() {
  const supabase = getSupabaseBrowserClient();

  if (!supabase) {
    return null;
  }

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return session?.access_token ?? null;
}
