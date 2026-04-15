"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { AppScreen } from "@/components/app/AppScreen";
import { GlassCard } from "@/components/app/GlassCard";
import { HeaderBar } from "@/components/app/HeaderBar";
import { Icon } from "@/components/app/Icon";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";
import { isSupabaseConfigured } from "@/lib/supabase/env";

const tabs = [
  { id: "password", label: "Contraseña" },
  { id: "account", label: "Cuenta" },
] as const;

const towerOptions = ["Torre A", "Torre B", "Torre C", "Torre D"] as const;

type SupportTab = (typeof tabs)[number]["id"];

type ApiResult = {
  sent?: boolean;
  requested?: boolean;
  message?: string;
  email?: string;
  error?: string;
};

export default function SupportPage() {
  const usingSupabase = isSupabaseConfigured();
  const [activeTab, setActiveTab] = useState<SupportTab>("password");

  const [email, setEmail] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [fullName, setFullName] = useState("");
  const [tower, setTower] = useState<(typeof towerOptions)[number]>("Torre A");
  const [unitCode, setUnitCode] = useState("");
  const [phone, setPhone] = useState("");
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupResult, setLookupResult] = useState<ApiResult | null>(null);

  const redirectTo = useMemo(() => {
    if (typeof window === "undefined") {
      return "";
    }

    return `${window.location.origin}/reset-password`;
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const nextTab = params.get("tab");
    const nextEmail = params.get("email");

    if (nextTab === "request") {
      window.location.replace(`/request-access?${params.toString()}`);
      return;
    }

    if (nextTab === "password" || nextTab === "account") {
      setActiveTab(nextTab);
    }

    if (nextEmail) {
      setEmail(nextEmail);
    }
  }, []);

  async function handlePasswordRecovery(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPasswordLoading(true);
    setPasswordError("");
    setPasswordMessage("");

    try {
      if (!usingSupabase) {
        throw new Error("La recuperación por correo se activa cuando Supabase está configurado.");
      }

      const normalizedEmail = email.trim().toLowerCase();
      if (!normalizedEmail.includes("@")) {
        throw new Error("Ingresa un correo válido para continuar.");
      }

      const supabase = getSupabaseBrowserClient();
      if (!supabase) {
        throw new Error("No fue posible inicializar Supabase en este dispositivo.");
      }

      const { error } = await supabase.auth.resetPasswordForEmail(normalizedEmail, {
        redirectTo,
      });

      if (error) {
        if (error.message.toLowerCase().includes("rate limit")) {
          setPasswordMessage(
            "Ya solicitamos un enlace hace poco. Revisa tu correo o espera unos minutos antes de pedir otro.",
          );
          return;
        }

        throw new Error(error.message);
      }

      setPasswordMessage(
        "Si existe una cuenta con ese correo, enviamos un enlace para cambiar la contraseña.",
      );
    } catch (error) {
      setPasswordError(
        error instanceof Error
          ? error.message
          : "No fue posible iniciar la recuperación de contraseña.",
      );
    } finally {
      setPasswordLoading(false);
    }
  }

  async function handleSilentRecovery(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLookupLoading(true);
    setLookupResult(null);

    try {
      const response = await fetch("/api/auth/recover-identifier", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName,
          tower,
          unitCode,
          phone,
        }),
      });

      const result = (await response.json()) as ApiResult;

      if (!response.ok) {
        throw new Error(result.error ?? "No fue posible validar tu identidad.");
      }

      setLookupResult(result);
    } catch (error) {
      setLookupResult({
        error:
          error instanceof Error ? error.message : "No fue posible validar tu identidad.",
      });
    } finally {
      setLookupLoading(false);
    }
  }

  return (
    <AppScreen
      requireAuth={false}
      header={
        <HeaderBar
          title="Acceso y soporte"
          subtitle="Recupera contraseña o confirma el correo vinculado a tu vivienda."
          icon="support_agent"
          action={
            <Link
              href="/login"
              className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[var(--app-card-border)] bg-white text-[var(--app-heading)] shadow-[0_10px_18px_rgba(93,64,55,0.05)]"
            >
              <Icon name="arrow_back" />
            </Link>
          }
        />
      }
    >
      <div className="space-y-5">
        <GlassCard className="rounded-[1.6rem] p-4">
          <div className="rounded-[1.15rem] border border-[var(--app-card-border)] bg-[var(--app-surface-soft)] p-1">
            <div className="grid grid-cols-2 gap-2">
              {tabs.map((tab) => {
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`rounded-[0.9rem] px-3 py-3 text-[0.92rem] font-semibold transition ${
                      active ? "app-button-primary" : "bg-transparent text-[var(--app-heading)]"
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {activeTab === "password" ? (
            <form className="mt-5 space-y-4" onSubmit={handlePasswordRecovery}>
              <div>
                <p className="app-kicker">Recuperación</p>
                <h2 className="app-display mt-2 text-[1.45rem] font-[680] text-[var(--app-heading)]">
                  Restablece tu contraseña
                </h2>
                <p className="mt-2 text-[0.92rem] leading-6 text-[var(--app-muted)]">
                  Ingresa tu correo y te enviaremos un enlace para definir una nueva contraseña.
                </p>
              </div>

              <label className="block">
                <span className="mb-2 block text-[0.75rem] font-semibold uppercase tracking-[0.18em] text-[var(--app-muted)]">
                  Correo electrónico
                </span>
                <div className="app-input flex h-[3.9rem] items-center gap-3 rounded-[1rem] px-4">
                  <Icon name="mail" className="text-[1.15rem] text-[var(--app-muted)]" />
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="nombre@conjunto.com"
                    className="w-full border-none bg-transparent text-[1rem] outline-none"
                  />
                </div>
              </label>

              {passwordMessage ? (
                <div className="rounded-[1rem] border border-[rgba(86,114,96,0.18)] bg-[var(--app-success-bg)] px-4 py-3 text-[0.9rem] text-[var(--app-success)]">
                  {passwordMessage}
                </div>
              ) : null}

              {passwordError ? (
                <div className="rounded-[1rem] border border-[rgba(161,90,73,0.18)] bg-[var(--app-danger-bg)] px-4 py-3 text-[0.9rem] text-[var(--app-danger)]">
                  {passwordError}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={passwordLoading}
                className="app-button-primary flex h-[4rem] w-full items-center justify-center gap-3 rounded-[1rem] text-[1rem] font-semibold disabled:opacity-70"
              >
                {passwordLoading ? "Enviando..." : "Enviar enlace seguro"}
                <Icon name="arrow_forward" className="text-[1.1rem]" />
              </button>
            </form>
          ) : null}

          {activeTab === "account" ? (
            <form className="mt-5 space-y-4" onSubmit={handleSilentRecovery}>
              <div>
                <p className="app-kicker">Buscar cuenta</p>
                <h2 className="app-display mt-2 text-[1.45rem] font-[680] text-[var(--app-heading)]">
                  No recuerdas tu correo
                </h2>
                <p className="mt-2 text-[0.92rem] leading-6 text-[var(--app-muted)]">
                  Confirma tus datos para ver el correo vinculado a tu vivienda. Si tampoco
                  recuerdas la contraseña, usa ese correo en la recuperación.
                </p>
              </div>

              <label className="block">
                <span className="mb-2 block text-[0.75rem] font-semibold uppercase tracking-[0.18em] text-[var(--app-muted)]">
                  Nombre completo
                </span>
                <input
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  className="app-input h-[3.8rem] w-full rounded-[1rem] px-4 outline-none"
                  placeholder="Tu nombre registrado"
                />
              </label>

              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="mb-2 block text-[0.75rem] font-semibold uppercase tracking-[0.18em] text-[var(--app-muted)]">
                    Torre
                  </span>
                  <select
                    value={tower}
                    onChange={(event) => setTower(event.target.value as (typeof towerOptions)[number])}
                    className="app-input h-[3.8rem] w-full rounded-[1rem] px-4 outline-none"
                  >
                    {towerOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="mb-2 block text-[0.75rem] font-semibold uppercase tracking-[0.18em] text-[var(--app-muted)]">
                    Apartamento
                  </span>
                  <input
                    value={unitCode}
                    onChange={(event) => setUnitCode(event.target.value.toUpperCase())}
                    className="app-input h-[3.8rem] w-full rounded-[1rem] px-4 outline-none"
                    placeholder="402"
                  />
                </label>
              </div>

              <label className="block">
                <span className="mb-2 block text-[0.75rem] font-semibold uppercase tracking-[0.18em] text-[var(--app-muted)]">
                  Teléfono
                </span>
                <input
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  className="app-input h-[3.8rem] w-full rounded-[1rem] px-4 outline-none"
                  placeholder="+57 300 000 0000"
                />
              </label>

              {lookupResult?.message ? (
                <div className="rounded-[1rem] border border-[rgba(86,114,96,0.18)] bg-[var(--app-success-bg)] px-4 py-3 text-[0.9rem] text-[var(--app-success)]">
                  {lookupResult.message}
                </div>
              ) : null}

              {lookupResult?.error ? (
                <div className="rounded-[1rem] border border-[rgba(161,90,73,0.18)] bg-[var(--app-danger-bg)] px-4 py-3 text-[0.9rem] text-[var(--app-danger)]">
                  {lookupResult.error}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={lookupLoading}
                className="app-button-primary flex h-[4rem] w-full items-center justify-center gap-3 rounded-[1rem] text-[1rem] font-semibold disabled:opacity-70"
              >
                {lookupLoading ? "Validando..." : "Ver correo vinculado"}
                <Icon name="mail" className="text-[1.1rem]" />
              </button>
            </form>
          ) : null}
        </GlassCard>

        <GlassCard className="rounded-[1.5rem] p-5">
          <p className="app-kicker">Nuevo acceso</p>
          <h2 className="app-display mt-2 text-[1.25rem] font-[680] text-[var(--app-heading)]">
            ¿Necesitas crear tu acceso residencial?
          </h2>
          <p className="mt-2 text-[0.92rem] leading-6 text-[var(--app-muted)]">
            Si todavía no tienes una cuenta vinculada a tu vivienda, solicita la activación por
            separado.
          </p>
          <Link
            href="/request-access"
            className="mt-4 app-button-secondary flex h-[3.8rem] items-center justify-center gap-2 rounded-[1rem] text-[0.95rem] font-semibold"
          >
            <Icon name="person_add" className="text-[1rem]" />
            Solicitar nuevo acceso
          </Link>
        </GlassCard>
      </div>
    </AppScreen>
  );
}
