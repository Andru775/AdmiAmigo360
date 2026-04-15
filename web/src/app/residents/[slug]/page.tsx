import Link from "next/link";
import { notFound } from "next/navigation";

import { AppScreen } from "@/components/app/AppScreen";
import { GlassCard } from "@/components/app/GlassCard";
import { HeaderBar } from "@/components/app/HeaderBar";
import { Icon } from "@/components/app/Icon";
import { RoleGate } from "@/components/app/RoleGate";
import { getResidentBySlug, residentTimelineBySlug, residents } from "@/data/demoDb";

type ResidentDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return residents.map((resident) => ({ slug: resident.slug }));
}

function ResidentDetailContent({ slug }: { slug: string }) {
  const resident = getResidentBySlug(slug);

  if (!resident) {
    notFound();
  }

  const timeline = residentTimelineBySlug[resident.slug] ?? [];

  return (
    <AppScreen
      currentNav="residents"
      header={
        <HeaderBar
          title={resident.name}
          subtitle={resident.summary}
          icon="person"
          action={
            <Link
              href="/residents"
              className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-[var(--app-surface)] text-slate-200"
            >
              <Icon name="arrow_back" />
            </Link>
          }
        />
      }
    >
      <div className="space-y-4">
        <GlassCard className="rounded-[1.3rem] border-white/10 bg-[#7A6358] p-5">
          <div className="grid grid-cols-1 gap-3">
            <div className="rounded-[1rem] bg-black/20 px-4 py-4 text-[0.92rem] leading-6 text-slate-300">
              Unidad: <span className="font-semibold text-white">{resident.unitLabel}</span>
            </div>
            <div className="rounded-[1rem] bg-black/20 px-4 py-4 text-[0.92rem] leading-6 text-slate-300">
              Rol: <span className="font-semibold text-white">{resident.residentType}</span>
            </div>
            <div className="rounded-[1rem] bg-black/20 px-4 py-4 text-[0.92rem] leading-6 text-slate-300">
              Correo: <span className="break-all font-semibold text-white">{resident.email}</span>
            </div>
            <div className="rounded-[1rem] bg-black/20 px-4 py-4 text-[0.92rem] leading-6 text-slate-300">
              Saldo:{" "}
              <span className={`font-semibold ${resident.balance > 0 ? "text-[#DAB36A]" : "text-white"}`}>
                ${resident.balance.toFixed(2)}
              </span>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="rounded-[1.3rem] border-white/10 bg-[#7A6358] p-5">
          <p className="text-[1rem] font-semibold text-white">Timeline</p>
          <div className="mt-4 space-y-3">
            {timeline.map((item) => (
              <div key={item} className="flex items-start gap-3 rounded-[1rem] bg-black/20 px-4 py-3">
                <Icon name="schedule" className="mt-0.5 shrink-0 text-[#C5A059]" />
                <p className="text-[0.92rem] leading-6 text-slate-300">{item}</p>
              </div>
            ))}
          </div>
        </GlassCard>

        <div className="grid grid-cols-1 gap-3">
          <Link
            href={`/messages/${resident.slug}`}
            className="flex h-12 items-center justify-center rounded-[1rem] bg-[#5D4037] text-[0.95rem] font-semibold text-white"
          >
            Abrir mensajes
          </Link>
          <Link
            href={`/payments/register?resident=${resident.slug}`}
            className="flex h-12 items-center justify-center rounded-[1rem] border border-white/10 bg-[var(--app-surface)] text-[0.95rem] font-semibold text-slate-200"
          >
            Registrar pago demo
          </Link>
        </div>
      </div>
    </AppScreen>
  );
}

export default async function ResidentDetailPage({ params }: ResidentDetailPageProps) {
  const { slug } = await params;

  return (
    <RoleGate allow={["admin"]}>
      <ResidentDetailContent slug={slug} />
    </RoleGate>
  );
}
