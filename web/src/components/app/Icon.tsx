import type { SVGProps } from "react";

type IconProps = {
  name: string;
  className?: string;
  filled?: boolean;
};

type SvgIconProps = SVGProps<SVGSVGElement> & {
  filled?: boolean;
};

function BaseIcon({
  children,
  className = "",
  filled = false,
  ...props
}: SvgIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={filled ? 1.4 : 1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`inline-block h-[1em] w-[1em] shrink-0 align-middle ${className}`}
      {...props}
    >
      {children}
    </svg>
  );
}

function DashboardIcon(props: SvgIconProps) {
  return (
    <BaseIcon {...props}>
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.6" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1.6" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1.6" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1.6" />
    </BaseIcon>
  );
}

function WalletIcon(props: SvgIconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M4 7.5a2.5 2.5 0 0 1 2.5-2.5h9.5a2 2 0 0 1 0 4H6.2A2.2 2.2 0 0 0 4 11.2v5.3A2.5 2.5 0 0 0 6.5 19h11a2.5 2.5 0 0 0 2.5-2.5v-7A2.5 2.5 0 0 0 17.5 7h-11" />
      <circle cx="16.5" cy="13" r="1.2" />
    </BaseIcon>
  );
}

function MailIcon(props: SvgIconProps) {
  return (
    <BaseIcon {...props}>
      <rect x="3.5" y="5.5" width="17" height="13" rx="2.5" />
      <path d="m5.5 8 6.5 5 6.5-5" />
    </BaseIcon>
  );
}

function LockIcon(props: SvgIconProps) {
  return (
    <BaseIcon {...props}>
      <rect x="5.5" y="10" width="13" height="10" rx="2.2" />
      <path d="M8 10V7.8A4 4 0 0 1 12 4a4 4 0 0 1 4 3.8V10" />
      <path d="M12 13.2v3.3" />
    </BaseIcon>
  );
}

function EyeIcon(props: SvgIconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M2.8 12s3.3-5.5 9.2-5.5S21.2 12 21.2 12s-3.3 5.5-9.2 5.5S2.8 12 2.8 12Z" />
      <circle cx="12" cy="12" r="2.6" />
    </BaseIcon>
  );
}

function ArrowForwardIcon(props: SvgIconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M5 12h13" />
      <path d="m13 7 5 5-5 5" />
    </BaseIcon>
  );
}

function ArrowBackIcon(props: SvgIconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M19 12H6" />
      <path d="m11 17-5-5 5-5" />
    </BaseIcon>
  );
}

function NorthEastIcon(props: SvgIconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M7 17 17 7" />
      <path d="M9 7h8v8" />
    </BaseIcon>
  );
}

function ChevronRightIcon(props: SvgIconProps) {
  return (
    <BaseIcon {...props}>
      <path d="m9 6 6 6-6 6" />
    </BaseIcon>
  );
}

function BellIcon(props: SvgIconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M8 18h8" />
      <path d="M6.3 16.5h11.4a1 1 0 0 0 .8-1.6l-1.1-1.5V10a5.4 5.4 0 0 0-10.8 0v3.4l-1.1 1.5a1 1 0 0 0 .8 1.6Z" />
      <path d="M10 18a2 2 0 0 0 4 0" />
    </BaseIcon>
  );
}

function SearchIcon(props: SvgIconProps) {
  return (
    <BaseIcon {...props}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4 4" />
    </BaseIcon>
  );
}

function SlidersIcon(props: SvgIconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M4 6h10" />
      <path d="M18 6h2" />
      <path d="M4 12h4" />
      <path d="M12 12h8" />
      <path d="M4 18h8" />
      <path d="M16 18h4" />
      <circle cx="14" cy="6" r="1.5" />
      <circle cx="10" cy="12" r="1.5" />
      <circle cx="14" cy="18" r="1.5" />
    </BaseIcon>
  );
}

function BuildingIcon(props: SvgIconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M5 20V7.5A1.5 1.5 0 0 1 6.5 6h5A1.5 1.5 0 0 1 13 7.5V20" />
      <path d="M13 20V4.5A1.5 1.5 0 0 1 14.5 3h3A1.5 1.5 0 0 1 19 4.5V20" />
      <path d="M3 20h18" />
      <path d="M7.5 9.5h1M10 9.5h1M7.5 12.5h1M10 12.5h1M15 7.5h1M17 7.5h1M15 10.5h1M17 10.5h1M15 13.5h1M17 13.5h1" />
    </BaseIcon>
  );
}

function ChartIcon(props: SvgIconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M4 19.5h16" />
      <path d="M6 16V11" />
      <path d="M10 16V8" />
      <path d="M14 16V10" />
      <path d="M18 16V5" />
    </BaseIcon>
  );
}

function TrendIcon(props: SvgIconProps) {
  return (
    <BaseIcon {...props}>
      <path d="m4 16 5-5 4 4 7-7" />
      <path d="M14 8h6v6" />
    </BaseIcon>
  );
}

