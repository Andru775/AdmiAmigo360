"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { AppViewport } from "@/components/app/AppViewport";
import { GlassCard } from "@/components/app/GlassCard";
import { Icon } from "@/components/app/Icon";
import { RoleGate } from "@/components/app/RoleGate";
import { SceneArt } from "@/components/app/SceneArt";
import { StitchTabBar } from "@/components/app/StitchTabBar";
import { fetchPaymentsOverview, summarizeMonthlyCollection, type PaymentsOverview } from "@/lib/app-data";

function PaymentsContent() {
  const [overview, setOverview] = useState<PaymentsOverview | null>(null);
  const [filter, setFilter] = useState<"all" | "overdue">("all");

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

  const paymentRows = useMemo(() => {
    const rows = overview?.rows ?? [];
    return filter === "overdue" ? rows.filter((row) => row.statusTone === "danger") : rows;
  }, [filter, overview]);

  return (
    <AppViewport>
      <div className="flex min-h-0 flex-1 flex-col">
        <header className="border-b border-[var(--app-card-border)] bg-[rgba(253,251,248,0.96)] px-5 pb-5 pt-6">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="app-kicker">Control de recaudo</p>
              <h1 className="app-display mt-2 text-[1.9rem] font-[680] leading-none text-[var(--app-heading)]">
                Pagos y cartera
              </h1>
              <p className="mt-3 max-w-[18rem] text-[0.95rem] leading-6 text-[var(--app-muted)]">
                Recaudo del mes, unidades en seguimiento y movimientos recientes desde una
                lectura apta para celular.
              </p>
            </div>

            <Link
              href="/payments/reminders"
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[1.15rem] border border-[var(--app-card-border)] bg-white text-[var(--app-heading)] shadow-[0_10px_22px_rgba(93,64,55,0.06)]"
            >
              <Icon name="notifications" className="text-[1.15rem]" />
            </Link>
          </div>
        </header>

        <main className="app-scroll flex-1 overflow-y-auto px-4 pb-24 pt-6">
          <GlassCard className="overflow-hidden rounded-[2rem] p-4">
            <div className="app-figure overflow-hidden rounded-[1.6rem] border">
              <SceneArt variant="finance" className="h-[12rem] w-full" />
            </div>

            <div className="mt-5 flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="app-kicker">Recaudo mensual</p>
                <h2 className="app-display mt-2 text-[1.85rem] font-[680] leading-[1.02] text-[var(--app-heading)]">
                  {overview ? summarizeMonthlyCollection(overview.monthlyCollectionFull) : "$45.2k"}
                </h2>
                <p className="mt-2 text-[0.92rem] leading-6 text-[var(--app-muted)]">
                  Flujo operativo para registrar recaudo, enviar recordatorios y revisar el
                  historial más reciente.
                </p>
              </div>
              <div className="rounded-full bg-[var(--app-success-bg)] px-3 py-2 text-[0.78rem] font-semibold text-[var(--app-success)]">
                +12% mes
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
                href="/payments/reminders"
                className="app-button-secondary flex h-[3.8rem] items-center justify-center gap-2 rounded-[1rem] px-4 text-[0.95rem] font-semibold"
              >
                <Icon name="send_and_archive" className="text-[1rem]" />
                Recordatorios
              </Link>
            </div>
          </GlassCard>

          <section className="mt-6">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="app-kicker">Seguimiento de cartera</p>
                <h3 className="app-display mt-2 text-[1.35rem] font-[680] text-[var(--app-heading)]">
                  Unidades
                </h3>
              </div>
              <div className="flex rounded-full border border-[var(--app-card-border)] bg-white p-1">
                <button
                  type="button"
                  onClick={() => setFilter("all")}
                  className={`rounded-full px-3 py-1.5 text-[0.82rem] font-semibold ${
                    filter === "all" ? "app-button-primary" : "text-[var(--app-heading)]"
                  }`}
                >
                  Todas
                </button>
                <button
                  type="button"
                  onClick={() => setFilter("overdue")}
                  className={`rounded-full px-3 py-1.5 text-[0.82rem] font-semibold ${
                    filter === "overdue" ? "app-button-primary" : "text-[var(--app-heading)]"
                  }`}
                >
                  Mora
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {paymentRows.map((row) => {
                const tone =
                  row.statusTone === "danger"
                    ? {
                        border: "border-[var(--app-danger)]/60",
                        badge: "bg-[var(--app-danger-bg)] text-[var(--app-danger)]",
                      }
                    : row.statusTone === "success"
                      ? {
                          border: "border-[var(--app-success)]/50",
                          badge: "bg-[var(--app-success-bg)] text-[var(--app-success)]",
                        }
                      : {
                          border: "border-[var(--app-secondary)]/60",
                          badge: "bg-[#FAF2E5] text-[#9E7B42]",
                        };

                return (
                  <GlassCard key={row.id} className={`rounded-[1.55rem] border ${tone.border} p-4`}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-[1rem] font-semibold text-[var(--app-heading)]">
                          {row.unitLabel}
                        </p>
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <span className={`rounded-full px-3 py-1 text-[0.74rem] font-semibold ${tone.badge}`}>
                            {row.statusLabel}
                          </span>
                          <span className="text-[0.78rem] uppercase tracking-[0.14em] text-[var(--app-muted)]">
                            {row.helperLabel}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-[1.15rem] font-semibold text-[var(--app-heading)]">
                          {row.amountLabel}
                        </p>
                        <Link
                          href={`/payments/register?resident=${row.residentSlug}`}
                          className="mt-3 inline-flex items-center gap-1 text-[0.82rem] font-semibold text-[var(--app-primary)]"
                        >
                          Gestionar
                          <Icon name="arrow_forward" className="text-[0.95rem]" />
                        </Link>
                      </div>
                    </div>
                  </GlassCard>
                );
              })}
            </div>
          </section>

          <section className="mt-6">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="app-kicker">Recent Activity</p>
                <h3 className="app-display mt-2 text-[1.35rem] font-[680] text-[var(--app-heading)]">
                  Ultimos pagos
                </h3>
              </div>
              <Link href="/reports" className="text-[0.86rem] font-semibold text-[var(--app-primary)]">
                Ver reportes
              </Link>
            </div>

            <GlassCard className="overflow-hidden rounded-[1.7rem] p-0">
              {(overview?.history ?? []).map((payment, index) => (
                <div
                  key={payment.id}
                  className={`flex items-center justify-between gap-4 px-4 py-4 ${
                    index !== 0 ? "border-t border-[var(--app-card-border)]" : ""
                  }`}
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--app-success-bg)] text-[var(--app-success)]">
                      <Icon name="payments" className="text-[1rem]" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-[0.96rem] font-semibold text-[var(--app-heading)]">
                        {payment.title}
                      </p>
                      <p className="truncate text-[0.82rem] text-[var(--app-muted)]">
                        {payment.note}
                      </p>
                    </div>
                  </div>
                  <p className="shrink-0 text-[0.96rem] font-semibold text-[var(--app-secondary)]">
                    {payment.amountLabel}
                  </p>
                </div>
              ))}
            </GlassCard>
          </section>
        </main>

        <StitchTabBar
          items={[
            { label: "Panel", href: "/dashboard", icon: "dashboard" },
            { label: "Residentes", href: "/residents", icon: "group" },
            { label: "Nuevo", href: "/payments/register", icon: "add_card", variant: "fab", tone: "gold" },
            { label: "Pagos", href: "/payments", icon: "payments", active: true },
            { label: "Cuenta", href: "/settings", icon: "settings" },
          ]}
        />
      </div>
    </AppViewport>
  );
}

export default function PaymentsPage() {
  return (
    <RoleGate allow={["admin"]}>
      <PaymentsContent />
    </RoleGate>
  );
}
