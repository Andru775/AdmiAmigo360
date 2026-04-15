export type NavItemKey =
  | "dashboard"
  | "payments"
  | "residents"
  | "reports"
  | "settings";
export type DemoRole = "admin" | "resident";
export type ResidentStatusKey = "paid" | "overdue" | "pending";

export type DemoAccount = {
  role: DemoRole;
  name: string;
  title: string;
  email: string;
  password: string;
  homeHref: string;
};

export type ResidentRecord = {
  slug: string;
  unit: string;
  unitLabel: string;
  tower: string;
  level: string;
  name: string;
  role: "Propietario" | "Inquilino";
  contact: string;
  phone: string;
  status: string;
  statusKey: ResidentStatusKey;
  balance: string;
  summary: string;
  accentClassName: string;
  statusClassName: string;
  timeline: string[];
  lastMessage: string;
};

export const navItems: Array<{
  key: NavItemKey;
  href: string;
  label: string;
  icon: string;
}> = [
  { key: "dashboard", href: "/dashboard", label: "Inicio", icon: "dashboard" },
  {
    key: "residents",
    href: "/residents",
    label: "Residentes",
    icon: "group",
  },
  {
    key: "payments",
    href: "/payments",
    label: "Pagos",
    icon: "account_balance_wallet",
  },
];

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
    title: "Residente demo",
    email: "residente@admiamigo360.com",
    password: "Resi360!",
    homeHref: "/payments",
  },
];

export const dashboardMetrics = [
  {
    label: "Recaudo mensual",
    value: "$45.2k",
    detail: "+12% vs. mes anterior",
    icon: "payments",
    iconClassName: "bg-violet-500/15 text-violet-100",
    trendClassName: "bg-emerald-400/15 text-emerald-200",
  },
  {
    label: "Ocupación activa",
    value: "124 unidades",
    detail: "94% del conjunto al día",
    icon: "home_work",
    iconClassName: "bg-amber-300/15 text-amber-200",
    trendClassName: "bg-amber-300/15 text-amber-100",
  },
];

export const dashboardHighlights = [
  {
    title: "Cobranza del día",
    value: "$8,450",
    note: "18 pagos confirmados hoy",
    icon: "savings",
  },
  {
    title: "Incidencias abiertas",
    value: "7",
    note: "3 con prioridad alta",
    icon: "crisis_alert",
  },
];

export const dashboardYield = [
  { month: "Ene", value: 44 },
  { month: "Feb", value: 58 },
  { month: "Mar", value: 53 },
  { month: "Abr", value: 82 },
  { month: "May", value: 68 },
  { month: "Jun", value: 100 },
];

export const operations = [
  {
    slug: "maintenance",
    title: "Mantenimiento de ascensor",
    note: "Torre B, 3 solicitudes urgentes",
    icon: "engineering",
    toneClassName: "border-red-500/70 bg-red-500/10 text-red-100",
    stat: "3 abiertas",
    href: "/operations/maintenance",
  },
  {
    slug: "late-payments",
    title: "Pagos vencidos",
    note: "15 unidades pendientes, corte del 15",
    icon: "receipt_long",
    toneClassName: "border-amber-300/60 bg-amber-300/10 text-amber-100",
    stat: "15 alertas",
    href: "/operations/late-payments",
  },
  {
    slug: "security",
    title: "CCTV actualizado",
    note: "Entrada principal ya reparada",
    icon: "security",
    toneClassName: "border-violet-400/60 bg-violet-400/10 text-violet-100",
    stat: "Listo",
    href: "/operations/security",
  },
];

export const operationDetails = [
  {
    slug: "maintenance",
    title: "Ruta de mantenimiento",
    headline: "Ascensor Torre B",
    summary:
      "Coordina la visita del proveedor, informa a los residentes afectados y deja trazabilidad del cierre.",
    checklist: [
      "Confirmar ventana de mantenimiento con proveedor externo.",
      "Bloquear acceso de 8:00 AM a 11:00 AM en Torre B.",
      "Enviar aviso a residentes por mensajes y tablero digital.",
    ],
    primaryAction: { label: "Ver residentes impactados", href: "/residents" },
    secondaryAction: { label: "Abrir reportes", href: "/reports" },
  },
  {
    slug: "late-payments",
    title: "Seguimiento de cartera",
    headline: "Recordatorios pendientes",
    summary:
      "Prioriza unidades con dos o más períodos vencidos y programa recordatorios antes del corte mensual.",
    checklist: [
      "Enviar recordatorio inmediato a unidades con más de 45 días de mora.",
      "Actualizar acuerdos de pago confirmados esta semana.",
      "Exportar reporte para comité financiero.",
    ],
    primaryAction: { label: "Ir a gestión de pagos", href: "/payments" },
    secondaryAction: { label: "Generar recordatorios", href: "/payments/reminders" },
  },
  {
    slug: "security",
    title: "Control de seguridad",
    headline: "CCTV principal",
    summary:
      "La cámara de acceso principal ya fue reparada. Falta dejar evidencia y actualizar bitácora.",
    checklist: [
      "Registrar cierre técnico en bitácora.",
      "Compartir evidencia fotográfica con administración.",
      "Programar revisión preventiva de las otras dos cámaras.",
    ],
    primaryAction: { label: "Abrir configuración", href: "/settings" },
    secondaryAction: { label: "Volver al dashboard", href: "/dashboard" },
  },
];

