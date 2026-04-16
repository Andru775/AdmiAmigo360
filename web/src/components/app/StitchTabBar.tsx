import Link from "next/link";

import { Icon } from "@/components/app/Icon";

type TabItem = {
  label: string;
  href: string;
  icon: string;
  active?: boolean;
  variant?: "default" | "fab";
  tone?: "violet" | "gold";
  hideLabel?: boolean;
};

type StitchTabBarProps = {
  items: TabItem[];
};

export function StitchTabBar({ items }: StitchTabBarProps) {
  return (
    <nav className="app-tabbar shrink-0 border-t border-[var(--app-card-border)] bg-[rgba(253,251,248,0.98)] px-3">
      <div className="grid grid-cols-5 items-end gap-1">
        {items.map((item) => {
          if (item.variant === "fab") {
            const fabTone =
              item.tone === "gold"
                ? "app-tabbar-fab-gold"
                : "app-tabbar-fab-primary";

            return (
              <div key={item.label} className="relative -mt-8 flex justify-center">
                <Link
                  href={item.href}
                  aria-label={item.label}
                  aria-current={item.active ? "page" : undefined}
                  className={`app-tabbar-fab flex h-[3.85rem] w-[3.85rem] items-center justify-center rounded-full border-4 border-[var(--app-shell)] ${fabTone}`}
                >
                  <Icon name={item.icon} className="text-[1.75rem]" />
                </Link>
              </div>
            );
          }

          return (
            <Link
              key={item.label}
              href={item.href}
              aria-current={item.active ? "page" : undefined}
              className={`app-tabbar-link flex min-w-0 flex-col items-center gap-1 rounded-[1rem] px-1 py-1.5 text-center transition ${
                item.active ? "app-tabbar-link-active" : ""
              }`}
            >
              <Icon name={item.icon} className="text-[1.35rem]" />
              {item.hideLabel ? null : (
                <span className="text-[10px] font-semibold tracking-[0.02em]">
                  {item.label}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
