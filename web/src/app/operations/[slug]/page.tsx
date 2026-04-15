import Link from "next/link";
import { notFound } from "next/navigation";

import { AppScreen } from "@/components/app/AppScreen";
import { GlassCard } from "@/components/app/GlassCard";
import { HeaderBar } from "@/components/app/HeaderBar";
import { Icon } from "@/components/app/Icon";
import { RoleGate } from "@/components/app/RoleGate";
import { adminOperationDetails } from "@/data/demoDb";

type OperationPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return adminOperationDetails.map((item) => ({ slug: item.slug }));
}

function OperationContent({ slug }: { slug: string }) {
  const operation = adminOperationDetails.find((item) => item.slug === slug);

  if (!operation) {
    notFound();
  }

  return (
    <AppScreen
      currentNav="dashboard"
      header={
        <HeaderBar
          title={operation.title}
          subtitle={operation.summary}
          icon="list_alt"
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
      <div className="space-y-4">
        <GlassCard className="rounded-[1.3rem] border-white/10 bg-[#7A6358] p-5">
          <p className="text-[0.72rem] uppercase tracking-[0.18em] text-slate-400">Frente actual</p>
          <p className="mt-2 text-[1.5rem] font-semibold text-white">{operation.headline}</p>
        </GlassCard>

        <GlassCard className="rounded-[1.3rem] border-white/10 bg-[#7A6358] p-5">
          <p className="text-[1rem] font-semibold text-white">Checklist</p>
          <div className="mt-4 space-y-3">
            {operation.checklist.map((item) => (
              <div key={item} className="flex items-start gap-3 rounded-[1rem] bg-black/20 px-4 py-3">
                <Icon name="check_circle" className="mt-0.5 shrink-0 text-[1rem] text-emerald-300" />
                <p className="text-[0.92rem] leading-6 text-slate-300">{item}</p>
              </div>
            ))}
          </div>
        </GlassCard>

        <div className="grid grid-cols-1 gap-3">
          <Link
            href={operation.primaryAction.href}
            className="flex h-12 items-center justify-center rounded-[1rem] bg-[#5D4037] text-[0.95rem] font-semibold text-white"
          >
            {operation.primaryAction.label}
          </Link>
          <Link
            href={operation.secondaryAction.href}
            className="flex h-12 items-center justify-center rounded-[1rem] border border-white/10 bg-white/[0.04] text-[0.95rem] font-semibold text-slate-200"
          >
            {operation.secondaryAction.label}
          </Link>
        </div>
      </div>
    </AppScreen>
  );
}

export default async function OperationPage({ params }: OperationPageProps) {
  const { slug } = await params;

  return (
    <RoleGate allow={["admin"]}>
      <OperationContent slug={slug} />
    </RoleGate>
  );
}
