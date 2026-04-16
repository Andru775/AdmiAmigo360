"use client";

import Link from "next/link";
import { useState } from "react";

import { AppViewport } from "@/components/app/AppViewport";
import { GlassCard } from "@/components/app/GlassCard";
import { Icon } from "@/components/app/Icon";

type ApiResult = {
  sent?: boolean;
  message?: string;
  error?: string;
};

export default function AdminRecoveryPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch("/api/auth/admin-recovery", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      const result = (await response.json()) as ApiResult;

      if (!response.ok) {
        throw new Error(result.error ?? "No fue posible iniciar la recuperación.");
      }

      setMessage(result.message ?? "Revisa tu correo para continuar.");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "No fue posible iniciar la recuperación.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AppViewport>
      <main className="app-scroll flex flex-1 flex-col overflow-y-auto px-4 pb-10 pt-8">
        <div className="mx-auto flex w-full max-w-[360px] flex-1 flex-col justify-center">
          <GlassCard className="rounded-[2rem] p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="app-kicker">Administradores</p>
                <h1 className="app-display mt-2 text-[1.9rem] font-[680] leading-[1.02] text-[var(--app-heading)]">
                  Recuperar acceso
                </h1>
                <p className="mt-3 text-[0.94rem] leading-6 text-[var(--app-muted)]">
                  Usa el correo administrativo autorizado para recibir un enlace seguro.
                </p>
              </div>

              <Link
                href="/login"
                className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[var(--app-card-border)] bg-white text-[var(--app-heading)] shadow-[0_10px_18px_rgba(93,64,55,0.05)]"
              >
                <Icon name="arrow_back" />
              </Link>
            </div>

            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              <label className="block">
                <span className="mb-2 block text-[0.75rem] font-semibold uppercase tracking-[0.18em] text-[var(--app-muted)]">
                  Correo administrativo
                </span>
                <div className="app-input flex h-[3.9rem] items-center gap-3 rounded-[1rem] px-4">
                  <Icon name="mail" className="text-[1.15rem] text-[var(--app-muted)]" />
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="administrador@gmail.com"
                    className="w-full border-none bg-transparent text-[1rem] outline-none"
                  />
                </div>
              </label>

              {message ? (
                <div className="rounded-[1rem] border border-[rgba(86,114,96,0.18)] bg-[var(--app-success-bg)] px-4 py-3 text-[0.9rem] text-[var(--app-success)]">
                  {message}
                </div>
              ) : null}

              {error ? (
                <div className="rounded-[1rem] border border-[rgba(161,90,73,0.18)] bg-[var(--app-danger-bg)] px-4 py-3 text-[0.9rem] text-[var(--app-danger)]">
                  {error}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={isLoading}
                className="app-button-primary flex h-[4rem] w-full items-center justify-center gap-3 rounded-[1rem] text-[1rem] font-semibold disabled:opacity-70"
              >
                {isLoading ? "Enviando..." : "Enviar enlace administrativo"}
                <Icon name="arrow_forward" className="text-[1.1rem]" />
              </button>
            </form>
          </GlassCard>
        </div>
      </main>
    </AppViewport>
  );
}
