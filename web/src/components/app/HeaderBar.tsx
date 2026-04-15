import type { ReactNode } from "react";

import { Icon } from "@/components/app/Icon";

type HeaderBarProps = {
  title: string;
  subtitle: string;
  icon: string;
  action?: ReactNode;
};

export function HeaderBar({
  title,
  subtitle,
  icon,
  action,
}: HeaderBarProps) {
  return (
    <header className="relative overflow-hidden border-b border-[var(--app-card-border)] bg-[rgba(253,251,248,0.98)] px-5 pb-5 pt-6">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-[radial-gradient(circle_at_top,rgba(191,157,108,0.16),transparent_72%)]" />
      <div className="relative flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="mt-0.5 flex h-[3.1rem] w-[3.1rem] shrink-0 items-center justify-center rounded-[1.2rem] border border-[rgba(191,157,108,0.22)] bg-[linear-gradient(180deg,#fffefd_0%,#f4ece3_100%)] text-[var(--app-primary)] shadow-[0_10px_22px_rgba(93,64,55,0.05)]">
            <Icon name={icon} filled className="text-[1.45rem]" />
          </div>
          <div className="max-w-[268px]">
            <p className="app-kicker">AdmiAmigo 360</p>
            <h1 className="app-display mt-1 text-[1.48rem] font-[680] leading-tight text-[var(--app-heading)]">
              {title}
            </h1>
            <p className="mt-2 text-[0.92rem] leading-6 text-[var(--app-muted)]">{subtitle}</p>
          </div>
        </div>
        {action}
      </div>
    </header>
  );
}
