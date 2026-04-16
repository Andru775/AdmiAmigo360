"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { AppScreen } from "@/components/app/AppScreen";
import { GlassCard } from "@/components/app/GlassCard";
import { HeaderBar } from "@/components/app/HeaderBar";
import { Icon } from "@/components/app/Icon";
import { RoleGate } from "@/components/app/RoleGate";
import { getSupabaseAccessToken } from "@/lib/supabase/browser";

type AdminUser = {
  id: string;
  userId: string;
  email: string;
  fullName: string;
  title: string;
  status: "active" | "revoked" | string;
  createdAt: string;
  revokedAt: string | null;
};

async function authenticatedFetch(path: string, init?: RequestInit) {
  const token = await getSupabaseAccessToken();
  const headers = new Headers(init?.headers);

  headers.set("Content-Type", "application/json");

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  return fetch(path, {
    ...init,
    headers,
    credentials: "include",
  });
}

function statusLabel(status: AdminUser["status"]) {
  return status === "active" ? "Activo" : "Revocado";
}

function AdminUsersContent() {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [title, setTitle] = useState("Administrador del conjunto");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function loadAdmins() {
    setLoading(true);
    setError("");

    const response = await authenticatedFetch("/api/admin/admin-users");
    const result = (await response.json()) as { admins?: AdminUser[]; error?: string };

    if (!response.ok) {
      setError(result.error ?? "No fue posible cargar administradores.");
      setLoading(false);
      return;
    }

    setAdmins(result.admins ?? []);
    setLoading(false);
  }

  useEffect(() => {
    void Promise.resolve().then(() => loadAdmins());
  }, []);

  async function handleCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    setMessage("");

    const response = await authenticatedFetch("/api/admin/admin-users", {
      method: "POST",
      body: JSON.stringify({ email, fullName, title }),
    });
    const result = (await response.json()) as { message?: string; error?: string };

    if (!response.ok) {
      setError(result.error ?? "No fue posible crear el administrador.");
      setSubmitting(false);
      return;
    }

    setMessage(result.message ?? "Acceso administrativo creado.");
    setEmail("");
    setFullName("");
    setTitle("Administrador del conjunto");
    setSubmitting(false);
    await loadAdmins();
  }

  async function updateAdmin(id: string, action: "activate" | "revoke") {
    setUpdatingId(id);
    setError("");
    setMessage("");

    const response = await authenticatedFetch(`/api/admin/admin-users/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ action }),
    });
    const result = (await response.json()) as { error?: string };

    if (!response.ok) {
      setError(result.error ?? "No fue posible actualizar el acceso.");
      setUpdatingId(null);
      return;
    }

    setMessage(action === "activate" ? "Acceso activado." : "Acceso revocado.");
    setUpdatingId(null);
    await loadAdmins();
  }

  return (
    <AppScreen
      currentNav="settings"
      header={
        <HeaderBar
          title="Administradores"
          subtitle="Crea accesos reales, permite usuarios con doble rol y revoca permisos cuando cambie el consejo."
          icon="admin_panel_settings"
          action={
            <Link
              href="/settings"
              className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[var(--app-card-border)] bg-white text-[var(--app-heading)]"
            >
              <Icon name="arrow_back" />
            </Link>
          }
        />
      }
    >
      <div className="space-y-5">
        <GlassCard className="rounded-[1.6rem] p-5">
          <p className="app-kicker">Nuevo acceso</p>
          <h2 className="app-display mt-2 text-[1.5rem] font-[680] text-[var(--app-heading)]">
            Invitar administrador
          </h2>
          <p className="mt-2 text-[0.92rem] leading-6 text-[var(--app-muted)]">
            Si el correo ya pertenece a un residente, se conserva su acceso residencial y se agrega
            el permiso administrativo.
          </p>

          <form className="mt-5 space-y-4" onSubmit={handleCreate}>
            <label className="block">
              <span className="mb-2 block text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[var(--app-muted)]">
                Correo
              </span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="persona@correo.com"
                className="app-input h-12 w-full rounded-[1rem] px-4 text-[0.95rem] outline-none"
                required
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[var(--app-muted)]">
                Nombre
              </span>
              <input
                type="text"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                placeholder="Nombre completo"
                className="app-input h-12 w-full rounded-[1rem] px-4 text-[0.95rem] outline-none"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[var(--app-muted)]">
                Cargo
              </span>
              <input
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                className="app-input h-12 w-full rounded-[1rem] px-4 text-[0.95rem] outline-none"
              />
            </label>

            <button
              type="submit"
              disabled={submitting}
              className="app-button-primary flex h-[3.25rem] w-full items-center justify-center gap-2 rounded-[1rem] text-[0.95rem] font-semibold disabled:opacity-70"
            >
              <Icon name="verified_user" className="text-[1rem]" />
              {submitting ? "Creando acceso..." : "Crear acceso administrativo"}
            </button>
          </form>
        </GlassCard>

        {error ? (
          <div className="rounded-[1rem] border border-[rgba(161,90,73,0.18)] bg-[var(--app-danger-bg)] px-4 py-3 text-[0.9rem] text-[var(--app-danger)]">
            {error}
          </div>
        ) : null}

        {message ? (
          <div className="rounded-[1rem] border border-[rgba(86,114,96,0.18)] bg-[var(--app-success-bg)] px-4 py-3 text-[0.9rem] text-[var(--app-success)]">
            {message}
          </div>
        ) : null}

        <section className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="app-kicker">Permisos activos</p>
              <h2 className="text-[1.2rem] font-semibold text-[var(--app-heading)]">
                Equipo administrativo
              </h2>
            </div>
            <button
              type="button"
              onClick={() => void loadAdmins()}
              className="app-button-secondary flex h-10 items-center gap-2 rounded-full px-4 text-[0.84rem] font-semibold"
            >
              <Icon name="refresh" className="text-[1rem]" />
              Actualizar
            </button>
          </div>

          {loading ? (
            <GlassCard className="rounded-[1.4rem] p-5">
              <p className="text-[0.95rem] text-[var(--app-muted)]">Cargando administradores...</p>
            </GlassCard>
          ) : null}

          {!loading && admins.length === 0 ? (
            <GlassCard className="rounded-[1.4rem] p-5">
              <p className="text-[0.95rem] text-[var(--app-muted)]">
                Todavía no hay administradores registrados en la tabla de roles.
              </p>
            </GlassCard>
          ) : null}

          {admins.map((admin) => {
            const active = admin.status === "active";

            return (
              <GlassCard key={admin.id} className="rounded-[1.4rem] p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="truncate text-[1rem] font-semibold text-[var(--app-heading)]">
                      {admin.fullName}
                    </h3>
                    <p className="mt-1 truncate text-[0.9rem] text-[var(--app-muted)]">
                      {admin.email || "Correo no disponible"}
                    </p>
                    <p className="mt-1 text-[0.82rem] text-[var(--app-muted)]">{admin.title}</p>
                  </div>

                  <span
                    className={`shrink-0 rounded-full px-3 py-1.5 text-[0.72rem] font-semibold ${
                      active
                        ? "bg-[var(--app-success-bg)] text-[var(--app-success)]"
                        : "bg-[var(--app-danger-bg)] text-[var(--app-danger)]"
                    }`}
                  >
                    {statusLabel(admin.status)}
                  </span>
                </div>

                <button
                  type="button"
                  disabled={updatingId === admin.id}
                  onClick={() => void updateAdmin(admin.id, active ? "revoke" : "activate")}
                  className={`mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-[0.95rem] text-[0.9rem] font-semibold disabled:opacity-70 ${
                    active ? "app-button-secondary" : "app-button-primary"
                  }`}
                >
                  <Icon name={active ? "block" : "verified"} className="text-[1rem]" />
                  {updatingId === admin.id
                    ? "Actualizando..."
                    : active
                      ? "Revocar acceso"
                      : "Reactivar acceso"}
                </button>
              </GlassCard>
            );
          })}
        </section>
      </div>
    </AppScreen>
  );
}

export default function AdminUsersPage() {
  return (
    <RoleGate allow={["admin"]}>
      <AdminUsersContent />
    </RoleGate>
  );
}
