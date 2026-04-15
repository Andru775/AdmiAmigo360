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
      return NextResponse.json({ error: "Solo un administrador puede ver este módulo." }, { status: 403 });
    }

    const adminClient = getSupabaseAdminClient();
    const propertyId = context.profile.property_id;

    const [{ data: residents, error: residentsError }, { data: payments, error: paymentsError }] =
      await Promise.all([
        adminClient
          .from("residents")
          .select(
            "id, slug, full_name, email, phone, resident_type, status, balance, notes, unit:units!residents_unit_id_fkey(tower, level_label, unit_code)",
          )
          .eq("property_id", propertyId)
          .order("created_at", { ascending: true }),
        adminClient
          .from("payments")
          .select("id, resident_id, title, amount, status, paid_at, created_at, payment_method, note")
          .eq("property_id", propertyId)
          .order("created_at", { ascending: false })
          .limit(12),
      ]);

    if (residentsError || paymentsError) {
      return NextResponse.json(
        { error: "No fue posible cargar el panel administrativo." },
        { status: 500 },
      );
    }

    return NextResponse.json({
      residents: residents ?? [],
      payments: payments ?? [],
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "No fue posible cargar el resumen administrativo.",
      },
      { status: 500 },
    );
  }
}
