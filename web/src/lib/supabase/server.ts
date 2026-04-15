import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

import { assertSupabaseConfigured, isSupabaseConfigured } from "@/lib/supabase/env";

export async function getSupabaseServerClient() {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const cookieStore = await cookies();
  const { supabaseUrl, supabaseAnonKey } = assertSupabaseConfigured();

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Ignore set failures in places where the response is immutable.
        }
      },
    },
  });
}
