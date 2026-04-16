"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { AppScreen } from "@/components/app/AppScreen";
import { GlassCard } from "@/components/app/GlassCard";
import { HeaderBar } from "@/components/app/HeaderBar";
import { Icon } from "@/components/app/Icon";
import { RoleGate } from "@/components/app/RoleGate";
import { getSupabaseAccessToken } from "@/lib/supabase/browser";

type AccessRequest = {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  resident_type: "owner" | "tenant";
  notes: string | null;
  created_at: string;
  unit:
    | {
        tower?: string | null;
        unit_code?: string | null;
      }
    | Array<{
        tower?: string | null;
        unit_code?: string | null;
      }>
    | null;
};

async function getHeaders() {
  const headers = new Headers({
    "Content-Type": "application/json",
  });
  const token = await getSupabaseAccessToken();

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  return headers;
}

function getUnit(request: AccessRequest) {
  const unit = Array.isArray(request.unit) ? request.unit[0] : request.unit;

  return {
    tower: unit?.tower ?? "Torre",
    apartment: unit?.unit_code ?? "Apartamento",
  };
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-CO", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function AccessRequestsContent() {
  const [requests, setRequests] = useState<AccessRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isReviewing, setIsReviewing] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [notificationStatus, setNotificationStatus] = useState("");

  async function loadRequests(notify = false) {
    setError("");

    try {
      const response = await fetch("/api/admin/access-requests", {
        method: "GET",
        headers: await getHeaders(),
        credentials: "include",
      });
      const result = (await response.json()) as {
        requests?: AccessRequest[];
        error?: string;
      };

      if (!response.ok) {
        throw new Error(result.error ?? "No fue posible cargar solicitudes.");
      }

      const nextRequests = result.requests ?? [];
      setRequests(nextRequests);

      if (typeof window !== "undefined" && nextRequests[0]?.id) {
        const latestId = nextRequests[0].id;
        const previousId = window.localStorage.getItem("admiamigo:last-access-request");

        if (notify && previousId && previousId !== latestId && Notification.permission === "granted") {
          const unit = getUnit(nextRequests[0]);
          const notification = new Notification("Nueva solicitud de acceso", {
            body: `${nextRequests[0].full_name} solicita acceso para ${unit.tower} ${unit.apartment}.`,
          });

          notification.onclick = () => {
            window.focus();
            window.location.assign("/access-requests");
          };
        }

        window.localStorage.setItem("admiamigo:last-access-request", latestId);
      }
    } catch (loadError) {
      setError(
        loadError instanceof Error ? loadError.message : "No fue posible cargar solicitudes.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadRequests(false);

    const timer = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        void loadRequests(true);
      }
    }, 60000);
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        void loadRequests(true);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  async function requestDeviceNotifications() {
    if (typeof window === "undefined" || !("Notification" in window)) {
      setNotificationStatus("Este dispositivo no permite notificaciones del navegador.");
      return;
    }

    const permission = await Notification.requestPermission();
    setNotificationStatus(
      permission === "granted"
        ? "Notificaciones activadas en este dispositivo mientras la app esté abierta."
        : "No se activaron las notificaciones en este dispositivo.",
    );
  }

  async function reviewRequest(id: string, action: "approve" | "reject") {
    setIsReviewing(`${action}:${id}`);
    setMessage("");
    setError("");

    try {
      const response = await fetch(`/api/admin/access-requests/${id}`, {
        method: "PATCH",
        headers: await getHeaders(),
        credentials: "include",
        body: JSON.stringify({ action }),
      });
      const result = (await response.json()) as { message?: string; error?: string };

      if (!response.ok) {
        throw new Error(result.error ?? "No fue posible revisar la solicitud.");
      }

      setMessage(result.message ?? "Solicitud revisada.");
      await loadRequests(false);
    } catch (reviewError) {
      setError(
        reviewError instanceof Error ? reviewError.message : "No fue posible revisar la solicitud.",
      );
    } finally {
      setIsReviewing("");
    }
  }

  return (
    <AppScreen
      currentNav="residents"
      header={
        <HeaderBar
          title="Solicitudes de acceso"
          subtitle="Revisa residentes que pidieron activar una cuenta."
          icon="person_add"
          action={
            <Link
              href="/dashboard"
              className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[var(--app-card-border)] bg-white text-[var(--app-heading)] shadow-[0_10px_18px_rgba(93,64,55,0.05)]"
            >
              <Icon name="arrow_back" />
            </Link>
          }
        />
      }
    >
      <div className="space-y-4">
        <GlassCard className="rounded-[1.5rem] p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[1rem] bg-[var(--app-surface)] text-[var(--app-primary)]">
              <Icon name="notifications" className="text-[1.1rem]" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[1rem] font-semibold text-[var(--app-heading)]">
                Avisos en este dispositivo
              </p>
              <p className="mt-1 text-[0.86rem] leading-6 text-[var(--app-muted)]">
                Recibe un aviso si llega una nueva solicitud mientras la app está abierta.
              </p>
              {notificationStatus ? (
                <p className="mt-2 text-[0.84rem] text-[var(--app-primary)]">
                  {notificationStatus}
                </p>
              ) : null}
            </div>
          </div>
          <button
            type="button"
            onClick={() => void requestDeviceNotifications()}
            className="mt-4 app-button-secondary flex h-12 w-full items-center justify-center gap-2 rounded-[1rem] text-[0.95rem] font-semibold"
          >
            <Icon name="notifications" className="text-[1rem]" />
            Activar avisos
          </button>
        </GlassCard>

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

        {isLoading ? (
          <GlassCard className="rounded-[1.5rem] p-5 text-[0.95rem] text-[var(--app-muted)]">
            Cargando solicitudes...
          </GlassCard>
        ) : null}

        {!isLoading && !requests.length ? (
          <GlassCard className="rounded-[1.5rem] p-5 text-center">
            <p className="app-kicker">Sin pendientes</p>
            <h2 className="app-display mt-2 text-[1.35rem] font-[680] text-[var(--app-heading)]">
              No hay solicitudes por revisar
            </h2>
            <p className="mt-2 text-[0.92rem] leading-6 text-[var(--app-muted)]">
              Cuando un residente solicite acceso, aparecerá en esta pantalla.
            </p>
          </GlassCard>
        ) : null}

        {requests.map((request) => {
          const unit = getUnit(request);
          const approving = isReviewing === `approve:${request.id}`;
          const rejecting = isReviewing === `reject:${request.id}`;

          return (
            <GlassCard key={request.id} className="rounded-[1.5rem] p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[1.08rem] font-semibold text-[var(--app-heading)]">
                    {request.full_name}
                  </p>
                  <p className="mt-1 text-[0.86rem] text-[var(--app-muted)]">
                    {unit.tower} · Apartamento {unit.apartment}
                  </p>
                </div>
                <span className="shrink-0 rounded-full bg-[#F7F1EA] px-3 py-1.5 text-[0.72rem] font-semibold text-[var(--app-primary)]">
                  Pendiente
                </span>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-2 text-[0.9rem] text-[var(--app-muted)]">
                <p>
                  <span className="font-semibold text-[var(--app-heading)]">Correo:</span>{" "}
                  {request.email}
                </p>
                <p>
                  <span className="font-semibold text-[var(--app-heading)]">Teléfono:</span>{" "}
                  {request.phone || "Sin teléfono"}
                </p>
                <p>
                  <span className="font-semibold text-[var(--app-heading)]">Tipo:</span>{" "}
                  {request.resident_type === "owner" ? "Propietario" : "Inquilino"}
                </p>
                <p>
                  <span className="font-semibold text-[var(--app-heading)]">Solicitud:</span>{" "}
                  {formatDate(request.created_at)}
                </p>
              </div>

              {request.notes ? (
                <div className="mt-4 rounded-[1rem] border border-[var(--app-card-border)] bg-[var(--app-surface-soft)] px-4 py-3 text-[0.86rem] leading-6 text-[var(--app-muted)]">
                  {request.notes}
                </div>
              ) : null}

              <div className="mt-4 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  disabled={Boolean(isReviewing)}
                  onClick={() => void reviewRequest(request.id, "reject")}
                  className="app-button-secondary flex h-12 items-center justify-center gap-2 rounded-[1rem] text-[0.92rem] font-semibold disabled:opacity-60"
                >
                  <Icon name="alert" className="text-[1rem]" />
                  {rejecting ? "Rechazando..." : "Rechazar"}
                </button>
                <button
                  type="button"
                  disabled={Boolean(isReviewing)}
                  onClick={() => void reviewRequest(request.id, "approve")}
                  className="app-button-primary flex h-12 items-center justify-center gap-2 rounded-[1rem] text-[0.92rem] font-semibold disabled:opacity-60"
                >
                  <Icon name="check_circle" className="text-[1rem]" />
                  {approving ? "Aprobando..." : "Aprobar"}
                </button>
              </div>
            </GlassCard>
          );
        })}
      </div>
    </AppScreen>
  );
}

export default function AccessRequestsPage() {
  return (
    <RoleGate allow={["admin"]}>
      <AccessRequestsContent />
    </RoleGate>
  );
}
