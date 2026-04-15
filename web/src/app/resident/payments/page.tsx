"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { ResidentShell } from "@/components/app/ResidentShell";
import { RoleGate } from "@/components/app/RoleGate";
import { GlassCard } from "@/components/app/GlassCard";
import { Icon } from "@/components/app/Icon";
import { SceneArt } from "@/components/app/SceneArt";
import { fetchResidentPortalData, type ResidentPortalData } from "@/lib/app-data";
import { useDemoSession } from "@/lib/useDemoSession";

function ResidentPaymentsContent() {
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
        title="Pagos"
        subtitle="Estamos preparando tu estado de cuenta."
        activeTab="payments"
      >
        <GlassCard className="rounded-[1.5rem] p-6">
          <p className="text-[0.95rem] text-[var(--app-muted)]">Cargando movimientos...</p>
        </GlassCard>
      </ResidentShell>
    );
  }

  return (
    <ResidentShell
      title="Pagos"
      subtitle="Estado de cuenta, historial y acciones sobre tu cartera."
      activeTab="payments"
    >
      <div className="space-y-5">
        <GlassCard className="overflow-hidden rounded-[2rem] p-4">
          <div className="app-figure overflow-hidden rounded-[1.6rem] border">
            <SceneArt variant="finance" className="h-[11rem] w-full" />
          </div>

          <div className="mt-5">
            <p className="app-kicker">Account Status</p>
            <h2 className="app-display mt-2 text-[1.7rem] font-[680] leading-[1.02] text-[var(--app-heading)]">
              Saldo claro y acciones concretas
            </h2>
            <p className="mt-3 text-[0.94rem] leading-6 text-[var(--app-muted)]">
              Consulta tu estado de cuenta y toma acción sin entrar en modulos que no te
              corresponden como residente.
            </p>
          </div>

          <div className="mt-5 rounded-[1.4rem] border border-[var(--app-card-border)] bg-[var(--app-surface-soft)] p-4">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--app-muted)]">
              Saldo total
            </p>
            <div className="mt-3 flex items-center justify-between gap-4">
              <p className="text-[2.2rem] font-semibold text-[var(--app-heading)]">
                ${resident.balance.toFixed(2)}
              </p>
              <div className="flex h-12 w-12 items-center justify-center rounded-[1rem] bg-white text-[var(--app-primary)]">
                <Icon name="payments" className="text-[1.15rem]" />
              </div>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <Link
              href="/resident/payments/pay"
              className="app-button-primary flex h-12 items-center justify-center rounded-[1rem] text-[0.95rem] font-semibold"
            >
              Pagar ahora
            </Link>
            <Link
              href="/resident/payments/agreement"
              className="app-button-secondary flex h-12 items-center justify-center rounded-[1rem] text-[0.95rem] font-semibold"
            >
              Solicitar acuerdo
            </Link>
          </div>
        </GlassCard>

        <section className="space-y-3">
          <div>
            <p className="app-kicker">Movement Ledger</p>
            <h2 className="app-display mt-2 text-[1.3rem] font-[680] text-[var(--app-heading)]">
              Movimientos
            </h2>
          </div>

          {(data?.ledger ?? []).map((item) => (
            <GlassCard key={item.id} className="rounded-[1.35rem] p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-[1rem] font-semibold text-[var(--app-heading)]">{item.title}</p>
                  <p className="mt-1 text-[0.9rem] text-[var(--app-muted)]">{item.dateLabel}</p>
                  <p className="mt-3 text-[0.92rem] leading-6 text-[var(--app-muted)]">{item.note}</p>
                </div>
                <div className="text-right">
                  <p
                    className={`text-[1rem] font-semibold ${
                      item.status === "paid" ? "text-[var(--app-success)]" : "text-[#9E7B42]"
                    }`}
                  >
                    {item.amountLabel}
                  </p>
                  <div className="mt-3 flex items-center justify-end gap-2 text-[0.8rem] text-[var(--app-muted)]">
                    <Icon
                      name={item.status === "paid" ? "check_circle" : "crisis_alert"}
                      className="text-[0.95rem]"
                    />
                    {item.status === "paid" ? "Pagado" : "Pendiente"}
                  </div>
                </div>
              </div>
            </GlassCard>
          ))}
        </section>
      </div>
    </ResidentShell>
  );
}

export default function ResidentPaymentsPage() {
  return (
    <RoleGate allow={["resident"]}>
      <ResidentPaymentsContent />
    </RoleGate>
  );
}
