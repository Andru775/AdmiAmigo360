import Link from "next/link";

import { AppScreen } from "@/components/app/AppScreen";
import { GlassCard } from "@/components/app/GlassCard";
import { HeaderBar } from "@/components/app/HeaderBar";
import { Icon } from "@/components/app/Icon";
import { RoleGate } from "@/components/app/RoleGate";
import { adminSettingsSections } from "@/data/demoDb";

function SettingsContent() {
  return (
    <AppScreen
      currentNav="settings"
      header={
        <HeaderBar
          title="Configuración"
          subtitle="Reglas del demo, automatizaciones activas y salida segura de sesión."
          icon="settings"
          action={
            <Link
              href="/dashboard"
              className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-200"
            >
              <Icon name="arrow_back" />
            </Link>
          }
        />
      }
    >
      <div className="space-y-4">
        {adminSettingsSections.map((section) => (
          <GlassCard key={section.id} className="rounded-[1.3rem] border-white/10 bg-[#7A6358] p-5">
            <h2 className="text-[1rem] font-semibold text-white">{section.title}</h2>
            <div className="mt-4 space-y-3">
              {section.items.map((item) => (
                <div key={item} className="rounded-[1rem] bg-black/20 px-4 py-3 text-[0.92rem] leading-6 text-slate-300">
                  {item}
                </div>
              ))}
            </div>
          </GlassCard>
        ))}

        <Link
          href="/logout"
          className="flex items-center justify-center gap-3 rounded-[1rem] bg-[linear-gradient(90deg,#5D4037,#8D6E63)] px-5 py-4 text-[0.95rem] font-semibold text-white shadow-[0_12px_28px_rgba(93,64,55,0.22)]"
        >
          <Icon name="logout" className="text-[1.1rem]" />
          Cerrar sesión
        </Link>
      </div>
    </AppScreen>
  );
}

export default function SettingsPage() {
  return (
    <RoleGate allow={["admin"]}>
      <SettingsContent />
    </RoleGate>
  );
}
