import { createClient } from "@supabase/supabase-js";

import { assertSupabaseConfigured } from "@/lib/supabase/env";

function createAuthClient() {
  const { supabaseUrl, supabaseAnonKey } = assertSupabaseConfigured();

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export async function sendPasswordResetEmail(email: string, redirectTo: string) {
  const client = createAuthClient();

  return client.auth.resetPasswordForEmail(email, {
    redirectTo,
  });
}
