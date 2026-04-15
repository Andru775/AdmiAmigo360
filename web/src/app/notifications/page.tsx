import Link from "next/link";

import { AppScreen } from "@/components/app/AppScreen";
import { GlassCard } from "@/components/app/GlassCard";
import { HeaderBar } from "@/components/app/HeaderBar";
import { Icon } from "@/components/app/Icon";
import { RoleGate } from "@/components/app/RoleGate";
import { adminNotifications } from "@/data/demoDb";

function NotificationsContent() {
  return (
    <AppScreen
      currentNav="dashboard"
      header={
        <HeaderBar
          title="Notificaciones"
          subtitle="Alertas operativas, validaciones bancarias y seguimientos del día."
          icon="notifications"
          action={
            <Link
              href="/dashboard"
              className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-200"
            >
              <Icon name="arrow_back" />
            </Link>
          }
        />
      }
    >
      <div className="space-y-3">
        {adminNotifications.map((notification) => (
          <GlassCard key={notification.id} className="rounded-[1.25rem] border-white/10 bg-[#7A6358] p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[0.95rem] bg-[#41332D] text-[#C5A059]">
                <Icon name={notification.icon} className="text-[1.1rem]" />
              </div>
              <div className="min-w-0">
                <p className="text-[0.98rem] font-semibold text-white">{notification.title}</p>
                <p className="mt-2 text-[0.9rem] leading-6 text-slate-400">{notification.note}</p>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </AppScreen>
  );
}

export default function NotificationsPage() {
  return (
    <RoleGate allow={["admin"]}>
      <NotificationsContent />
    </RoleGate>
  );
}
