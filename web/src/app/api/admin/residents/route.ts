import { NextResponse } from "next/server";

import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { sendPasswordResetEmail } from "@/lib/supabase/auth-emails";
import { getRequestContext } from "@/lib/supabase/request-context";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getRequestSupabaseUser } from "@/lib/supabase/request-user";

function residentSlugFromUnit(tower: string, unitCode: string) {
  return `${tower}-${unitCode}`.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

export async function GET(request: Request) {
  try {
    const context = await getRequestContext(request);

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
    const supabase = await getSupabaseServerClient();

    if (!supabase) {
      return NextResponse.json(
        {
          error:
            "Supabase no está configurado. Agrega NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY.",
        },
        { status: 503 },
      );
    }

    const user = await getRequestSupabaseUser(request);

    if (!user?.id) {
      return NextResponse.json({ error: "Debes iniciar sesión como administrador." }, { status: 401 });
    }

    const adminClient = getSupabaseAdminClient();

    const { data: profile } = await adminClient
      .from("profiles")
      .select("role, property_id")
      .eq("id", user.id)
      .maybeSingle();

    if (!profile || profile.role !== "admin") {
      return NextResponse.json({ error: "Solo un administrador puede crear residentes." }, { status: 403 });
    }

    const body = (await request.json()) as Record<string, unknown>;
    const fullName = String(body.fullName ?? "").trim();
    const email = String(body.email ?? "").trim().toLowerCase();
    const phone = String(body.phone ?? "").trim();
    const tower = String(body.tower ?? "").trim();
    const levelLabel = String(body.levelLabel ?? "").trim();
    const unitCode = String(body.unitCode ?? "").trim().toUpperCase();
    const residentType = String(body.residentType ?? "tenant");
    const notes = String(body.notes ?? "").trim();
    const password = String(body.password ?? "").trim();
    const balance = Number(body.balance ?? 0);

    if (!fullName || !email || !tower || !levelLabel || !unitCode) {
      return NextResponse.json({ error: "Completa nombre, correo, torre, nivel y unidad." }, { status: 400 });
    }

    const unitUpsert = await adminClient
      .from("units")
      .upsert(
        {
          property_id: profile.property_id,
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

    const existingResidentInUnit = await adminClient
      .from("residents")
      .select("id, full_name, email")
      .eq("unit_id", unitUpsert.data.id)
      .neq("email", email)
      .maybeSingle();

    if (existingResidentInUnit.error) {
      return NextResponse.json({ error: "No fue posible validar la ocupación de la unidad." }, { status: 500 });
    }

    if (existingResidentInUnit.data) {
      return NextResponse.json(
        {
          error: `La unidad ${tower} - ${unitCode} ya está asignada a ${existingResidentInUnit.data.full_name}. Usa otra unidad o edita ese residente.`,
        },
        { status: 409 },
      );
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
          property_id: profile.property_id,
          unit_id: unitUpsert.data.id,
          slug: residentSlugFromUnit(tower, unitCode),
          full_name: fullName,
          email,
          phone,
          resident_type: residentType === "owner" ? "owner" : "tenant",
          status: balance > 0 ? "overdue" : "paid",
          balance,
          notes,
          created_by: user.id,
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
              ? "Ese correo o esa unidad ya tienen un residente asociado."
              : "No fue posible guardar el residente.",
        },
        { status: residentUpsert.error.code === "23505" ? 409 : 500 },
      );
    }

    const profileUpsert = await adminClient.from("profiles").upsert(
      {
        id: authUserId,
        property_id: profile.property_id,
        role: "resident",
        full_name: fullName,
        title: `Residente ${unitCode}`,
        phone,
      },
      { onConflict: "id" },
    );

    if (profileUpsert.error) {
      return NextResponse.json({ error: "No fue posible guardar el perfil de acceso." }, { status: 500 });
    }

    let activationEmailSent = false;

    if (shouldSendActivationEmail) {
      const redirectTo = `${new URL(request.url).origin}/reset-password`;
      const { error: emailError } = await sendPasswordResetEmail(email, redirectTo);

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
