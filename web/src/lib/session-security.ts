"use client";

export type PasswordActionMode = "create" | "reset";

const PASSWORD_ACTION_KEY = "admiamigo360.password-action-pending";
const REMEMBER_SESSION_KEY = "admiamigo360.remember-session";
const EPHEMERAL_SESSION_KEY = "admiamigo360.ephemeral-session-active";

function canUseBrowserStorage() {
  return typeof window !== "undefined";
}

export function markPasswordActionPending(mode: PasswordActionMode) {
  if (!canUseBrowserStorage()) {
    return;
  }

  window.localStorage.setItem(
    PASSWORD_ACTION_KEY,
    JSON.stringify({
      mode,
      startedAt: Date.now(),
    }),
  );
}

export function clearPasswordActionPending() {
  if (!canUseBrowserStorage()) {
    return;
  }

  window.localStorage.removeItem(PASSWORD_ACTION_KEY);
}

export function hasPasswordActionPending() {
  if (!canUseBrowserStorage()) {
    return false;
  }

  return Boolean(window.localStorage.getItem(PASSWORD_ACTION_KEY));
}

export function isPasswordActionRoute() {
  if (!canUseBrowserStorage()) {
    return false;
  }

  return ["/create-password", "/reset-password"].includes(window.location.pathname);
}

export function setRememberSessionPreference(remember: boolean) {
  if (!canUseBrowserStorage()) {
    return;
  }

  window.localStorage.setItem(REMEMBER_SESSION_KEY, remember ? "1" : "0");

  if (remember) {
    window.sessionStorage.removeItem(EPHEMERAL_SESSION_KEY);
  } else {
    window.sessionStorage.setItem(EPHEMERAL_SESSION_KEY, "1");
  }
}

export function rememberSessionPreference() {
  if (!canUseBrowserStorage()) {
    return true;
  }

  return window.localStorage.getItem(REMEMBER_SESSION_KEY) !== "0";
}

export function markEphemeralSessionActive() {
  if (!canUseBrowserStorage()) {
    return;
  }

  if (!rememberSessionPreference()) {
    window.sessionStorage.setItem(EPHEMERAL_SESSION_KEY, "1");
  }
}

export function clearEphemeralSessionState() {
  if (!canUseBrowserStorage()) {
    return;
  }

  window.sessionStorage.removeItem(EPHEMERAL_SESSION_KEY);
}

export function shouldClearPersistentSession() {
  if (!canUseBrowserStorage() || rememberSessionPreference()) {
    return false;
  }

  return window.sessionStorage.getItem(EPHEMERAL_SESSION_KEY) !== "1";
}