export const dashboardActions = [
  {
    title: "Residentes",
    subtitle: "Directorio y novedades",
    href: "/residents",
    icon: "person_add",
  },
  {
    title: "Pagos",
    subtitle: "Cartera y recaudo",
    href: "/payments",
    icon: "payments",
  },
  {
    title: "Reportes",
    subtitle: "KPIs y exportes",
    href: "/reports",
    icon: "insights",
  },
  {
    title: "Cerrar sesión",
    subtitle: "Salir del demo",
    href: "/logout",
    icon: "logout",
  },
];

export const paymentBars = [
  { month: "Ene", value: 60 },
  { month: "Feb", value: 45 },
  { month: "Mar", value: 85 },
  { month: "Abr", value: 70 },
  { month: "May", value: 55 },
  { month: "Jun", value: 95 },
];

export const paymentActions = [
  { label: "Registrar pago", href: "/payments/register", icon: "add_card" },
  {
    label: "Enviar recordatorio",
    href: "/payments/reminders",
    icon: "send_and_archive",
  },
  { label: "Generar reporte", href: "/reports", icon: "description" },
];

export const residentDirectory: ResidentRecord[] = [
  {
    slug: "12a",
    unit: "12A",
    unitLabel: "Torre A - 12A",
    tower: "Torre A",
    level: "Nivel 12",
    name: "Alexander Wright",
    role: "Propietario",
    contact: "alexander@wright.com",
    phone: "+1 234 567 890",
    status: "Al día",
    statusKey: "paid",
    balance: "$0.00",
    summary: "Documentacion y pagos al día. Usa la app para reservar amenidades.",
    accentClassName: "bg-violet-400",
    statusClassName: "bg-emerald-500/15 text-emerald-200",
    timeline: [
      "Pago confirmado el 03 de marzo.",
      "Reserva de salón social aprobada para el 24 de marzo.",
      "Sin PQRS pendientes.",
    ],
    lastMessage: "Gracias, ya vi el recibo en la app.",
  },
  {
    slug: "12b",
    unit: "12B",
    unitLabel: "Torre A - 12B",
    tower: "Torre A",
    level: "Nivel 12",
    name: "Elena Rodriguez",
    role: "Inquilino",
    contact: "elena@rodmail.com",
    phone: "+1 876 543 210",
    status: "En mora",
    statusKey: "overdue",
    balance: "$450.00",
    summary: "Tiene dos períodos vencidos y solicita acuerdo de pago para el corte actual.",
    accentClassName: "bg-violet-400",
    statusClassName: "bg-red-500/15 text-red-200",
    timeline: [
      "Recordatorio enviado hace 2 días.",
      "Promesa de pago estimada para el viernes.",
      "Pendiente verificar soporte bancario.",
    ],
    lastMessage: "Necesito el extracto para revisar el saldo antes de pagar.",
  },
  {
    slug: "ph1",
    unit: "PH1",
    unitLabel: "Torre B - PH1",
    tower: "Torre B",
    level: "Penthouse",
    name: "Marcus Sterling",
    role: "Propietario",
    contact: "m.sterling@luxury.com",
    phone: "+1 302 991 881",
    status: "Al día",
    statusKey: "paid",
    balance: "$0.00",
    summary: "Unidad premium con dos parqueaderos y acceso prioritario a concierge.",
    accentClassName: "bg-amber-300",
    statusClassName: "bg-emerald-500/15 text-emerald-200",
    timeline: [
      "Pago anual anticipado registrado.",
      "Solicitud de mantenimiento premium cerrada.",
      "Invitado recurrente autorizado en recepción.",
    ],
    lastMessage: "Por favor confirmen el horario del mantenimiento preventivo.",
  },
  {
    slug: "210",
    unit: "210",
    unitLabel: "Torre B - 210",
    tower: "Torre B",
    level: "Nivel 2",
    name: "Juan Camilo Ortega",
    role: "Inquilino",
    contact: "juan.ortega@correo.com",
    phone: "+57 310 442 9918",
    status: "Pago pendiente",
    statusKey: "pending",
    balance: "$225.00",
    summary: "Pago del periodo actual aún no confirmado por la pasarela.",
    accentClassName: "bg-amber-300",
    statusClassName: "bg-violet-500/15 text-violet-100",
    timeline: [
      "Intento de pago por PSE registrado hoy.",
      "Validación bancaria en curso.",
      "No requiere llamada por ahora.",
    ],
    lastMessage: "Acabo de pagar por PSE, quedó atento a la confirmación.",
  },
];

