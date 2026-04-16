import { NextResponse } from "next/server";

import { ensureAccountRole, isAppRole } from "@/lib/supabase/account-roles";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { sendAccountActivationEmail } from "@/lib/supabase/auth-emails";
import { getRequestContext } from "@/lib/supabase/request-context";

function residentSlugFromUnit(tower: string, unitCode: string, email: string) {
  return `${tower}-${unitCode}-${email}`.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function normalizePhone(value: string) {
  const trimmed = value.trim();

  if (!trimmed) {
    return "";
  }

  if (!trimmed.startsWith("+")) {
    return "";
  }

  return `+${trimmed.slice(1).replace(/\D/g, "")}`;
}

function isValidInternationalPhone(value: string) {
  return !value || /^\+[1-9]\d{7,14}$/.test(value);
}

export async function GET(request: Request) {
  try {
    const context = await getRequestContext(request, "admin");

    if (!context) {
      return NextResponse.json({ error: "Debes iniciar sesión como administrador." }, { status: 401 });
    }

    if (context.profile.role !== "admin") {
      return NextResponse.json({ error: "Solo un administrador puede ver residentes." }, { status: 403 });
    }

    const adminClient = getSupabaseAdminClient();
    const { data, error } = await adminClient
      .from("residents")
      .select(
        "id, slug, full_name, email, phone, resident_type, status, balance, notes, unit:units!residents_unit_id_fkey(tower, level_label, unit_code)",
      )
      .eq("property_id", context.profile.property_id)
      .order("created_at", { ascending: true });

    if (error) {
      return NextResponse.json({ error: "No fue posible cargar residentes." }, { status: 500 });
    }

    return NextResponse.json({ residents: data ?? [] });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Ocurrió un error inesperado cargando residentes.",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const context = await getRequestContext(request, "admin");

    if (!context) {
      return NextResponse.json({ error: "Debes iniciar sesión como administrador." }, { status: 401 });
    }

    if (context.profile.role !== "admin") {
      return NextResponse.json({ error: "Solo un administrador puede crear residentes." }, { status: 403 });
    }

    const adminClient = getSupabaseAdminClient();
    const body = (await request.json()) as Record<string, unknown>;
    const fullName = String(body.fullName ?? "").trim();
    const email = String(body.email ?? "").trim().toLowerCase();
    const rawPhone = String(body.phone ?? "").trim();
    const rawUnitCode = String(body.unitCode ?? "").trim();
    const phone = normalizePhone(rawPhone);
    const tower = String(body.tower ?? "").trim();
    const levelLabel = String(body.levelLabel ?? "").trim();
    const unitCode = rawUnitCode.replace(/\D/g, "");
    const residentType = String(body.residentType ?? "tenant");
    const notes = String(body.notes ?? "").trim();
    const password = String(body.password ?? "").trim();
    const balance = Number(body.balance ?? 0);

    if (!fullName || !email || !tower || !levelLabel || !unitCode) {
      return NextResponse.json({ error: "Completa nombre, correo, torre y apartamento." }, { status: 400 });
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Ingresa un correo electrónico válido." }, { status: 400 });
    }

    if (!/^\d{1,6}$/.test(rawUnitCode) || !/^\d{1,6}$/.test(unitCode)) {
      return NextResponse.json({ error: "El apartamento debe contener solo números." }, { status: 400 });
    }

    if (/[a-z]/i.test(rawPhone) || !isValidInternationalPhone(phone)) {
      return NextResponse.json(
        { error: "Ingresa un teléfono válido con indicativo de país." },
        { status: 400 },
      );
    }

    const unitUpsert = await adminClient
      .from("units")
      .upsert(
        {
          property_id: context.profile.property_id,
          tower,
          level_label: levelLabel,
          unit_code: unitCode,
        },
        { onConflict: "property_id,tower,unit_code" },
      )
      .select("id")
      .single();

    if (unitUpsert.error || !unitUpsert.data?.id) {
      return NextResponse.json({ error: "No fue posible crear o ubicar la unidad." }, { status: 500 });
    }

    const listResult = await adminClient.auth.admin.listUsers({ page: 1, perPage: 1000 });
    const existingUser = listResult.data.users.find(
      (candidate) => candidate.email?.toLowerCase() === email,
    );

    const createdPassword = password || `Admi360-${unitCode}`;
    const shouldSendActivationEmail = !password;
    let authUserId = existingUser?.id;

    if (!authUserId) {
      const createResult = await adminClient.auth.admin.createUser({
        email,
        password: createdPassword,
        email_confirm: true,
        user_metadata: {
          role: "resident",
        },
      });

      if (createResult.error || !createResult.data.user?.id) {
        return NextResponse.json(
          {
            error:
              createResult.error?.message ??
              "No fue posible crear la cuenta de acceso en Supabase Auth.",
          },
          { status: 500 },
        );
      }

      authUserId = createResult.data.user.id;
    }

    const residentUpsert = await adminClient
      .from("residents")
      .upsert(
        {
          profile_id: authUserId,
          property_id: context.profile.property_id,
          unit_id: unitUpsert.data.id,
          slug: residentSlugFromUnit(tower, unitCode, email),
          full_name: fullName,
          email,
          phone,
          resident_type: residentType === "owner" ? "owner" : "tenant",
          status: balance > 0 ? "overdue" : "paid",
          balance,
          notes,
          created_by: context.user.id,
        },
        { onConflict: "email" },
      )
      .select("id, slug, full_name, email")
      .single();

    if (residentUpsert.error || !residentUpsert.data) {
      return NextResponse.json(
        {
          error:
            residentUpsert.error.code === "23505"
              ? "Ese correo ya tiene un residente asociado."
              : "No fue posible guardar el residente.",
        },
        { status: residentUpsert.error.code === "23505" ? 409 : 500 },
      );
    }

    const existingProfile = await adminClient
      .from("profiles")
      .select("role, title")
      .eq("id", authUserId)
      .maybeSingle();

    const currentRole = isAppRole(existingProfile.data?.role)
      ? existingProfile.data.role
      : "resident";

    const profileUpsert = await adminClient.from("profiles").upsert(
      {
        id: authUserId,
        property_id: context.profile.property_id,
        role: currentRole,
        full_name: fullName,
        title:
          currentRole === "admin" && existingProfile.data?.title
            ? existingProfile.data.title
            : `Residente ${unitCode}`,
        phone,
      },
      { onConflict: "id" },
    );

    if (profileUpsert.error) {
      return NextResponse.json({ error: "No fue posible guardar el perfil de acceso." }, { status: 500 });
    }

    const residentRole = await ensureAccountRole(adminClient, {
      user_id: authUserId,
      property_id: context.profile.property_id,
      role: "resident",
      granted_by: context.user.id,
    });

    if (residentRole.error) {
      return NextResponse.json({ error: "No fue posible activar el rol de residente." }, { status: 500 });
    }

    let activationEmailSent = false;

    if (shouldSendActivationEmail) {
      const redirectTo = `${new URL(request.url).origin}/create-password?role=resident`;
      const { error: emailError } = await sendAccountActivationEmail(email, fullName, redirectTo);

      if (!emailError) {
        activationEmailSent = true;
      }
    }

    return NextResponse.json({
      resident: residentUpsert.data,
      temporaryPassword:
        shouldSendActivationEmail || existingUser ? null : createdPassword,
      activationEmailSent,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Ocurrió un error inesperado creando el residente.",
      },
      { status: 500 },
    );
  }
}
