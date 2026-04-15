"use client";

import { useEffect, useState } from "react";

import { ResidentShell } from "@/components/app/ResidentShell";
import { RoleGate } from "@/components/app/RoleGate";
import { GlassCard } from "@/components/app/GlassCard";
import { SceneArt } from "@/components/app/SceneArt";
import { fetchResidentPortalData, requestReservation, type ResidentPortalData } from "@/lib/app-data";
import { useDemoSession } from "@/lib/useDemoSession";

function tomorrowAt(hour: number) {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  date.setHours(hour, 0, 0, 0);
  return date.toISOString().slice(0, 16);
}

function ResidentReservationRequestContent() {
  const session = useDemoSession();
  const [data, setData] = useState<ResidentPortalData | null>(null);
  const [amenityId, setAmenityId] = useState("");
  const [startsAt, setStartsAt] = useState(tomorrowAt(18));
  const [endsAt, setEndsAt] = useState(tomorrowAt(20));
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let active = true;

    void fetchResidentPortalData(session).then((result) => {
      if (!active) {
        return;
      }

      setData(result);
      setAmenityId(result.amenities[0]?.id ?? "");
    });

    return () => {
      active = false;
    };
  }, [session]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      await requestReservation({
        amenityId,
        startsAt: new Date(startsAt).toISOString(),
        endsAt: new Date(endsAt).toISOString(),
        note,
      });

      setSuccess("Tu solicitud fue enviada a administración y quedó en estado pendiente.");
      setNote("");
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "No fue posible enviar la reserva.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <ResidentShell
      title="Nueva reserva"
      subtitle="Solicita espacios comunes sin salir del flujo del residente."
      activeTab="reservations"
      actionHref="/resident/reservations"
      actionIcon="arrow_back"
    >
      <GlassCard className="overflow-hidden rounded-[2rem] p-4">
        <div className="app-figure overflow-hidden rounded-[1.6rem] border">
          <SceneArt variant="assembly" className="h-[11rem] w-full" />
        </div>

        <div className="mt-5">
          <p className="app-kicker">Reservas</p>
          <h2 className="app-display mt-2 text-[1.7rem] font-[680] leading-[1.02] text-[var(--app-heading)]">
            Reserva una amenidad con información clara
          </h2>
          <p className="mt-3 text-[0.94rem] leading-6 text-[var(--app-muted)]">
            Selecciona la amenidad, el horario y deja una nota corta para la administración.
          </p>
        </div>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="mb-2 block text-[0.74rem] font-semibold uppercase tracking-[0.18em] text-[var(--app-muted)]">
              Amenidad
            </span>
            <select
              value={amenityId}
              onChange={(event) => setAmenityId(event.target.value)}
              className="app-input h-[3.8rem] w-full rounded-[1rem] px-4 outline-none"
            >
              {(data?.amenities ?? []).map((amenity) => (
                <option key={amenity.id} value={amenity.id}>
                  {amenity.title} · {amenity.nextSlot}
                </option>
              ))}
            </select>
          </label>

          <div className="grid grid-cols-1 gap-4">
            <label className="block">
              <span className="mb-2 block text-[0.74rem] font-semibold uppercase tracking-[0.18em] text-[var(--app-muted)]">
                Inicio
              </span>
              <input
                type="datetime-local"
                value={startsAt}
                onChange={(event) => setStartsAt(event.target.value)}
                className="app-input h-[3.8rem] w-full rounded-[1rem] px-4 outline-none"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-[0.74rem] font-semibold uppercase tracking-[0.18em] text-[var(--app-muted)]">
                Fin
              </span>
              <input
                type="datetime-local"
                value={endsAt}
                onChange={(event) => setEndsAt(event.target.value)}
                className="app-input h-[3.8rem] w-full rounded-[1rem] px-4 outline-none"
              />
            </label>
          </div>

          <label className="block">
            <span className="mb-2 block text-[0.74rem] font-semibold uppercase tracking-[0.18em] text-[var(--app-muted)]">
              Nota
            </span>
            <textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              className="app-input min-h-[7rem] w-full rounded-[1rem] px-4 py-3 outline-none"
              placeholder="Indica si necesitas apoyo logistico o un motivo especial"
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

          <button
            type="submit"
            disabled={submitting || !amenityId}
            className="app-button-primary flex h-12 w-full items-center justify-center rounded-[1rem] text-[0.95rem] font-semibold disabled:opacity-70"
          >
            {submitting ? "Enviando..." : "Enviar solicitud"}
          </button>
        </form>
      </GlassCard>
    </ResidentShell>
  );
}

export default function ResidentReservationRequestPage() {
  return (
    <RoleGate allow={["resident"]}>
      <ResidentReservationRequestContent />
    </RoleGate>
  );
}
