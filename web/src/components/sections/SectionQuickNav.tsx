"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

const sections = [
  { href: "#inicio", label: "Inicio" },
  { href: "#como-funciona", label: "Como funciona" },
  { href: "#ecosistema", label: "Ecosistema 360" },
  { href: "#problemas", label: "Problemas" },
  { href: "#modulos", label: "Modulos" },
  { href: "#valores", label: "Valores" },
  { href: "#planes", label: "Planes" },
  { href: "#salto", label: "Salto tech" },
  { href: "#apartamentos", label: "Apartamentos" },
  { href: "#asistente", label: "Asistente IA" },
  { href: "#demo", label: "Contacto" },
];

export default function SectionQuickNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed right-4 top-4 z-50 sm:right-7 sm:top-7">
      <button
        type="button"
        onClick={() => setOpen((state) => !state)}
        className="group flex h-12 w-12 items-center justify-center rounded-full border border-white/30 bg-black/55 text-white backdrop-blur-xl transition hover:border-cyan-300/70 hover:bg-black/70"
        aria-expanded={open}
        aria-label="Abrir secciones"
      >
        <span className="flex flex-col items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-white transition group-hover:bg-cyan-300" />
          <span className="h-1.5 w-1.5 rounded-full bg-white transition group-hover:bg-cyan-300" />
          <span className="h-1.5 w-1.5 rounded-full bg-white transition group-hover:bg-cyan-300" />
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.aside
            initial={{ opacity: 0, y: -10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="mt-3 w-56 rounded-2xl border border-white/20 bg-black/80 p-3 text-white shadow-2xl backdrop-blur-2xl"
          >
            <p className="mb-3 px-2 text-xs uppercase tracking-[0.24em] text-cyan-200/90">Secciones</p>
            <nav className="flex flex-col gap-1">
              {sections.map((section) => (
                <a
                  key={section.href}
                  href={section.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm text-white/85 transition hover:bg-white/10 hover:text-cyan-200"
                >
                  {section.label}
                </a>
              ))}
            </nav>
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  );
}
