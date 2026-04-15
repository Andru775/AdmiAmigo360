import type { DemoAccount, DemoRole } from "@/data/appData";

export type SessionRole = DemoRole;

export type ResidentProfile = {
  id: string;
  slug: string;
  email: string;
  name: string;
  unitCode: string;
  tower: string;
  levelLabel: string;
  unitLabel: string;
  residentType: "Propietario" | "Inquilino";
  phone: string;
  status: "paid" | "overdue" | "pending";
  balance: number;
  statusLabel: string;
  accent: "violet" | "gold" | "teal";
  summary: string;
  avatarLabel: string;
};

export type AdminTask = {
  id: string;
  title: string;
  note: string;
  priority: "high" | "medium" | "done";
  targetUnit?: string;
  icon: string;
  href: string;
  actionLabel?: string;
};

export type AssemblyRecord = {
  id: string;
  title: string;
  dateLabel: string;
  location: string;
  topic: string;
  audience: "all" | "owners" | "tower-a";
  summary: string;
};

export type AmenityRecord = {
  id: string;
  title: string;
  icon: string;
  description: string;
  nextSlot: string;
  color: "violet" | "gold" | "teal";
};

export type ReservationRecord = {
  id: string;
  residentId: string;
  amenityId: string;
  dateLabel: string;
  timeLabel: string;
  status: "confirmed" | "pending";
};

export type ResidentPaymentRecord = {
  id: string;
  residentId: string;
  title: string;
  amountLabel: string;
  dateLabel: string;
  status: "paid" | "due" | "pending";
  note: string;
};

export type AnnouncementRecord = {
  id: string;
  title: string;
  note: string;
  tone: "violet" | "gold" | "teal";
};

export type MessageRecord = {
  residentId: string;
  residentLine: string;
  adminLine: string;
};

export const demoAccounts: DemoAccount[] = [
  {
    role: "admin",
    name: "Monica Pena",
    title: "Administradora general",
    email: "admin@admiamigo360.com",
    password: "Admin360!",
    homeHref: "/dashboard",
  },
  {
    role: "resident",
    name: "Elena Rodriguez",
    title: "Residente Torre A 12B",
    email: "residente@admiamigo360.com",
    password: "Resi360!",
    homeHref: "/resident",
  },
];

export const adminSummary = {
  propertyName: "Adminamigo 360",
  propertySubtitle: "Administración residencial",
  monthlyCollectionLabel: "$45.2k",
  monthlyCollectionFull: "$45,200",
  occupancyLabel: "124 unidades",
  occupancyRate: "94%",
  financialYield: "$124,000",
  targetLabel: "Meta: $135k",
};

export const adminBarSeries = [
  { month: "ENE", value: 32 },
  { month: "FEB", value: 46 },
  { month: "MAR", value: 41 },
  { month: "ABR", value: 74 },
  { month: "MAY", value: 62 },
  { month: "JUN", value: 96 },
];

export const adminTasks: AdminTask[] = [
  {
    id: "maintenance-elevator",
    title: "Mantenimiento de ascensor",
    note: "Torre B - 3 solicitudes urgentes",
    priority: "high",
    targetUnit: "Torre B",
    icon: "engineering",
    href: "/operations/maintenance",
  },
  {
    id: "late-payments",
    title: "Pagos vencidos",
    note: "15 unidades pendientes - 15 de junio",
    priority: "medium",
    icon: "receipt_long",
    href: "/operations/late-payments",
    actionLabel: "Recordar",
  },
  {
    id: "security-update",
    title: "Actualización de seguridad",
    note: "CCTV entrada principal - reparado",
    priority: "done",
    icon: "security",
    href: "/operations/security",
  },
];

export const adminQuickActions = [
  { id: "new-resident", label: "Agregar residente", href: "/residents/new", icon: "person_add" },
  { id: "reports", label: "Reportes", href: "/reports", icon: "description" },
  { id: "amenities", label: "Amenidades", href: "/amenities", icon: "event_note" },
  { id: "expenses", label: "Gastos", href: "/payments", icon: "payments" },
];

