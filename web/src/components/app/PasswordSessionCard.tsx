"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { AuthChangeEvent, Session } from "@supabase/supabase-js";

import { AppViewport } from "@/components/app/AppViewport";
import { GlassCard } from "@/components/app/GlassCard";
import { Icon } from "@/components/app/Icon";
import {
  getPasswordRequirements,
  getPasswordStrengthLabel,
  validatePassword,
} from "@/lib/password-policy";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";

type PasswordSessionCardProps = {
  mode: "create" | "reset";
};

const copy = {
  create: {
    kicker: "Cuenta aprobada",
    title: "Crea tu contraseña",
    description: "Tu solicitud fue aceptada por la administración. Define una contraseña segura para activar tu usuario.",
    loading: "Validando enlace de activación...",
    invalid: "El enlace de activación ya no es válido. Solicita uno nuevo a la administración.",
    submit: "Crear contraseña",
    saving: "Creando...",
    success: "Tu contraseña fue creada. Ya puedes iniciar sesión.",
    requestLink: "/request-access",
    requestLabel: "Solicitar acceso nuevamente",
  },
  reset: {
    kicker: "Recuperación",
    title: "Nueva contraseña",
    description: "Define una contraseña segura para volver a entrar en tu cuenta.",
    loading: "Validando enlace de recuperación...",
    invalid: "El enlace de recuperación ya no es válido. Solicita uno nuevo.",
    submit: "Guardar contraseña",
    saving: "Guardando...",
    success: "La contraseña fue actualizada. Ya puedes iniciar sesión de nuevo.",
    requestLink: "/support?tab=password",
    requestLabel: "Solicitar otro enlace",
  },
} as const;

