import { StitchTabBar } from "@/components/app/StitchTabBar";
import type { NavItemKey } from "@/data/appData";

type BottomNavProps = {
  current: NavItemKey;
};

export function BottomNav({ current }: BottomNavProps) {
  return (
    <StitchTabBar
      items={[
        { label: "Panel", href: "/dashboard", icon: "dashboard", active: current === "dashboard" },
        { label: "Residentes", href: "/residents", icon: "group", active: current === "residents" },
        {
          label: "Nuevo",
          href: "/residents/new",
          icon: "person_add",
          variant: "fab",
          tone: "gold",
        },
        { label: "Pagos", href: "/payments", icon: "payments", active: current === "payments" },
        { label: "Cuenta", href: "/settings", icon: "settings", active: current === "settings" },
      ]}
    />
  );
}