export const residentSections = [
  {
    name: "Torre A - Nivel 12",
    accentClassName: "bg-violet-400",
    residentSlugs: ["12a", "12b"],
  },
  {
    name: "Torre B - Mix residencial",
    accentClassName: "bg-amber-300",
    residentSlugs: ["ph1", "210"],
  },
];

export const paymentUnits = [
  {
    slug: "12b",
    unit: "Torre A - 402",
    status: "En mora",
    detail: "2 meses de retraso",
    amount: "$450.00",
    toneClassName: "border-red-500/70",
    badgeClassName: "bg-red-500/15 text-red-200",
    primaryHref: "/payments/register?unit=torre-a-402",
    secondaryHref: "/residents/12b",
  },
  {
    slug: "12a",
    unit: "Torre C - 105",
    status: "Al día",
    detail: "Sin saldo pendiente",
    amount: "$0.00",
    toneClassName: "border-emerald-500/70",
    badgeClassName: "bg-emerald-500/15 text-emerald-200",
    primaryHref: "/payments/register?unit=torre-c-105",
    secondaryHref: "/residents/12a",
  },
  {
    slug: "210",
    unit: "Torre B - 210",
    status: "Pago pendiente",
    detail: "Corresponde al mes actual",
    amount: "$225.00",
    toneClassName: "border-violet-500/70",
    badgeClassName: "bg-violet-500/15 text-violet-100",
    primaryHref: "/payments/reminders",
    secondaryHref: "/residents/210",
  },
];

export const paymentHistory = [
  {
    title: "Transferencia recibida",
    note: "Hoy, 10:45 AM - Torre D-301",
    amount: "+$225.00",
    icon: "receipt_long",
  },
  {
    title: "Pago en efectivo",
    note: "Ayer, 4:20 PM - Torre A-102",
    amount: "+$225.00",
    icon: "payments",
  },
  {
    title: "Promesa de pago creada",
    note: "Ayer, 2:15 PM - Torre A-402",
    amount: "Seguimiento",
    icon: "event_note",
  },
];

export const residentFilters = ["Todas", "Propietarios", "Inquilinos", "En mora"];

export const notifications = [
  {
    title: "3 pagos entraron en validación",
    note: "Banco aliado reporto movimientos hace 14 minutos.",
    icon: "notifications_active",
  },
  {
    title: "Se actualizo el flujo de cartera",
    note: "Recordatorios programados para las 5:00 PM.",
    icon: "schedule_send",
  },
  {
    title: "Mantenimiento confirmado en Torre B",
    note: "El proveedor llega mañana a las 8:00 AM.",
    icon: "handyman",
  },
];

export const reportCards = [
  {
    title: "KPIs del mes",
    value: "94%",
    note: "Cartera recuperada sobre meta",
    icon: "monitoring",
  },
  {
    title: "Acuerdos vigentes",
    value: "11",
    note: "Con seguimiento automatizado",
    icon: "assignment_turned_in",
  },
  {
    title: "Tiempo promedio de respuesta",
    value: "4h",
    note: "PQRS financieras y administrativas",
    icon: "timer",
  },
];

export const settingsSections = [
  {
    title: "Cobranza",
    items: [
      "Regla de corte automatica el día 15.",
      "Recordatorio por email + push a las 5:00 PM.",
      "Validación bancaria cada 20 minutos.",
    ],
  },
  {
    title: "Accesos",
    items: [
      "2 administradores con permisos completos.",
      "14 residentes con acceso demo habilitado.",
      "Biometria disponible solo para administradores.",
    ],
  },
];

export const supportChannels = [
  {
    title: "Acceso demo",
    note: "Usa las credenciales visibles en el login para entrar como admin o residente.",
    icon: "key",
  },
  {
    title: "Soporte funcional",
    note: "Cualquier flujo no modelado aún debe caer aquí mientras se integra backend real.",
    icon: "support_agent",
  },
  {
    title: "Canal de ayuda",
    note: "soporte@admiamigo360.com • +57 300 000 3600",
    icon: "alternate_email",
  },
];
