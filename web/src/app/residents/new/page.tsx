"use client";

import Link from "next/link";
import { useState } from "react";

import { AppScreen } from "@/components/app/AppScreen";
import { GlassCard } from "@/components/app/GlassCard";
import { HeaderBar } from "@/components/app/HeaderBar";
import { Icon } from "@/components/app/Icon";
import { SceneArt } from "@/components/app/SceneArt";
import { RoleGate } from "@/components/app/RoleGate";
import { createResident } from "@/lib/app-data";

const initialState = {
  fullName: "",
  email: "",
  phone: "",
  tower: "Torre A",
  levelLabel: "Nivel 12",
  unitCode: "",
  residentType: "tenant",
  balance: "0",
  notes: "",
  password: "",
};

type CreateResidentResult = {
  temporaryPassword?: string | null;
  activationEmailSent?: boolean;
};

function NewResidentContent() {
  const [form, setForm] = useState(initialState);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState<CreateResidentResult | null>(null);

  function updateField(field: keyof typeof initialState, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess(null);

    try {
      const result = await createResident({
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        tower: form.tower,
        levelLabel: form.levelLabel,
        unitCode: form.unitCode,
        residentType: form.residentType === "owner" ? "owner" : "tenant",
        balance: Number(form.balance),
        notes: form.notes,
        password: form.password || undefined,
      });

      setSuccess({
        temporaryPassword:
          typeof result.temporaryPassword === "string" ? result.temporaryPassword : null,
        activationEmailSent: result.activationEmailSent === true,
      });
      setForm(initialState);
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "No fue posible crear el residente.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AppScreen
      currentNav="residents"
      header={
        <HeaderBar
          title="Nuevo residente"
          subtitle="Alta real de propietario o inquilino con cuenta de acceso conectada a Supabase."
          icon="person_add"
          action={
            <Link
              href="/residents"
              className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[var(--app-card-border)] bg-white text-[var(--app-heading)] shadow-[0_10px_18px_rgba(93,64,55,0.05)]"
            >
              <Icon name="arrow_back" />
            </Link>
          }
        />
      }
    >
      <GlassCard className="overflow-hidden rounded-[2rem] p-4">
        <div className="app-figure overflow-hidden rounded-[1.6rem] border">
          <SceneArt variant="concierge" className="h-[11rem] w-full" />
        </div>

        <div className="mt-5">
          <p className="app-kicker">Resident Onboarding</p>
          <h2 className="app-display mt-2 text-[1.7rem] font-[680] leading-[1.02] text-[var(--app-heading)]">
            Crea el residente y su acceso desde una sola pantalla
          </h2>
          <p className="mt-3 text-[0.94rem] leading-6 text-[var(--app-muted)]">
            Está pantalla queda enlazada a la ruta administrativa interna. Cuando Supabase está
            configurado, crea unidad, residente, perfil y cuenta de acceso.
          </p>
        </div>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-4">
            <label className="block">
              <span className="mb-2 block text-[0.74rem] font-semibold uppercase tracking-[0.18em] text-[var(--app-muted)]">
                Nombre completo
              </span>
              <input
                value={form.fullName}
                onChange={(event) => updateField("fullName", event.target.value)}
                className="app-input h-[3.8rem] w-full rounded-[1rem] px-4 outline-none"
                placeholder="Nombre del residente"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-[0.74rem] font-semibold uppercase tracking-[0.18em] text-[var(--app-muted)]">
                Correo
              </span>
              <input
                type="email"
                value={form.email}
                onChange={(event) => updateField("email", event.target.value)}
                className="app-input h-[3.8rem] w-full rounded-[1rem] px-4 outline-none"
                placeholder="correo@residente.com"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-[0.74rem] font-semibold uppercase tracking-[0.18em] text-[var(--app-muted)]">
                Teléfono
              </span>
              <input
                value={form.phone}
                onChange={(event) => updateField("phone", event.target.value)}
                className="app-input h-[3.8rem] w-full rounded-[1rem] px-4 outline-none"
                placeholder="+57 300 000 0000"
              />
            </label>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="mb-2 block text-[0.74rem] font-semibold uppercase tracking-[0.18em] text-[var(--app-muted)]">
                Torre
              </span>
              <input
                value={form.tower}
                onChange={(event) => updateField("tower", event.target.value)}
                className="app-input h-[3.8rem] w-full rounded-[1rem] px-4 outline-none"
                placeholder="Torre A"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-[0.74rem] font-semibold uppercase tracking-[0.18em] text-[var(--app-muted)]">
                Nivel
              </span>
              <input
                value={form.levelLabel}
                onChange={(event) => updateField("levelLabel", event.target.value)}
                className="app-input h-[3.8rem] w-full rounded-[1rem] px-4 outline-none"
                placeholder="Nivel 12"
              />
            </label>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="mb-2 block text-[0.74rem] font-semibold uppercase tracking-[0.18em] text-[var(--app-muted)]">
                Unidad
              </span>
              <input
                value={form.unitCode}
                onChange={(event) => updateField("unitCode", event.target.value.toUpperCase())}
                className="app-input h-[3.8rem] w-full rounded-[1rem] px-4 outline-none"
                placeholder="12B"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-[0.74rem] font-semibold uppercase tracking-[0.18em] text-[var(--app-muted)]">
                Tipo
              </span>
              <select
                value={form.residentType}
                onChange={(event) => updateField("residentType", event.target.value)}
                className="app-input h-[3.8rem] w-full rounded-[1rem] px-4 outline-none"
              >
                <option value="tenant">Inquilino</option>
                <option value="owner">Propietario</option>
              </select>
            </label>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="mb-2 block text-[0.74rem] font-semibold uppercase tracking-[0.18em] text-[var(--app-muted)]">
                Saldo inicial
              </span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.balance}
                onChange={(event) => updateField("balance", event.target.value)}
                className="app-input h-[3.8rem] w-full rounded-[1rem] px-4 outline-none"
                placeholder="0.00"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-[0.74rem] font-semibold uppercase tracking-[0.18em] text-[var(--app-muted)]">
                Contraseña temporal
              </span>
              <input
                value={form.password}
                onChange={(event) => updateField("password", event.target.value)}
                className="app-input h-[3.8rem] w-full rounded-[1rem] px-4 outline-none"
                placeholder="Opcional"
              />
              <p className="mt-2 text-[0.8rem] leading-5 text-[var(--app-muted)]">
                Si lo dejas vacío, enviaremos un correo para activar y definir la contraseña.
              </p>
            </label>
          </div>

          <label className="block">
            <span className="mb-2 block text-[0.74rem] font-semibold uppercase tracking-[0.18em] text-[var(--app-muted)]">
              Observaciones
            </span>
            <textarea
              value={form.notes}
              onChange={(event) => updateField("notes", event.target.value)}
              className="app-input min-h-[7rem] w-full rounded-[1rem] px-4 py-3 outline-none"
              placeholder="Notas internas para administración"
            />
          </label>

          {error ? (
            <div className="rounded-[1rem] border border-[rgba(161,90,73,0.18)] bg-[var(--app-danger-bg)] px-4 py-3 text-[0.9rem] text-[var(--app-danger)]">
              {error}
            </div>
          ) : null}

          {success ? (
            <div className="rounded-[1rem] border border-[rgba(86,114,96,0.18)] bg-[var(--app-success-bg)] px-4 py-4 text-[0.92rem] text-[var(--app-success)]">
              Residente creado correctamente.
              {success.activationEmailSent ? (
                <p className="mt-2 font-semibold">
                  Se envio un correo para que el residente configure su acceso.
                </p>
              ) : null}
              {success.temporaryPassword ? (
                <p className="mt-2 font-semibold">
                  Contraseña temporal generada: {success.temporaryPassword}
                </p>
              ) : null}
            </div>
          ) : null}

          <div className="grid grid-cols-1 gap-3 pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="app-button-primary flex h-12 items-center justify-center gap-2 rounded-[1rem] text-[0.95rem] font-semibold disabled:opacity-70"
            >
              <Icon name="check_circle" className="text-[1rem]" />
              {submitting ? "Creando residente..." : "Crear residente"}
            </button>
            <Link
              href="/residents"
              className="app-button-secondary flex h-12 items-center justify-center rounded-[1rem] text-[0.95rem] font-semibold"
            >
              Volver al directorio
            </Link>
          </div>
        </form>
      </GlassCard>
    </AppScreen>
  );
}

export default function NewResidentPage() {
  return (
    <RoleGate allow={["admin"]}>
      <NewResidentContent />
    </RoleGate>
  );
}
