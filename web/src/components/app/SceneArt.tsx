type SceneArtProps = {
  variant?: "estate" | "concierge" | "assembly" | "finance";
  className?: string;
};

const palette = {
  stroke: "#5C4439",
  dark: "#4F382F",
  soft: "#EDE2D7",
  warm: "#BF9D6C",
  cream: "#FFF8F0",
  sand: "#F5E8D9",
  leaf: "#6E7C62",
};

function EstateScene() {
  return (
    <>
      <rect width="420" height="260" rx="32" fill={palette.cream} />
      <rect x="24" y="28" width="372" height="208" rx="28" fill={palette.sand} />
      <path d="M44 194c28-40 61-63 98-63 31 0 54 12 76 35 16-12 31-18 45-18 31 0 60 22 92 71H44Z" fill="#F0E1D3" />
      <rect x="74" y="62" width="84" height="132" rx="14" fill="#D8BFA8" />
      <rect x="170" y="44" width="102" height="150" rx="18" fill="#C6A58A" />
      <rect x="284" y="74" width="64" height="120" rx="14" fill="#E3CCB7" />
      <path d="M170 44h102v18H170z" fill={palette.dark} opacity="0.14" />
      <path d="M91 82h18v24H91zM122 82h18v24h-18zM91 118h18v24H91zM122 118h18v24h-18zM91 154h18v24H91zM122 154h18v24h-18z" fill={palette.cream} opacity="0.9" />
      <path d="M191 68h18v24h-18zM223 68h18v24h-18zM191 104h18v24h-18zM223 104h18v24h-18zM191 140h18v24h-18zM223 140h18v24h-18z" fill={palette.cream} opacity="0.95" />
      <path d="M302 98h14v20h-14zM322 98h14v20h-14zM302 128h14v20h-14zM322 128h14v20h-14z" fill={palette.cream} opacity="0.92" />
      <path d="M44 194h312v20H44z" fill="#E5D4C4" />
      <circle cx="80" cy="170" r="18" fill="#D0B39A" />
      <circle cx="334" cy="166" r="18" fill="#D0B39A" />
      <path d="M62 200c6-22 15-33 26-33 11 0 20 11 27 33H62Z" fill={palette.leaf} opacity="0.9" />
      <path d="M316 196c5-20 13-30 22-30 10 0 19 10 26 30h-48Z" fill={palette.leaf} opacity="0.9" />
      <circle cx="325" cy="48" r="18" fill={palette.warm} opacity="0.2" />
      <path d="M84 212h186" stroke={palette.stroke} strokeLinecap="round" strokeOpacity="0.18" strokeWidth="6" />
    </>
  );
}

function ConciergeScene() {
  return (
    <>
      <rect width="420" height="260" rx="32" fill={palette.cream} />
      <rect x="24" y="28" width="372" height="208" rx="28" fill="#F7ECE0" />
      <path d="M52 74h316v18H52z" fill="#E7D6C7" />
      <rect x="72" y="126" width="276" height="74" rx="22" fill="#E4D1C0" />
      <rect x="94" y="144" width="120" height="20" rx="10" fill="#FFF9F2" />
      <rect x="232" y="144" width="92" height="20" rx="10" fill="#F6EEE6" />
      <path d="M72 184h276v16H72z" fill="#D1B7A0" />
      <circle cx="124" cy="98" r="24" fill="#C7A46F" opacity="0.18" />
      <circle cx="288" cy="94" r="24" fill="#8A6F63" opacity="0.12" />
      <rect x="110" y="74" width="28" height="54" rx="10" fill="#C5A485" />
      <rect x="282" y="72" width="28" height="56" rx="10" fill="#D9BFA5" />
      <path d="M116 162h78" stroke={palette.stroke} strokeLinecap="round" strokeOpacity="0.16" strokeWidth="8" />
      <path d="M244 162h54" stroke={palette.stroke} strokeLinecap="round" strokeOpacity="0.12" strokeWidth="8" />
      <path d="M92 210c9-20 22-30 39-30 17 0 30 10 39 30H92Z" fill={palette.leaf} opacity="0.9" />
      <path d="M268 210c8-18 20-28 34-28 15 0 27 10 35 28h-69Z" fill={palette.leaf} opacity="0.8" />
      <circle cx="210" cy="70" r="18" fill={palette.dark} opacity="0.12" />
    </>
  );
}

