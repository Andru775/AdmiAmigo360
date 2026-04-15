import { createClient } from "@supabase/supabase-js";

import { assertSupabaseAdminConfigured } from "@/lib/supabase/env";

export function getSupabaseAdminClient() {
  const { supabaseUrl, supabaseServiceRoleKey } = assertSupabaseAdminConfigured();

  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
