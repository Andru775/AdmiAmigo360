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
      className="relative min-h-screen overflow-x-hidden bg-[var(--app-bg)] text-[var(--app-text)] sm:px-6 sm:py-8"
      style={{ minHeight: "100dvh" }}
    >
      <div
        className="relative mx-auto flex min-h-screen w-full max-w-[430px] flex-col overflow-hidden bg-[linear-gradient(180deg,var(--app-shell)_0%,var(--app-shell-strong)_100%)] sm:min-h-[844px] sm:rounded-[42px] sm:border sm:border-[var(--app-card-border)] sm:shadow-[0_28px_62px_rgba(71,51,41,0.16)]"
        style={{ minHeight: "100dvh" }}
      >
        {children}
        {currentNav ? <BottomNav current={currentNav} /> : null}
      </div>
    </div>
  );
}
