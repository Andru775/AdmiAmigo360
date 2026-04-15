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
    <nav className="shrink-0 border-t border-[var(--app-card-border)] bg-[rgba(253,251,248,0.98)] px-3 pb-[calc(env(safe-área-inset-bottom)+1rem)] pt-3">
      <div className="grid grid-cols-5 items-end gap-1">
        {items.map((item) => {
          if (item.variant === "fab") {
            const fabTone =
              item.tone === "gold"
                ? "bg-[radial-gradient(circle_at_30%_30%,#f0deba,#c7a061_56%,#8a6a4a_100%)] text-[#2f241e] shadow-[0_12px_24px_rgba(122,95,65,0.2)]"
                : "bg-[radial-gradient(circle_at_30%_30%,#ceb3a1,#8f7569_56%,#4f382f_100%)] text-white shadow-[0_12px_24px_rgba(93,64,55,0.18)]";

            return (
              <div key={item.label} className="relative -mt-8 flex justify-center">
                <Link
                  href={item.href}
                  className={`flex h-[4.1rem] w-[4.1rem] items-center justify-center rounded-full border-4 border-[var(--app-shell)] ${fabTone}`}
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
              className={`flex min-w-0 flex-col items-center gap-1 rounded-[1rem] px-1 py-1.5 text-center transition ${
                item.active
                  ? "bg-[var(--app-primary)] text-white shadow-[0_14px_24px_rgba(79,56,47,0.16)]"
                  : "text-[var(--app-tertiary)]"
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