function WrenchIcon(props: SvgIconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M14.5 6.5a4 4 0 0 0-5.3 5.3L4 17v3h3l5.2-5.2a4 4 0 0 0 5.3-5.3l-2.2 2.2-2.8-2.8Z" />
    </BaseIcon>
  );
}

function ShieldIcon(props: SvgIconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M12 3.5 5.5 6v5.4c0 4.1 2.5 7.9 6.5 9.1 4-1.2 6.5-5 6.5-9.1V6L12 3.5Z" />
      <circle cx="12" cy="10" r="1.7" />
      <path d="M9.3 15.4a3.3 3.3 0 0 1 5.4 0" />
    </BaseIcon>
  );
}

function DocumentIcon(props: SvgIconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M7 3.5h7l4 4V20H7a2 2 0 0 1-2-2V5.5a2 2 0 0 1 2-2Z" />
      <path d="M14 3.5V8h4" />
      <path d="M9 12h6M9 15.5h6M9 19h4" />
    </BaseIcon>
  );
}

function PeopleIcon(props: SvgIconProps) {
  return (
    <BaseIcon {...props}>
      <circle cx="9" cy="9" r="2.5" />
      <circle cx="16" cy="10.5" r="2.1" />
      <path d="M4.5 18.5a4.7 4.7 0 0 1 9 0" />
      <path d="M14 18.5a3.7 3.7 0 0 1 5.5-2.7" />
    </BaseIcon>
  );
}

function PersonAddIcon(props: SvgIconProps) {
  return (
    <BaseIcon {...props}>
      <circle cx="10" cy="8" r="3" />
      <path d="M4.5 19a5.6 5.6 0 0 1 11 0" />
      <path d="M18.5 8v6M15.5 11h6" />
    </BaseIcon>
  );
}

function ChatIcon(props: SvgIconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M5.5 6.5h13a1.5 1.5 0 0 1 1.5 1.5v7a1.5 1.5 0 0 1-1.5 1.5H11l-4.5 3v-3H5.5A1.5 1.5 0 0 1 4 15V8a1.5 1.5 0 0 1 1.5-1.5Z" />
    </BaseIcon>
  );
}

function CheckCircleIcon(props: SvgIconProps) {
  return (
    <BaseIcon {...props}>
      <circle cx="12" cy="12" r="8" />
      <path d="m8.5 12 2.3 2.3 4.7-4.8" />
    </BaseIcon>
  );
}

function AlertIcon(props: SvgIconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M12 4 3.8 18a1 1 0 0 0 .9 1.5h14.6a1 1 0 0 0 .9-1.5L12 4Z" />
      <path d="M12 9v4.5" />
      <circle cx="12" cy="16.4" r=".8" fill="currentColor" stroke="none" />
    </BaseIcon>
  );
}

function FingerprintIcon(props: SvgIconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M12 4.2a5.8 5.8 0 0 0-5.8 5.8" />
      <path d="M17.8 10A5.8 5.8 0 0 0 12 4.2" />
      <path d="M7.5 11.2a4.5 4.5 0 1 1 9 0c0 4-1.7 7.1-3.2 8.6" />
      <path d="M10 10.8a2 2 0 1 1 4 0c0 2.5-.8 4.7-2 6" />
      <path d="M6 14.5c0 2.4-.5 4.2-1.5 5.3" />
      <path d="M18 14.5c0 2.4.5 4.2 1.5 5.3" />
    </BaseIcon>
  );
}

function KeyIcon(props: SvgIconProps) {
  return (
    <BaseIcon {...props}>
      <circle cx="8" cy="12" r="3.5" />
      <path d="M11.5 12H20" />
      <path d="M16 12v3" />
      <path d="M18.5 12v2" />
    </BaseIcon>
  );
}

function PhoneIcon(props: SvgIconProps) {
  return (
    <BaseIcon {...props}>
      <path d="m8.5 4.5 2.2 2.2-1.5 2.4a13.8 13.8 0 0 0 5.7 5.7l2.4-1.5 2.2 2.2-1.4 3a2 2 0 0 1-2.1 1.1 16.6 16.6 0 0 1-11.5-11.5 2 2 0 0 1 1.1-2.1l2.9-1.5Z" />
    </BaseIcon>
  );
}

function LogoutIcon(props: SvgIconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M9 4.5H6.5A2.5 2.5 0 0 0 4 7v10a2.5 2.5 0 0 0 2.5 2.5H9" />
      <path d="M13 8.5 18 12l-5 3.5" />
      <path d="M10 12h8" />
    </BaseIcon>
  );
}

function TimerIcon(props: SvgIconProps) {
  return (
    <BaseIcon {...props}>
      <circle cx="12" cy="13" r="7.5" />
      <path d="M12 13 15 10" />
      <path d="M9 3.5h6" />
    </BaseIcon>
  );
}

function SettingsIcon(props: SvgIconProps) {
  return (
    <BaseIcon {...props}>
      <circle cx="12" cy="12" r="2.5" />
      <path d="M19 12a7 7 0 0 0-.1-1l2-1.5-2-3.4-2.4 1a7.4 7.4 0 0 0-1.7-1L14.5 3h-5l-.3 3.1a7.4 7.4 0 0 0-1.7 1l-2.4-1-2 3.4 2 1.5a7 7 0 0 0 0 2l-2 1.5 2 3.4 2.4-1a7.4 7.4 0 0 0 1.7 1l.3 3.1h5l.3-3.1a7.4 7.4 0 0 0 1.7-1l2.4 1 2-3.4-2-1.5c.1-.3.1-.6.1-1Z" />
    </BaseIcon>
  );
}

