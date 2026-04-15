"use client";

import {
  adminPaymentHistory,
  adminPaymentRows,
  adminSummary,
  amenities as demoAmenities,
  getResidentAnnouncements,
  getResidentAssemblies,
  getResidentByEmail,
  getResidentLedger,
  getResidentReservations,
  residents as demoResidents,
} from "@/data/demoDb";
import type {
  AmenityRecord,
  ResidentPaymentRecord,
  ResidentProfile,
} from "@/data/demoDb";
import type { SessionUser } from "@/lib/demoAuth";
import { getSupabaseAccessToken } from "@/lib/supabase/browser";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export type PaymentRow = {
  id: string;
  unitLabel: string;
  statusLabel: string;
  statusTone: "danger" | "success" | "violet";
  amountLabel: string;
  helperLabel: string;
  residentSlug: string;
};

export type PaymentActivity = {
  id: string;
  title: string;
  amountLabel: string;
  note: string;
};

export type PaymentsOverview = {
  residents: ResidentProfile[];
  rows: PaymentRow[];
  history: PaymentActivity[];
  monthlyCollectionFull: string;
};

export type ResidentPortalData = {
  resident: ResidentProfile | null;
  announcements: ReturnType<typeof getResidentAnnouncements>;
  assemblies: ReturnType<typeof getResidentAssemblies>;
  reservations: Array<
    {
      id: string;
      dateLabel: string;
      timeLabel: string;
      status: "confirmed" | "pending";
      amenity: { title: string };
    }
  >;
  ledger: ResidentPaymentRecord[];
  amenities: AmenityRecord[];
};

export type CreateResidentPayload = {
  fullName: string;
  email: string;
  phone: string;
  tower: string;
  levelLabel: string;
  unitCode: string;
  residentType: "owner" | "tenant";
  balance?: number;
  notes?: string;
  password?: string;
};

export type RegisterPaymentPayload = {
  residentId: string;
  amount: number;
  title: string;
  paymentMethod: string;
  note?: string;
};

export type ReservationPayload = {
  amenityId: string;
  startsAt: string;
  endsAt: string;
  note?: string;
};

const DATA_CACHE_TTL = 60_000;
const dataCache = new Map<string, { data: unknown; expiresAt: number }>();
const inflightCache = new Map<string, Promise<unknown>>();

function money(value: number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(value);
}

