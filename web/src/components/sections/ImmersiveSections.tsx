"use client";

import {
  AnimatePresence,
  animate,
  motion,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

type Plan = {
  name: string;
  price: string;
  items: string[];
  featured?: boolean;
};

type Apartment = {
  id: string;
  name: string;
  type: string;
  area: string;
  price: string;
  city: string;
  perks: string[];
  image: string;
};

type AnimatedValue = {
  to: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
};

type DashboardMetric = {
  title: string;
  description: string;
  value: AnimatedValue;
};

const howItWorks = [
  {
    stage: "01",
    title: "Pagos automaticos",
    description:
      "Conciliacion bancaria al instante con pasarelas certificadas y seguimiento de cartera en tiempo real.",
  },
  {
    stage: "02",
    title: "Onboarding residencial",
    description:
      "Registro digital de residentes, vehiculos y mascotas sin friccion operativa.",
  },
  {
    stage: "03",
    title: "Flujos PQR",
    description:
      "Solicitudes priorizadas, responsables asignados y trazabilidad completa por caso.",
  },
  {
    stage: "04",
    title: "Notificaciones smart",
    description:
      "Alertas automaticas multicanal para eventos, cobros, novedades y mantenimiento.",
  },
];

const ecosystemNodes = [
  "Residentes",
  "Administracion",
  "Consejo",
  "Seguridad",
  "Proveedores",
  "Pagos",
  "Asambleas",
  "Reservas",
];

const dashboardMetrics: DashboardMetric[] = [
  {
    title: "Rastreo de ingresos",
    description: "Visualiza salud financiera al segundo con ingresos, recaudo y mora.",
    value: { to: 18.4, prefix: "+", suffix: "%", decimals: 1 },
  },
  {
    title: "Metricas de ocupacion",
    description: "Control estricto del censo residencial y estado por unidad.",
    value: { to: 96, suffix: "%" },
  },
  {
    title: "Mantenimiento",
    description: "Supervision de areas comunes y cumplimiento de tareas criticas.",
    value: { to: 42, suffix: " tareas" },
  },
  {
    title: "Proyecciones",
    description: "Semaforos presupuestales para detectar desvio antes del cierre mensual.",
    value: { to: 3, suffix: " alertas" },
  },
];

const modules = [
  {
    title: "Modulo Integrador de Solicitudes",
    description:
      "Chatbot + PQRS con clasificacion inteligente, prioridades y respuestas guiadas por normativa.",
    badge: "IA + servicio",
  },
  {
    title: "Gestion Financiera",
    description:
      "Tablero en tiempo real para ingresos, egresos, cartera, presupuestos y reporteria fiscal.",
    badge: "Control total",
  },
  {
    title: "Pasarela de Pagos",
    description:
      "Recaudo digital de cuotas y reservas con conciliacion automatica y seguimiento de mora.",
    badge: "Pagos seguros",
  },
  {
    title: "Agenda de Espacios",
    description:
      "Reservas de zonas comunes con reglas de convivencia, cupos, horarios y aprobaciones.",
    badge: "Reservas smart",
  },
  {
    title: "Asambleas Digitales",
    description:
      "Convocatoria, quorum, votacion online y actas digitales en un mismo flujo.",
    badge: "Gobernanza",
  },
  {
    title: "Economia Colaborativa",
    description:
      "Marketplace de proveedores verificados con calificaciones y contratacion transparente.",
    badge: "Comunidad activa",
  },
];

const intelligenceCards = [
  {
    title: "IA legal",
    description: "Asistente entrenado en Ley 675 para respuestas claras, accionables y trazables.",
  },
  {
    title: "Deteccion de riesgos",
    description: "Alertas preventivas sobre desviaciones de cartera, gasto y presupuesto.",
  },
  {
    title: "Cumplimiento de datos",
    description: "Habeas Data aplicado en permisos, auditoria y ciclo de vida de la informacion.",
  },
  {
    title: "Auditoria 100%",
    description: "Registro completo de acciones del sistema para consejo y revisoria.",
  },
  {
    title: "Infraestructura cloud",
    description: "Respaldo y disponibilidad de alto nivel para operacion continua del conjunto.",
  },
];

const plans: Plan[] = [
  {
    name: "Basico",
    price: "Desde $500K",
    items: ["Modulo de solicitudes", "Tablero financiero basico", "Gestor de asambleas"],
  },
  {
    name: "Profesional",
    price: "Desde $1.5M",
    items: [
      "Todos los modulos basicos",
      "Pasarela de pagos",
      "Control presupuestal avanzado",
      "Economia colaborativa",
    ],
    featured: true,
  },
  {
    name: "Premium",
    price: "Contactar",
    items: [
      "Todos los modulos",
      "Reportes y analitica avanzada",
      "Soporte prioritario 24/7",
      "Integraciones personalizadas",
    ],
  },
];

const traditional = [
  "Carteras vencidas fuera de control",
  "Gestion manual en Excel",
  "Asambleas extensas de horas",
  "Decisiones sin datos reales",
];

const admiAmigo = [
  "Recaudo automatizado y trazable",
  "Panel centralizado en la nube",
  "Asambleas guiadas y votacion digital",
  "Decisiones con IA y metricas en vivo",
];

const apartments: Apartment[] = [
  // Económicos / Estándar
  {
    id: "apt-201",
    name: "Apto 301 - Torre Lago",
    type: "1 habitacion",
    area: "58 m2",
    price: "$290.000.000",
    city: "Bogota",
    perks: ["Home office", "Cocina abierta", "Pet friendly"],
    image: "https://images.unsplash.com/photo-1612320648993-61c1cd604b71?q=80&w=2072&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "apt-202",
    name: "Apto 204 - Torre Rio",
    type: "2 habitaciones",
    area: "65 m2",
    price: "$280.000.000",
    city: "Bogota",
    perks: ["Iluminado", "Administracion baja"],
    image: "https://images.unsplash.com/photo-1612419299101-6c294dc2901d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "apt-203",
    name: "Apto 402 - Torre Luna",
    type: "1 habitacion",
    area: "50 m2",
    price: "$250.000.000",
    city: "Bogota",
    perks: ["Studio", "Zona lavanderia"],
    image: "https://images.unsplash.com/photo-1689043528099-2ba014dd7c64?q=80&w=1625&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "apt-204",
    name: "Apto 505 - Torre Viento",
    type: "2 habitaciones",
    area: "70 m2",
    price: "$310.000.000",
    city: "Bogota",
    perks: ["Parqueadero cubierto", "Balcon"],
    image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80",
  },
  {
    id: "apt-205",
    name: "Apto 103 - Torre Sol",
    type: "1 habitacion",
    area: "45 m2",
    price: "$230.000.000",
    city: "Bogota",
    perks: ["Primer piso", "Patio interior"],
    image: "https://images.unsplash.com/photo-1502672023488-70e25813eb80?w=800&q=80",
  },
  {
    id: "apt-206",
    name: "Apto 802 - Torre Norte",
    type: "2 habitaciones",
    area: "60 m2",
    price: "$275.000.000",
    city: "Bogota",
    perks: ["Economico", "Cerca a ascensor"],
    image: "https://images.unsplash.com/photo-1630699144375-6b6b7cb66696?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },

  // Rango Medio
  {
    id: "apt-301",
    name: "Apto 1104 - Torre Norte",
    type: "2 habitaciones",
    area: "76 m2",
    price: "$365.000.000",
    city: "Bogota",
    perks: ["Remodelado", "Deposito", "Gym cercano"],
    image: "https://images.unsplash.com/photo-1741764014072-68953e93cd48?q=80&w=2119&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "apt-302",
    name: "Apto 702 - Torre Sol",
    type: "3 habitaciones",
    area: "92 m2",
    price: "$420.000.000",
    city: "Bogota",
    perks: ["Balcon", "Parqueadero doble", "Vista interior"],
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80",
  },
  {
    id: "apt-303",
    name: "Apto 904 - Torre Bosque",
    type: "2 habitaciones",
    area: "82 m2",
    price: "$389.000.000",
    city: "Bogota",
    perks: ["Esquinero", "Luz natural", "Vista al parque"],
    image: "https://images.unsplash.com/photo-1630699034276-0be879da7ebf?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "apt-304",
    name: "Apto 603 - Torre Rio",
    type: "3 habitaciones",
    area: "88 m2",
    price: "$410.000.000",
    city: "Bogota",
    perks: ["Cocina abierta", "Zonas verdes"],
    image: "https://images.unsplash.com/photo-1741764014072-68953e93cd48?q=80&w=2119&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "apt-305",
    name: "Apto 401 - Torre Parque",
    type: "2 habitaciones",
    area: "78 m2",
    price: "$370.000.000",
    city: "Bogota",
    perks: ["Pisos de madera", "Cortinas auto"],
    image: "https://images.unsplash.com/photo-1649068491097-8d0d19a6e378?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "apt-306",
    name: "Apto 1205 - Torre Luna",
    type: "3 habitaciones",
    area: "95 m2",
    price: "$450.000.000",
    city: "Bogota",
    perks: ["Vista despejada", "Walking closet"],
    image: "https://images.unsplash.com/photo-1649068453220-f7394ee150d1?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },

  // Gama Alta / Lujo
  {
    id: "apt-401",
    name: "Apto 508 - Torre Parque",
    type: "3 habitaciones",
    area: "104 m2",
    price: "$520.000.000",
    city: "Bogota",
    perks: ["Terraza grande", "Zona BBQ", "Panoramica"],
    image: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800&q=80",
  },
  {
    id: "apt-402",
    name: "Apto 1502 - Torre Cielo",
    type: "4 habitaciones",
    area: "142 m2",
    price: "$810.000.000",
    city: "Bogota",
    perks: ["Doble balcon", "Estudio", "Club house"],
    image: "https://images.unsplash.com/photo-1664372623516-0b1540d6771e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "apt-403",
    name: "Apto PH - Torre Rio",
    type: "3 habitaciones",
    area: "120 m2",
    price: "$650.000.000",
    city: "Bogota",
    perks: ["Penthouse", "Terraza privada", "Jacuzzi"],
    image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&q=80",
  },
  {
    id: "apt-404",
    name: "Apto 1601 - Torre Sol",
    type: "4 habitaciones",
    area: "155 m2",
    price: "$920.000.000",
    city: "Bogota",
    perks: ["Acabados de lujo", "Estilo moderno"],
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",
  },
  {
    id: "apt-405",
    name: "Apto 1404 - Torre Bosque",
    type: "3 habitaciones",
    area: "110 m2",
    price: "$580.000.000",
    city: "Bogota",
    perks: ["Domotica", "Doble altura"],
    image: "https://images.unsplash.com/photo-1702014862053-946a122b920d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "apt-406",
    name: "Apto 1302 - Torre Viento",
    type: "4 habitaciones",
    area: "135 m2",
    price: "$750.000.000",
    city: "Bogota",
    perks: ["Aire central", "Triple parqueadero"],
    image: "https://images.unsplash.com/photo-1601760562234-9814eea6663a?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];

const assistantResponses = [
  "Clasificando caso #4092 como Prevencion. Sugiero usar la plantilla 'Falla Mantenimiento'.",
  "Borrador listo: 'Aviso Corte de Agua Programado - Martes 15'. ¿Deseas enviarlo a Torre Norte?",
  "Ingresaron $4.2M en recaudos hoy. Hay 3 apartamentos que acaban de pasar a mora. ¿Envio alerta?",
  "Agenda generada. Ya se enviaron las convocatorias con el link de votacion online a 120 residentes."
];

const assistantHints = [
  "Clasifica PQRS y sugiere respuesta inicial.",
  "Genera borradores de comunicados para residentes.",
  "Resume cartera y alertas financieras del dia.",
  "Prepara agenda de asamblea y seguimiento de tareas.",
];

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const SECTION_HEIGHT_VH = 190;
const STICKY_PROGRESS_END = (SECTION_HEIGHT_VH - 100) / SECTION_HEIGHT_VH;

function CountUp({ value, className, trigger }: { value: AnimatedValue; className?: string; trigger?: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: false, amount: 0.6 });
  const shouldAnimate = trigger !== undefined ? trigger : inView;
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { damping: 24, stiffness: 110 });

  const label = useTransform(springValue, (latest) => {
    const decimals = value.decimals ?? 0;
    return `${value.prefix ?? ""}${latest.toFixed(decimals)}${value.suffix ?? ""}`;
  });

  useEffect(() => {
    if (!shouldAnimate) {
      motionValue.set(0);
      return;
    }

    const controls = animate(motionValue, value.to, {
      duration: 1.05,
      ease: [0.22, 1, 0.36, 1],
    });
    return () => controls.stop();
  }, [shouldAnimate, motionValue, value.to]);

  return (
    <motion.span ref={ref} className={className}>
      {label}
    </motion.span>
  );
}

function HowItWorksSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const animationProgress = useTransform(
    scrollYProgress,
    [0, STICKY_PROGRESS_END],
    [0, 1],
    { clamp: true },
  );

  const cubeRotateY = useTransform(animationProgress, [0, 1], [0, -270]);
  const cubeRotateX = useTransform(animationProgress, [0, 1], [-7, 7]);
  const bgShift = useTransform(animationProgress, [0, 1], ["-8%", "8%"]);

  const [activeStep, setActiveStep] = useState(0);
  useMotionValueEvent(animationProgress, "change", (progress) => {
    const next = Math.min(howItWorks.length - 1, Math.floor(progress * howItWorks.length));
    setActiveStep((prev) => (prev === next ? prev : next));
  });

  return (
    <section id="como-funciona" ref={sectionRef} className="relative h-[190vh] overflow-clip bg-[#060f1b]">
      <motion.div
        style={{ x: bgShift }}
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(14,165,233,0.22),transparent_42%)]"
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_82%_12%,rgba(244,114,182,0.14),transparent_42%)]" />

      <div className="sticky top-0 flex h-screen items-center">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-6 lg:grid-cols-[1.1fr_1fr]">
          <div className="mx-auto w-full max-w-[420px]">
            <div className="relative h-[380px] w-full [perspective:1400px]">
              <motion.div
                style={{ rotateY: cubeRotateY, rotateX: cubeRotateX }}
                className="absolute left-1/2 top-1/2 h-[250px] w-[250px] -translate-x-1/2 -translate-y-1/2 [transform-style:preserve-3d]"
              >
                {howItWorks.map((step, index) => (
                  <div
                    key={step.title}
                    style={{ transform: `rotateY(${index * 90}deg) translateZ(125px)` }}
                    className="absolute inset-0 rounded-3xl border border-cyan-200/35 bg-[#0e213a]/85 p-5 shadow-[0_0_30px_rgba(14,165,233,0.24)]"
                  >
                    <p className="text-xs uppercase tracking-[0.2em] text-cyan-200/95">{step.stage}</p>
                    <h3 className="mt-3 text-xl text-white">{step.title}</h3>
                    <p className="mt-3 text-sm text-white/72">{step.description}</p>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>

          <div>
            <h2 className="font-cinematic text-4xl text-white sm:text-6xl">Motor central de automatizacion</h2>
            <p className="mt-4 text-white/75">
              Flujo operativo de punta a punta: recaudo, servicio, comunicacion y trazabilidad.
            </p>

            <AnimatePresence mode="wait">
              <motion.article
                key={howItWorks[activeStep].title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.28 }}
                className="mt-8 rounded-3xl border border-white/15 bg-black/35 p-6"
              >
                <p className="text-xs uppercase tracking-[0.2em] text-cyan-200/90">Paso activo</p>
                <h3 className="mt-3 text-2xl text-white">{howItWorks[activeStep].title}</h3>
                <p className="mt-3 text-white/74">{howItWorks[activeStep].description}</p>
              </motion.article>
            </AnimatePresence>
          </div>
        </div>
      </div>

    </section>
  );
}

function EcosystemWorldSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const animationProgress = useTransform(
    scrollYProgress,
    [0, STICKY_PROGRESS_END],
    [0, 1],
    { clamp: true },
  );

  const ringRotate = useTransform(animationProgress, [0, 1], [-35, 220]);
  const ringCounterRotate = useTransform(ringRotate, (value) => -value);
  const globeRotate = useTransform(animationProgress, [0, 1], [0, 210]);
  const globeScale = useTransform(animationProgress, [0, 0.5, 1], [0.8, 1.05, 0.92]);

  const [activeNode, setActiveNode] = useState(0);
  useMotionValueEvent(animationProgress, "change", (progress) => {
    const next = Math.min(ecosystemNodes.length - 1, Math.floor(progress * ecosystemNodes.length));
    setActiveNode((prev) => (prev === next ? prev : next));
  });

  const nodes = useMemo(
    () =>
      ecosystemNodes.map((label, index) => {
        const angle = (index / ecosystemNodes.length) * Math.PI * 2;
        return {
          label,
          left: `${(50 + Math.cos(angle) * 42).toFixed(3)}%`,
          top: `${(50 + Math.sin(angle) * 42).toFixed(3)}%`,
        };
      }),
    [],
  );

  return (
    <section id="ecosistema" ref={sectionRef} className="relative h-[190vh] overflow-clip bg-[#030a14]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_40%,rgba(56,189,248,0.25),transparent_46%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_18%,rgba(245,158,11,0.18),transparent_40%)]" />

      <div className="sticky top-0 flex h-screen items-center">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-6 lg:grid-cols-2">
          <div>
            <h2 className="font-cinematic text-4xl text-white sm:text-6xl">Ecosistema 360</h2>
            <p className="mt-4 text-white/75">
              Integracion activa entre residentes, administracion, seguridad, pagos y proveedores.
            </p>
            <p className="mt-4 text-sm text-cyan-100/90">
              El foco rota por cada actor para mostrar como se conecta al flujo operativo del conjunto.
            </p>
          </div>

          <div className="relative mx-auto h-[360px] w-[360px] sm:h-[470px] sm:w-[470px]">
            <motion.div
              style={{ rotate: ringRotate }}
              className="absolute inset-0 rounded-full border border-cyan-300/30 [transform-style:preserve-3d]"
            >
              <div className="absolute inset-[12%] rounded-full border border-cyan-200/20" />
              <div className="absolute inset-[25%] rounded-full border border-cyan-100/15" />

              {nodes.map((node, index) => {
                const isActive = activeNode === index;
                return (
                  <motion.div
                    key={node.label}
                    style={{ left: node.left, top: node.top, rotate: ringCounterRotate }}
                    animate={{
                      scale: isActive ? 1.38 : 0.92,
                      opacity: isActive ? 1 : 0.65,
                    }}
                    transition={{ duration: 0.28 }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full border px-3 py-1.5 text-xs backdrop-blur ${isActive
                      ? "border-cyan-200/65 bg-cyan-200/18 text-cyan-50"
                      : "border-white/25 bg-black/60 text-white/90"
                      }`}
                  >
                    {node.label}
                  </motion.div>
                );
              })}
            </motion.div>

            <motion.div
              style={{ rotate: globeRotate, scale: globeScale }}
              className="absolute left-1/2 top-1/2 h-[44%] w-[44%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-100/35 bg-[radial-gradient(circle_at_30%_30%,rgba(186,230,253,0.94),rgba(56,189,248,0.46)_43%,rgba(8,47,73,0.9)_80%)] shadow-[0_0_45px_rgba(56,189,248,0.35)]"
            >
              <div className="absolute left-[15%] top-[22%] h-[17%] w-[28%] rounded-full bg-white/45 blur-[1px]" />
              <div className="absolute left-[55%] top-[34%] h-[16%] w-[20%] rounded-full bg-cyan-50/45 blur-[1px]" />
              <div className="absolute left-[30%] top-[60%] h-[14%] w-[24%] rounded-full bg-cyan-100/38 blur-[1px]" />
              <div className="absolute inset-[10%] rounded-full border border-cyan-100/20" />
              <div className="absolute inset-[34%] rounded-full border border-cyan-100/25" />
            </motion.div>

            <AnimatePresence mode="wait">
              <motion.div
                key={ecosystemNodes[activeNode]}
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.82, y: -8 }}
                transition={{ duration: 0.24 }}
                className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full border border-cyan-200/45 bg-black/65 px-5 py-2 text-sm font-semibold text-cyan-100"
              >
                {ecosystemNodes[activeNode]}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

    </section>
  );
}

function DashboardSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const animationProgress = useTransform(
    scrollYProgress,
    [0, STICKY_PROGRESS_END],
    [0, 1],
    { clamp: true },
  );

  const gridShift = useTransform(animationProgress, [0, 1], ["0%", "-30%"]);
  const [progress, setProgress] = useState(0);
  useMotionValueEvent(animationProgress, "change", (value) => {
    setProgress(value);
  });

  const cardStyle = (index: number) => {
    const start = index * 0.12;
    const end = start + 0.3;
    const local = clamp((progress - start) / (end - start), 0, 1);
    const y = 30 - local * 30;
    const opacity = 0.1 + local * 0.9;
    return { y, opacity, local };
  };

  return (
    <section id="problemas" ref={sectionRef} className="relative h-[190vh] overflow-clip bg-[#060b14]">
      <motion.div
        style={{ x: gridShift }}
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(34,211,238,0.08)_1px,transparent_1px),linear-gradient(180deg,rgba(34,211,238,0.06)_1px,transparent_1px)] bg-[size:120px_120px]"
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(129,140,248,0.18),transparent_40%)]" />

      <div className="sticky top-0 flex h-screen items-center">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <h2 className="font-cinematic text-4xl text-white sm:text-6xl">Dashboard de control total</h2>
            <p className="mt-4 text-white/74">
              Visualizacion ejecutiva para decisiones rapidas en finanzas, ocupacion, mantenimiento y
              presupuesto.
            </p>
          </div>

          <div className="grid w-full grid-cols-1 sm:grid-cols-2 gap-4">
            {dashboardMetrics.map((metric, index) => {
              const { y, opacity, local } = cardStyle(index);
              const tone = [
                "border-cyan-200/35 bg-[#132a46]/88",
                "border-indigo-200/35 bg-[#1b2548]/88",
                "border-emerald-200/35 bg-[#10282e]/88",
                "border-amber-200/30 bg-[#2d2415]/88",
              ][index % 4];
              return (
                <motion.article
                  key={metric.title}
                  animate={{ y, opacity }}
                  transition={{ duration: 0.28 }}
                  className={`w-full rounded-3xl border p-5 shadow-[0_15px_35px_rgba(0,0,0,0.35)] ${tone}`}
                >
                  <p className="text-[10px] uppercase tracking-[0.2em] text-cyan-200/92">Indicador</p>
                  <h3 className="mt-2 text-xl text-white">{metric.title}</h3>
                  <p className="mt-2 text-xs text-white/73">{metric.description}</p>
                  <p className="mt-4 text-3xl font-semibold text-cyan-200">
                    <CountUp value={metric.value} trigger={local > 0.4} />
                  </p>
                </motion.article>
              );
            })}
          </div>
        </div>
      </div>

    </section>
  );
}

function ModulesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-72%"]);
  return (
    <section id="modulos" ref={sectionRef} className="relative h-[190vh] bg-[#05070d]">
      <div className="sticky top-0 flex h-screen flex-col overflow-hidden">
        <div className="mx-auto w-full max-w-6xl px-6 pt-16">
          <h2 className="font-cinematic text-4xl text-white sm:text-6xl">Modulos conectados</h2>
          <p className="mt-3 max-w-2xl text-white/72">
            Arquitectura por capacidades para operar finanzas, servicio, reservas y gobierno desde el
            mismo sistema.
          </p>
        </div>

        <div className="relative mt-10 flex-1 overflow-hidden">
          <motion.div style={{ x }} className="flex h-full w-max items-center gap-5 px-[7vw] pb-14">
            {modules.map((module) => (
              <article
                key={module.title}
                className="w-[min(84vw,380px)] rounded-3xl border border-white/15 bg-white/[0.08] p-7 backdrop-blur-md"
              >
                <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/90">{module.badge}</p>
                <h3 className="mt-3 text-2xl text-white">{module.title}</h3>
                <p className="mt-4 text-sm leading-relaxed text-white/75">{module.description}</p>
                <a
                  href="#demo"
                  className="mt-6 inline-flex rounded-lg border border-cyan-200/40 bg-cyan-200/10 px-3 py-2 text-xs font-semibold text-cyan-100 transition hover:bg-cyan-200/20"
                >
                  Solicitar demostracion
                </a>
              </article>
            ))}
          </motion.div>
        </div>

      </div>
    </section>
  );
}

function IntelligenceSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const animationProgress = useTransform(
    scrollYProgress,
    [0, STICKY_PROGRESS_END],
    [0, 1],
    { clamp: true },
  );

  const orbitRotate = useTransform(animationProgress, [0, 1], [0, 220]);
  const orbitCounterRotate = useTransform(orbitRotate, (value) => -value);
  const centerScale = useTransform(animationProgress, [0, 0.5, 1], [0.92, 1.06, 0.96]);
  return (
    <section id="valores" ref={sectionRef} className="relative h-[190vh] overflow-clip bg-[#081225]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_15%,rgba(251,191,36,0.18),transparent_45%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_85%,rgba(14,165,233,0.2),transparent_45%)]" />

      <div className="sticky top-0 flex h-screen items-center">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-6 lg:grid-cols-2">
          <div>
            <h2 className="font-cinematic text-4xl text-white sm:text-6xl">Inteligencia aplicada y cumplimiento</h2>
            <p className="mt-4 text-white/74">
              Capa de analitica avanzada, IA legal y auditoria para decisiones confiables.
            </p>
          </div>

          <div className="relative mx-auto h-[420px] w-full max-w-[460px]">
            <motion.div
              style={{ rotate: orbitRotate }}
              className="absolute inset-0 rounded-full border border-cyan-200/18"
            >
              {intelligenceCards.map((card, index) => {
                const angle = (index / intelligenceCards.length) * Math.PI * 2;
                const styleTone = [
                  "rgba(34,211,238,0.18)",
                  "rgba(129,140,248,0.2)",
                  "rgba(16,185,129,0.2)",
                  "rgba(245,158,11,0.2)",
                  "rgba(244,114,182,0.2)",
                ][index % 5];

                return (
                  <motion.article
                    key={card.title}
                    style={{
                      left: `${(50 + Math.cos(angle) * 42).toFixed(3)}%`,
                      top: `${(50 + Math.sin(angle) * 42).toFixed(3)}%`,
                      rotate: orbitCounterRotate,
                      background: `linear-gradient(145deg, ${styleTone}, rgba(5,10,18,0.78) 72%)`,
                    }}
                    className="absolute w-[170px] -translate-x-1/2 -translate-y-1/2 rounded-xl border border-white/14 p-3 text-xs text-white/82 backdrop-blur"
                  >
                    <p className="font-semibold text-cyan-100">{card.title}</p>
                    <p className="mt-1 leading-relaxed text-white/72">{card.description}</p>
                  </motion.article>
                );
              })}
            </motion.div>

            <motion.div
              style={{ scale: centerScale }}
              className="absolute left-1/2 top-1/2 w-[220px] -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-cyan-200/35 bg-[#10203a]/92 p-5 text-center shadow-[0_0_40px_rgba(56,189,248,0.25)]"
            >
              <p className="text-xs uppercase tracking-[0.2em] text-cyan-200/95">Core IA</p>
              <p className="mt-3 text-xl text-white">
                <CountUp value={{ to: 80, suffix: "%" }} /> resolucion asistida
              </p>
            </motion.div>
          </div>
        </div>
      </div>

    </section>
  );
}

function PricingSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const animationProgress = useTransform(
    scrollYProgress,
    [0, STICKY_PROGRESS_END],
    [0, 1],
    { clamp: true },
  );

  const carouselRotate = useTransform(animationProgress, [0, 1], [0, -240]);

  return (
    <section id="planes" ref={sectionRef} className="relative h-[190vh] overflow-clip bg-[#0a101d]">
      <div className="sticky top-0 flex h-screen items-center">
        <div className="mx-auto w-full max-w-6xl px-6">
          <h2 className="font-cinematic text-center text-4xl text-white sm:text-6xl">Planes de suscripcion</h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-white/72">
            Estructura escalable por numero de unidades y nivel de automatizacion requerido.
          </p>

          <div className="mx-auto mt-12 h-[430px] w-full max-w-5xl [perspective:1500px]">
            <motion.div
              style={{ rotateY: carouselRotate }}
              className="relative h-full w-full [transform-style:preserve-3d]"
            >
              {plans.map((plan, index) => (
                <article
                  key={plan.name}
                  style={{
                    transform:
                      `translateX(-50%) translateY(-50%) rotateY(${index * 120}deg) translateZ(290px)`,
                  }}
                  className={`absolute left-1/2 top-1/2 w-[280px] rounded-3xl border p-6 ${plan.featured
                    ? "border-cyan-300/75 bg-cyan-300/10 shadow-[0_0_40px_rgba(34,211,238,0.28)]"
                    : "border-white/15 bg-white/[0.05]"
                    }`}
                >
                  <h3 className="text-2xl text-white">{plan.name}</h3>
                  <p className="mt-2 text-lg text-cyan-200">{plan.price}</p>

                  <ul className="mt-4 space-y-2 text-sm text-white/74">
                    {plan.items.map((item) => (
                      <li key={item} className="rounded-md border border-white/10 bg-black/30 px-3 py-2">
                        {item}
                      </li>
                    ))}
                  </ul>

                  <a
                    href="#demo"
                    className="mt-5 inline-flex rounded-xl bg-cyan-200 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-100"
                  >
                    Quiero este plan
                  </a>
                </article>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

    </section>
  );
}

function LeapSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const animationProgress = useTransform(
    scrollYProgress,
    [0, STICKY_PROGRESS_END],
    [0, 1],
    { clamp: true },
  );

  const flip = useTransform(animationProgress, [0, 1], [0, 180]);

  return (
    <section id="salto" ref={sectionRef} className="relative h-[190vh] overflow-clip bg-[#04070d]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_20%,rgba(236,72,153,0.17),transparent_44%)]" />
      <div className="sticky top-0 flex h-screen items-center">
        <div className="mx-auto w-full max-w-6xl px-6">
          <h2 className="font-cinematic text-center text-4xl text-white sm:text-6xl">El salto tecnologico</h2>

          <div className="mx-auto mt-12 h-[440px] w-full max-w-[440px] [perspective:1400px]">
            <motion.div
              style={{ rotateY: flip }}
              className="relative h-full w-full [transform-style:preserve-3d]"
            >
              <article className="absolute inset-0 flex flex-col overflow-hidden rounded-3xl border border-red-300/30 bg-[#1a0808]">
                <div className="p-6 pb-4">
                  <h3 className="text-2xl text-red-200">Gestion tradicional</h3>
                  <ul className="mt-4 space-y-3 text-sm text-red-50/86">
                    {traditional.map((item) => (
                      <li key={item} className="flex items-start gap-3 rounded-lg border border-red-200/10 bg-black/40 px-3 py-2.5">
                        <svg className="mt-0.5 h-4 w-4 shrink-0 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-auto h-[100px] w-full bg-cover bg-center opacity-60 mix-blend-screen" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600&q=80')" }} />
              </article>

              <article className="absolute inset-0 flex flex-col overflow-hidden rounded-3xl border border-emerald-300/35 bg-[#081a10] [backface-visibility:hidden] [transform:rotateY(180deg)]">
                <div className="p-6 pb-4">
                  <h3 className="text-2xl text-emerald-200">Admi Amigo 360</h3>
                  <ul className="mt-4 space-y-3 text-sm text-emerald-50/90">
                    {admiAmigo.map((item) => (
                      <li key={item} className="flex items-start gap-3 rounded-lg border border-emerald-200/15 bg-black/40 px-3 py-2.5">
                        <svg className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-auto h-[100px] w-full bg-cover bg-center opacity-60 mix-blend-screen" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80')" }} />
              </article>
            </motion.div>
          </div>
        </div>
      </div>

    </section>
  );
}

function ApartmentsShowcaseSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const animationProgress = useTransform(
    scrollYProgress,
    [0, STICKY_PROGRESS_END],
    [0, 1],
    { clamp: true },
  );

  const colOneY = useTransform(animationProgress, [0, 1], ["0%", "-30%"]);
  const colTwoY = useTransform(animationProgress, [0, 1], ["-18%", "22%"]);
  const colThreeY = useTransform(animationProgress, [0, 1], ["10%", "-24%"]);

  const [activeApt, setActiveApt] = useState(0);
  useMotionValueEvent(animationProgress, "change", (progress) => {
    const next = Math.min(apartments.length - 1, Math.floor(progress * apartments.length));
    setActiveApt((prev) => (prev === next ? prev : next));
  });

  const columns = useMemo(
    () => [
      apartments.filter((_, index) => index % 3 === 0),
      apartments.filter((_, index) => index % 3 === 1),
      apartments.filter((_, index) => index % 3 === 2),
    ],
    [],
  );

  return (
    <section id="apartamentos" ref={sectionRef} className="relative h-[190vh] overflow-clip bg-[#061019]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_22%,rgba(56,189,248,0.18),transparent_42%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_82%_82%,rgba(168,85,247,0.16),transparent_44%)]" />
      <div className="sticky top-0 flex h-screen items-center">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-6 lg:grid-cols-[1fr_1.15fr]">
          <div>
            <h2 className="font-cinematic text-4xl text-white sm:text-6xl">Vitrina de apartamentos</h2>
            <p className="mt-4 text-white/74">
              Publica, descubre y filtra inmuebles del conjunto con un recorrido visual inmersivo.
            </p>

            <AnimatePresence mode="wait">
              <motion.article
                key={apartments[activeApt].id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="mt-8 overflow-hidden rounded-3xl border border-white/14 bg-black/35"
              >
                <div className="h-44 w-full bg-cover bg-center" style={{ backgroundImage: `url(${apartments[activeApt].image})` }} />
                <div className="p-6">
                  <p className="text-xs uppercase tracking-[0.2em] text-cyan-200/90">Apartamento destacado</p>
                  <h3 className="mt-3 text-2xl text-white">{apartments[activeApt].name}</h3>
                  <p className="mt-2 text-sm text-white/74">
                    {apartments[activeApt].type} · {apartments[activeApt].area} · {apartments[activeApt].city}
                  </p>
                  <p className="mt-2 text-xl font-semibold text-cyan-200">{apartments[activeApt].price}</p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {apartments[activeApt].perks.map((perk) => (
                      <span key={perk} className="rounded-full border border-white/16 bg-white/6 px-3 py-1 text-xs text-white/84">
                        {perk}
                      </span>
                    ))}
                  </div>

                  <a
                    href="#demo"
                    className="mt-5 inline-flex rounded-xl bg-cyan-200 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-100"
                  >
                    Publicar apartamento
                  </a>
                </div>
              </motion.article>
            </AnimatePresence>
          </div>

          <div className="relative h-[65vh] overflow-hidden rounded-3xl border border-white/12 bg-black/25 p-4">
            <motion.div style={{ y: colOneY }} className="absolute left-4 top-4 w-[31%] space-y-3">
              {columns[0].map((apartment) => (
                <article key={apartment.id} className="overflow-hidden rounded-2xl border border-cyan-200/20 bg-[#0f1f38]/88">
                  <div className="h-28 w-full bg-cover bg-center" style={{ backgroundImage: `url(${apartment.image})` }} />
                  <div className="p-3">
                    <p className="text-[10px] text-white/88" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{apartment.name}</p>
                  </div>
                </article>
              ))}
            </motion.div>

            <motion.div style={{ y: colTwoY }} className="absolute left-[34.5%] top-4 w-[31%] space-y-3">
              {columns[1].map((apartment) => (
                <article key={apartment.id} className="overflow-hidden rounded-2xl border border-fuchsia-200/25 bg-[#10263f]/88">
                  <div className="h-36 w-full bg-cover bg-center" style={{ backgroundImage: `url(${apartment.image})` }} />
                  <div className="p-3">
                    <p className="text-[10px] text-white/88" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{apartment.name}</p>
                  </div>
                </article>
              ))}
            </motion.div>

            <motion.div style={{ y: colThreeY }} className="absolute right-4 top-4 w-[31%] space-y-3">
              {columns[2].map((apartment) => (
                <article key={apartment.id} className="overflow-hidden rounded-2xl border border-amber-200/25 bg-[#10233a]/88">
                  <div className="h-32 w-full bg-cover bg-center" style={{ backgroundImage: `url(${apartment.image})` }} />
                  <div className="p-3">
                    <p className="text-[10px] text-white/88" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{apartment.name}</p>
                  </div>
                </article>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

    </section>
  );
}

function AssistantSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const animationProgress = useTransform(
    scrollYProgress,
    [0, STICKY_PROGRESS_END],
    [0, 1],
    { clamp: true },
  );

  const bubbleY = useTransform(animationProgress, [0, 1], [30, -24]);
  const pulseScale = useTransform(animationProgress, [0, 0.5, 1], [0.92, 1.08, 0.96]);
  const [activeHint, setActiveHint] = useState(0);
  useMotionValueEvent(animationProgress, "change", (progress) => {
    const next = Math.min(assistantHints.length - 1, Math.floor(progress * assistantHints.length));
    setActiveHint((prev) => (prev === next ? prev : next));
  });

  return (
    <section id="asistente" ref={sectionRef} className="relative h-[190vh] overflow-clip bg-[#050914]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_30%,rgba(14,165,233,0.22),transparent_48%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_78%,rgba(244,114,182,0.16),transparent_44%)]" />

      <div className="sticky top-0 flex h-screen items-center">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-6 lg:grid-cols-2">
          <div>
            <h2 className="font-cinematic text-4xl text-white sm:text-6xl">Asistente IA 24/7</h2>
            <p className="mt-5 text-white/75">
              Copiloto para administracion y residentes con foco en velocidad de respuesta y calidad de
              servicio.
            </p>

            <div className="mt-7 grid gap-3">
              {assistantHints.map((hint, index) => {
                const isActive = index === activeHint;
                return (
                  <motion.div
                    key={hint}
                    animate={{
                      opacity: isActive ? 1 : 0.55,
                      x: isActive ? 0 : 10,
                      scale: isActive ? 1.02 : 0.985,
                    }}
                    transition={{ duration: 0.24 }}
                    className={`rounded-xl border px-4 py-3 text-sm backdrop-blur ${isActive
                      ? "border-cyan-200/50 bg-cyan-300/12 text-cyan-50"
                      : "border-white/15 bg-black/35 text-white/84"
                      }`}
                  >
                    {hint}
                  </motion.div>
                );
              })}
            </div>
          </div>

          <motion.div
            style={{ y: bubbleY }}
            className="relative mx-auto w-full max-w-md rounded-3xl border border-cyan-200/30 bg-[#0d1b32]/85 p-6 shadow-[0_0_50px_rgba(56,189,248,0.24)]"
          >
            <motion.div
              style={{ scale: pulseScale }}
              className="pointer-events-none absolute -inset-3 rounded-[28px] border border-cyan-200/20 blur-[1px]"
            />
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-200/90">Chat activo</p>

            <AnimatePresence mode="wait">
              <motion.div
                key={assistantHints[activeHint]}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.24 }}
                className="mt-4 rounded-2xl border border-white/15 bg-black/35 p-4 text-sm text-white/86"
              >
                {assistantHints[activeHint]}
              </motion.div>
            </AnimatePresence>

            <AnimatePresence mode="wait">
              <motion.div
                key={assistantResponses[activeHint]}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="mt-4 rounded-2xl border border-cyan-200/25 bg-cyan-300/10 p-4 text-sm leading-relaxed text-cyan-50/95 shadow-[inset_0_0_15px_rgba(34,211,238,0.1)]"
              >
                {assistantResponses[activeHint]}
              </motion.div>
            </AnimatePresence>

            <div className="mt-4 flex items-center gap-2">
              <motion.span
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.2, repeat: Infinity }}
                className="h-2.5 w-2.5 rounded-full bg-cyan-300"
              />
              <motion.span
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: 0.2 }}
                className="h-2.5 w-2.5 rounded-full bg-fuchsia-300"
              />
              <motion.span
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: 0.4 }}
                className="h-2.5 w-2.5 rounded-full bg-amber-300"
              />
              <span className="ml-2 text-xs text-cyan-100/90">respondiendo...</span>
            </div>
          </motion.div>
        </div>
      </div>

    </section>
  );
}

function ContactSection() {
  return (
    <section id="demo" className="relative overflow-hidden bg-[#05060a] py-24 sm:py-28">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(56,189,248,0.2),transparent_55%)]" />

      <div className="relative mx-auto w-full max-w-6xl px-6">
        <div className="rounded-3xl border border-white/15 bg-white/[0.04] p-8 text-center sm:p-12">
          <h2 className="font-cinematic text-4xl text-white sm:text-6xl">Toma el control hoy</h2>

          <p className="mx-auto mt-5 max-w-2xl text-white/74">
            Setup en 24 horas, acompanamiento premium y puesta en marcha guiada para tu comunidad.
          </p>

          <div className="mt-10 grid gap-4 text-sm text-white/80 sm:grid-cols-3">
            <a
              className="rounded-xl border border-white/15 bg-black/40 px-4 py-3 transition hover:bg-black/60"
              href="mailto:info@admiamigo360.com"
            >
              info@admiamigo360.com
            </a>
            <a
              className="rounded-xl border border-white/15 bg-black/40 px-4 py-3 transition hover:bg-black/60"
              href="tel:+57123456789"
            >
              +57 (1) 2345-6789
            </a>
            <a
              className="rounded-xl border border-white/15 bg-black/40 px-4 py-3 transition hover:bg-black/60"
              href="https://maps.google.com/?q=Bogota+Colombia"
              target="_blank"
              rel="noreferrer"
            >
              Bogota, Colombia
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function ImmersiveSections() {
  return (
    <>
      <HowItWorksSection />
      <EcosystemWorldSection />
      <DashboardSection />
      <ModulesSection />
      <IntelligenceSection />
      <PricingSection />
      <LeapSection />
      <ApartmentsShowcaseSection />
      <AssistantSection />
      <ContactSection />
    </>
  );
}
