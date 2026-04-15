const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ?? "";
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ?? "";

export function getSupabaseEnv() {
  return {
    supabaseUrl,
    supabaseAnonKey,
    supabaseServiceRoleKey,
  };
}

export function isSupabaseConfigured() {
  return Boolean(supabaseUrl && supabaseAnonKey);
}

export function hasSupabaseServiceRole() {
  return Boolean(supabaseUrl && supabaseServiceRoleKey);
}

export function assertSupabaseConfigured() {
  if (!isSupabaseConfigured()) {
    throw new Error(
      "Faltan NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_ANON_KEY para activar Supabase.",
    );
  }

  return { supabaseUrl, supabaseAnonKey };
}

export function assertSupabaseAdminConfigured() {
  if (!hasSupabaseServiceRole()) {
    throw new Error(
      "Falta SUPABASE_SERVICE_ROLE_KEY para ejecutar operaciones administrativas en Supabase.",
    );
  }

  return { supabaseUrl, supabaseServiceRoleKey };
}
