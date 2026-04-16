import { NextResponse } from "next/server";

import { isMissingAccountRolesTable } from "@/lib/supabase/account-roles";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { getRequestContext } from "@/lib/supabase/request-context";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const requestContext = await getRequestContext(request, "admin");

    if (!requestContext || requestContext.profile.role !== "admin") {
      return NextResponse.json({ error: "Debes iniciar sesión como administrador." }, { status: 401 });
    }

    const body = (await request.json()) as Record<string, unknown>;
    const action = String(body.action ?? "");

    if (action !== "revoke" && action !== "activate") {
      return NextResponse.json({ error: "Acción inválida." }, { status: 400 });
    }

    const adminClient = getSupabaseAdminClient();
    const roleResult = await adminClient
      .from("account_roles")
      .select("id, user_id, property_id, role, status")
      .eq("id", id)
      .eq("property_id", requestContext.profile.property_id)
      .eq("role", "admin")
      .maybeSingle();

    if (isMissingAccountRolesTable(roleResult.error)) {
      return NextResponse.json(
        { error: "Falta aplicar la migración de roles administrativos en Supabase." },
        { status: 503 },
      );
    }

    if (roleResult.error || !roleResult.data) {
      return NextResponse.json({ error: "No encontramos ese acceso administrativo." }, { status: 404 });
    }

    const role = roleResult.data as Record<string, unknown>;
    const targetUserId = String(role.user_id ?? "");

    if (action === "revoke") {
      if (targetUserId === requestContext.user.id) {
        return NextResponse.json(
          { error: "No puedes revocar tu propio acceso administrativo desde esta pantalla." },
          { status: 400 },
        );
      }

      const activeCountResult = await adminClient
        .from("account_roles")
        .select("id", { count: "exact", head: true })
        .eq("property_id", requestContext.profile.property_id)
        .eq("role", "admin")
        .eq("status", "active");

      if (activeCountResult.error) {
        return NextResponse.json({ error: "No fue posible validar los administradores activos." }, { status: 500 });
      }

      if ((activeCountResult.count ?? 0) <= 1) {
        return NextResponse.json(
          { error: "Debe quedar al menos un administrador activo." },
          { status: 400 },
        );
      }

      const updateResult = await adminClient
        .from("account_roles")
        .update({
          status: "revoked",
          revoked_by: requestContext.user.id,
          revoked_at: new Date().toISOString(),
        })
        .eq("id", id);

      if (updateResult.error) {
        return NextResponse.json({ error: "No fue posible revocar el acceso." }, { status: 500 });
      }

      return NextResponse.json({ updated: true, status: "revoked" });
    }

    const updateResult = await adminClient
      .from("account_roles")
      .update({
        status: "active",
        granted_by: requestContext.user.id,
        revoked_by: null,
        revoked_at: null,
      })
      .eq("id", id);

    if (updateResult.error) {
      return NextResponse.json({ error: "No fue posible activar el acceso." }, { status: 500 });
    }

    return NextResponse.json({ updated: true, status: "active" });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "No fue posible actualizar el acceso administrativo.",
      },
      { status: 500 },
    );
  }
}
