import { NextResponse } from "next/server";

import { validateInternationalPhone } from "@/lib/contact-validation";
import { validateEmailCanReceiveMail } from "@/lib/supabase/email-domain";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

function normalizeTower(value: string) {
  const cleaned = value.trim().replace(/\s+/g, " ").toLowerCase();

  if (!cleaned) {
    return "";
  }

  if (cleaned.startsWith("torre ")) {
    const suffix = cleaned.slice(6).trim().toUpperCase();
    return `Torre ${suffix}`;
  }

  return cleaned
    .split(" ")
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
}

function buildResidentSlug(tower: string, unitCode: string, email: string) {
  const emailSeed = email.split("@")[0] ?? "resident";
  const randomSeed = crypto.randomUUID().slice(0, 6);
  return `${tower}-${unitCode}-${emailSeed}-${randomSeed}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-");
}

function normalizePhone(value: string) {
  const trimmed = value.trim();

  if (!trimmed.startsWith("+")) {
    return "";
  }

  return `+${trimmed.slice(1).replace(/\D/g, "")}`;
}

function buildRequestNotes(
  notes: string,
  preferredProvider: string,
  fullName: string,
  email: string,
  tower: string,
  unitCode: string,
) {
  return [
    "Solicitud de acceso enviada desde la app.",
    `Solicitante: ${fullName}.`,
    `Correo de contacto: ${email}.`,
    `Apartamento: ${tower} ${unitCode}.`,
    `Método preferido: ${preferredProvider || "correo y contraseña"}.`,
    notes || "",
  ]
    .filter(Boolean)
    .join(" ");
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const fullName = String(body.fullName ?? "").trim();
    const email = String(body.email ?? "").trim().toLowerCase();
    const rawPhone = String(body.phone ?? "").trim();
    const rawUnitCode = String(body.apartmentCode ?? body.unitCode ?? "").trim();
    const phone = normalizePhone(rawPhone);
    const tower = normalizeTower(String(body.tower ?? ""));
    const unitCode = rawUnitCode.replace(/\D/g, "");
    const levelLabel = unitCode;
    const residentType = String(body.residentType ?? "tenant");
    const preferredProvider = String(body.preferredProvider ?? "password").trim();
    const notes = String(body.notes ?? "").trim();
    const propertyCode = String(body.propertyCode ?? "admiamigo-360").trim().toLowerCase();

    if (!fullName || !email || !phone || !tower || !unitCode) {
      return NextResponse.json(
        {
          error:
            "Completa nombre, correo, teléfono, torre y apartamento para solicitar el acceso.",
        },
        { status: 400 },
      );
    }

    const emailValidation = await validateEmailCanReceiveMail(email);

    if (!emailValidation.isValid) {
      return NextResponse.json(
        { error: emailValidation.error },
        { status: 400 },
      );
    }

    if (!/^\d{1,6}$/.test(rawUnitCode) || !/^\d{1,6}$/.test(unitCode)) {
      return NextResponse.json(
        { error: "El apartamento debe contener solo números." },
        { status: 400 },
      );
    }

    const phoneValidation = validateInternationalPhone(phone);

    if (!/^\+\d+$/.test(rawPhone) || !phoneValidation.isValid) {
      return NextResponse.json(
        { error: phoneValidation.error },
        { status: 400 },
      );
    }

    const adminClient = getSupabaseAdminClient();
    const propertyResult = await adminClient
      .from("properties")
      .select("id, name, code")
      .ilike("code", propertyCode)
      .maybeSingle();

    if (propertyResult.error || !propertyResult.data?.id) {
      return NextResponse.json(
        {
          error:
            "No encontramos el conjunto asociado a esta app. Verifica el código del conjunto con administración.",
        },
        { status: 404 },
      );
    }

    const propertyId = propertyResult.data.id;
    const unitResult = await adminClient
      .from("units")
      .upsert(
        {
          property_id: propertyId,
          tower,
          level_label: levelLabel,
          unit_code: unitCode,
        },
        { onConflict: "property_id,tower,unit_code" },
      )
      .select("id")
      .single();

    if (unitResult.error || !unitResult.data?.id) {
      return NextResponse.json(
        { error: "No fue posible ubicar el apartamento para la solicitud de acceso." },
        { status: 500 },
      );
    }

    const existingEmailResident = await adminClient
      .from("residents")
      .select("id, email, full_name, profile_id")
      .eq("property_id", propertyId)
      .eq("email", email)
      .maybeSingle();

    if (existingEmailResident.error) {
      return NextResponse.json(
        { error: "No fue posible validar el correo del solicitante." },
        { status: 500 },
      );
    }

    if (existingEmailResident.data?.profile_id) {
      return NextResponse.json(
        {
          error:
            "Ya existe una cuenta activa con ese correo. Usa la recuperación de acceso o inicia sesión directamente.",
        },
        { status: 409 },
      );
    }

    const requestNotes = buildRequestNotes(
      notes,
      preferredProvider,
      fullName,
      email,
      tower,
      unitCode,
    );

    const residentPayload = {
      profile_id: null,
      property_id: propertyId,
      unit_id: unitResult.data.id,
      slug: buildResidentSlug(tower, unitCode, email),
      full_name: fullName,
      email,
      phone,
      resident_type: residentType === "owner" ? "owner" : "tenant",
      status: "pending",
      balance: 0,
      notes: requestNotes,
      created_by: null,
    };

    const residentResult = existingEmailResident.data?.id
      ? await adminClient
          .from("residents")
          .update({
            unit_id: unitResult.data.id,
            full_name: fullName,
            phone,
            resident_type: residentType === "owner" ? "owner" : "tenant",
            status: "pending",
            notes: requestNotes,
          })
          .eq("id", existingEmailResident.data.id)
          .select("id, full_name, email")
          .single()
      : await adminClient
          .from("residents")
          .insert(residentPayload)
          .select("id, full_name, email")
          .single();

    if (residentResult.error || !residentResult.data) {
      return NextResponse.json(
        {
          error:
            residentResult.error?.message ??
            "No fue posible registrar la solicitud de acceso.",
        },
        { status: 500 },
      );
    }

    await adminClient.from("operations").insert({
      property_id: propertyId,
      title: "Solicitud de acceso",
      note: `${fullName} solicitó acceso para ${tower} apartamento ${unitCode}. Método: ${preferredProvider}. Correo: ${email}.`,
      priority: "medium",
      icon: "person_add",
      status: "open",
    });

    return NextResponse.json({
      requested: true,
      message:
        "Tu solicitud de acceso fue registrada. La administración del conjunto debe validarla antes de habilitar tu ingreso.",
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "No fue posible registrar la solicitud de acceso.",
      },
      { status: 500 },
    );
  }
}
