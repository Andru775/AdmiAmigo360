import Link from "next/link";

const kpis = [
  { label: "Recaudo del mes", value: "$184.2M", trend: "+12.4% vs mes anterior" },
  { label: "Cartera vencida", value: "$22.8M", trend: "-8.1% en 30 dias" },
  { label: "PQRS abiertas", value: "18", trend: "6 criticas · 12 normales" },
  { label: "Reservas hoy", value: "14", trend: "2 pendientes de aprobacion" },
];

const tasks = [
  {
    title: "Aprobar acta de asamblea extraordinaria",
    due: "Hoy · 17:00",
    owner: "Administracion",
  },
  {
    title: "Enviar recordatorio de cuota abril",
    due: "Mañana · 08:00",
    owner: "Finanzas",
  },
  {
    title: "Asignar proveedor para bomba hidraulica",
    due: "04 abr · 10:30",
    owner: "Mantenimiento",
  },
];

const pqrsQueue = [
  { id: "PQR-1931", type: "Ruido", apt: "Torre C · 1204", status: "En gestion" },
  { id: "PQR-1930", type: "Parqueadero", apt: "Torre A · 304", status: "Nuevo" },
  { id: "PQR-1928", type: "Mascotas", apt: "Torre B · 905", status: "Pendiente residente" },
  { id: "PQR-1924", type: "Porteria", apt: "Torre A · 102", status: "Cerrado" },
];

export default function AppDashboardPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-cyan-300/90">Admi Amigo 360</p>
            <h1 className="mt-2 text-3xl font-semibold">Panel operativo</h1>
            <p className="mt-1 text-sm text-slate-300">Vista inicial para administración de propiedad horizontal.</p>
          </div>
          <div className="flex gap-2">
            <Link
              href="/"
              className="rounded-lg border border-slate-600 px-4 py-2 text-sm text-slate-200 transition hover:border-cyan-300 hover:text-cyan-200"
            >
              Volver a landing
            </Link>
            <button className="rounded-lg bg-cyan-300 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200">
              Crear anuncio
            </button>
          </div>
        </header>

        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {kpis.map((kpi) => (
            <article key={kpi.label} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
              <p className="text-sm text-slate-400">{kpi.label}</p>
              <p className="mt-2 text-2xl font-semibold text-white">{kpi.value}</p>
              <p className="mt-1 text-xs text-emerald-300">{kpi.trend}</p>
            </article>
          ))}
        </section>

        <section className="mt-6 grid gap-4 lg:grid-cols-[1.3fr_1fr]">
          <article className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
            <h2 className="text-lg font-medium">Bandeja PQRS</h2>
            <p className="mt-1 text-sm text-slate-400">Casos recientes con estado actualizado.</p>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[560px] text-left text-sm">
                <thead className="text-slate-400">
                  <tr>
                    <th className="py-2">ID</th>
                    <th className="py-2">Tipo</th>
                    <th className="py-2">Unidad</th>
                    <th className="py-2">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {pqrsQueue.map((row) => (
                    <tr key={row.id} className="border-t border-slate-800">
                      <td className="py-2 text-cyan-300">{row.id}</td>
                      <td className="py-2">{row.type}</td>
                      <td className="py-2 text-slate-300">{row.apt}</td>
                      <td className="py-2">
                        <span className="rounded-full bg-slate-800 px-2 py-1 text-xs text-slate-200">{row.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>

          <article className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
            <h2 className="text-lg font-medium">Tareas clave</h2>
            <p className="mt-1 text-sm text-slate-400">Prioridades operativas próximas.</p>
            <ul className="mt-4 space-y-3">
              {tasks.map((task) => (
                <li key={task.title} className="rounded-xl border border-slate-800 bg-slate-950/50 p-3">
                  <p className="text-sm font-medium text-white">{task.title}</p>
                  <p className="mt-1 text-xs text-slate-400">{task.owner}</p>
                  <p className="mt-2 text-xs text-cyan-300">{task.due}</p>
                </li>
              ))}
            </ul>
          </article>
        </section>
      </div>
    </main>
  );
}