export function PasswordSessionCard({ mode }: PasswordSessionCardProps) {
  const router = useRouter();
  const content = copy[mode];
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const requirements = useMemo(() => getPasswordRequirements(password), [password]);
  const strengthLabel = useMemo(() => getPasswordStrengthLabel(password), [password]);
  const passwordMismatch = confirmPassword.length > 0 && password !== confirmPassword;

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();

    if (!supabase) {
      const timer = window.setTimeout(() => {
        setError("No fue posible preparar el cambio de contraseña.");
        setIsLoading(false);
      }, 0);

      return () => {
        window.clearTimeout(timer);
      };
    }

    if (typeof window === "undefined") {
      return;
    }

    let active = true;

    const resolveRecovery = async () => {
      const url = new URL(window.location.href);
      const code = url.searchParams.get("code");
      const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));
      const accessToken = hashParams.get("access_token");
      const refreshToken = hashParams.get("refresh_token");

      if (code) {
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

        if (!active) {
          return;
        }

        if (exchangeError) {
          setError(content.invalid);
          setIsLoading(false);
          return;
        }

        window.history.replaceState(null, "", mode === "create" ? "/create-password" : "/reset-password");
      } else if (accessToken && refreshToken) {
        const { error: sessionError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        if (!active) {
          return;
        }

        if (sessionError) {
          setError(content.invalid);
          setIsLoading(false);
          return;
        }

        window.history.replaceState(null, "", mode === "create" ? "/create-password" : "/reset-password");
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!active) {
        return;
      }

      if (session) {
        setIsReady(true);
        setIsLoading(false);
        return;
      }

      setIsLoading(false);
    };

    void resolveRecovery();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {
      if (!active) {
        return;
      }

      if (event === "PASSWORD_RECOVERY" || Boolean(session)) {
        setIsReady(true);
        setIsLoading(false);
      }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [content.invalid, mode]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");

    const validation = validatePassword(password);

    if (!validation.isValid) {
      const missing = validation.requirements.find((requirement) => !requirement.isMet);
      setError(missing ? `La contraseña necesita: ${missing.label.toLowerCase()}.` : "La contraseña no es segura.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden, intenta nuevamente.");
      return;
    }

    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setError("No fue posible actualizar la contraseña.");
      return;
    }

    setIsSaving(true);

    const { error: updateError } = await supabase.auth.updateUser({
      password,
    });

    if (updateError) {
      setError(updateError.message);
      setIsSaving(false);
      return;
    }

    setSuccess(content.success);
    setIsSaving(false);

    window.setTimeout(() => {
      router.replace(mode === "create" ? "/login?created=1" : "/login?recovered=1");
    }, 1200);
  }

  return (
    <AppViewport>
      <main className="app-scroll flex flex-1 flex-col overflow-y-auto px-4 pb-10 pt-8">
        <div className="mx-auto flex w-full max-w-[360px] flex-1 flex-col justify-center">
          <GlassCard className="rounded-[2rem] p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="app-kicker">{content.kicker}</p>
                <h1 className="app-display mt-2 text-[1.9rem] font-[680] leading-[1.02] text-[var(--app-heading)]">
                  {content.title}
                </h1>
                <p className="mt-3 text-[0.94rem] leading-6 text-[var(--app-muted)]">
                  {content.description}
                </p>
              </div>

              <Link
                href="/login"
                className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[var(--app-card-border)] bg-white text-[var(--app-heading)] shadow-[0_10px_18px_rgba(93,64,55,0.05)]"
              >
                <Icon name="arrow_back" />
              </Link>
            </div>

            {isLoading ? (
              <div className="mt-6 rounded-[1rem] border border-[var(--app-card-border)] bg-[var(--app-surface-soft)] px-4 py-4 text-[0.92rem] text-[var(--app-muted)]">
                {content.loading}
              </div>
            ) : null}

            {!isLoading && !isReady ? (
              <div className="mt-6 space-y-4">
                <div className="rounded-[1rem] border border-[rgba(161,90,73,0.18)] bg-[var(--app-danger-bg)] px-4 py-4 text-[0.92rem] text-[var(--app-danger)]">
                  {error || content.invalid}
                </div>
                <Link
                  href={content.requestLink}
                  className="app-button-secondary flex h-12 items-center justify-center rounded-[1rem] text-[0.95rem] font-semibold"
                >
                  {content.requestLabel}
                </Link>
              </div>
            ) : null}

            {!isLoading && isReady ? (
              <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                <label className="block">
                  <span className="mb-2 block text-[0.75rem] font-semibold uppercase tracking-[0.18em] text-[var(--app-muted)]">
                    Contraseña
                  </span>
                  <div className="app-input flex h-[3.8rem] items-center gap-3 rounded-[1rem] px-4">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      className="w-full border-none bg-transparent outline-none"
                      placeholder="Crea una contraseña segura"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((current) => !current)}
                      className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--app-muted)] transition hover:bg-[var(--app-surface)]"
                      aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                    >
                      <Icon name="visibility" className="text-[1.15rem]" />
                    </button>
                  </div>
                </label>

                <div className="rounded-[1rem] border border-[var(--app-card-border)] bg-[var(--app-surface-soft)] px-4 py-3">
                  <p className="text-[0.86rem] font-semibold text-[var(--app-heading)]">
                    {strengthLabel}
                  </p>
                  <div className="mt-3 space-y-2">
                    {requirements.map((requirement) => (
                      <div
                        key={requirement.id}
                        className={`flex items-center gap-2 text-[0.82rem] ${
                          requirement.isMet ? "text-[var(--app-success)]" : "text-[var(--app-muted)]"
                        }`}
                      >
                        <Icon
                          name={requirement.isMet ? "check_circle" : "radio_button_unchecked"}
                          className="text-[1rem]"
                        />
                        {requirement.label}
                      </div>
                    ))}
                  </div>
                </div>

                <label className="block">
                  <span className="mb-2 block text-[0.75rem] font-semibold uppercase tracking-[0.18em] text-[var(--app-muted)]">
                    Confirmar contraseña
                  </span>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    className="app-input h-[3.8rem] w-full rounded-[1rem] px-4 outline-none"
                    placeholder="Repite la contraseña"
                  />
                  {passwordMismatch ? (
                    <p className="mt-2 text-[0.82rem] text-[var(--app-danger)]">
                      Las contraseñas no coinciden, intenta nuevamente.
                    </p>
                  ) : null}
                </label>

                {error ? (
                  <div className="rounded-[1rem] border border-[rgba(161,90,73,0.18)] bg-[var(--app-danger-bg)] px-4 py-3 text-[0.9rem] text-[var(--app-danger)]">
                    {error}
                  </div>
                ) : null}

                {success ? (
                  <div className="rounded-[1rem] border border-[rgba(86,114,96,0.18)] bg-[var(--app-success-bg)] px-4 py-3 text-[0.9rem] text-[var(--app-success)]">
                    {success}
                  </div>
                ) : null}

                <button
                  type="submit"
                  disabled={isSaving}
                  className="app-button-primary flex h-[4rem] w-full items-center justify-center gap-3 rounded-[1rem] text-[1rem] font-semibold disabled:opacity-70"
                >
                  {isSaving ? content.saving : content.submit}
                  <Icon name="check_circle" className="text-[1.1rem]" />
                </button>
              </form>
            ) : null}
          </GlassCard>
        </div>
      </main>
    </AppViewport>
  );
}
