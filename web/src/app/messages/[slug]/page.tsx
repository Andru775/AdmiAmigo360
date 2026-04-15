import Link from "next/link";
import { notFound } from "next/navigation";

import { AppScreen } from "@/components/app/AppScreen";
import { GlassCard } from "@/components/app/GlassCard";
import { HeaderBar } from "@/components/app/HeaderBar";
import { Icon } from "@/components/app/Icon";
import { RoleGate } from "@/components/app/RoleGate";
import { getResidentBySlug, getResidentThreadBySlug, residents } from "@/data/demoDb";

type MessagePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return residents.map((resident) => ({ slug: resident.slug }));
}

function MessageContent({ slug }: { slug: string }) {
  const resident = getResidentBySlug(slug);
  const thread = getResidentThreadBySlug(slug);

  if (!resident || !thread) {
    notFound();
  }

  return (
    <AppScreen
      currentNav="residents"
      header={
        <HeaderBar
          title={`Mensajes con ${resident.name}`}
          subtitle={`Canal demo para ${resident.unitLabel}.`}
          icon="chat"
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
          <div className="space-y-4">
            <div className="flex justify-start">
              <div className="max-w-[85%] rounded-[1rem] rounded-bl-[0.35rem] bg-[var(--app-surface)] px-4 py-3">
                <p className="text-[0.8rem] font-semibold uppercase tracking-[0.12em] text-slate-400">
                  Residente
                </p>
                <p className="mt-2 text-[0.95rem] leading-6 text-slate-200">{thread.residentLine}</p>
              </div>
            </div>

            <div className="flex justify-end">
              <div className="max-w-[85%] rounded-[1rem] rounded-br-[0.35rem] bg-[#5D4037] px-4 py-3 text-white">
                <p className="text-[0.8rem] font-semibold uppercase tracking-[0.12em] text-white/70">
                  Admin
                </p>
                <p className="mt-2 text-[0.95rem] leading-6">{thread.adminLine}</p>
              </div>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="rounded-[1.3rem] border-white/10 bg-[#7A6358] p-5">
          <p className="text-[0.92rem] text-slate-400">
            Atajos del flujo demo
          </p>
          <div className="mt-4 grid grid-cols-1 gap-3">
            <Link
              href={`/residents/${resident.slug}`}
              className="flex h-12 items-center justify-center rounded-[1rem] border border-white/10 bg-[var(--app-surface)] text-[0.95rem] font-semibold text-slate-200"
            >
              Ver ficha del residente
            </Link>
            <Link
              href={`/payments/register?resident=${resident.slug}`}
              className="flex h-12 items-center justify-center rounded-[1rem] bg-[#5D4037] text-[0.95rem] font-semibold text-white"
            >
              Registrar acuerdo o pago
            </Link>
          </div>
        </GlassCard>
      </div>
    </AppScreen>
  );
}

export default async function MessagePage({ params }: MessagePageProps) {
  const { slug } = await params;

  return (
    <RoleGate allow={["admin"]}>
      <MessageContent slug={slug} />
    </RoleGate>
  );
}
