"use client";

import type { DemoRole } from "@/data/appData";
import { clearAppDataCache } from "@/lib/app-data";
import {
  authenticateDemoUser,
  clearSession,
  getDefaultAccount,
  readSession,
  storeSession,
  type SessionUser,
} from "@/lib/demoAuth";
import {
  clearEphemeralSessionState,
  clearPasswordActionPending,
  hasPasswordActionPending,
  markEphemeralSessionActive,
  setRememberSessionPreference,
  shouldClearPersistentSession,
} from "@/lib/session-security";
import { getSupabaseAccessToken, getSupabaseBrowserClient } from "@/lib/supabase/browser";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export type ResidentOAuthProvider = "google" | "azure";

const PREFERRED_ROLE_KEY = "admiamigo360.preferred-role";

function isDemoRole(value: unknown): value is DemoRole {
  return value === "admin" || value === "resident";
}

function readPreferredRole() {
  if (typeof window === "undefined") {
    return undefined;
  }

  const storedRole = window.localStorage.getItem(PREFERRED_ROLE_KEY);
  const sessionRole = readSession()?.role;

  if (isDemoRole(storedRole)) {
    return storedRole;
  }

  return isDemoRole(sessionRole) ? sessionRole : undefined;
}

function storePreferredRole(role: DemoRole) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(PREFERRED_ROLE_KEY, role);
}

function clearPreferredRole() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(PREFERRED_ROLE_KEY);
}

function getPasswordLoginMessage(message: string) {
  const normalized = message.toLowerCase();

  if (normalized.includes("email not confirmed")) {
    return "Confirma tu correo antes de iniciar sesión.";
  }

  if (normalized.includes("invalid login credentials")) {
    return "Correo o contraseña incorrectos. Si no recuerdas la clave, solicita un enlace de recuperación.";
  }

  return "No fue posible iniciar sesión. Revisa los datos e intenta nuevamente.";
}

async function buildSupabaseSession(role?: DemoRole) {
  const token = await getSupabaseAccessToken();
  const headers = new Headers();
  const preferredRole = role ?? readPreferredRole();

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const params = preferredRole ? `?role=${preferredRole}` : "";
  const response = await fetch(`/api/session${params}`, {
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
  markEphemeralSessionActive();
  clearPreferredRole();
  return session;
}

export async function resolveSupabaseSession(role?: DemoRole) {
  const supabase = getSupabaseBrowserClient();

  if (!supabase) {
    return null;
  }

  if (hasPasswordActionPending() || shouldClearPersistentSession()) {
    await supabase.auth.signOut();
    clearPasswordActionPending();
    clearEphemeralSessionState();
    clearAppDataCache();
    clearSession();
    return null;
  }

  const session = await buildSupabaseSession(role);

  if (!session) {
    clearSession();
    return null;
  }

  return session;
}

export async function loginWithPassword(
  role: DemoRole,
  email: string,
  password: string,
  rememberSession = true,
) {
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedPassword = password.trim();
  storePreferredRole(role);
  setRememberSessionPreference(rememberSession);

  if (!normalizedEmail || !normalizedPassword) {
    return {
      error: "Ingresa correo y contraseña para continuar.",
      mode: isSupabaseConfigured() ? ("supabase" as const) : ("demo" as const),
    };
  }

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
      error: getPasswordLoginMessage(error.message),
      mode: "supabase" as const,
    };
  }

  const session = await resolveSupabaseSession(role);

  if (!session) {
    await supabase.auth.signOut();
    return {
      error:
        "Tu cuenta existe, pero todavía no tiene una vivienda o un rol activo vinculado. Solicita acceso o contacta a administración.",
      mode: "supabase" as const,
    };
  }

  if (session.role !== role) {
    await supabase.auth.signOut();
    clearSession();
    return {
      error:
        role === "admin"
          ? "Esta cuenta no tiene permiso para entrar como administrador."
          : "Esta cuenta no está habilitada como residente.",
      mode: "supabase" as const,
    };
  }

  markEphemeralSessionActive();

  return { session, mode: "supabase" as const };
}

export async function loginWithOAuth(provider: ResidentOAuthProvider, rememberSession = true) {
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
  setRememberSessionPreference(rememberSession);
  storePreferredRole("resident");
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

  clearPreferredRole();
  clearEphemeralSessionState();
  clearPasswordActionPending();
  clearAppDataCache();
  clearSession();
}

export { getDefaultAccount, isSupabaseConfigured };
