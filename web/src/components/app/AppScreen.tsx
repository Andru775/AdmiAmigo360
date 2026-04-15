"use client";

import type { ReactNode } from "react";

import { AppViewport } from "@/components/app/AppViewport";
import type { NavItemKey } from "@/data/appData";

type AppScreenProps = {
  header?: ReactNode;
  children: ReactNode;
  currentNav?: NavItemKey;
  requireAuth?: boolean;
  contentClassName?: string;
};

export function AppScreen({
  header,
  children,
  currentNav,
  contentClassName = "",
}: AppScreenProps) {
  return (
    <AppViewport currentNav={currentNav}>
      <div className="flex min-h-0 flex-1 flex-col">
        {header ? <div className="shrink-0">{header}</div> : null}
        <main
          className={`app-scroll min-h-0 flex-1 overflow-y-auto px-4 pb-8 pt-6 ${contentClassName}`}
        >
          {children}
        </main>
      </div>
    </AppViewport>
  );
}
