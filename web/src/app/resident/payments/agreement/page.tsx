"use client";

import Link from "next/link";

import { ResidentShell } from "@/components/app/ResidentShell";
import { RoleGate } from "@/components/app/RoleGate";
import { GlassCard } from "@/components/app/GlassCard";
import { Icon } from "@/components/app/Icon";

function ResidentAgreementContent() {
  return (
    <ResidentShell
      title="Acuerdo de pago"
      subtitle="Ruta demo para dejar una solicitud formal a administración."
      activeTab="payments"
      actionHref="/resident/payments"
      actionIcon="arrow_back"
    >
      <div className="space-y-4">
        <GlassCard className="rounded-[1.3rem] border-white/8 bg-[#7E695F] p-5">
          <p className="text-[0.95rem] leading-6 text-slate-300">
            Puedes plantear un acuerdo en 2, 3 o 4 cuotas. La administración revisa la propuesta y responde por la app.
          </p>
        </GlassCard>

        {["Plan a 2 cuotas", "Plan a 3 cuotas", "Plan a 4 cuotas"].map((plan) => (
          <Link
            key={plan}
            href="/resident/payments"
            className="flex items-center justify-between rounded-[1.1rem] border border-white/10 bg-[#7E695F] px-4 py-4"
          >
            <span className="text-[0.95rem] font-semibold text-white">{plan}</span>
            <Icon name="arrow_forward_ios" className="text-[0.9rem] text-slate-500" />
          </Link>
        ))}
      </div>
    </ResidentShell>
  );
}

export default function ResidentAgreementPage() {
  return (
    <RoleGate allow={["resident"]}>
      <ResidentAgreementContent />
    </RoleGate>
  );
}
