import { NextResponse } from "next/server";

import { getSupabaseAdminClient } from "@/lib/supabase/admin";

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

function normalizePhone(value: string) {
  return value.replace(/\D/g, "");
}

function phoneMatches(storedPhone: string, inputPhone: string) {
  const stored = normalizePhone(storedPhone);
  const input = normalizePhone(inputPhone);

  return Boolean(stored && input && (stored === input || stored.endsWith(input) || input.endsWith(stored)));
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const fullName = String(body.fullName ?? "").trim();
    const tower = String(body.tower ?? "").trim();
    const unitCode = String(body.unitCode ?? "").trim().toUpperCase();
    const phone = String(body.phone ?? "").trim();

    if (!fullName || !tower || !unitCode || !phone) {
      return NextResponse.json(
        { error: "Completa nombre, torre, unidad y teléfono para continuar." },
        { status: 400 },
      );
    }

    const adminClient = getSupabaseAdminClient();
    let matchedEmail = "";
    const unitResult = await adminClient
      .from("units")
      .select("id")
      .ilike("tower", tower)
      .ilike("unit_code", unitCode)
      .maybeSingle();

    if (!unitResult.error && unitResult.data?.id) {
      const residentsResult = await adminClient
        .from("residents")
        .select("full_name, email, phone, profile_id")
        .eq("unit_id", unitResult.data.id);

      if (!residentsResult.error && residentsResult.data?.length) {
        const targetResident = residentsResult.data.find((resident) => {
          const nameMatches =
            normalizeText(String(resident.full_name ?? "")) === normalizeText(fullName);
          const residentPhone = String(resident.phone ?? "");
          return nameMatches && phoneMatches(residentPhone, phone) && Boolean(resident.profile_id);
        });

        if (targetResident?.email) {
          matchedEmail = String(targetResident.email).trim().toLowerCase();
        }
      }
    }

    if (!matchedEmail) {
      return NextResponse.json(
        {
          error:
            "No encontramos una cuenta activa con esos datos. Revisa la información o solicita soporte a administración.",
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      sent: true,
      email: matchedEmail,
      message: `El correo vinculado a esta vivienda es ${matchedEmail}. Si no recuerdas la contraseña, usa ese correo en recuperación.`,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "No fue posible iniciar la recuperación de acceso.",
      },
      { status: 500 },
    );
  }
}
