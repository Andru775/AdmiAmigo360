"use client";

import { useEffect, useState } from "react";

import { ResidentShell } from "@/components/app/ResidentShell";
import { RoleGate } from "@/components/app/RoleGate";
import { GlassCard } from "@/components/app/GlassCard";
import { Icon } from "@/components/app/Icon";
import { fetchResidentPortalData, type ResidentPortalData } from "@/lib/app-data";
import { useDemoSession } from "@/lib/useDemoSession";

function ResidentAssembliesContent() {
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

  return (
    <ResidentShell
      title="Asambleas"
      subtitle="Agenda, convocatorias y reuniones asociadas a tu conjunto."
      activeTab="assemblies"
    >
      <div className="space-y-4">
        {!data ? (
          <GlassCard className="rounded-[1.4rem] p-5">
            <p className="text-[0.95rem] text-[var(--app-muted)]">Cargando asambleas...</p>
          </GlassCard>
        ) : null}

        {data && data.assemblies.length === 0 ? (
          <GlassCard className="rounded-[1.4rem] p-5">
            <p className="text-[0.95rem] text-[var(--app-muted)]">
              No hay asambleas programadas por ahora.
            </p>
          </GlassCard>
        ) : null}

        {(data?.assemblies ?? []).map((assembly) => (
          <GlassCard key={assembly.id} className="rounded-[1.35rem] p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-[1rem] font-semibold text-[var(--app-heading)]">
                  {assembly.title}
                </p>
                <p className="mt-2 text-[0.92rem] text-[var(--app-muted)]">
                  {assembly.dateLabel} • {assembly.location}
                </p>
                <p className="mt-3 text-[0.95rem] leading-6 text-[var(--app-muted)]">
                  {assembly.summary}
                </p>
              </div>
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[1rem] bg-[var(--app-surface-soft)] text-[var(--app-primary)]">
                <Icon name="description" className="text-[1.1rem]" />
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-[1rem] bg-[var(--app-surface-soft)] px-4 py-3 text-[0.9rem] text-[var(--app-muted)]">
                Tema principal
                <p className="mt-2 font-medium text-[var(--app-heading)]">{assembly.topic}</p>
              </div>
              <div className="rounded-[1rem] bg-[var(--app-surface-soft)] px-4 py-3 text-[0.9rem] text-[var(--app-muted)]">
                Participacion
                <p className="mt-2 font-medium text-[var(--app-heading)]">
                  Habilitada desde la app
                </p>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </ResidentShell>
  );
}

export default function ResidentAssembliesPage() {
  return (
    <RoleGate allow={["resident"]}>
      <ResidentAssembliesContent />
    </RoleGate>
  );
}
