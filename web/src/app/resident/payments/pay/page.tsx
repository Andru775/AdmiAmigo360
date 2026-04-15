"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { ResidentShell } from "@/components/app/ResidentShell";
import { RoleGate } from "@/components/app/RoleGate";
import { GlassCard } from "@/components/app/GlassCard";
import { Icon } from "@/components/app/Icon";
import { fetchResidentPortalData, type ResidentPortalData } from "@/lib/app-data";
import { useDemoSession } from "@/lib/useDemoSession";

function ResidentPayNowContent() {
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
      title="Pagar administración"
      subtitle="Selecciona un método para completar el pago."
      activeTab="payments"
      actionHref="/resident/payments"
      actionIcon="arrow_back"
    >
      {!resident ? (
        <GlassCard className="rounded-[1.4rem] p-5">
          <p className="text-[0.95rem] text-[var(--app-muted)]">Preparando pasarela...</p>
        </GlassCard>
      ) : (
        <div className="space-y-4">
          <GlassCard className="rounded-[1.3rem] p-5">
            <p className="text-[0.82rem] uppercase tracking-[0.18em] text-[var(--app-muted)]">
              Saldo a cubrir
            </p>
            <p className="mt-2 text-[2rem] font-semibold text-[var(--app-heading)]">
              ${resident.balance.toFixed(2)}
            </p>
            <p className="mt-2 text-[0.92rem] text-[var(--app-muted)]">
              Flujo preparado para PSE, transferencia o recaudo presencial.
            </p>
          </GlassCard>

          <div className="space-y-3">
            {["PSE inmediato", "Transferencia bancaria", "Pago en recepción"].map((option) => (
              <Link
                key={option}
                href="/resident/payments"
                className="app-button-secondary flex items-center justify-between rounded-[1.1rem] px-4 py-4"
              >
                <span className="text-[0.95rem] font-semibold text-[var(--app-heading)]">
                  {option}
                </span>
                <Icon name="arrow_forward_ios" className="text-[0.9rem] text-[var(--app-muted)]" />
              </Link>
            ))}
          </div>
        </div>
      )}
    </ResidentShell>
  );
}

export default function ResidentPayNowPage() {
  return (
    <RoleGate allow={["resident"]}>
      <ResidentPayNowContent />
    </RoleGate>
  );
}