function compactMoney(value: number) {
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(1)}k`;
  }

  return money(value);
}

function toOptionalString(value: unknown) {
  return typeof value === "string" ? value : undefined;
}

async function getAuthenticatedHeaders() {
  const headers = new Headers({
    "Content-Type": "application/json",
  });

  if (!isSupabaseConfigured()) {
    return headers;
  }

  const accessToken = await getSupabaseAccessToken();

  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  return headers;
}

async function withDataCache<T>(
  key: string,
  loader: () => Promise<T>,
  ttl = DATA_CACHE_TTL,
) {
  const cached = dataCache.get(key);

  if (cached && cached.expiresAt > Date.now()) {
    return cached.data as T;
  }

  const inflight = inflightCache.get(key);

  if (inflight) {
    return (await inflight) as T;
  }

  const pending = loader()
    .then((result) => {
      dataCache.set(key, {
        data: result,
        expiresAt: Date.now() + ttl,
      });
      return result;
    })
    .finally(() => {
      inflightCache.delete(key);
    });

  inflightCache.set(key, pending);
  return pending;
}

export function clearAppDataCache() {
  dataCache.clear();
  inflightCache.clear();
}

function formatDateLabel(input?: string | null) {
  if (!input) {
    return "Sin fecha";
  }

  const value = new Date(input);
  return new Intl.DateTimeFormat("es-CO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(value);
}

function formatDateTimeLabel(input?: string | null) {
  if (!input) {
    return "Sin movimiento";
  }

  const value = new Date(input);
  return new Intl.DateTimeFormat("es-CO", {
    day: "2-digit",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  }).format(value);
}

function formatTimeRange(startsAt?: string | null, endsAt?: string | null) {
  if (!startsAt || !endsAt) {
    return "Hora por confirmar";
  }

  const formatter = new Intl.DateTimeFormat("es-CO", {
    hour: "numeric",
    minute: "2-digit",
  });

  return `${formatter.format(new Date(startsAt))} - ${formatter.format(new Date(endsAt))}`;
}

function toResidentProfile(row: Record<string, unknown>) {
  const unit = (row.unit ?? {}) as Record<string, unknown>;
  const tower = String(unit.tower ?? "Torre");
  const unitCode = String(unit.unit_code ?? "000");
  const levelLabel = String(unit.level_label ?? "Nivel");
  const residentTypeRaw = String(row.resident_type ?? "tenant");
  const status = (row.status ?? "pending") as ResidentProfile["status"];

  return {
    id: String(row.id ?? ""),
    slug: String(row.slug ?? ""),
    email: String(row.email ?? ""),
    name: String(row.full_name ?? "Residente"),
    unitCode,
    tower,
    levelLabel,
    unitLabel: `${tower} - ${unitCode}`,
    residentType: residentTypeRaw === "owner" ? "Propietario" : "Inquilino",
    phone: String(row.phone ?? "Sin contacto"),
    status,
    balance: Number(row.balance ?? 0),
    statusLabel: status.toUpperCase(),
    accent: tower.includes("B") ? "gold" : "violet",
    summary: String(row.notes ?? "Perfil sincronizado desde Supabase."),
    avatarLabel: unitCode,
  } satisfies ResidentProfile;
}

export async function fetchResidentsDirectory() {
  if (!isSupabaseConfigured()) {
    return demoResidents;
  }

  return withDataCache("admin:residents", async () => {
    const headers = await getAuthenticatedHeaders();
    const response = await fetch("/api/admin/residents", {
      method: "GET",
      headers,
      credentials: "include",
    });

    if (!response.ok) {
      return demoResidents;
    }

    const result = (await response.json()) as { residents?: Record<string, unknown>[] };
    const data = result.residents ?? [];

    if (!data.length) {
      return demoResidents;
    }

    return [...data]
      .map((row) => toResidentProfile(row as Record<string, unknown>))
      .sort((left, right) => left.unitLabel.localeCompare(right.unitLabel));
  });
}

export async function fetchPaymentsOverview(): Promise<PaymentsOverview> {
  if (!isSupabaseConfigured()) {
    return {
      residents: demoResidents,
      rows: adminPaymentRows,
      history: adminPaymentHistory,
      monthlyCollectionFull: adminSummary.monthlyCollectionFull,
    };
  }

  return withDataCache("admin:overview", async () => {
    const headers = await getAuthenticatedHeaders();
    const response = await fetch("/api/admin/overview", {
      method: "GET",
      headers,
      credentials: "include",
    });

    if (!response.ok) {
      return {
        residents: demoResidents,
        rows: adminPaymentRows,
        history: adminPaymentHistory,
        monthlyCollectionFull: adminSummary.monthlyCollectionFull,
      };
    }

    const result = (await response.json()) as {
      residents?: Record<string, unknown>[];
      payments?: Record<string, unknown>[];
    };

    const residentRows = result.residents ?? [];
    const paymentsData = result.payments ?? [];

    if (!residentRows.length) {
      return {
        residents: demoResidents,
        rows: adminPaymentRows,
        history: adminPaymentHistory,
        monthlyCollectionFull: adminSummary.monthlyCollectionFull,
      };
    }

    const residents = residentRows
      .map((row) => toResidentProfile(row))
      .sort((left, right) => left.unitLabel.localeCompare(right.unitLabel));
    const typedPayments = paymentsData as Record<string, unknown>[];

    const rows = residents
      .slice()
      .sort((left, right) => right.balance - left.balance)
      .map((resident) => ({
        id: resident.id,
        unitLabel: resident.unitLabel,
        statusLabel:
          resident.status === "paid"
            ? "Al día"
            : resident.status === "overdue"
              ? "En mora"
              : "Pendiente",
        statusTone:
          resident.status === "paid"
            ? "success"
            : resident.status === "overdue"
              ? "danger"
              : "violet",
        amountLabel: money(resident.balance),
        helperLabel:
          resident.status === "paid"
            ? "SIN DEUDA"
            : resident.status === "overdue"
              ? "SALDO TOTAL"
              : "PENDIENTE",
        residentSlug: resident.slug,
      })) satisfies PaymentRow[];

    const history = typedPayments.map((entry) => {
      const resident = residents.find((item) => item.id === entry.resident_id);
      const method = String(entry.payment_method ?? "Pago");
      const activityTimestamp = toOptionalString(entry.paid_at) ?? toOptionalString(entry.created_at);
      return {
        id: String(entry.id),
        title: String(entry.title ?? method),
        amountLabel: `+${money(Number(entry.amount ?? 0))}`,
        note: `${formatDateTimeLabel(activityTimestamp)} • ${resident?.unitLabel ?? "Unidad"}`,
      };
    });

    const now = new Date();
    const monthlyCollection = typedPayments.reduce((total: number, entry) => {
      const paidAtValue = toOptionalString(entry.paid_at);
      const paidAt = paidAtValue ? new Date(paidAtValue) : null;

      if (
        entry.status === "paid" &&
        paidAt &&
        paidAt.getMonth() === now.getMonth() &&
        paidAt.getFullYear() === now.getFullYear()
      ) {
        return total + Number(entry.amount ?? 0);
      }

      return total;
    }, 0);

    return {
      residents,
      rows,
      history,
      monthlyCollectionFull: money(monthlyCollection),
    };
  });
}

export async function fetchResidentPortalData(
  session: SessionUser | null,
): Promise<ResidentPortalData> {
  if (!session) {
    return {
      resident: null,
      announcements: getResidentAnnouncements(),
      assemblies: [],
      reservations: [],
      ledger: [],
      amenities: demoAmenities,
    };
  }

  if (!isSupabaseConfigured()) {
    const resident = getResidentByEmail(session.email);
    return {
      resident,
      announcements: getResidentAnnouncements(),
      assemblies: resident ? getResidentAssemblies(resident) : [],
      reservations: resident ? getResidentReservations(resident) : [],
      ledger: resident ? getResidentLedger(resident) : [],
      amenities: demoAmenities,
    };
  }

  const cacheKey = `resident:portal:${session.userId ?? session.email}`;

  return withDataCache(cacheKey, async () => {
    const headers = await getAuthenticatedHeaders();
    const response = await fetch("/api/resident/portal", {
      method: "GET",
      headers,
      credentials: "include",
    });

    if (!response.ok) {
      return {
        resident: null,
        announcements: getResidentAnnouncements(),
        assemblies: [],
        reservations: [],
        ledger: [],
        amenities: demoAmenities,
      };
    }

    const result = (await response.json()) as {
      resident?: Record<string, unknown> | null;
      announcements?: Record<string, unknown>[];
      assemblies?: Record<string, unknown>[];
      amenities?: Record<string, unknown>[];
      reservations?: Record<string, unknown>[];
      payments?: Record<string, unknown>[];
    };

    const residentRow = result.resident ?? null;

    if (!residentRow) {
      return {
        resident: null,
        announcements: getResidentAnnouncements(),
        assemblies: [],
        reservations: [],
        ledger: [],
        amenities: demoAmenities,
      };
    }

    const resident = toResidentProfile(residentRow as Record<string, unknown>);
    const announcementsData = result.announcements ?? [];
    const assembliesData = result.assemblies ?? [];
    const amenitiesData = result.amenities ?? [];
    const reservationsData = result.reservations ?? [];
    const paymentsData = result.payments ?? [];

    const amenities =
      amenitiesData?.map((amenity: Record<string, unknown>) => ({
        id: String(amenity.id),
        title: String(amenity.title),
        icon: String(amenity.icon ?? "event_note"),
        description: String(amenity.description ?? ""),
        nextSlot: String(amenity.next_slot ?? "Sin agenda"),
        color: ((amenity.color ?? "gold") as AmenityRecord["color"]) ?? "gold",
      })) ?? demoAmenities;

    const amenityById = new Map<string, AmenityRecord>(
      amenities.map((amenity: AmenityRecord) => [amenity.id, amenity]),
    );

    const reservations =
      reservationsData?.map((entry: Record<string, unknown>) => ({
        id: String(entry.id),
        dateLabel: formatDateLabel(toOptionalString(entry.starts_at)),
        timeLabel: formatTimeRange(toOptionalString(entry.starts_at), toOptionalString(entry.ends_at)),
        status: (entry.status === "confirmed" ? "confirmed" : "pending") as "confirmed" | "pending",
        amenity: { title: amenityById.get(String(entry.amenity_id))?.title ?? "Amenidad" },
      })) ?? [];

    const ledger =
      paymentsData?.map((entry: Record<string, unknown>) => {
        const status =
          entry.status === "paid"
            ? "paid"
            : entry.status === "due"
              ? "due"
              : "pending";

        return {
          id: String(entry.id),
          residentId: resident.id,
          title: String(entry.title ?? "Movimiento"),
          amountLabel: money(Number(entry.amount ?? 0)),
          dateLabel: formatDateLabel(
            toOptionalString(entry.paid_at) ??
              toOptionalString(entry.due_date) ??
              toOptionalString(entry.created_at),
          ),
          status: status as ResidentPaymentRecord["status"],
          note: String(entry.note ?? "Movimiento sincronizado desde Supabase."),
        };
      }) ?? [];

    return {
      resident,
      announcements:
        announcementsData?.map((announcement: Record<string, unknown>) => ({
          id: String(announcement.id),
          title: String(announcement.title),
          note: String(announcement.note ?? ""),
          tone: ((announcement.tone ?? "gold") as "violet" | "gold" | "teal") ?? "gold",
        })) ?? getResidentAnnouncements(),
      assemblies:
        assembliesData?.map((assembly: Record<string, unknown>) => ({
          id: String(assembly.id),
          title: String(assembly.title),
          dateLabel: formatDateLabel(toOptionalString(assembly.starts_at)),
          location: String(assembly.location ?? "Salón comunal"),
          topic: String(assembly.topic ?? ""),
          audience: "all",
          summary: String(assembly.summary ?? ""),
        })) ?? [],
      reservations,
      ledger,
      amenities,
    };
  });
}

export async function createResident(payload: CreateResidentPayload) {
  const headers = await getAuthenticatedHeaders();
  const response = await fetch("/api/admin/residents", {
    method: "POST",
    headers,
    credentials: "include",
    body: JSON.stringify(payload),
  });

  const result = (await response.json()) as Record<string, unknown>;

  if (!response.ok) {
    throw new Error(String(result.error ?? "No fue posible crear el residente."));
  }

  clearAppDataCache();
  return result;
}

export async function registerPayment(payload: RegisterPaymentPayload) {
  const headers = await getAuthenticatedHeaders();
  const response = await fetch("/api/admin/payments", {
    method: "POST",
    headers,
    credentials: "include",
    body: JSON.stringify(payload),
  });

  const result = (await response.json()) as Record<string, unknown>;

  if (!response.ok) {
    throw new Error(String(result.error ?? "No fue posible registrar el pago."));
  }

  clearAppDataCache();
  return result;
}

export async function requestReservation(payload: ReservationPayload) {
  const headers = await getAuthenticatedHeaders();
  const response = await fetch("/api/resident/reservations", {
    method: "POST",
    headers,
    credentials: "include",
    body: JSON.stringify(payload),
  });

  const result = (await response.json()) as Record<string, unknown>;

  if (!response.ok) {
    throw new Error(String(result.error ?? "No fue posible enviar la reserva."));
  }

  clearAppDataCache();
  return result;
}

export function summarizeMonthlyCollection(value: string) {
  const numeric = Number(value.replace(/[^\d.-]/g, ""));
  return Number.isFinite(numeric) ? compactMoney(numeric) : adminSummary.monthlyCollectionLabel;
}
