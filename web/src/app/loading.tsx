import { AppViewport } from "@/components/app/AppViewport";

export default function Loading() {
  return (
    <AppViewport>
      <main className="flex flex-1 items-center justify-center px-6">
        <section className="w-full max-w-[330px] rounded-[2rem] border border-[var(--app-card-border)] bg-white p-6 text-center shadow-[var(--app-shadow)]">
          <div className="mx-auto h-12 w-12 rounded-full bg-[var(--app-primary-soft)]" />
          <p className="app-kicker mt-5">AdmiAmigo 360</p>
          <h1 className="app-display mt-2 text-[1.45rem] font-[680] text-[var(--app-heading)]">
            Cargando pantalla
          </h1>
          <p className="mt-2 text-[0.92rem] leading-6 text-[var(--app-muted)]">
            Preparando la información del conjunto.
          </p>
        </section>
      </main>
    </AppViewport>
  );
}
