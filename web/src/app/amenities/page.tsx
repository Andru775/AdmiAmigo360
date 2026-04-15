import Link from "next/link";

import { AppScreen } from "@/components/app/AppScreen";
import { GlassCard } from "@/components/app/GlassCard";
import { HeaderBar } from "@/components/app/HeaderBar";
import { Icon } from "@/components/app/Icon";
import { RoleGate } from "@/components/app/RoleGate";
import { amenities, reservations, residents } from "@/data/demoDb";

function AmenitiesContent() {
  return (
    <AppScreen
      currentNav="dashboard"
      header={
        <HeaderBar
          title="Amenidades"
          subtitle="Reservas activas y disponibilidad para el conjunto."
          icon="event_note"
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
        {amenities.map((amenity) => {
          const amenityReservations = reservations.filter((reservation) => reservation.amenityId === amenity.id);

          return (
            <GlassCard key={amenity.id} className="rounded-[1.3rem] border-white/10 bg-[#7A6358] p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[0.95rem] bg-[#41332D] text-[#C5A059]">
                      <Icon name={amenity.icon} className="text-[1.1rem]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[1rem] font-semibold text-white">{amenity.title}</p>
                      <p className="text-[0.84rem] text-slate-400">{amenity.nextSlot}</p>
                    </div>
                  </div>
                  <p className="mt-3 text-[0.92rem] leading-6 text-slate-400">{amenity.description}</p>
                </div>
                <span className="shrink-0 rounded-full bg-[#473730] px-3 py-1 text-[0.72rem] font-semibold text-[#C5A059]">
                  {amenityReservations.length} reservas
                </span>
              </div>

              <div className="mt-4 space-y-2 border-t border-white/8 pt-4">
                {amenityReservations.map((reservation) => {
                  const resident = residents.find((item) => item.id === reservation.residentId);

                  return (
                    <div key={reservation.id} className="flex items-center justify-between gap-3 rounded-[1rem] bg-black/20 px-4 py-3">
                      <div className="min-w-0">
                        <p className="truncate text-[0.92rem] font-semibold text-white">
                          {resident?.name ?? "Residente"}
                        </p>
                        <p className="text-[0.8rem] text-slate-400">
                          {reservation.dateLabel} • {reservation.timeLabel}
                        </p>
                      </div>
                      <span
                        className={`shrink-0 rounded-full px-3 py-1 text-[0.72rem] font-semibold ${
                          reservation.status === "confirmed"
                            ? "bg-[#32443A] text-[#7B986A]"
                            : "bg-[#473730] text-[#C5A059]"
                        }`}
                      >
                        {reservation.status === "confirmed" ? "CONFIRMADA" : "PENDIENTE"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </GlassCard>
          );
        })}
      </div>
    </AppScreen>
  );
}

export default function AmenitiesPage() {
  return (
    <RoleGate allow={["admin"]}>
      <AmenitiesContent />
    </RoleGate>
  );
}
