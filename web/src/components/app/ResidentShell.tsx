import type { ReactNode } from "react";
import Link from "next/link";

import { AppViewport } from "@/components/app/AppViewport";
import { Icon } from "@/components/app/Icon";
import { StitchTabBar } from "@/components/app/StitchTabBar";

type ResidentShellProps = {
  title: string;
  subtitle: string;
  activeTab: "home" | "assemblies" | "reservations" | "payments" | "profile";
  children: ReactNode;
  actionHref?: string;
  actionIcon?: string;
};

export function ResidentShell({
  title,
  subtitle,
  activeTab,
  children,
  actionHref = "/resident/notifications",
  actionIcon = "notifications",
}: ResidentShellProps) {
  return (
    <AppViewport>
      <div className="flex min-h-0 flex-1 flex-col">
        <header className="border-b border-[var(--app-card-border)] bg-[rgba(253,251,248,0.96)] px-5 pb-4 pt-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="app-kicker">Portal residente</p>
              <h1 className="app-display mt-2 text-[1.4rem] font-[680] text-[var(--app-heading)]">
                {title}
              </h1>
              <p className="mt-1 text-[0.92rem] leading-6 text-[var(--app-muted)]">{subtitle}</p>
            </div>
            <Link
              href={actionHref}
              className="flex h-12 w-12 items-center justify-center rounded-[1rem] border border-[var(--app-card-border)] bg-white text-[var(--app-heading)] shadow-[0_10px_18px_rgba(93,64,55,0.05)]"
            >
              <Icon name={actionIcon} className="text-[1.2rem]" />
            </Link>
          </div>
        </header>

        <main className="app-scroll flex-1 overflow-y-auto px-4 pb-8 pt-6">{children}</main>

        <StitchTabBar
          items={[
            { label: "Inicio", href: "/resident", icon: "dashboard", active: activeTab === "home" },
            {
              label: "Asambleas",
              href: "/resident/assemblies",
              icon: "description",
              active: activeTab === "assemblies",
            },
            {
              label: "Reservas",
              href: "/resident/reservations",
              icon: "event_note",
              variant: "fab",
              tone: "gold",
              hideLabel: true,
            },
            {
              label: "Pagos",
              href: "/resident/payments",
              icon: "payments",
              active: activeTab === "payments",
            },
            {
              label: "Perfil",
              href: "/resident/profile",
              icon: "person",
              active: activeTab === "profile",
            },
          ]}
        />
      </div>
    </AppViewport>
  );
}