export const adminResidentSections = [
  {
    id: "tower-a-level-12",
    title: "Torre A - Nivel 12",
    accent: "violet" as const,
    residentSlugs: ["12a", "12b"],
  },
  {
    id: "tower-b-penthouse",
    title: "Torre B - Ático",
    accent: "gold" as const,
    residentSlugs: ["ph1", "210"],
  },
];

export const residents: ResidentProfile[] = [
  {
    id: "resident-12a",
    slug: "12a",
    email: "alexander@wright.com",
    name: "Alexander Wright",
    unitCode: "12A",
    tower: "Torre A",
    levelLabel: "Nivel 12",
    unitLabel: "Torre A - 12A",
    residentType: "Propietario",
    phone: "+1 234 567 890",
    status: "paid",
    balance: 0,
    statusLabel: "AL DÍA",
    accent: "violet",
    summary: "Perfil de propietario al día, con uso de amenidades y sin incidencias activas.",
    avatarLabel: "12A",
  },
  {
    id: "resident-12b",
    slug: "12b",
    email: "residente@admiamigo360.com",
    name: "Elena Rodriguez",
    unitCode: "12B",
    tower: "Torre A",
    levelLabel: "Nivel 12",
    unitLabel: "Torre A - 12B",
    residentType: "Inquilino",
    phone: "+1 876 543 210",
    status: "overdue",
    balance: 450,
    statusLabel: "EN MORA",
    accent: "violet",
    summary: "Cuenta demo residente con acceso a asambleas, reservas y avisos comunitarios.",
    avatarLabel: "12B",
  },
  {
    id: "resident-ph1",
    slug: "ph1",
    email: "m.sterling@luxury.com",
    name: "Marcus Sterling",
    unitCode: "PH1",
    tower: "Torre B",
    levelLabel: "Ático",
    unitLabel: "Torre B - PH1",
    residentType: "Propietario",
    phone: "+1 302 991 881",
    status: "paid",
    balance: 0,
    statusLabel: "AL DÍA",
    accent: "gold",
    summary: "Propietario premium con solicitudes de conserjería y pago anual anticipado.",
    avatarLabel: "PH1",
  },
  {
    id: "resident-210",
    slug: "210",
    email: "juan.ortega@correo.com",
    name: "Juan Camilo Ortega",
    unitCode: "210",
    tower: "Torre B",
    levelLabel: "Nivel 2",
    unitLabel: "Torre B - 210",
    residentType: "Inquilino",
    phone: "+57 310 442 9918",
    status: "pending",
    balance: 225,
    statusLabel: "PENDIENTE",
    accent: "gold",
    summary: "Validación de pago PSE pendiente, sin otras novedades abiertas.",
    avatarLabel: "210",
  },
];

export const adminPaymentRows = [
  {
    id: "row-402",
    unitLabel: "Torre A - 402",
    statusLabel: "En mora (2 meses)",
    statusTone: "danger" as const,
    amountLabel: "$450.00",
    helperLabel: "DEUDA TOTAL",
    residentSlug: "12b",
  },
  {
    id: "row-105",
    unitLabel: "Torre C - 105",
    statusLabel: "Al día",
    statusTone: "success" as const,
    amountLabel: "$0.00",
    helperLabel: "SIN DEUDA",
    residentSlug: "12a",
  },
  {
    id: "row-210",
    unitLabel: "Torre B - 210",
    statusLabel: "Pago pendiente",
    statusTone: "violet" as const,
    amountLabel: "$225.00",
    helperLabel: "MES ACTUAL",
    residentSlug: "210",
  },
];

export const adminPaymentHistory = [
  {
    id: "payment-1",
    title: "Transferencia Recibida",
    amountLabel: "+$225.00",
    note: "Hoy, 10:45 AM • Torre D-301",
  },
  {
    id: "payment-2",
    title: "Pago en Efectivo",
    amountLabel: "+$225.00",
    note: "Ayer, 4:20 PM • Torre A-102",
  },
];

