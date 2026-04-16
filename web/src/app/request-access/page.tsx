"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { AppScreen } from "@/components/app/AppScreen";
import { GlassCard } from "@/components/app/GlassCard";
import { HeaderBar } from "@/components/app/HeaderBar";
import { Icon } from "@/components/app/Icon";
import {
  buildInternationalPhone,
  countryOptions,
  getCountryOption,
  onlyDigits,
  towerOptions,
  validateEmailFormat,
  validateNationalPhone,
} from "@/lib/contact-validation";

type ApiResult = {
  requested?: boolean;
  message?: string;
  error?: string;
};

const initialRequestState = {
  fullName: "",
  email: "",
  phoneCountry: "+57",
  phone: "",
  tower: "Torre A",
  apartmentCode: "",
  residentType: "tenant",
  preferredProvider: "password",
  notes: "",
};

export default function RequestAccessPage() {
  const [requestForm, setRequestForm] = useState(initialRequestState);
  const [requestLoading, setRequestLoading] = useState(false);
  const [requestResult, setRequestResult] = useState<ApiResult | null>(null);
  const [requestSource, setRequestSource] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const nextEmail = params.get("email");
    const nextSource = params.get("source");

    if (nextEmail) {
      setRequestForm((current) => ({ ...current, email: nextEmail }));
    }

    if (nextSource === "oauth") {
      setRequestSource(nextSource);
    }
  }, []);

  function updateRequestField(field: keyof typeof initialRequestState, value: string) {
    setRequestForm((current) => ({ ...current, [field]: value }));
  }

  function updateDigitsField(field: "phone" | "apartmentCode", value: string) {
    const digits = onlyDigits(value);
    const maxLength =
      field === "phone" ? getCountryOption(requestForm.phoneCountry).digits : 6;

    updateRequestField(field, digits.slice(0, maxLength));
  }

  async function handleAccessRequest(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setRequestLoading(true);
    setRequestResult(null);

    try {
      const emailValidation = validateEmailFormat(requestForm.email);
      const phoneValidation = validateNationalPhone(
        requestForm.phoneCountry,
        requestForm.phone,
      );

      if (!emailValidation.isValid) {
        throw new Error(emailValidation.error);
      }

      if (!phoneValidation.isValid) {
        throw new Error(phoneValidation.error);
      }

      const response = await fetch("/api/auth/access-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...requestForm,
          email: emailValidation.email,
          apartmentCode: requestForm.apartmentCode,
          phone: buildInternationalPhone(requestForm.phoneCountry, requestForm.phone),
          propertyCode: "admiamigo-360",
        }),
      });

      const result = (await response.json()) as ApiResult;

      if (!response.ok) {
        throw new Error(result.error ?? "No fue posible registrar tu solicitud.");
      }

      setRequestResult(result);
      setRequestForm(initialRequestState);
    } catch (error) {
      setRequestResult({
        error:
          error instanceof Error ? error.message : "No fue posible registrar tu solicitud.",
      });
    } finally {
      setRequestLoading(false);
    }
  }

  const selectedCountry = getCountryOption(requestForm.phoneCountry);

  return (
    <AppScreen
      requireAuth={false}
      header={
        <HeaderBar
          title="Solicitud de acceso"
          subtitle="Crea una solicitud para vincular tu correo con una vivienda."
          icon="person_add"
          action={
            <Link
              href="/login"
              className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[var(--app-card-border)] bg-white text-[var(--app-heading)] shadow-[0_10px_18px_rgba(93,64,55,0.05)]"
            >
              <Icon name="arrow_back" />
            </Link>
          }
        />
      }
    >
      <GlassCard className="rounded-[1.6rem] p-4">
        <form className="space-y-4" onSubmit={handleAccessRequest}>
          <div>
            <p className="app-kicker">Nuevo residente</p>
            <h2 className="app-display mt-2 text-[1.45rem] font-[680] text-[var(--app-heading)]">
              Vincula tu vivienda
            </h2>
            <p className="mt-2 text-[0.92rem] leading-6 text-[var(--app-muted)]">
              La administración revisará los datos antes de activar tu ingreso.
            </p>
          </div>

          {requestSource === "oauth" ? (
            <div className="rounded-[1rem] border border-[rgba(159,122,86,0.18)] bg-[#F7F1EA] px-4 py-3 text-[0.9rem] leading-6 text-[var(--app-heading)]">
              El correo ya fue verificado. Falta vincularlo a una vivienda del conjunto.
            </div>
          ) : null}

          <label className="block">
            <span className="mb-2 block text-[0.75rem] font-semibold uppercase tracking-[0.18em] text-[var(--app-muted)]">
              Nombre completo
            </span>
            <input
              value={requestForm.fullName}
              onChange={(event) => updateRequestField("fullName", event.target.value)}
              className="app-input h-[3.8rem] w-full rounded-[1rem] px-4 outline-none"
              placeholder="Nombre del residente"
            />
          </label>

          <div className="grid grid-cols-1 gap-4">
            <label className="block">
              <span className="mb-2 block text-[0.75rem] font-semibold uppercase tracking-[0.18em] text-[var(--app-muted)]">
                Correo de contacto
              </span>
              <input
                type="email"
                value={requestForm.email}
                onChange={(event) => updateRequestField("email", event.target.value)}
                className="app-input h-[3.8rem] w-full rounded-[1rem] px-4 outline-none"
                placeholder="nombre@gmail.com"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-[0.75rem] font-semibold uppercase tracking-[0.18em] text-[var(--app-muted)]">
                Teléfono
              </span>
              <div className="grid grid-cols-[7.8rem_1fr] gap-2">
                <select
                  value={requestForm.phoneCountry}
                  onChange={(event) => {
                    const nextCountry = getCountryOption(event.target.value);
                    setRequestForm((current) => ({
                      ...current,
                      phoneCountry: nextCountry.code,
                      phone: current.phone.slice(0, nextCountry.digits),
                    }));
                  }}
                  className="app-input h-[3.8rem] w-full rounded-[1rem] px-3 text-[0.9rem] outline-none"
                  aria-label="Indicativo del país"
                >
                  {countryOptions.map((option) => (
                    <option key={option.code} value={option.code}>
                      {option.code} {option.label}
                    </option>
                  ))}
                </select>
                <input
                  type="tel"
                  inputMode="numeric"
                  value={requestForm.phone}
                  onChange={(event) => updateDigitsField("phone", event.target.value)}
                  maxLength={selectedCountry.digits}
                  className="app-input h-[3.8rem] w-full rounded-[1rem] px-4 outline-none"
                  placeholder={selectedCountry.placeholder}
                />
              </div>
              <p className="mt-2 text-[0.78rem] leading-5 text-[var(--app-muted)]">
                {selectedCountry.label}: {selectedCountry.digits} dígitos.
              </p>
            </label>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="mb-2 block text-[0.75rem] font-semibold uppercase tracking-[0.18em] text-[var(--app-muted)]">
                Torre
              </span>
              <select
                value={requestForm.tower}
                onChange={(event) => updateRequestField("tower", event.target.value)}
                className="app-input h-[3.8rem] w-full rounded-[1rem] px-4 outline-none"
              >
                {towerOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-[0.75rem] font-semibold uppercase tracking-[0.18em] text-[var(--app-muted)]">
                Apartamento
              </span>
              <input
                type="text"
                inputMode="numeric"
                value={requestForm.apartmentCode}
                onChange={(event) => updateDigitsField("apartmentCode", event.target.value)}
                maxLength={6}
                className="app-input h-[3.8rem] w-full rounded-[1rem] px-4 outline-none"
                placeholder="402"
              />
            </label>
          </div>

          <label className="block">
            <span className="mb-2 block text-[0.75rem] font-semibold uppercase tracking-[0.18em] text-[var(--app-muted)]">
              Tipo
            </span>
            <select
              value={requestForm.residentType}
              onChange={(event) => updateRequestField("residentType", event.target.value)}
              className="app-input h-[3.8rem] w-full rounded-[1rem] px-4 outline-none"
            >
              <option value="tenant">Inquilino</option>
              <option value="owner">Propietario</option>
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-[0.75rem] font-semibold uppercase tracking-[0.18em] text-[var(--app-muted)]">
              Método de acceso preferido
            </span>
            <select
              value={requestForm.preferredProvider}
              onChange={(event) => updateRequestField("preferredProvider", event.target.value)}
              className="app-input h-[3.8rem] w-full rounded-[1rem] px-4 outline-none"
            >
              <option value="password">Correo y contraseña</option>
              <option value="google">Google</option>
              <option value="azure">Microsoft</option>
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-[0.75rem] font-semibold uppercase tracking-[0.18em] text-[var(--app-muted)]">
              Observaciones
            </span>
            <textarea
              value={requestForm.notes}
              onChange={(event) => updateRequestField("notes", event.target.value)}
              className="app-input min-h-[7rem] w-full rounded-[1rem] px-4 py-3 outline-none"
              placeholder="Ejemplo: recién me entregaron el apartamento o necesito activar acceso para reservas."
            />
          </label>

          {requestResult?.message ? (
            <div className="rounded-[1rem] border border-[rgba(86,114,96,0.18)] bg-[var(--app-success-bg)] px-4 py-3 text-[0.9rem] text-[var(--app-success)]">
              {requestResult.message}
            </div>
          ) : null}

          {requestResult?.error ? (
            <div className="rounded-[1rem] border border-[rgba(161,90,73,0.18)] bg-[var(--app-danger-bg)] px-4 py-3 text-[0.9rem] text-[var(--app-danger)]">
              {requestResult.error}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={requestLoading}
            className="app-button-primary flex h-[4rem] w-full items-center justify-center gap-3 rounded-[1rem] text-[1rem] font-semibold disabled:opacity-70"
          >
            {requestLoading ? "Enviando..." : "Solicitar acceso"}
            <Icon name="person_add" className="text-[1.1rem]" />
          </button>
        </form>
      </GlassCard>
    </AppScreen>
  );
}
