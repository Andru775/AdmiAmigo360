"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { AuthChangeEvent, Session } from "@supabase/supabase-js";

import { AppViewport } from "@/components/app/AppViewport";
import { GlassCard } from "@/components/app/GlassCard";
import { Icon } from "@/components/app/Icon";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (password.length < 8) {
      setError("La nueva contraseña debe tener al menos 8 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
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

    setSuccess("La contraseña fue actualizada. Ya puedes iniciar sesión de nuevo.");
    setIsSaving(false);

    window.setTimeout(() => {
      router.replace("/login?recovered=1");
    }, 1200);
  }

  return (
    <AppViewport>
      <main className="app-scroll flex flex-1 flex-col overflow-y-auto px-4 pb-10 pt-8">
        <div className="mx-auto flex w-full max-w-[360px] flex-1 flex-col justify-center">
          <GlassCard className="rounded-[2rem] p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="app-kicker">Password Reset</p>
                <h1 className="app-display mt-2 text-[1.9rem] font-[680] leading-[1.02] text-[var(--app-heading)]">
                  Nueva contraseña
                </h1>
                <p className="mt-3 text-[0.94rem] leading-6 text-[var(--app-muted)]">
                  Define una contraseña segura para volver a entrar en tu cuenta.
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
                Validando enlace de recuperación...
              </div>
            ) : null}

            {!isLoading && !isReady ? (
              <div className="mt-6 space-y-4">
                <div className="rounded-[1rem] border border-[rgba(161,90,73,0.18)] bg-[var(--app-danger-bg)] px-4 py-4 text-[0.92rem] text-[var(--app-danger)]">
                  El enlace ya no es valido o no llego una sesión de recuperación.
                </div>
                <Link
                  href="/support"
                  className="app-button-secondary flex h-12 items-center justify-center rounded-[1rem] text-[0.95rem] font-semibold"
                >
                  Solicitar otro enlace
                </Link>
              </div>
            ) : null}

            {!isLoading && isReady ? (
              <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                <label className="block">
                  <span className="mb-2 block text-[0.75rem] font-semibold uppercase tracking-[0.18em] text-[var(--app-muted)]">
                    Nueva contraseña
                  </span>
                  <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="app-input h-[3.8rem] w-full rounded-[1rem] px-4 outline-none"
                    placeholder="Minimo 8 caracteres"
                  />
                </label>

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
                  {isSaving ? "Guardando..." : "Guardar contraseña"}
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
