import { NextResponse } from "next/server";

import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { getRequestContext } from "@/lib/supabase/request-context";
import { getSupabaseServerClient } from "@/lib/supabase/server";

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

    const context = await getRequestContext(request, "resident");

    if (!context) {
      return NextResponse.json({ error: "Debes iniciar sesión como residente." }, { status: 401 });
    }

    if (context.profile.role !== "resident") {
      return NextResponse.json({ error: "Solo un residente puede enviar reservas." }, { status: 403 });
    }

    const adminClient = getSupabaseAdminClient();
    const residentQuery = await adminClient
      .from("residents")
      .select("id, property_id")
      .eq("profile_id", context.user.id)
      .maybeSingle();

    if (residentQuery.error || !residentQuery.data) {
      return NextResponse.json({ error: "No se encontró tu perfil de residente." }, { status: 404 });
    }

    const body = (await request.json()) as Record<string, unknown>;
    const amenityId = String(body.amenityId ?? "").trim();
    const startsAt = String(body.startsAt ?? "").trim();
    const endsAt = String(body.endsAt ?? "").trim();
    const note = String(body.note ?? "").trim();

    if (!amenityId || !startsAt || !endsAt) {
      return NextResponse.json(
        { error: "Selecciona la amenidad y define fecha y horario." },
        { status: 400 },
      );
    }

    const reservationInsert = await adminClient
      .from("reservations")
      .insert({
        property_id: residentQuery.data.property_id,
        resident_id: residentQuery.data.id,
        amenity_id: amenityId,
        starts_at: startsAt,
        ends_at: endsAt,
        status: "pending",
        notes: note,
      })
      .select("id")
      .single();

    if (reservationInsert.error) {
      return NextResponse.json({ error: "No fue posible crear la reserva." }, { status: 500 });
    }

    return NextResponse.json({ reservationId: reservationInsert.data.id });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Ocurrió un error inesperado creando la reserva.",
      },
      { status: 500 },
    );
  }
}
