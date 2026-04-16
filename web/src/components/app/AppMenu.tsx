"use client";

import Link from "next/link";
import { useState } from "react";

import { Icon } from "@/components/app/Icon";

export type AppMenuItem = {
  label: string;
  href: string;
  icon: string;
  helper?: string;
};

type AppMenuProps = {
  items: AppMenuItem[];
  label?: string;
};

export const adminMenuItems: AppMenuItem[] = [
  { label: "Solicitudes", href: "/access-requests", icon: "person_add", helper: "Accesos pendientes" },
  { label: "Reportes", href: "/reports", icon: "monitoring", helper: "Indicadores y exportes" },
  { label: "Amenidades", href: "/amenities", icon: "event_note", helper: "Reservas del conjunto" },
  { label: "Administradores", href: "/admin-users", icon: "shield_person", helper: "Permisos y roles" },
  { label: "Soporte", href: "/support", icon: "support_agent", helper: "Ayuda y recuperación" },
];

export const residentMenuItems: AppMenuItem[] = [
  { label: "Notificaciones", href: "/resident/notifications", icon: "notifications", helper: "Avisos del conjunto" },
  { label: "Asambleas", href: "/resident/assemblies", icon: "description", helper: "Citaciones y temas" },
  { label: "Reservas", href: "/resident/reservations", icon: "event_note", helper: "Espacios comunes" },
  { label: "Pagos", href: "/resident/payments", icon: "payments", helper: "Estado de cuenta" },
  { label: "Perfil", href: "/resident/profile", icon: "person", helper: "Datos de vivienda" },
];

export function AppMenu({ items, label = "Menú" }: AppMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative z-50">
      <button
        type="button"
        aria-expanded={isOpen}
        aria-label={label}
        onClick={() => setIsOpen((value) => !value)}
        className="flex h-12 w-12 items-center justify-center rounded-[1.15rem] border border-[var(--app-card-border)] bg-white/82 text-[var(--app-heading)] shadow-[0_10px_22px_rgba(93,64,55,0.06)] backdrop-blur-xl"
      >
        <Icon name="menu" className="text-[1.25rem]" />
      </button>

      {isOpen ? (
        <div className="absolute right-0 top-[3.45rem] w-[16rem] overflow-hidden rounded-[1.5rem] border border-[rgba(232,221,210,0.72)] bg-[rgba(255,255,255,0.78)] p-2 shadow-[0_24px_48px_rgba(71,51,41,0.18)] backdrop-blur-2xl">
          <div className="px-3 py-2">
            <p className="app-kicker">Accesos</p>
          </div>
          <div className="space-y-1">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 rounded-[1rem] px-3 py-3 text-[var(--app-heading)] transition hover:bg-white/80"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[0.9rem] bg-[var(--app-surface)] text-[var(--app-primary)]">
                  <Icon name={item.icon} className="text-[1rem]" />
                </span>
                <span className="min-w-0">
                  <span className="block text-[0.94rem] font-semibold">{item.label}</span>
                  {item.helper ? (
                    <span className="mt-0.5 block truncate text-[0.78rem] text-[var(--app-muted)]">
                      {item.helper}
                    </span>
                  ) : null}
                </span>
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
