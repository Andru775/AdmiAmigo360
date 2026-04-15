import Link from "next/link";

import { AppScreen } from "@/components/app/AppScreen";
import { GlassCard } from "@/components/app/GlassCard";
import { HeaderBar } from "@/components/app/HeaderBar";
import { Icon } from "@/components/app/Icon";
import { RoleGate } from "@/components/app/RoleGate";
import { adminReminderCampaigns } from "@/data/demoDb";

function PaymentRemindersContent() {
  return (
    <AppScreen
      currentNav="payments"
      header={
        <HeaderBar
          title="Recordatorios"
          subtitle="Secuencias de cobro demo por email, push y seguimiento interno."
          icon="schedule_send"
          action={
            <Link
              href="/payments"
              className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-200"
            >
              <Icon name="arrow_back" />
            </Link>
          }
        />
      }
    >
      <div className="space-y-3">
        {adminReminderCampaigns.map((campaign) => (
          <Link key={campaign.id} href={campaign.href}>
            <GlassCard className="rounded-[1.25rem] border-white/10 bg-[#7A6358] p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-[0.98rem] font-semibold text-white">{campaign.title}</p>
                  <p className="mt-2 text-[0.9rem] leading-6 text-slate-400">{campaign.note}</p>
                  <p className="mt-3 text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-[#C5A059]">
                    {campaign.channel}
                  </p>
                </div>
                <Icon name="arrow_forward_ios" className="shrink-0 text-[0.9rem] text-slate-500" />
              </div>
            </GlassCard>
          </Link>
        ))}
      </div>
    </AppScreen>
  );
}

export default function PaymentRemindersPage() {
  return (
    <RoleGate allow={["admin"]}>
      <PaymentRemindersContent />
    </RoleGate>
  );
}
