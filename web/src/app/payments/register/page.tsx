"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import { AppScreen } from "@/components/app/AppScreen";
import { GlassCard } from "@/components/app/GlassCard";
import { HeaderBar } from "@/components/app/HeaderBar";
import { Icon } from "@/components/app/Icon";
import { SceneArt } from "@/components/app/SceneArt";
import { RoleGate } from "@/components/app/RoleGate";
import { fetchResidentsDirectory, registerPayment } from "@/lib/app-data";
import type { ResidentProfile } from "@/data/demoDb";

function RegisterPaymentContent() {
  const searchParams = useSearchParams();
  const residentSlug = searchParams.get("resident");

  const [residents, setResidents] = useState<ResidentProfile[]>([]);
  const [selectedResidentId, setSelectedResidentId] = useState("");
  const [amount, setAmount] = useState("225");
  const [title, setTitle] = useState("Cuota de administración");
  const [paymentMethod, setPaymentMethod] = useState("Transferencia");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let active = true;

    void fetchResidentsDirectory().then((result) => {
      if (!active) {
        return;
      }

      setResidents(result);

      const requestedResident = result.find((resident) => resident.slug === residentSlug);
      setSelectedResidentId(requestedResident?.id ?? result[0]?.id ?? "");
      setAmount(String(requestedResident?.balance || 225));
    });

    return () => {
      active = false;
    };
  }, [residentSlug]);

  const selectedResident = useMemo(
    () => residents.find((resident) => resident.id === selectedResidentId) ?? null,
    [residents, selectedResidentId],
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      await registerPayment({
        residentId: selectedResidentId,
        amount: Number(amount),
        title,
        paymentMethod,
        note,
      });

      setSuccess("Pago registrado correctamente. El saldo del residente fue actualizado.");
      if (selectedResident) {
        setAmount(String(Math.max(selectedResident.balance - Number(amount), 0)));
      }
      setNote("");
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "No fue posible registrar el pago.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AppScreen
      currentNav="payments"
      header={
        <HeaderBar
          title="Registrar pago"
          subtitle="Concilia cartera y registra recaudo real directamente sobre la base de datos."
          icon="add_card"
          action={
            <Link
              href="/payments"
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
          <SceneArt variant="finance" className="h-[11rem] w-full" />
        </div>

        <div className="mt-5">
          <p className="app-kicker">Payment Capture</p>
          <h2 className="app-display mt-2 text-[1.7rem] font-[680] leading-[1.02] text-[var(--app-heading)]">
            Recaudo alineado con el residente correcto
          </h2>
          <p className="mt-3 text-[0.94rem] leading-6 text-[var(--app-muted)]">
            Escoge la unidad, define el valor y deja trazabilidad del medio de pago y la nota
            operativa.
          </p>
        </div>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="mb-2 block text-[0.74rem] font-semibold uppercase tracking-[0.18em] text-[var(--app-muted)]">
              Residente
            </span>
            <select
              value={selectedResidentId}
              onChange={(event) => setSelectedResidentId(event.target.value)}
              className="app-input h-[3.8rem] w-full rounded-[1rem] px-4 outline-none"
            >
              {residents.map((resident) => (
                <option key={resident.id} value={resident.id}>
                  {resident.name} · {resident.unitLabel}
                </option>
              ))}
            </select>
          </label>

          {selectedResident ? (
            <div className="rounded-[1.2rem] border border-[var(--app-card-border)] bg-[var(--app-surface-soft)] px-4 py-4">
              <p className="text-[0.78rem] font-semibold uppercase tracking-[0.16em] text-[var(--app-muted)]">
                Unidad seleccionada
              </p>
              <p className="mt-2 text-[1.15rem] font-semibold text-[var(--app-heading)]">
                {selectedResident.unitLabel}
              </p>
              <p className="mt-2 text-[0.9rem] text-[var(--app-muted)]">
                Saldo actual: ${selectedResident.balance.toFixed(2)}
              </p>
            </div>
          ) : null}

          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="mb-2 block text-[0.74rem] font-semibold uppercase tracking-[0.18em] text-[var(--app-muted)]">
                Valor
              </span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                className="app-input h-[3.8rem] w-full rounded-[1rem] px-4 outline-none"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-[0.74rem] font-semibold uppercase tracking-[0.18em] text-[var(--app-muted)]">
                Método
              </span>
              <select
                value={paymentMethod}
                onChange={(event) => setPaymentMethod(event.target.value)}
                className="app-input h-[3.8rem] w-full rounded-[1rem] px-4 outline-none"
              >
                <option>Transferencia</option>
                <option>PSE</option>
                <option>Efectivo</option>
                <option>Datafono</option>
              </select>
            </label>
          </div>

          <label className="block">
            <span className="mb-2 block text-[0.74rem] font-semibold uppercase tracking-[0.18em] text-[var(--app-muted)]">
              Concepto
            </span>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="app-input h-[3.8rem] w-full rounded-[1rem] px-4 outline-none"
              placeholder="Cuota de administración"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-[0.74rem] font-semibold uppercase tracking-[0.18em] text-[var(--app-muted)]">
              Nota operativa
            </span>
            <textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              className="app-input min-h-[7rem] w-full rounded-[1rem] px-4 py-3 outline-none"
              placeholder="Detalle del soporte o conciliación"
            />
          </label>

          {error ? (
            <div className="rounded-[1rem] border border-[rgba(161,90,73,0.18)] bg-[var(--app-danger-bg)] px-4 py-3 text-[0.9rem] text-[var(--app-danger)]">
              {error}
            </div>
          ) : null}

          {success ? (
            <div className="rounded-[1rem] border border-[rgba(86,114,96,0.18)] bg-[var(--app-success-bg)] px-4 py-3 text-[0.9rem] text-[var(--app-success)]">
              {success}
            </div>
          ) : null}

          <div className="grid grid-cols-1 gap-3 pt-2">
            <button
              type="submit"
              disabled={submitting || !selectedResidentId}
              className="app-button-primary flex h-12 items-center justify-center gap-2 rounded-[1rem] text-[0.95rem] font-semibold disabled:opacity-70"
            >
              <Icon name="check_circle" className="text-[1rem]" />
              {submitting ? "Registrando..." : "Registrar pago"}
            </button>
            <Link
              href="/payments"
              className="app-button-secondary flex h-12 items-center justify-center rounded-[1rem] text-[0.95rem] font-semibold"
            >
              Volver a cartera
            </Link>
          </div>
        </form>
      </GlassCard>
    </AppScreen>
  );
}

export default function RegisterPaymentPage() {
  return (
    <RoleGate allow={["admin"]}>
      <RegisterPaymentContent />
    </RoleGate>
  );
}
