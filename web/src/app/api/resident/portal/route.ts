import { NextResponse } from "next/server";

import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { getRequestContext } from "@/lib/supabase/request-context";

export async function GET(request: Request) {
  try {
    const context = await getRequestContext(request);

    if (!context) {
      return NextResponse.json({ error: "Debes iniciar sesión como residente." }, { status: 401 });
    }

    if (context.profile.role !== "resident") {
      return NextResponse.json({ error: "Solo un residente puede ver este portal." }, { status: 403 });
    }

    const adminClient = getSupabaseAdminClient();
    const residentResult = await adminClient
      .from("residents")
      .select(
        "id, profile_id, slug, full_name, email, phone, resident_type, status, balance, notes, property_id, unit:units!residents_unit_id_fkey(tower, level_label, unit_code)",
      )
      .eq("profile_id", context.user.id)
      .maybeSingle();

    if (residentResult.error || !residentResult.data) {
      return NextResponse.json({ error: "No se encontró el perfil del residente." }, { status: 404 });
    }

    const resident = residentResult.data;
    const propertyId = String(resident.property_id);

    const [
      { data: announcements, error: announcementsError },
      { data: assemblies, error: assembliesError },
      { data: amenities, error: amenitiesError },
      { data: reservations, error: reservationsError },
      { data: payments, error: paymentsError },
    ] = await Promise.all([
      adminClient
        .from("announcements")
        .select("id, title, note, tone")
        .eq("property_id", propertyId)
        .order("published_at", { ascending: false })
        .limit(4),
      adminClient
        .from("assemblies")
        .select("id, title, starts_at, location, topic, summary")
        .eq("property_id", propertyId)
        .order("starts_at", { ascending: true })
        .limit(4),
      adminClient
        .from("amenities")
        .select("id, title, description, next_slot, icon, color")
        .eq("property_id", propertyId)
        .order("title", { ascending: true }),
      adminClient
        .from("reservations")
        .select("id, amenity_id, starts_at, ends_at, status")
        .eq("resident_id", resident.id)
        .order("starts_at", { ascending: false })
        .limit(4),
      adminClient
        .from("payments")
        .select("id, title, amount, status, note, due_date, paid_at, created_at")
        .eq("resident_id", resident.id)
        .order("created_at", { ascending: false })
        .limit(6),
    ]);

    if (
      announcementsError ||
      assembliesError ||
      amenitiesError ||
      reservationsError ||
      paymentsError
    ) {
      return NextResponse.json(
        { error: "No fue posible cargar la información del residente." },
        { status: 500 },
      );
    }

    return NextResponse.json({
      resident,
      announcements: announcements ?? [],
      assemblies: assemblies ?? [],
      amenities: amenities ?? [],
      reservations: reservations ?? [],
      payments: payments ?? [],
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "No fue posible cargar el portal del residente.",
      },
      { status: 500 },
    );
  }
}
