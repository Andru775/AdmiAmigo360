import type { ReactNode } from "react";

import { BottomNav } from "@/components/app/BottomNav";
import type { NavItemKey } from "@/data/appData";

type AppViewportProps = {
  children: ReactNode;
  currentNav?: NavItemKey;
};

export function AppViewport({ children, currentNav }: AppViewportProps) {
  return (
    <div
      className="relative flex h-[100dvh] justify-center overflow-hidden bg-[var(--app-bg)] text-[var(--app-text)] sm:px-6 sm:py-8"
    >
      <div
        className="app-shell-frame relative mx-auto flex h-full min-h-0 w-full max-w-[430px] flex-col overflow-hidden bg-[linear-gradient(180deg,var(--app-shell)_0%,var(--app-shell-strong)_100%)] sm:max-h-[844px] sm:rounded-[42px] sm:border sm:border-[var(--app-card-border)] sm:shadow-[0_28px_62px_rgba(71,51,41,0.16)]"
      >
        {children}
        {currentNav ? <BottomNav current={currentNav} /> : null}
      </div>
    </div>
  );
}
