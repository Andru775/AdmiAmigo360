"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { GlassCard } from "@/components/app/GlassCard";
import { Icon } from "@/components/app/Icon";
import { ResidentShell } from "@/components/app/ResidentShell";
import { RoleGate } from "@/components/app/RoleGate";
import { SceneArt } from "@/components/app/SceneArt";
import { fetchResidentPortalData, type ResidentPortalData } from "@/lib/app-data";
import { useDemoSession } from "@/lib/useDemoSession";

function ResidentHomeContent() {
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

  if (!resident) {
    return (
      <ResidentShell
        title="Portal residente"
        subtitle="Estamos cargando tu información del conjunto."
        activeTab="home"
      >
        <GlassCard className="rounded-[1.6rem] p-6">
          <p className="text-[0.95rem] text-[var(--app-muted)]">Cargando información...</p>
        </GlassCard>
      </ResidentShell>
    );
  }

  return (
    <ResidentShell
      title={`Hola, ${resident.name.split(" ")[0]}`}
      subtitle={`${resident.unitLabel} • ${resident.status === "paid" ? "Tu cuenta está al día" : "Tienes acciones pendientes"}`}
      activeTab="home"
    >
      <div className="space-y-5">
        <GlassCard className="overflow-hidden rounded-[2rem] p-4">
          <div className="app-figure overflow-hidden rounded-[1.6rem] border">
            <SceneArt variant="assembly" className="h-[11.5rem] w-full" />
          </div>

          <div className="mt-5 flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="app-kicker">Resumen residente</p>
              <h2 className="app-display mt-2 text-[1.55rem] font-[680] leading-[1.04] text-[var(--app-heading)]">
                Tu vivienda
              </h2>
            </div>

            <div className="rounded-[1.1rem] border border-[var(--app-card-border)] bg-[var(--app-surface-soft)] px-3 py-2 text-right">
              <p className="text-[0.66rem] uppercase tracking-[0.14em] text-[var(--app-muted)]">
                Unidad
              </p>
              <p className="mt-1 text-[1rem] font-semibold text-[var(--app-heading)]">
                {resident.unitCode}
              </p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-[1.2rem] border border-[var(--app-card-border)] bg-[var(--app-surface-soft)] px-4 py-4">
              <p className="text-[0.66rem] uppercase tracking-[0.14em] text-[var(--app-muted)]">
                Saldo actual
              </p>
              <p className="mt-2 text-[1.7rem] font-semibold text-[var(--app-heading)]">
                ${resident.balance.toFixed(2)}
              </p>
            </div>
            <div className="rounded-[1.2rem] border border-[var(--app-card-border)] bg-[var(--app-surface-soft)] px-4 py-4">
              <p className="text-[0.66rem] uppercase tracking-[0.14em] text-[var(--app-muted)]">
                Estado
              </p>
              <p
                className={`mt-2 text-[1rem] font-semibold ${
                  resident.status === "paid"
                    ? "text-[var(--app-success)]"
                    : resident.status === "overdue"
                      ? "text-[var(--app-danger)]"
                      : "text-[#9E7B42]"
                }`}
              >
                {resident.status === "paid"
                  ? "Sin novedades"
                  : resident.status === "overdue"
                    ? "Pendiente por revisar"
                    : "Pendiente"}
              </p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <Link
              href="/resident/payments"
              className="app-button-primary flex h-12 items-center justify-center gap-2 rounded-[1rem] text-[0.95rem] font-semibold"
            >
              <Icon name="payments" className="text-[1rem]" />
              Ver pagos
            </Link>
            <Link
              href="/resident/assemblies"
              className="app-button-secondary flex h-12 items-center justify-center gap-2 rounded-[1rem] text-[0.95rem] font-semibold"
            >
              <Icon name="description" className="text-[1rem]" />
              Asambleas
            </Link>
          </div>
        </GlassCard>

        <section>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="app-kicker">Avisos comunitarios</p>
              <h2 className="app-display mt-2 text-[1.3rem] font-[680] text-[var(--app-heading)]">
                Anuncios
              </h2>
            </div>
            <Link href="/resident/notifications" className="text-[0.88rem] font-semibold text-[var(--app-primary)]">
              Ver todo
            </Link>
          </div>

          <div className="app-horizontal no-scrollbar flex gap-3 overflow-x-auto pb-1">
            {(data?.announcements ?? []).map((announcement) => {
              const toneClass =
                announcement.tone === "gold"
                  ? "bg-[#FAF2E5] text-[#9E7B42]"
                  : announcement.tone === "teal"
                    ? "bg-[var(--app-success-bg)] text-[var(--app-success)]"
                    : "bg-[var(--app-primary-soft)] text-[var(--app-primary)]";

              return (
                <GlassCard key={announcement.id} className="min-w-[16rem] shrink-0 rounded-[1.4rem] p-4">
                  <div className={`inline-flex rounded-full px-3 py-1 text-[0.72rem] font-semibold ${toneClass}`}>
                    Comunidad
                  </div>
                  <p className="mt-4 text-[1rem] font-semibold text-[var(--app-heading)]">
                    {announcement.title}
                  </p>
                  <p className="mt-2 text-[0.9rem] leading-6 text-[var(--app-muted)]">
                    {announcement.note}
                  </p>
                </GlassCard>
              );
            })}
          </div>
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="app-kicker">Asambleas</p>
              <h2 className="app-display mt-2 text-[1.3rem] font-[680] text-[var(--app-heading)]">
                Próximas asambleas
              </h2>
            </div>
            <Link href="/resident/assemblies" className="text-[0.88rem] font-semibold text-[var(--app-primary)]">
              Abrir módulo
            </Link>
          </div>

          <div className="space-y-3">
            {(data?.assemblies ?? []).slice(0, 2).map((assembly) => (
              <GlassCard key={assembly.id} className="rounded-[1.4rem] p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-[1rem] bg-[var(--app-surface)] text-[var(--app-primary)]">
                    <Icon name="description" className="text-[1rem]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[1rem] font-semibold text-[var(--app-heading)]">
                      {assembly.title}
                    </p>
                    <p className="mt-1 text-[0.86rem] text-[var(--app-muted)]">
                      {assembly.dateLabel} • {assembly.location}
                    </p>
                    <p className="mt-2 text-[0.9rem] leading-6 text-[var(--app-muted)]">
                      {assembly.topic}
                    </p>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="app-kicker">Reservas y cartera</p>
              <h2 className="app-display mt-2 text-[1.3rem] font-[680] text-[var(--app-heading)]">
                Reservas y pagos
              </h2>
            </div>
            <Link href="/resident/reservations" className="text-[0.88rem] font-semibold text-[var(--app-primary)]">
              Gestionar
            </Link>
          </div>

          <div className="space-y-3">
            {(data?.reservations ?? []).slice(0, 2).map((reservation) => (
              <GlassCard key={reservation.id} className="rounded-[1.4rem] p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[1rem] font-semibold text-[var(--app-heading)]">
                      {reservation.amenity.title}
                    </p>
                    <p className="mt-1 text-[0.86rem] text-[var(--app-muted)]">
                      {reservation.dateLabel} • {reservation.timeLabel}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-[0.72rem] font-semibold ${
                      reservation.status === "confirmed"
                        ? "bg-[var(--app-success-bg)] text-[var(--app-success)]"
                        : "bg-[#FAF2E5] text-[#9E7B42]"
                    }`}
                  >
                    {reservation.status === "confirmed" ? "Confirmada" : "Pendiente"}
                  </span>
                </div>
              </GlassCard>
            ))}

            {(data?.ledger ?? []).slice(0, 2).map((item) => (
              <GlassCard key={item.id} className="rounded-[1.4rem] p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[1rem] font-semibold text-[var(--app-heading)]">
                      {item.title}
                    </p>
                    <p className="mt-1 text-[0.86rem] text-[var(--app-muted)]">{item.dateLabel}</p>
                  </div>
                  <p
                    className={`text-[0.98rem] font-semibold ${
                      item.status === "paid" ? "text-[var(--app-success)]" : "text-[#9E7B42]"
                    }`}
                  >
                    {item.amountLabel}
                  </p>
                </div>
              </GlassCard>
            ))}
          </div>
        </section>
      </div>
    </ResidentShell>
  );
}

export default function ResidentHomePage() {
  return (
    <RoleGate allow={["resident"]}>
      <ResidentHomeContent />
    </RoleGate>
  );
}
