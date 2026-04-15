"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { AppViewport } from "@/components/app/AppViewport";
import { GlassCard } from "@/components/app/GlassCard";
import { Icon } from "@/components/app/Icon";
import { RoleGate } from "@/components/app/RoleGate";
import { SceneArt } from "@/components/app/SceneArt";
import { StitchTabBar } from "@/components/app/StitchTabBar";
import { adminBarSeries, adminQuickActions, adminTasks, adminSummary } from "@/data/demoDb";
import { fetchPaymentsOverview, summarizeMonthlyCollection, type PaymentsOverview } from "@/lib/app-data";

function DashboardContent() {
  const [overview, setOverview] = useState<PaymentsOverview | null>(null);

  useEffect(() => {
    let active = true;

    void fetchPaymentsOverview().then((result) => {
      if (active) {
        setOverview(result);
      }
    });

    return () => {
      active = false;
    };
  }, []);

  const summary = useMemo(() => {
    if (!overview) {
      return {
        monthlyCollection: adminSummary.monthlyCollectionLabel,
        activeUnits: adminSummary.occupancyLabel,
        overdueCount: "2 alertas",
        paidCount: "2 al día",
      };
    }

    const overdue = overview.residents.filter((resident) => resident.status === "overdue").length;
    const paid = overview.residents.filter((resident) => resident.status === "paid").length;

    return {
      monthlyCollection: summarizeMonthlyCollection(overview.monthlyCollectionFull),
      activeUnits: `${overview.residents.length} unidades`,
      overdueCount: `${overdue} alertas`,
      paidCount: `${paid} al día`,
    };
  }, [overview]);

  return (
    <AppViewport>
      <div className="flex min-h-0 flex-1 flex-col">
        <header className="border-b border-[var(--app-card-border)] bg-[rgba(253,251,248,0.96)] px-5 pb-5 pt-6">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="app-kicker">AdmiAmigo 360</p>
              <h1 className="app-display mt-2 text-[1.95rem] font-[680] leading-none text-[var(--app-heading)]">
                Panel principal
              </h1>
              <p className="mt-3 max-w-[18rem] text-[0.95rem] leading-6 text-[var(--app-muted)]">
                Resumen ejecutivo del conjunto con cartera, residentes activos y seguimientos
                prioritarios.
              </p>
            </div>

            <Link
              href="/notifications"
              className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-[1.15rem] border border-[var(--app-card-border)] bg-white text-[var(--app-heading)] shadow-[0_10px_22px_rgba(93,64,55,0.06)]"
            >
              <Icon name="notifications" className="text-[1.2rem]" />
              <span className="absolute right-2.5 top-2.5 h-2.5 w-2.5 rounded-full bg-[var(--app-secondary)]" />
            </Link>
          </div>
        </header>

        <main className="app-scroll flex-1 overflow-y-auto px-4 pb-24 pt-6">
          <GlassCard className="overflow-hidden rounded-[2rem] p-4">
            <div className="app-figure overflow-hidden rounded-[1.6rem] border">
              <SceneArt variant="estate" className="h-[12rem] w-full" />
            </div>

            <div className="mt-5">
              <p className="app-kicker">Resumen ejecutivo</p>
              <h2 className="app-display mt-2 text-[1.85rem] font-[680] leading-[1.02] text-[var(--app-heading)]">
                Administración residencial con lectura clara y elegante
              </h2>
              <p className="mt-3 text-[0.94rem] leading-6 text-[var(--app-muted)]">
                Todo el panorama del conjunto en una sola pantalla mobile-first, con foco en
                recaudo, ocupación y acciones reales del día.
              </p>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-[1.35rem] border border-[var(--app-card-border)] bg-[var(--app-surface-soft)] p-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[0.74rem] font-semibold uppercase tracking-[0.16em] text-[var(--app-muted)]">
                    Recaudo
                  </span>
                  <span className="rounded-full bg-[var(--app-success-bg)] px-2.5 py-1 text-[0.72rem] font-semibold text-[var(--app-success)]">
                    +12%
                  </span>
                </div>
                <p className="mt-4 text-[1.9rem] font-semibold tracking-tight text-[var(--app-heading)]">
                  {summary.monthlyCollection}
                </p>
                <p className="mt-2 text-[0.85rem] text-[var(--app-muted)]">
                  Consolidado del mes actual.
                </p>
              </div>

              <div className="rounded-[1.35rem] border border-[var(--app-card-border)] bg-[var(--app-surface-soft)] p-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[0.74rem] font-semibold uppercase tracking-[0.16em] text-[var(--app-muted)]">
                    Ocupación
                  </span>
                  <span className="rounded-full bg-white px-2.5 py-1 text-[0.72rem] font-semibold text-[var(--app-primary)]">
                    {summary.paidCount}
                  </span>
                </div>
                <p className="mt-4 text-[1.9rem] font-semibold tracking-tight text-[var(--app-heading)]">
                  {summary.activeUnits}
                </p>
                <p className="mt-2 text-[0.85rem] text-[var(--app-muted)]">
                  Directorio activo del conjunto.
                </p>
              </div>
            </div>

            <div className="app-horizontal no-scrollbar mt-5 flex gap-2 overflow-x-auto pb-1">
              <div className="shrink-0 rounded-full border border-[var(--app-card-border)] bg-white px-4 py-2 text-[0.78rem] font-semibold text-[var(--app-heading)]">
                {summary.overdueCount} requieren seguimiento
              </div>
              <div className="shrink-0 rounded-full border border-[var(--app-card-border)] bg-white px-4 py-2 text-[0.78rem] font-semibold text-[var(--app-heading)]">
                {summary.activeUnits} con lectura en tiempo real
              </div>
              <div className="shrink-0 rounded-full border border-[var(--app-card-border)] bg-white px-4 py-2 text-[0.78rem] font-semibold text-[var(--app-heading)]">
                Navegación optimizada para celular
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <Link
                href="/payments/register"
                className="app-button-primary flex h-[3.8rem] items-center justify-center gap-2 rounded-[1rem] px-4 text-[0.95rem] font-semibold"
              >
                <Icon name="add_card" className="text-[1rem]" />
                Registrar pago
              </Link>
              <Link
                href="/residents/new"
                className="app-button-secondary flex h-[3.8rem] items-center justify-center gap-2 rounded-[1rem] px-4 text-[0.95rem] font-semibold"
              >
                <Icon name="person_add" className="text-[1rem]" />
                Nuevo residente
              </Link>
            </div>
          </GlassCard>

          <GlassCard className="mt-5 rounded-[2rem] p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="app-kicker">Ritmo financiero</p>
                <h3 className="app-display mt-2 text-[1.55rem] font-[680] text-[var(--app-heading)]">
                  Curva de recaudo
                </h3>
                <p className="mt-2 text-[0.9rem] leading-6 text-[var(--app-muted)]">
                  Lectura compacta del comportamiento financiero del semestre.
                </p>
              </div>
              <div className="app-figure overflow-hidden rounded-[1.25rem] border p-2">
                <SceneArt variant="finance" className="h-[4.8rem] w-[5.8rem]" />
              </div>
            </div>

            <div className="mt-5 rounded-[1.5rem] border border-[var(--app-card-border)] bg-[var(--app-surface-soft)] p-4">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[var(--app-muted)]">
                    Yield actual
                  </p>
                  <p className="mt-2 text-[2rem] font-semibold text-[var(--app-heading)]">
                    {overview?.monthlyCollectionFull ?? adminSummary.financialYield}
                  </p>
                </div>
                <p className="text-right text-[0.82rem] font-semibold text-[var(--app-secondary)]">
                  {adminSummary.targetLabel}
                </p>
              </div>

              <div className="mt-6 flex h-36 items-end gap-2">
                {adminBarSeries.map((bar, index) => (
                  <div key={bar.month} className="flex flex-1 flex-col items-center gap-2">
                    <div className="flex h-full w-full items-end rounded-t-[1rem] bg-white/80 px-1">
                      <div
                        className={`w-full rounded-t-[0.95rem] ${
                          index === adminBarSeries.length - 1
                            ? "bg-[linear-gradient(180deg,#8a6a4a_0%,#4f382f_100%)]"
                            : "bg-[linear-gradient(180deg,#ead7c2_0%,#c8a98e_100%)]"
                        }`}
                        style={{ height: `${bar.value}%` }}
                      />
                    </div>
                    <span
                      className={`text-[0.68rem] font-semibold uppercase tracking-[0.12em] ${
                        index === adminBarSeries.length - 1
                          ? "text-[var(--app-primary)]"
                          : "text-[var(--app-muted)]"
                      }`}
                    >
                      {bar.month}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>

          <section className="mt-6">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="app-kicker">Operaciones prioritarias</p>
                <h3 className="app-display mt-2 text-[1.4rem] font-[680] text-[var(--app-heading)]">
                  Seguimientos prioritarios
                </h3>
              </div>
              <Link href="/reports" className="text-[0.88rem] font-semibold text-[var(--app-primary)]">
                Ver reportes
              </Link>
            </div>

            <div className="space-y-3">
              {adminTasks.map((task) => {
                const tone =
                  task.priority === "high"
                    ? {
                        stripe: "bg-[#A15A49]",
                        iconWrap: "bg-[var(--app-danger-bg)] text-[var(--app-danger)]",
                        trailing: "Critico",
                      }
                    : task.priority === "medium"
                      ? {
                          stripe: "bg-[var(--app-secondary)]",
                          iconWrap: "bg-[#FAF2E5] text-[#9E7B42]",
                          trailing: task.actionLabel ?? "Revisar",
                        }
                      : {
                          stripe: "bg-[var(--app-success)]",
                          iconWrap: "bg-[var(--app-success-bg)] text-[var(--app-success)]",
                          trailing: "Resuelto",
                        };

                return (
                  <Link key={task.id} href={task.href}>
                    <GlassCard className="overflow-hidden rounded-[1.5rem] p-0">
                      <div className="flex items-stretch">
                        <div className={`w-1.5 shrink-0 ${tone.stripe}`} />
                        <div className="flex flex-1 items-center gap-4 p-4">
                          <div
                            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-[1rem] ${tone.iconWrap}`}
                          >
                            <Icon name={task.icon} className="text-[1.05rem]" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-[0.98rem] font-semibold text-[var(--app-heading)]">
                              {task.title}
                            </p>
                            <p className="mt-1 text-[0.84rem] leading-6 text-[var(--app-muted)]">
                              {task.note}
                            </p>
                          </div>
                          <span className="shrink-0 rounded-full bg-[var(--app-surface-soft)] px-3 py-2 text-[0.72rem] font-semibold text-[var(--app-heading)]">
                            {tone.trailing}
                          </span>
                        </div>
                      </div>
                    </GlassCard>
                  </Link>
                );
              })}
            </div>
          </section>

          <section className="mt-6 pb-2">
            <div className="mb-4">
              <p className="app-kicker">Quick Access</p>
              <h3 className="app-display mt-2 text-[1.35rem] font-[680] text-[var(--app-heading)]">
                Atajos operativos
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {adminQuickActions.map((action) => (
                <Link
                  key={action.id}
                  href={action.href}
                  className="rounded-[1.45rem] border border-[var(--app-card-border)] bg-white p-4 shadow-[0_12px_24px_rgba(93,64,55,0.05)]"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-[1rem] bg-[var(--app-surface)] text-[var(--app-primary)]">
                    <Icon name={action.icon} className="text-[1.05rem]" />
                  </div>
                  <p className="mt-4 text-[1rem] font-semibold text-[var(--app-heading)]">
                    {action.label}
                  </p>
                  <p className="mt-2 text-[0.86rem] leading-6 text-[var(--app-muted)]">
                    Abrir módulo relacionado con {action.label.toLowerCase()}.
                  </p>
                </Link>
              ))}
            </div>
          </section>
        </main>

        <StitchTabBar
          items={[
            { label: "Panel", href: "/dashboard", icon: "dashboard", active: true },
            { label: "Residentes", href: "/residents", icon: "apartment" },
            { label: "Nuevo", href: "/residents/new", icon: "person_add", variant: "fab", tone: "gold" },
            { label: "Pagos", href: "/payments", icon: "payments" },
            { label: "Cuenta", href: "/settings", icon: "settings" },
          ]}
        />
      </div>
    </AppViewport>
  );
}

export default function DashboardPage() {
  return (
    <RoleGate allow={["admin"]}>
      <DashboardContent />
    </RoleGate>
  );
}
