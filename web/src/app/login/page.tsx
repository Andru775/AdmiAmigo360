"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { AppViewport } from "@/components/app/AppViewport";
import { Icon } from "@/components/app/Icon";
import { SceneArt } from "@/components/app/SceneArt";
import { type DemoRole } from "@/data/appData";
import {
  getDefaultAccount,
  isSupabaseConfigured,
  loginWithOAuth,
  loginWithPassword,
  type ResidentOAuthProvider,
} from "@/lib/auth";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";
import { useSessionState } from "@/lib/useDemoSession";

function roleDefaults(role: DemoRole) {
  if (isSupabaseConfigured()) {
    return { email: "", password: "" };
  }

  const account = getDefaultAccount(role);
  return { email: account.email, password: account.password };
}

function providerLabel(provider: ResidentOAuthProvider) {
  return provider === "google" ? "Google" : "Microsoft";
}

export default function LoginPage() {
  const router = useRouter();
  const { session, isLoading } = useSessionState();
  const [role, setRole] = useState<DemoRole>("resident");
  const [email, setEmail] = useState(roleDefaults("resident").email);
  const [password, setPassword] = useState(roleDefaults("resident").password);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberSession, setRememberSession] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [recovered, setRecovered] = useState(false);
  const [created, setCreated] = useState(false);
  const [oauthSubmitting, setOauthSubmitting] = useState<ResidentOAuthProvider | null>(null);
  const usingSupabase = isSupabaseConfigured();

  function applyRole(nextRole: DemoRole) {
    const defaults = roleDefaults(nextRole);
    setRole(nextRole);
    setEmail(defaults.email);
    setPassword(defaults.password);
    setError("");
  }

  useEffect(() => {
    if (!isLoading && session) {
      router.replace(session.homeHref);
    }
  }, [isLoading, router, session]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const recoveredFlag = params.get("recovered") === "1";
    const createdFlag = params.get("created") === "1";
    const oauthError = params.get("oauth_error");
    const roleParam = params.get("role");

    void Promise.resolve().then(() => {
      if (roleParam === "admin" || roleParam === "resident") {
        applyRole(roleParam);
      }

      setRecovered(recoveredFlag);
      setCreated(createdFlag);

      if (oauthError) {
        setError(
          "No fue posible completar el acceso con el proveedor seleccionado. Revisa la configuración de Google o Microsoft en Supabase.",
        );
      }
    });
  }, []);

  useEffect(() => {
    if (!usingSupabase || typeof window === "undefined") {
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const oauthAttempt = params.get("oauth") === "1";

    if (!oauthAttempt || isLoading || session) {
      return;
    }

    let active = true;
    const timer = window.setTimeout(async () => {
      const supabase = getSupabaseBrowserClient();
      if (!supabase) {
        return;
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!active) {
        return;
      }

      if (user?.email) {
        const params = new URLSearchParams({
          email: user.email,
          source: "oauth",
        });

        await supabase.auth.signOut();

        if (active) {
          router.replace(`/request-access?${params.toString()}`);
        }

        return;
      }

      setError(
        "El proveedor no entregó un correo verificado. Intenta con correo y contraseña o solicita soporte.",
      );
      await supabase.auth.signOut();
    }, 450);

    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [isLoading, router, session, usingSupabase]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    const result = await loginWithPassword(role, email, password, rememberSession);

    if (result.error || !result.session) {
      setError(result.error ?? "No se pudo iniciar sesión.");
      setSubmitting(false);
      return;
    }

    router.push(result.session.homeHref);
  }

  async function handleOAuth(provider: ResidentOAuthProvider) {
    setOauthSubmitting(provider);
    setError("");

    const result = await loginWithOAuth(provider, rememberSession);

    if (result.error) {
      setError(
        `No fue posible iniciar con ${providerLabel(provider)}. Verifica que el proveedor esté activo en Supabase.`,
      );
      setOauthSubmitting(null);
      return;
    }

    if (!result.url) {
      setError(
        `No fue posible iniciar con ${providerLabel(provider)}. Falta terminar la configuración del proveedor en Supabase.`,
      );
      setOauthSubmitting(null);
      return;
    }

    window.location.assign(result.url);
  }

  return (
    <AppViewport>
      <main className="app-scroll flex flex-1 flex-col overflow-y-auto px-4 pb-10 pt-8">
        <div className="mx-auto flex w-full max-w-[360px] flex-1 flex-col justify-center">
          <section className="app-figure overflow-hidden rounded-[2rem] border px-4 pb-4 pt-4 shadow-[0_22px_44px_rgba(79,56,47,0.08)]">
            <div className="overflow-hidden rounded-[1.6rem] border border-[rgba(191,157,108,0.22)] bg-white">
              <SceneArt variant="estate" className="h-[12.5rem] w-full object-cover" />
            </div>

            <div className="mt-4 flex items-start justify-between gap-4">
              <div>
                <p className="app-kicker">Administración residencial</p>
                <h1 className="app-display mt-2 text-[2.2rem] font-[680] leading-[0.95] text-[var(--app-heading)]">
                  AdmiAmigo 360
                </h1>
                <p className="mt-3 text-[0.96rem] leading-6 text-[var(--app-muted)]">
                  Acceso seguro para administración residencial, cartera, reservas y comunicación
                  comunitaria.
                </p>
              </div>

              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[1.2rem] border border-[rgba(191,157,108,0.24)] bg-white text-[var(--app-primary)] shadow-[0_12px_24px_rgba(79,56,47,0.08)]">
                <Icon name="shield_person" className="text-[1.75rem]" />
              </div>
            </div>
          </section>

          <section className="mt-6 rounded-[2rem] border border-[var(--app-card-border)] bg-white p-5 shadow-[0_18px_42px_rgba(79,56,47,0.08)]">
            <div className="rounded-[1.15rem] border border-[var(--app-card-border)] bg-[var(--app-surface-soft)] p-1">
              <div className="grid grid-cols-2 gap-2">
                {(["resident", "admin"] as const).map((item) => {
                  const active = role === item;

                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => applyRole(item)}
                      className={`rounded-[0.9rem] px-4 py-3 text-[0.95rem] font-semibold transition ${
                        active
                          ? "app-button-primary"
                          : "bg-transparent text-[var(--app-heading)]"
                      }`}
                    >
                      {item === "resident" ? "Residente" : "Administrador"}
                    </button>
                  );
                })}
              </div>
            </div>

            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
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
                    placeholder="nombre@gmail.com"
                    className="w-full border-none bg-transparent text-[1rem] outline-none"
                  />
                </div>
              </label>

              <label className="block">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <span className="text-[0.75rem] font-semibold uppercase tracking-[0.18em] text-[var(--app-muted)]">
                    Contraseña
                  </span>
                  {role === "resident" ? (
                    <Link
                      href="/support?tab=password"
                      className="text-[0.85rem] font-semibold text-[var(--app-primary)]"
                    >
                      Recuperar acceso
                    </Link>
                  ) : null}
                </div>
                <div className="app-input flex h-[3.9rem] items-center gap-3 rounded-[1rem] px-4">
                  <Icon name="lock" className="text-[1.15rem] text-[var(--app-muted)]" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Ingresa tu contraseña"
                    className="w-full border-none bg-transparent text-[1rem] outline-none"
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

              <label className="flex items-start gap-3 rounded-[1rem] border border-[var(--app-card-border)] bg-[var(--app-surface-soft)] px-4 py-3">
                <input
                  type="checkbox"
                  checked={rememberSession}
                  onChange={(event) => setRememberSession(event.target.checked)}
                  className="mt-1 h-4 w-4 accent-[var(--app-primary)]"
                />
                <span className="text-[0.85rem] leading-5 text-[var(--app-muted)]">
                  Mantener la sesión iniciada en este dispositivo.
                </span>
              </label>

              <button
                type="submit"
                disabled={submitting}
                className="app-button-primary flex h-[4.1rem] w-full items-center justify-center gap-3 rounded-[1rem] text-[1rem] font-semibold disabled:opacity-70"
              >
                {submitting ? "Ingresando..." : "Ingresar"}
                <Icon name="arrow_forward" className="text-[1.2rem]" />
              </button>

              {error ? (
                <div className="rounded-[1rem] border border-[rgba(161,90,73,0.18)] bg-[var(--app-danger-bg)] px-4 py-3 text-[0.9rem] text-[var(--app-danger)]">
                  {error}
                </div>
              ) : null}

              {recovered ? (
                <div className="rounded-[1rem] border border-[rgba(86,114,96,0.18)] bg-[var(--app-success-bg)] px-4 py-3 text-[0.9rem] text-[var(--app-success)]">
                  Tu contraseña ya fue actualizada. Ingresa con la nueva clave.
                </div>
              ) : null}

              {created ? (
                <div className="rounded-[1rem] border border-[rgba(86,114,96,0.18)] bg-[var(--app-success-bg)] px-4 py-3 text-[0.9rem] text-[var(--app-success)]">
                  Tu contraseña fue creada. Ingresa con tu correo y la nueva clave.
                </div>
              ) : null}
            </form>

            {role === "resident" ? (
              <>
                <div className="my-6 flex items-center gap-3">
                  <div className="h-px flex-1 bg-[var(--app-card-border)]" />
                  <span className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--app-muted)]">
                    Accesos residentes
                  </span>
                  <div className="h-px flex-1 bg-[var(--app-card-border)]" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => void handleOAuth("google")}
                    disabled={oauthSubmitting !== null}
                    className="app-button-secondary flex h-[3.8rem] items-center justify-center gap-2 rounded-[1rem] px-4 text-[0.95rem] font-semibold disabled:opacity-70"
                  >
                    <Icon name="orb" className="text-[1.05rem] text-[var(--app-secondary)]" />
                    {oauthSubmitting === "google" ? "Abriendo..." : "Google"}
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleOAuth("azure")}
                    disabled={oauthSubmitting !== null}
                    className="app-button-secondary flex h-[3.8rem] items-center justify-center gap-2 rounded-[1rem] px-4 text-[0.95rem] font-semibold disabled:opacity-70"
                  >
                    <Icon name="dashboard" className="text-[1.05rem] text-[var(--app-secondary)]" />
                    {oauthSubmitting === "azure" ? "Abriendo..." : "Microsoft"}
                  </button>
                </div>

                <Link
                  href="/request-access"
                  className="mt-3 app-button-secondary flex h-[3.8rem] items-center justify-center gap-2 rounded-[1rem] text-[0.95rem] font-semibold"
                >
                  <Icon name="person_add" className="text-[1rem]" />
                  Solicitar acceso como residente
                </Link>
              </>
            ) : (
              <Link
                href="/admin-recovery"
                className="mt-4 app-button-secondary flex h-[3.8rem] items-center justify-center gap-2 rounded-[1rem] text-[0.95rem] font-semibold"
              >
                <Icon name="lock_reset" className="text-[1rem]" />
                Recuperar acceso administrativo
              </Link>
            )}
          </section>

          {role === "resident" ? (
            <p className="mt-7 text-center text-[0.95rem] leading-6 text-[var(--app-muted)]">
              Si no recuerdas tu usuario o tu contraseña,{" "}
              <Link
                href="/support?tab=account"
                className="font-semibold text-[var(--app-primary)]"
              >
                usa la recuperación segura
              </Link>
              .
            </p>
          ) : null}
        </div>
      </main>
    </AppViewport>
  );
}