export const adminNotifications = [
  {
    id: "admin-notification-1",
    title: "3 pagos entraron en validación",
    note: "Banco aliado reportó movimientos hace 14 minutos.",
    icon: "notifications_active",
  },
  {
    id: "admin-notification-2",
    title: "Mantenimiento confirmado en Torre B",
    note: "Proveedor asignado para mañana a las 8:00 AM.",
    icon: "handyman",
  },
  {
    id: "admin-notification-3",
    title: "Recordatorios listos para enviarse",
    note: "15 avisos quedaron programados para las 5:00 PM.",
    icon: "schedule_send",
  },
];

export const adminReportCards = [
  {
    id: "report-collection",
    title: "Tasa de recaudo",
    value: "92%",
    note: "12 puntos por encima del trimestre anterior.",
    icon: "payments",
  },
  {
    id: "report-portfolio",
    title: "Cartera abierta",
    value: "$12.8k",
    note: "24 unidades concentran el 81% de la cartera activa.",
    icon: "monitoring",
  },
  {
    id: "report-occupancy",
    title: "Ocupación",
    value: "94%",
    note: "Solo 7 unidades están en rotación durante marzo.",
    icon: "home_work",
  },
];

export const adminExportActions = [
  {
    id: "export-portfolio",
    label: "Exportar cartera por torre",
    href: "/payments/reminders",
    helper: "Prepara el lote de cobro y recordatorios.",
  },
  {
    id: "export-directory",
    label: "Exportar directorio de residentes",
    href: "/residents",
    helper: "Directorio segmentado por torre y tipo de residente.",
  },
  {
    id: "committee-pack",
    label: "Armar paquete de comité",
    href: "/reports",
    helper: "Incluye KPIs, cobranza y estado operativo.",
  },
];

export const adminSettingsSections = [
  {
    id: "billing-rules",
    title: "Cobranza automatizada",
    items: [
      "Recordatorio preventivo 5 días antes del vencimiento.",
      "WhatsApp y push para cartera mayor a 30 días.",
      "Conciliación bancaria simulada cada hora.",
    ],
  },
  {
    id: "resident-communications",
    title: "Comunicación con residentes",
    items: [
      "Plantillas separadas para propietarios e inquilinos.",
      "Asambleas y anuncios visibles solo para perfiles residentes.",
      "Alertas internas reservadas al rol administrador.",
    ],
  },
  {
    id: "security",
    title: "Seguridad de acceso",
    items: [
      "Demo con perfiles precargados por rol.",
      "Cierre de sesión disponible desde admin y residente.",
      "Bloqueo de rutas privadas por tipo de usuario.",
    ],
  },
];

export const adminReminderCampaigns = [
  {
    id: "campaign-critical",
    title: "Cartera crítica",
    note: "8 unidades con más de 45 días de mora.",
    channel: "WhatsApp + email",
    href: "/messages/12b",
  },
  {
    id: "campaign-due",
    title: "Vencimiento de cierre mensual",
    note: "15 unidades deben quedar notificadas hoy antes de las 5:00 PM.",
    channel: "Push + email",
    href: "/payments",
  },
  {
    id: "campaign-confirmed",
    title: "Pagos en validación",
    note: "3 transferencias pendientes de conciliación bancaria.",
    channel: "Backoffice",
    href: "/notifications",
  },
];

export const adminOperationDetails = [
  {
    slug: "maintenance",
    title: "Mantenimiento de ascensor",
    headline: "Torre B - proveedor asignado",
    summary:
      "Coordina la ventana de mantenimiento, informa a los residentes impactados y deja trazabilidad del cierre.",
    checklist: [
      "Confirmar llegada del proveedor a recepción a las 8:00 AM.",
      "Avisar a PH1 y Torre B - 210 sobre restricción temporal del ascensor.",
      "Cargar evidencia fotográfica y cerrar acta en reportes.",
    ],
    primaryAction: { label: "Ver residentes impactados", href: "/residents" },
    secondaryAction: { label: "Ir a mensajes", href: "/messages/ph1" },
  },
  {
    slug: "late-payments",
    title: "Pagos vencidos",
    headline: "Seguimiento de cartera",
    summary:
      "Prioriza unidades con dos o más períodos vencidos y programa recordatorios antes del corte mensual.",
    checklist: [
      "Enviar recordatorio premium a Elena Rodriguez por saldo acumulado.",
      "Separar promesas de pago recibidas hoy por canal digital.",
      "Dejar listo el consolidado para reporte financiero del comité.",
    ],
    primaryAction: { label: "Abrir pagos", href: "/payments" },
    secondaryAction: { label: "Lanzar recordatorios", href: "/payments/reminders" },
  },
  {
    slug: "security",
    title: "Actualización de seguridad",
    headline: "CCTV entrada principal",
    summary:
      "La incidencia técnica ya fue resuelta; falta comunicar cierre y dejar evidencia en configuración operativa.",
    checklist: [
      "Marcar tarea cerrada para equipo de seguridad.",
      "Compartir evidencia con administración y vigilancia.",
      "Programar verificación preventiva para las otras cámaras.",
    ],
    primaryAction: { label: "Abrir configuración", href: "/settings" },
    secondaryAction: { label: "Volver al panel", href: "/dashboard" },
  },
];

