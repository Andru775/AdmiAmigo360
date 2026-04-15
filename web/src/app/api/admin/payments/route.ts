import { NextResponse } from "next/server";

import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getRequestSupabaseUser } from "@/lib/supabase/request-user";

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
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    if (!profile || profile.role !== "admin") {
      return NextResponse.json({ error: "Solo un administrador puede registrar pagos." }, { status: 403 });
    }

    const body = (await request.json()) as Record<string, unknown>;
    const residentId = String(body.residentId ?? "").trim();
    const amount = Number(body.amount ?? 0);
    const title = String(body.title ?? "").trim();
    const paymentMethod = String(body.paymentMethod ?? "").trim();
    const note = String(body.note ?? "").trim();

    if (!residentId || !title || !paymentMethod || !Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json(
        { error: "Completa residente, monto, titulo y método de pago." },
        { status: 400 },
      );
    }

    const residentQuery = await adminClient
      .from("residents")
      .select("id, property_id, unit_id, balance")
      .eq("id", residentId)
      .maybeSingle();

    if (residentQuery.error || !residentQuery.data) {
      return NextResponse.json({ error: "No se encontró el residente seleccionado." }, { status: 404 });
    }

    const currentBalance = Number(residentQuery.data.balance ?? 0);
    const nextBalance = Math.max(currentBalance - amount, 0);
    const nextStatus = nextBalance <= 0 ? "paid" : "pending";

    const paymentInsert = await adminClient
      .from("payments")
      .insert({
        property_id: residentQuery.data.property_id,
        unit_id: residentQuery.data.unit_id,
        resident_id: residentId,
        title,
        amount,
        status: "paid",
        paid_at: new Date().toISOString(),
        payment_method: paymentMethod,
        note,
        created_by: user.id,
      })
      .select("id")
      .single();

    if (paymentInsert.error) {
      return NextResponse.json({ error: "No fue posible registrar el pago." }, { status: 500 });
    }

    const residentUpdate = await adminClient
      .from("residents")
      .update({
        balance: nextBalance,
        status: nextStatus,
      })
      .eq("id", residentId);

    if (residentUpdate.error) {
      return NextResponse.json(
        { error: "El pago se registro pero no se pudo actualizar el saldo del residente." },
        { status: 500 },
      );
    }

    return NextResponse.json({
      paymentId: paymentInsert.data.id,
      nextBalance,
      nextStatus,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Ocurrió un error inesperado registrando el pago.",
      },
      { status: 500 },
    );
  }
}
