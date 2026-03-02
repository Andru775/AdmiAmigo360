"use client";

import CinematicHero from "@/components/sections/CinematicHero";
import ImmersiveSections from "@/components/sections/ImmersiveSections";
import SectionQuickNav from "@/components/sections/SectionQuickNav";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-x-clip bg-black text-white">
      <SectionQuickNav />
      <CinematicHero />
      <ImmersiveSections />
    </main>
  );
}
