"use client";

import { ResidentShell } from "@/components/app/ResidentShell";
import { RoleGate } from "@/components/app/RoleGate";
import { GlassCard } from "@/components/app/GlassCard";
import { Icon } from "@/components/app/Icon";
import { residentNotifications } from "@/data/demoDb";

function ResidentNotificationsContent() {
  return (
    <ResidentShell
      title="Notificaciones"
      subtitle="Novedades relevantes para tu unidad y tu cuenta."
      activeTab="home"
      actionHref="/resident"
      actionIcon="arrow_back"
    >
      <div className="space-y-3">
        {residentNotifications.map((item) => (
          <GlassCard key={item.id} className="rounded-[1.2rem] border-white/8 bg-[#7E695F] p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-[0.95rem] bg-[#473730] text-[#C5A059]">
                <Icon name={item.icon} className="text-[1.1rem]" />
              </div>
              <div>
                <p className="text-[1rem] font-semibold text-white">{item.title}</p>
                <p className="mt-2 text-[0.92rem] leading-6 text-slate-400">{item.note}</p>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </ResidentShell>
  );
}

export default function ResidentNotificationsPage() {
  return (
    <RoleGate allow={["resident"]}>
      <ResidentNotificationsContent />
    </RoleGate>
  );
}
