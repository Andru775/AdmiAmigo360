"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { ResidentShell } from "@/components/app/ResidentShell";
import { RoleGate } from "@/components/app/RoleGate";
import { GlassCard } from "@/components/app/GlassCard";
import { Icon } from "@/components/app/Icon";
import { fetchResidentPortalData, type ResidentPortalData } from "@/lib/app-data";
import { useDemoSession } from "@/lib/useDemoSession";

function ResidentReservationsContent() {
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
      title="Reservas"
      subtitle="Espacios comunes, solicitudes activas y disponibilidad."
      activeTab="reservations"
    >
      <div className="space-y-5">
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-[1rem] font-semibold text-[var(--app-heading)]">Amenidades</h2>
            <Link
              href="/support"
              className="text-[0.92rem] font-medium text-[var(--app-primary)]"
            >
              Solicitar soporte
            </Link>
          </div>

          {!data ? (
            <GlassCard className="rounded-[1.3rem] p-5">
              <p className="text-[0.95rem] text-[var(--app-muted)]">Cargando amenidades...</p>
            </GlassCard>
          ) : (
            <div className="app-horizontal no-scrollbar flex gap-3 overflow-x-auto pb-1">
              {(data.amenities ?? []).map((amenity) => {
                const toneClass =
                  amenity.color === "gold"
                    ? "bg-[#FAF2E5] text-[#9E7B42]"
                    : amenity.color === "teal"
                      ? "bg-[var(--app-success-bg)] text-[var(--app-success)]"
                      : "bg-[var(--app-primary-soft)] text-[var(--app-primary)]";

                return (
                  <GlassCard key={amenity.id} className="min-w-[15rem] shrink-0 rounded-[1.2rem] p-4">
                    <div className={`flex h-11 w-11 items-center justify-center rounded-[1rem] ${toneClass}`}>
                      <Icon name={amenity.icon} className="text-[1.1rem]" />
                    </div>
                    <p className="mt-4 text-[1rem] font-semibold text-[var(--app-heading)]">
                      {amenity.title}
                    </p>
                    <p className="mt-2 text-[0.92rem] leading-6 text-[var(--app-muted)]">
                      {amenity.description}
                    </p>
                    <p className="mt-3 text-[0.88rem] font-medium text-[var(--app-muted)]">
                      Proximo turno: {amenity.nextSlot}
                    </p>
                  </GlassCard>
                );
              })}
            </div>
          )}
        </section>

        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-[1rem] font-semibold text-[var(--app-heading)]">Tus reservas</h2>
            <Link
              href="/resident/reservations/request"
              className="app-button-primary rounded-full px-4 py-2 text-[0.9rem] font-semibold"
            >
              Nueva reserva
            </Link>
          </div>

          {!data ? (
            <GlassCard className="rounded-[1.3rem] p-5">
              <p className="text-[0.95rem] text-[var(--app-muted)]">Cargando reservas...</p>
            </GlassCard>
          ) : null}

          {data && data.reservations.length === 0 ? (
            <GlassCard className="rounded-[1.3rem] p-5">
              <p className="text-[0.95rem] text-[var(--app-muted)]">
                Aún no tienes reservas registradas.
              </p>
            </GlassCard>
          ) : null}

          {(data?.reservations ?? []).map((reservation) => (
            <GlassCard key={reservation.id} className="rounded-[1.2rem] p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-[1rem] font-semibold text-[var(--app-heading)]">
                    {reservation.amenity.title}
                  </p>
                  <p className="mt-2 text-[0.92rem] text-[var(--app-muted)]">
                    {reservation.dateLabel}
                  </p>
                  <p className="mt-1 text-[0.92rem] text-[var(--app-muted)]">
                    {reservation.timeLabel}
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-[0.75rem] font-semibold ${
                    reservation.status === "confirmed"
                      ? "bg-[var(--app-success-bg)] text-[var(--app-success)]"
                      : "bg-[#FAF2E5] text-[#9E7B42]"
                  }`}
                >
                  {reservation.status === "confirmed" ? "CONFIRMADA" : "PENDIENTE"}
                </span>
              </div>
            </GlassCard>
          ))}
        </section>
      </div>
    </ResidentShell>
  );
}

export default function ResidentReservationsPage() {
  return (
    <RoleGate allow={["resident"]}>
      <ResidentReservationsContent />
    </RoleGate>
  );
}