function AssemblyScene() {
  return (
    <>
      <rect width="420" height="260" rx="32" fill={palette.cream} />
      <rect x="24" y="28" width="372" height="208" rx="28" fill="#F8F0E8" />
      <rect x="78" y="62" width="264" height="78" rx="20" fill="#D4B79F" />
      <rect x="104" y="88" width="212" height="12" rx="6" fill="#FFF6EE" opacity="0.9" />
      <path d="M88 174h244" stroke="#D9C6B4" strokeLinecap="round" strokeWidth="12" />
      <path d="M92 166c8-16 18-24 31-24 12 0 22 8 30 24" fill={palette.soft} />
      <path d="M170 166c8-16 18-24 31-24 12 0 22 8 30 24" fill={palette.soft} />
      <path d="M248 166c8-16 18-24 31-24 12 0 22 8 30 24" fill={palette.soft} />
      <circle cx="122" cy="152" r="10" fill="#EEDFCF" />
      <circle cx="200" cy="152" r="10" fill="#EEDFCF" />
      <circle cx="278" cy="152" r="10" fill="#EEDFCF" />
      <rect x="104" y="182" width="38" height="20" rx="10" fill="#E6D5C5" />
      <rect x="182" y="182" width="38" height="20" rx="10" fill="#E6D5C5" />
      <rect x="260" y="182" width="38" height="20" rx="10" fill="#E6D5C5" />
      <path d="M54 208h312" stroke={palette.stroke} strokeOpacity="0.16" strokeWidth="8" strokeLinecap="round" />
      <circle cx="332" cy="74" r="14" fill={palette.warm} opacity="0.22" />
    </>
  );
}

function FinanceScene() {
  return (
    <>
      <rect width="420" height="260" rx="32" fill={palette.cream} />
      <rect x="24" y="28" width="372" height="208" rx="28" fill="#F8F1EA" />
      <rect x="60" y="58" width="156" height="144" rx="22" fill="#FFFDFC" />
      <rect x="232" y="58" width="128" height="144" rx="22" fill="#F2E6DA" />
      <rect x="84" y="84" width="74" height="12" rx="6" fill="#DCCBBB" />
      <rect x="84" y="108" width="108" height="12" rx="6" fill="#EAE0D5" />
      <rect x="84" y="132" width="64" height="12" rx="6" fill="#EAE0D5" />
      <path d="M252 174h88" stroke="#D7C3AF" strokeLinecap="round" strokeWidth="14" />
      <path d="M252 174V98" stroke="#CAB19A" strokeLinecap="round" strokeWidth="10" />
      <path d="M276 174v-48M300 174v-70M324 174v-32" stroke={palette.dark} strokeLinecap="round" strokeWidth="12" />
      <circle cx="300" cy="86" r="18" fill={palette.warm} opacity="0.18" />
      <path d="M84 168c12-8 22-12 31-12 10 0 22 4 37 12 11 6 21 9 31 9" stroke={palette.dark} strokeOpacity="0.26" strokeLinecap="round" strokeWidth="8" />
    </>
  );
}

export function SceneArt({ variant = "estate", className = "" }: SceneArtProps) {
  return (
    <svg
      viewBox="0 0 420 260"
      className={`h-full w-full ${className}`}
      role="img"
      aria-label="Ilustracion editorial de AdmiAmigo 360"
    >
      {variant === "concierge" ? <ConciergeScene /> : null}
      {variant === "assembly" ? <AssemblyScene /> : null}
      {variant === "finance" ? <FinanceScene /> : null}
      {variant === "estate" ? <EstateScene /> : null}
    </svg>
  );
}
