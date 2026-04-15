"use client";

import type { ReactNode } from "react";
import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";

import type { DemoRole } from "@/data/appData";
import { useSessionState } from "@/lib/useDemoSession";

type RoleGateProps = {
  allow: DemoRole[];
  children: ReactNode;
};

export function RoleGate({ allow, children }: RoleGateProps) {
  const router = useRouter();
  const { session, isLoading } = useSessionState();
  const allowKey = allow.join("|");
  const allowedRoles = useMemo(
    () => new Set(allowKey.split("|") as DemoRole[]),
    [allowKey],
  );

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (!session) {
      router.replace("/login");
      return;
    }

    if (!allowedRoles.has(session.role)) {
      router.replace(session.homeHref);
    }
  }, [allowedRoles, isLoading, router, session]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--app-bg)] px-6 text-center">
        <div className="space-y-4">
          <div className="mx-auto h-12 w-12 rounded-full bg-[var(--app-primary-soft)] animate-pulse" />
          <p className="text-[0.95rem] font-medium text-[var(--app-heading)]">
            Cargando tu sesión...
          </p>
        </div>
      </div>
    );
  }

  if (!session || !allowedRoles.has(session.role)) {
    return null;
  }

  return <>{children}</>;
}
