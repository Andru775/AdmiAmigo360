import { NextResponse } from "next/server";

import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { getRequestContext } from "@/lib/supabase/request-context";

export async function GET(request: Request) {
  try {
    const context = await getRequestContext(request);

    if (!context) {
      return NextResponse.json({ error: "Debes iniciar sesión como administrador." }, { status: 401 });
    }

    if (context.profile.role !== "admin") {
      return NextResponse.json({ error: "Solo un administrador puede ver solicitudes." }, { status: 403 });
    }

    const adminClient = getSupabaseAdminClient();
    const { data, error } = await adminClient
      .from("residents")
      .select(
        "id, full_name, email, phone, resident_type, status, notes, created_at, unit:units!residents_unit_id_fkey(tower, unit_code)",
      )
      .eq("property_id", context.profile.property_id)
      .eq("status", "pending")
      .is("profile_id", null)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: "No fue posible cargar solicitudes." }, { status: 500 });
    }

    return NextResponse.json({ requests: data ?? [] });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Ocurrió un error inesperado cargando solicitudes.",
      },
      { status: 500 },
    );
  }
}
