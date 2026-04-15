import type { DemoAccount, DemoRole } from "@/data/appData";
import { demoAccounts } from "@/data/demoDb";

export const SESSION_KEY = "admiamigo360.demo-session";

export type SessionUser = Pick<
  DemoAccount,
  "role" | "name" | "title" | "email" | "homeHref"
> & {
  userId?: string;
  propertyId?: string;
  residentId?: string;
  residentSlug?: string;
};

export function getDefaultAccount(role: DemoRole) {
  return demoAccounts.find((account) => account.role === role) ?? demoAccounts[0];
}

export function authenticateDemoUser(
  role: DemoRole,
  email: string,
  password: string,
) {
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedPassword = password.trim();

  const account = demoAccounts.find(
    (candidate) =>
      candidate.role === role &&
      candidate.email.toLowerCase() === normalizedEmail &&
      candidate.password === normalizedPassword,
  );

  if (!account) {
    return null;
  }

  const { name, title, homeHref } = account;
  return {
    role,
    name,
    title,
    email: normalizedEmail,
    homeHref,
  } satisfies SessionUser;
}

export function readSession() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const rawValue = window.localStorage.getItem(SESSION_KEY);
    if (!rawValue) {
      return null;
    }

    return JSON.parse(rawValue) as SessionUser;
  } catch {
    return null;
  }
}

export function storeSession(session: SessionUser) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearSession() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(SESSION_KEY);
}