export const residentTimelineBySlug: Record<string, string[]> = {
  "12a": [
    "Pago de marzo conciliado el 12 de marzo por transferencia.",
    "Reserva de piscina confirmada para el domingo a las 10:00 AM.",
    "Sin novedades disciplinarias ni PQRS abiertas.",
  ],
  "12b": [
    "Saldo acumulado de $450.00 pendiente entre febrero y marzo.",
    "Asamblea ordinaria pendiente por confirmar asistencia.",
    "Reserva del salón social aprobada para el 30 de marzo.",
  ],
  ph1: [
    "Propietario premium con mantenimiento preventivo programado.",
    "Pago anual anticipado registrado y confirmado.",
    "Solicitud de concierge abierta para visita técnica el viernes.",
  ],
  "210": [
    "Pago PSE enviado y pendiente de conciliación bancaria.",
    "Solicitud de parqueadero temporal aprobada para este fin de semana.",
    "Sin mensajes sin leer en el canal de administración.",
  ],
};

export const residentAnnouncements: AnnouncementRecord[] = [
  {
    id: "announcement-1",
    title: "Asamblea ordinaria confirmada",
    note: "Se realizará el 28 de marzo a las 7:00 PM en el salón social.",
    tone: "violet",
  },
  {
    id: "announcement-2",
    title: "Mantenimiento en piscina",
    note: "El área húmeda cerrará el sábado de 8:00 AM a 1:00 PM.",
    tone: "gold",
  },
  {
    id: "announcement-3",
    title: "Nueva reserva disponible",
    note: "Se habilitaron horarios extra para coworking la próxima semana.",
    tone: "teal",
  },
];

export const assemblies: AssemblyRecord[] = [
  {
    id: "assembly-1",
    title: "Asamblea Ordinaria 2026",
    dateLabel: "28 Mar • 7:00 PM",
    location: "Salón social",
    topic: "Presupuesto, cartera y mejoras",
    audience: "all",
    summary: "Sesión general para revisar estados financieros, votaciones y prioridades del trimestre.",
  },
  {
    id: "assembly-2",
    title: "Comité Torre A",
    dateLabel: "04 Apr • 6:30 PM",
    location: "Coworking 2",
    topic: "Ruido y uso de amenidades",
    audience: "tower-a",
    summary: "Encuentro corto para decisiones de convivencia y horarios en áreas comunes.",
  },
];

export const amenities: AmenityRecord[] = [
  {
    id: "amenity-pool",
    title: "Piscina",
    icon: "orb",
    description: "Turnos familiares de 90 minutos con aforo controlado.",
    nextSlot: "Hoy • 6:00 PM",
    color: "teal",
  },
  {
    id: "amenity-social",
    title: "Salón social",
    icon: "description",
    description: "Reservas para reuniones, cumpleaños y eventos internos.",
    nextSlot: "Sáb • 3:00 PM",
    color: "gold",
  },
  {
    id: "amenity-cowork",
    title: "Coworking",
    icon: "monitoring",
    description: "Espacio para trabajo remoto con cabinas y café.",
    nextSlot: "Mañana • 9:00 AM",
    color: "violet",
  },
];