function MenuIcon(props: SvgIconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </BaseIcon>
  );
}

function MoreIcon(props: SvgIconProps) {
  return (
    <BaseIcon {...props}>
      <circle cx="12" cy="5" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="12" cy="19" r="1.5" fill="currentColor" stroke="none" />
    </BaseIcon>
  );
}

function EnvelopeAtIcon(props: SvgIconProps) {
  return (
    <BaseIcon {...props}>
      <rect x="3.5" y="6" width="17" height="12" rx="2.5" />
      <path d="m5.5 8.5 6.5 4.5 6.5-4.5" />
      <path d="M15.8 11.8a2.1 2.1 0 1 1 2 2.5" />
    </BaseIcon>
  );
}

function OrbIcon(props: SvgIconProps) {
  return (
    <BaseIcon {...props}>
      <circle cx="12" cy="12" r="7.5" />
      <circle cx="12" cy="12" r="4" fill="currentColor" stroke="none" />
    </BaseIcon>
  );
}

function resolveIconName(name: string) {
  const aliasMap: Record<string, string> = {
    account_balance_wallet: "wallet",
    payments: "wallet",
    add_card: "wallet",
    send_and_archive: "description",
    receipt_long: "description",
    event_note: "description",
    description: "description",
    list_alt: "description",
    group: "people",
    person_add: "person_add",
    support_agent: "people",
    home_work: "building",
    apartment: "building",
    monitoring: "chart",
    insights: "chart",
    savings: "wallet",
    space_dashboard: "dashboard",
    dashboard: "dashboard",
    notifications: "bell",
    notifications_active: "bell",
    schedule_send: "chart",
    engineering: "wrench",
    handyman: "wrench",
    security: "shield",
    crisis_alert: "alert",
    assignment_turned_in: "check_circle",
    shield_person: "shield_person",
    fingerprint: "fingerprint",
    chat_bubble: "chat",
    chat: "chat",
    settings: "settings",
    tune: "sliders",
    alternate_email: "envelope_at",
    person: "person",
    call: "phone",
  };

  return aliasMap[name] ?? name;
}

export function Icon({ name, className = "", filled = false }: IconProps) {
  const resolved = resolveIconName(name);
  const props = { className, filled };

  switch (resolved) {
    case "dashboard":
      return <DashboardIcon {...props} />;
    case "wallet":
      return <WalletIcon {...props} />;
    case "mail":
      return <MailIcon {...props} />;
    case "lock":
      return <LockIcon {...props} />;
    case "visibility":
      return <EyeIcon {...props} />;
    case "arrow_forward":
      return <ArrowForwardIcon {...props} />;
    case "arrow_back":
      return <ArrowBackIcon {...props} />;
    case "north_east":
      return <NorthEastIcon {...props} />;
    case "arrow_forward_ios":
      return <ChevronRightIcon {...props} />;
    case "bell":
      return <BellIcon {...props} />;
    case "search":
      return <SearchIcon {...props} />;
    case "sliders":
      return <SlidersIcon {...props} />;
    case "building":
      return <BuildingIcon {...props} />;
    case "chart":
      return <ChartIcon {...props} />;
    case "trending_up":
      return <TrendIcon {...props} />;
    case "wrench":
      return <WrenchIcon {...props} />;
    case "shield":
      return <ShieldIcon {...props} />;
    case "shield_person":
      return <ShieldIcon {...props} />;
    case "description":
      return <DocumentIcon {...props} />;
    case "people":
      return <PeopleIcon {...props} />;
    case "person_add":
      return <PersonAddIcon {...props} />;
    case "person":
      return <BaseIcon {...props}><circle cx="12" cy="8.5" r="3.2" /><path d="M6.2 19a6 6 0 0 1 11.6 0" /></BaseIcon>;
    case "chat":
      return <ChatIcon {...props} />;
    case "check_circle":
      return <CheckCircleIcon {...props} />;
    case "alert":
      return <AlertIcon {...props} />;
    case "fingerprint":
      return <FingerprintIcon {...props} />;
    case "key":
      return <KeyIcon {...props} />;
    case "phone":
      return <PhoneIcon {...props} />;
    case "logout":
      return <LogoutIcon {...props} />;
    case "timer":
      return <TimerIcon {...props} />;
    case "settings":
      return <SettingsIcon {...props} />;
    case "menu":
      return <MenuIcon {...props} />;
    case "more_vert":
      return <MoreIcon {...props} />;
    case "schedule":
      return <TimerIcon {...props} />;
    case "envelope_at":
      return <EnvelopeAtIcon {...props} />;
    case "orb":
      return <OrbIcon {...props} />;
    default:
      return <BaseIcon {...props}><circle cx="12" cy="12" r="8" /></BaseIcon>;
  }
}
