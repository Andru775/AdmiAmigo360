import Link from "next/link";

import { AppScreen } from "@/components/app/AppScreen";
import { GlassCard } from "@/components/app/GlassCard";
import { HeaderBar } from "@/components/app/HeaderBar";
import { Icon } from "@/components/app/Icon";
import { RoleGate } from "@/components/app/RoleGate";
import { adminExportActions, adminReportCards, adminSummary } from "@/data/demoDb";

function ReportsContent() {
  return (
    <AppScreen
      currentNav="reports"
      header={
        <HeaderBar
          title="Reportes"
          subtitle="KPIs, cartera y salidas listas para comité o seguimiento operativo."
          icon="monitoring"
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
      <div className="space-y-5">
        <GlassCard className="rounded-[1.35rem] border-white/10 bg-[#7A6358] p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-slate-400">
                Cierre del mes
              </p>
              <p className="mt-2 text-[1.9rem] font-bold text-white">
                {adminSummary.monthlyCollectionFull}
              </p>
              <p className="mt-2 text-[0.92rem] text-slate-400">
                Recaudo proyectado frente a una meta de {adminSummary.targetLabel.replace("Meta: ", "")}.
              </p>
            </div>
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[1rem] bg-[#41332D] text-[#C5A059]">
              <Icon name="monitoring" className="text-[1.2rem]" />
            </div>
          </div>
        </GlassCard>

        <section className="grid grid-cols-1 gap-3">
          {adminReportCards.map((card) => (
            <GlassCard key={card.id} className="rounded-[1.25rem] border-white/10 bg-[#7A6358] p-4">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[0.95rem] bg-[#41332D] text-[#C5A059]">
                  <Icon name={card.icon} className="text-[1.1rem]" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[0.82rem] text-slate-400">{card.title}</p>
                  <p className="mt-1 text-[1.8rem] font-bold text-white">{card.value}</p>
                  <p className="mt-2 text-[0.9rem] leading-6 text-slate-400">{card.note}</p>
                </div>
              </div>
            </GlassCard>
          ))}
        </section>

        <GlassCard className="rounded-[1.35rem] border-white/10 bg-[#7A6358] p-5">
          <h2 className="text-[1rem] font-semibold text-white">Exportaciones disponibles</h2>
          <div className="mt-4 space-y-3">
            {adminExportActions.map((action) => (
              <Link
                key={action.id}
                href={action.href}
                className="flex items-center justify-between gap-4 rounded-[1rem] bg-black/20 px-4 py-4"
              >
                <div className="min-w-0">
                  <p className="text-[0.95rem] font-semibold text-white">{action.label}</p>
                  <p className="mt-1 text-[0.82rem] text-slate-400">{action.helper}</p>
                </div>
                <Icon name="arrow_forward_ios" className="shrink-0 text-[0.9rem] text-slate-500" />
              </Link>
            ))}
          </div>
        </GlassCard>
      </div>
    </AppScreen>
  );
}

export default function ReportsPage() {
  return (
    <RoleGate allow={["admin"]}>
      <ReportsContent />
    </RoleGate>
  );
}
