"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { AppViewport } from "@/components/app/AppViewport";
import { GlassCard } from "@/components/app/GlassCard";
import { Icon } from "@/components/app/Icon";
import { RoleGate } from "@/components/app/RoleGate";
import { SceneArt } from "@/components/app/SceneArt";
import { StitchTabBar } from "@/components/app/StitchTabBar";
import type { ResidentProfile } from "@/data/demoDb";
import { deleteResident, fetchResidentsDirectory } from "@/lib/app-data";

const filters = ["Todas", "Propietarios", "Inquilinos", "En mora"] as const;

function ResidentsContent() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<(typeof filters)[number]>("Todas");
  const [residents, setResidents] = useState<ResidentProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let isActive = true;

    const timer = window.setTimeout(() => {
      setLoading(true);
      setError("");

      void fetchResidentsDirectory()
        .then((result) => {
          if (isActive) {
            setResidents(result);
          }
        })
        .catch((loadError: unknown) => {
          if (isActive) {
            setError(
              loadError instanceof Error
                ? loadError.message
                : "No fue posible cargar residentes.",
            );
          }
        })
        .finally(() => {
          if (isActive) {
            setLoading(false);
          }
        });
    }, 0);

    return () => {
      isActive = false;
      window.clearTimeout(timer);
    };
  }, []);

  async function handleDeleteResident(resident: ResidentProfile) {
    const confirmed = window.confirm(
      `¿Eliminar la cuenta de ${resident.name} de ${resident.unitLabel}? Esta acción elimina su acceso como residente.`,
    );

    if (!confirmed) {
      return;
    }

    setDeletingId(resident.id);
    setMessage("");
    setError("");

    try {
      await deleteResident(resident.id);
      setMessage(`Eliminamos la cuenta de ${resident.name}.`);
      const result = await fetchResidentsDirectory();
      setResidents(result);
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "No fue posible eliminar el residente.",
      );
    } finally {
      setDeletingId("");
    }
  }

  const filteredResidents = useMemo(() => {
    const normalized = search.trim().toLowerCase();

    return residents.filter((resident) => {
      const matchesSearch =
        normalized.length === 0 ||
        resident.name.toLowerCase().includes(normalized) ||
        resident.unitLabel.toLowerCase().includes(normalized) ||
        resident.phone.toLowerCase().includes(normalized) ||
        resident.email.toLowerCase().includes(normalized);

      const matchesFilter =
        filter === "Todas" ||
        (filter === "Propietarios" && resident.residentType === "Propietario") ||
        (filter === "Inquilinos" && resident.residentType === "Inquilino") ||
        (filter === "En mora" && resident.status === "overdue");

      return matchesSearch && matchesFilter;
    });
  }, [filter, residents, search]);

  const stats = useMemo(() => {
    const total = residents.length;
    const overdue = residents.filter((resident) => resident.status === "overdue").length;
    const current = residents.filter((resident) => resident.status === "paid").length;
    return { total, overdue, current };
  }, [residents]);

  const unitSections = useMemo(() => {
    const map = new Map<
      string,
      {
        title: string;
        tower: string;
        unitCode: string;
        residents: ResidentProfile[];
        accent: "gold" | "violet";
      }
    >();

    filteredResidents.forEach((resident) => {
      const key = `${resident.tower}|${resident.unitCode}`;
      const current = map.get(key);

      if (current) {
        current.residents.push(resident);
        return;
      }

      map.set(key, {
        title: `${resident.tower} · Apartamento ${resident.unitCode}`,
        tower: resident.tower,
        unitCode: resident.unitCode,
        residents: [resident],
        accent: resident.accent === "gold" ? "gold" : "violet",
      });
    });

    return Array.from(map.values())
      .map((section) => ({
        ...section,
        residents: [...section.residents].sort((left, right) =>
          left.name.localeCompare(right.name),
        ),
      }))
      .sort((left, right) => left.title.localeCompare(right.title));
  }, [filteredResidents]);

  return (
    <AppViewport>
      <div className="flex min-h-0 flex-1 flex-col">
        <header className="border-b border-[var(--app-card-border)] bg-[rgba(253,251,248,0.96)] px-5 pb-5 pt-6">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="app-kicker">Directorio residencial</p>
              <h1 className="app-display mt-2 text-[1.9rem] font-[680] leading-none text-[var(--app-heading)]">
                Residentes
              </h1>
              <p className="mt-3 max-w-[18rem] text-[0.94rem] leading-6 text-[var(--app-muted)]">
                Directorio organizado para encontrar, contactar y dar seguimiento a cada
                apartamento del conjunto.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/notifications"
                className="relative flex h-12 w-12 items-center justify-center rounded-[1.15rem] border border-[var(--app-card-border)] bg-white text-[var(--app-heading)] shadow-[0_10px_22px_rgba(93,64,55,0.06)]"
              >
                <Icon name="notifications" className="text-[1.16rem]" />
                <span className="absolute right-2.5 top-2.5 h-2.5 w-2.5 rounded-full bg-[var(--app-secondary)]" />
              </Link>
              <Link
                href="/residents/new"
                className="flex h-12 w-12 items-center justify-center rounded-[1.15rem] border border-[var(--app-card-border)] bg-[var(--app-primary)] text-white shadow-[0_10px_22px_rgba(93,64,55,0.14)]"
              >
                <Icon name="person_add" className="text-[1.08rem]" />
              </Link>
            </div>
          </div>
        </header>

        <main className="app-scroll flex-1 overflow-y-auto px-4 pb-24 pt-6">
          <GlassCard className="overflow-hidden rounded-[2rem] p-4">
            <div className="app-figure overflow-hidden rounded-[1.6rem] border">
              <SceneArt variant="concierge" className="h-[12rem] w-full" />
            </div>

            <div className="mt-5">
              <p className="app-kicker">Vista de cartera</p>
              <h2 className="app-display mt-2 text-[1.8rem] font-[680] leading-[1.02] text-[var(--app-heading)]">
                Relación clara entre apartamentos, residentes y estado de cartera
              </h2>
              <p className="mt-3 text-[0.94rem] leading-6 text-[var(--app-muted)]">
                La información se organiza por apartamentos y mantiene visible lo importante sin
                que las etiquetas ni los textos se salgan de su espacio.
              </p>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-2">
              <div className="rounded-[1.2rem] border border-[var(--app-card-border)] bg-[var(--app-surface-soft)] px-3 py-3">
                <p className="text-[0.66rem] uppercase tracking-[0.14em] text-[var(--app-muted)]">
                  Total
                </p>
                <p className="mt-2 text-[1.35rem] font-semibold text-[var(--app-heading)]">
                  {stats.total}
                </p>
              </div>
              <div className="rounded-[1.2rem] border border-[var(--app-card-border)] bg-[var(--app-surface-soft)] px-3 py-3">
                <p className="text-[0.66rem] uppercase tracking-[0.14em] text-[var(--app-muted)]">
                  Al día
                </p>
                <p className="mt-2 text-[1.35rem] font-semibold text-[var(--app-success)]">
                  {stats.current}
                </p>
              </div>
              <div className="rounded-[1.2rem] border border-[var(--app-card-border)] bg-[var(--app-surface-soft)] px-3 py-3">
                <p className="text-[0.66rem] uppercase tracking-[0.14em] text-[var(--app-muted)]">
                  Mora
                </p>
                <p className="mt-2 text-[1.35rem] font-semibold text-[var(--app-danger)]">
                  {stats.overdue}
                </p>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <Link
                href="/residents/new"
                className="app-button-primary flex h-[3.7rem] items-center justify-center gap-2 rounded-[1rem] px-4 text-[0.95rem] font-semibold"
              >
                <Icon name="person_add" className="text-[1rem]" />
                Agregar residente
              </Link>
              <Link
                href="/messages/12b"
                className="app-button-secondary flex h-[3.7rem] items-center justify-center gap-2 rounded-[1rem] px-4 text-[0.95rem] font-semibold"
              >
                <Icon name="chat_bubble" className="text-[1rem]" />
                Abrir mensajes
              </Link>
            </div>
          </GlassCard>

          <div className="mt-5 flex items-center gap-3 rounded-[1.25rem] border border-[var(--app-card-border)] bg-white px-4 py-4 shadow-[0_12px_22px_rgba(93,64,55,0.05)]">
            <Icon name="search" className="text-[1.25rem] text-[var(--app-muted)]" />
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar por nombre, apartamento, correo o teléfono..."
              className="w-full border-none bg-transparent text-[0.98rem] text-[var(--app-heading)] outline-none"
            />
            <Icon name="tune" className="text-[1.15rem] text-[var(--app-muted)]" />
          </div>

          <div className="app-horizontal no-scrollbar mt-4 flex gap-3 overflow-x-auto pb-2">
            {filters.map((item) => {
              const active = filter === item;
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => setFilter(item)}
                  className={`flex h-10 shrink-0 items-center justify-center rounded-full px-5 text-[0.9rem] font-semibold ${
                    active
                      ? "app-button-primary"
                      : "app-button-secondary"
                  }`}
                >
                  {item}
                </button>
              );
            })}
          </div>

          <div className="mt-6 space-y-6">
            {message ? (
              <div className="rounded-[1rem] border border-[rgba(86,114,96,0.18)] bg-[var(--app-success-bg)] px-4 py-3 text-[0.9rem] text-[var(--app-success)]">
                {message}
              </div>
            ) : null}

            {error ? (
              <div className="rounded-[1rem] border border-[rgba(161,90,73,0.18)] bg-[var(--app-danger-bg)] px-4 py-3 text-[0.9rem] text-[var(--app-danger)]">
                {error}
              </div>
            ) : null}

            {loading ? (
              <GlassCard className="rounded-[1.6rem] p-6">
                <p className="text-[0.95rem] text-[var(--app-muted)]">Cargando directorio...</p>
              </GlassCard>
            ) : null}

            {!loading && unitSections.length === 0 ? (
              <GlassCard className="rounded-[1.6rem] p-6">
                <p className="text-[0.95rem] text-[var(--app-muted)]">
                  No encontramos residentes con ese criterio de búsqueda.
                </p>
              </GlassCard>
            ) : null}

            {unitSections.map((section) => (
              <section key={section.title} className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <span
                      className={`h-5 w-1.5 shrink-0 rounded-full ${
                        section.accent === "gold"
                          ? "bg-[var(--app-secondary)]"
                          : "bg-[var(--app-primary)]"
                      }`}
                    />
                    <div className="min-w-0">
                      <p className="app-kicker !text-[0.58rem]">Sector</p>
                      <h2 className="truncate text-[1rem] font-semibold text-[var(--app-heading)]">
                        {section.title}
                      </h2>
                    </div>
                  </div>

                  <span className="rounded-full bg-[var(--app-surface-soft)] px-3 py-2 text-[0.72rem] font-semibold text-[var(--app-heading)]">
                    {section.residents.length} residentes
                  </span>
                </div>

                <GlassCard className="rounded-[1.8rem] p-4">
                  <div className="flex items-center gap-3 border-b border-[var(--app-card-border)] pb-4">
                    <div
                      className={`flex h-[3.5rem] w-[3.5rem] shrink-0 items-center justify-center rounded-[1.1rem] text-[1rem] font-semibold ${
                        section.accent === "gold"
                          ? "bg-[#FAF2E5] text-[#9E7B42]"
                          : "bg-[var(--app-primary-soft)] text-[var(--app-primary)]"
                      }`}
                    >
                      {section.unitCode}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[1rem] font-semibold text-[var(--app-heading)]">
                        {section.tower} · Apartamento {section.unitCode}
                      </p>
                      <p className="mt-1 text-[0.84rem] text-[var(--app-muted)]">
                        {section.residents.length === 1
                          ? "1 residente vinculado"
                          : `${section.residents.length} residentes vinculados`}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 space-y-3">
                    {section.residents.map((resident) => {
                      const statusTone =
                        resident.status === "paid"
                          ? "bg-[var(--app-success-bg)] text-[var(--app-success)]"
                          : resident.status === "overdue"
                            ? "bg-[var(--app-danger-bg)] text-[var(--app-danger)]"
                            : "bg-[#FAF2E5] text-[#9E7B42]";

                      return (
                        <div
                          key={resident.id}
                          className="rounded-[1.3rem] border border-[var(--app-card-border)] bg-white px-4 py-4"
                        >
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-start justify-between gap-3">
                              <div className="min-w-0">
                                <p className="truncate text-[1.05rem] font-semibold text-[var(--app-heading)]">
                                  {resident.name}
                                </p>
                                <div className="mt-2 flex flex-wrap items-center gap-2">
                                  <span className="rounded-full bg-[var(--app-surface-soft)] px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-[var(--app-heading)]">
                                    {resident.residentType}
                                  </span>
                                  <span
                                    className={`rounded-full px-3 py-1 text-[0.72rem] font-semibold ${statusTone}`}
                                  >
                                    {resident.status === "paid"
                                      ? "Al día"
                                      : resident.status === "overdue"
                                        ? "En mora"
                                        : "Pendiente"}
                                  </span>
                                </div>
                              </div>

                              <div className="rounded-full bg-[var(--app-surface-soft)] px-3 py-2 text-[0.84rem] font-semibold text-[var(--app-heading)]">
                                ${resident.balance.toFixed(2)}
                              </div>
                            </div>

                            <div className="mt-3 grid gap-2 text-[0.86rem] text-[var(--app-muted)]">
                              <div className="flex min-w-0 items-center gap-2">
                                <Icon name="mail" className="shrink-0 text-[0.95rem]" />
                                <span className="truncate">{resident.email}</span>
                              </div>
                              <div className="flex min-w-0 items-center gap-2">
                                <Icon name="call" className="shrink-0 text-[0.95rem]" />
                                <span className="truncate">{resident.phone}</span>
                              </div>
                            </div>
                          </div>

                          <div className="mt-4 grid grid-cols-1 gap-2 border-t border-[var(--app-card-border)] pt-4 sm:grid-cols-3">
                            <Link
                              href={`/messages/${resident.slug}`}
                              className="app-button-secondary flex h-11 items-center justify-center gap-2 rounded-[1rem] text-[0.92rem] font-semibold"
                            >
                              <Icon name="chat_bubble" className="text-[0.95rem]" />
                              Mensaje
                            </Link>
                            <Link
                              href={`/residents/${resident.slug}`}
                              className="app-button-secondary flex h-11 items-center justify-center gap-2 rounded-[1rem] text-[0.92rem] font-semibold"
                            >
                              <Icon name="visibility" className="text-[0.95rem]" />
                              Detalles
                            </Link>
                            <button
                              type="button"
                              disabled={Boolean(deletingId)}
                              onClick={() => void handleDeleteResident(resident)}
                              className="flex h-11 items-center justify-center gap-2 rounded-[1rem] border border-[rgba(161,90,73,0.2)] bg-[var(--app-danger-bg)] text-[0.88rem] font-semibold text-[var(--app-danger)] disabled:opacity-60"
                            >
                              <Icon name="delete" className="text-[0.95rem]" />
                              {deletingId === resident.id ? "Eliminando..." : "Eliminar"}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </GlassCard>
              </section>
            ))}
          </div>
        </main>

        <StitchTabBar
          items={[
            { label: "Panel", href: "/dashboard", icon: "dashboard" },
            { label: "Residentes", href: "/residents", icon: "group", active: true },
            { label: "Nuevo", href: "/residents/new", icon: "person_add", variant: "fab", tone: "gold" },
            { label: "Pagos", href: "/payments", icon: "payments" },
            { label: "Cuenta", href: "/settings", icon: "settings" },
          ]}
        />
      </div>
    </AppViewport>
  );
}

export default function ResidentsPage() {
  return (
    <RoleGate allow={["admin"]}>
      <ResidentsContent />
    </RoleGate>
  );
}