export const reservations: ReservationRecord[] = [
  {
    id: "reservation-1",
    residentId: "resident-12b",
    amenityId: "amenity-social",
    dateLabel: "30 Mar 2026",
    timeLabel: "4:00 PM - 6:00 PM",
    status: "confirmed",
  },
  {
    id: "reservation-2",
    residentId: "resident-12b",
    amenityId: "amenity-cowork",
    dateLabel: "02 Apr 2026",
    timeLabel: "9:00 AM - 12:00 PM",
    status: "pending",
  },
];

export const residentLedger: ResidentPaymentRecord[] = [
  {
    id: "ledger-1",
    residentId: "resident-12b",
    title: "Cuota de administración marzo",
    amountLabel: "$225.00",
    dateLabel: "Vence 31 Mar",
    status: "due",
    note: "Saldo pendiente correspondiente al periodo actual.",
  },
  {
    id: "ledger-2",
    residentId: "resident-12b",
    title: "Cuota de administración febrero",
    amountLabel: "$225.00",
    dateLabel: "Vencida",
    status: "due",
    note: "Incluye intereses si se paga después del 31 de marzo.",
  },
  {
    id: "ledger-3",
    residentId: "resident-12b",
    title: "Pago registrado enero",
    amountLabel: "-$225.00",
    dateLabel: "03 Ene",
    status: "paid",
    note: "Transferencia conciliada correctamente.",
  },
];

export const residentNotifications = [
  {
    id: "resident-notification-1",
    title: "Tu reserva del salón social fue aprobada",
    note: "30 Mar • 4:00 PM - 6:00 PM",
    icon: "check_circle",
  },
  {
    id: "resident-notification-2",
    title: "Asamblea ordinaria esta semana",
    note: "Recuerda revisar el orden del día antes de asistir.",
    icon: "description",
  },
  {
    id: "resident-notification-3",
    title: "Saldo pendiente en administración",
    note: "Tienes $450.00 acumulados hasta marzo.",
    icon: "crisis_alert",
  },
];

export const messageThreads: MessageRecord[] = [
  {
    residentId: "resident-12a",
    residentLine: "Gracias, ya vi el recibo en la app.",
    adminLine: "Perfecto. Dejamos la cuenta cerrada y sin novedades.",
  },
  {
    residentId: "resident-12b",
    residentLine: "Necesito el extracto para revisar el saldo antes de pagar.",
    adminLine: "Ya te enviamos el detalle de cartera y el enlace de pago.",
  },
  {
    residentId: "resident-ph1",
    residentLine: "Por favor confirmen el horario del mantenimiento preventivo.",
    adminLine: "Quedó agendado para el viernes a las 9:00 AM con recepción avisada.",
  },
  {
    residentId: "resident-210",
    residentLine: "Acabo de pagar por PSE, quedó atento a la confirmación.",
    adminLine: "Tu validación bancaria sigue en proceso. Te avisamos apenas quede conciliada.",
  },
];

export function getResidentBySlug(slug: string) {
  return residents.find((resident) => resident.slug === slug) ?? null;
}

export function getResidentByEmail(email: string) {
  return residents.find((resident) => resident.email === email) ?? null;
}

export function getResidentThreadBySlug(slug: string) {
  const resident = getResidentBySlug(slug);
  if (!resident) {
    return null;
  }

  return messageThreads.find((thread) => thread.residentId === resident.id) ?? null;
}

export function getResidentAssemblies(resident: ResidentProfile) {
  return assemblies.filter((assembly) => {
    if (assembly.audience === "all") {
      return true;
    }

    if (assembly.audience === "owners") {
      return resident.residentType === "Propietario";
    }

    return resident.tower === "Torre A";
  });
}

export function getResidentReservations(resident: ResidentProfile) {
  return reservations
    .filter((reservation) => reservation.residentId === resident.id)
    .map((reservation) => ({
      ...reservation,
      amenity: amenities.find((amenity) => amenity.id === reservation.amenityId)!,
    }));
}

export function getResidentLedger(resident: ResidentProfile) {
  return residentLedger.filter((entry) => entry.residentId === resident.id);
}

export function getResidentAnnouncements() {
  return residentAnnouncements;
}
