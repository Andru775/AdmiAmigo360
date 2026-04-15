"use client";

import type { DemoRole } from "@/data/appData";
import { clearAppDataCache } from "@/lib/app-data";
import {
  authenticateDemoUser,
  clearSession,
  getDefaultAccount,
  storeSession,
  type SessionUser,
} from "@/lib/demoAuth";
import { getSupabaseAccessToken, getSupabaseBrowserClient } from "@/lib/supabase/browser";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export type ResidentOAuthProvider = "google" | "azure";

async function buildSupabaseSession() {
  const token = await getSupabaseAccessToken();
  const headers = new Headers();

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch("/api/session", {
    method: "GET",
    headers,
    credentials: "include",
  });

  if (!response.ok) {
    return null;
  }

  const result = (await response.json()) as { session?: SessionUser };
  const session = result.session ?? null;

  if (!session) {
    return null;
  }

  storeSession(session);
  return session;
}

export async function resolveSupabaseSession() {
  if (!getSupabaseBrowserClient()) {
    return null;
  }

  const session = await buildSupabaseSession();

  if (!session) {
    clearSession();
    return null;
  }

  return session;
}

export async function loginWithPassword(role: DemoRole, email: string, password: string) {
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedPassword = password.trim();

  if (!isSupabaseConfigured()) {
    const session = authenticateDemoUser(role, normalizedEmail, normalizedPassword);

    if (!session) {
      return {
        error: "Ese acceso demo no coincide. Usa el usuario precargado del rol seleccionado.",
        mode: "demo" as const,
      };
    }

    storeSession(session);
    return { session, mode: "demo" as const };
  }

  const supabase = getSupabaseBrowserClient();

  if (!supabase) {
    return {
      error: "No fue posible inicializar Supabase en el navegador.",
      mode: "supabase" as const,
    };
  }

  const { error } = await supabase.auth.signInWithPassword({
    email: normalizedEmail,
    password: normalizedPassword,
  });

  if (error) {
    return {
      error: "No se pudo iniciar sesión con Supabase. Verifica correo y contraseña.",
      mode: "supabase" as const,
    };
  }

  const session = await resolveSupabaseSession();

  if (!session) {
    await supabase.auth.signOut();
    return {
      error: "La cuenta no tiene perfil activo en la app. Revisa la tabla profiles.",
      mode: "supabase" as const,
    };
  }

  if (session.role !== role) {
    await supabase.auth.signOut();
    clearSession();
    return {
      error: "El rol seleccionado no coincide con el perfil de esta cuenta.",
      mode: "supabase" as const,
    };
  }

  return { session, mode: "supabase" as const };
}

export async function loginWithOAuth(provider: ResidentOAuthProvider) {
  if (!isSupabaseConfigured()) {
    return {
      error: "Activa Supabase para usar accesos con Google o Microsoft.",
    };
  }

  if (typeof window === "undefined") {
    return {
      error: "Este acceso solo puede iniciarse desde el navegador.",
    };
  }

  const supabase = getSupabaseBrowserClient();

  if (!supabase) {
    return {
      error: "No fue posible inicializar Supabase en el navegador.",
    };
  }

  const redirectTo = `${window.location.origin}/auth/callback?next=/login&oauth=1`;
  const scopes = provider === "azure" ? "email" : undefined;
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo,
      skipBrowserRedirect: true,
      scopes,
    },
  });

  return {
    error: error?.message ?? null,
    url: data?.url ?? null,
  };
}

export async function logoutApp() {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseBrowserClient();
    await supabase?.auth.signOut();
  }

  clearAppDataCache();
  clearSession();
}

export { getDefaultAccount, isSupabaseConfigured };
