"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { ResidentShell } from "@/components/app/ResidentShell";
import { RoleGate } from "@/components/app/RoleGate";
import { GlassCard } from "@/components/app/GlassCard";
import { Icon } from "@/components/app/Icon";
import { fetchResidentPortalData, type ResidentPortalData } from "@/lib/app-data";
import { useDemoSession } from "@/lib/useDemoSession";

function ResidentProfileContent() {
  const session = useDemoSession();
  const [data, setData] = useState<ResidentPortalData | null>(null);

  useEffect(() => {
    let active = true;

    void fetchResidentPortalData(session).then((result) => {
      if (active) {
        setData(result);
      }
    });

    return () => {
      active = false;
    };
  }, [session]);

  const resident = data?.resident ?? null;

  return (
    <ResidentShell
      title="Perfil"
      subtitle="Datos del residente, unidad y accesos disponibles."
      activeTab="profile"
      actionHref="/resident/notifications"
      actionIcon="notifications"
    >
      {!resident || !session ? (
        <GlassCard className="rounded-[1.4rem] p-5">
          <p className="text-[0.95rem] text-[var(--app-muted)]">Cargando perfil...</p>
        </GlassCard>
      ) : (
        <div className="space-y-4">
          <GlassCard className="rounded-[1.3rem] p-5">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[radial-gradient(circle_at_top,#ffe4cd,#f2c39f_65%,#8d5f45_100%)] text-[#8d5f45]">
                <Icon name="person" className="text-[1.45rem]" />
              </div>
              <div className="min-w-0">
                <p className="text-[1.05rem] font-semibold text-[var(--app-heading)]">
                  {resident.name}
                </p>
                <p className="mt-1 text-[0.92rem] text-[var(--app-muted)]">
                  {resident.unitLabel}
                </p>
                <p className="mt-1 truncate text-[0.92rem] text-[var(--app-muted)]">
                  {session.email}
                </p>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="rounded-[1.3rem] p-5">
            <div className="grid grid-cols-1 gap-3">
              <div className="rounded-[1rem] bg-[var(--app-surface-soft)] px-4 py-3 text-[0.92rem] text-[var(--app-muted)]">
                Tipo de residente
                <p className="mt-2 font-medium text-[var(--app-heading)]">
                  {resident.residentType}
                </p>
              </div>
              <div className="rounded-[1rem] bg-[var(--app-surface-soft)] px-4 py-3 text-[0.92rem] text-[var(--app-muted)]">
                Teléfono
                <p className="mt-2 font-medium text-[var(--app-heading)]">{resident.phone}</p>
              </div>
              <div className="rounded-[1rem] bg-[var(--app-surface-soft)] px-4 py-3 text-[0.92rem] text-[var(--app-muted)]">
                Acceso actual
                <p className="mt-2 font-medium text-[var(--app-heading)]">
                  Asambleas, reservas, pagos y avisos
                </p>
              </div>
            </div>
          </GlassCard>

          <div className="grid grid-cols-1 gap-3">
            <Link
              href="/support"
              className="app-button-secondary flex items-center justify-center gap-3 rounded-[1rem] px-4 py-4 text-[0.95rem] font-semibold"
            >
              <Icon name="support_agent" className="text-[1.1rem]" />
              Contactar administración
            </Link>
            <Link
              href="/logout"
              className="app-button-primary flex items-center justify-center gap-3 rounded-[1rem] px-4 py-4 text-[0.95rem] font-semibold"
            >
              <Icon name="logout" className="text-[1.1rem]" />
              Cerrar sesión
            </Link>
          </div>
        </div>
      )}
    </ResidentShell>
  );
}

export default function ResidentProfilePage() {
  return (
    <RoleGate allow={["resident"]}>
      <ResidentProfileContent />
    </RoleGate>
  );
}
