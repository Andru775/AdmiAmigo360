import Link from "next/link";

import { Icon } from "@/components/app/Icon";
import type { NavItemKey } from "@/data/appData";

type BottomNavProps = {
  current: NavItemKey;
};

export function BottomNav({ current }: BottomNavProps) {
  const items = [
    { key: "dashboard" as const, label: "Panel", href: "/dashboard", icon: "dashboard" },
    { key: "residents" as const, label: "Residentes", href: "/residents", icon: "apartment" },
    { key: "reports" as const, label: "Reportes", href: "/reports", icon: "monitoring" },
    { key: "payments" as const, label: "Pagos", href: "/payments", icon: "payments" },
    { key: "settings" as const, label: "Cuenta", href: "/settings", icon: "settings" },
  ];

  return (
    <nav className="shrink-0 border-t border-[var(--app-card-border)] bg-[rgba(253,251,248,0.98)] px-3 pb-[calc(env(safe-área-inset-bottom)+1rem)] pt-3">
      <div className="grid grid-cols-5 gap-1">
        {items.map((item) => {
          const active = item.key === current;

          return (
            <Link
              key={item.key}
              href={item.href}
              className={`flex min-w-0 flex-col items-center gap-1 rounded-[1rem] px-1 py-1.5 text-center transition ${
                active
                  ? "bg-[var(--app-primary)] text-white shadow-[0_14px_24px_rgba(79,56,47,0.16)]"
                  : "text-[var(--app-tertiary)]"
              }`}
            >
              <Icon name={item.icon} className="text-[1.35rem]" />
              <span className="text-[10px] font-semibold tracking-[0.02em]">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
