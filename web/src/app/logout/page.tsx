"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { AppViewport } from "@/components/app/AppViewport";
import { logoutApp } from "@/lib/auth";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    void logoutApp().finally(() => {
      router.replace("/login");
    });
  }, [router]);

  return (
    <AppViewport>
      <div className="flex flex-1 items-center justify-center px-8 text-center">
        <div className="space-y-3">
          <div className="mx-auto h-12 w-12 animate-pulse rounded-full bg-[var(--app-primary-soft)]" />
          <p className="text-base font-medium text-[var(--app-heading)]">Cerrando sesión...</p>
          <p className="text-sm text-[var(--app-muted)]">Te estamos devolviendo al acceso principal.</p>
        </div>
      </div>
    </AppViewport>
  );
}
