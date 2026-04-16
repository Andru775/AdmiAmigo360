import { NextResponse } from "next/server";

import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { getRequestContext } from "@/lib/supabase/request-context";

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const requestContext = await getRequestContext(request, "admin");

    if (!requestContext || requestContext.profile.role !== "admin") {
      return NextResponse.json(
        { error: "Debes iniciar sesión como administrador." },
        { status: 401 },
      );
    }

    const adminClient = getSupabaseAdminClient();
    const residentResult = await adminClient
      .from("residents")
      .select("id, profile_id, property_id, full_name, email")
      .eq("id", id)
      .eq("property_id", requestContext.profile.property_id)
      .maybeSingle();

    if (residentResult.error || !residentResult.data) {
      return NextResponse.json({ error: "No encontramos ese residente." }, { status: 404 });
    }

    const resident = residentResult.data as Record<string, unknown>;
    const profileId = typeof resident.profile_id === "string" ? resident.profile_id : null;
    const fullName = String(resident.full_name ?? "Residente");
    const email = String(resident.email ?? "");
    const propertyId = String(resident.property_id ?? requestContext.profile.property_id);

    const deleteResident = await adminClient.from("residents").delete().eq("id", id);

    if (deleteResident.error) {
      return NextResponse.json(
        { error: "No fue posible eliminar el residente." },
        { status: 500 },
      );
    }

    if (profileId) {
      await adminClient
        .from("account_roles")
        .delete()
        .eq("user_id", profileId)
        .eq("property_id", propertyId)
        .eq("role", "resident");

      const activeRoles = await adminClient
        .from("account_roles")
        .select("id")
        .eq("user_id", profileId)
        .eq("property_id", propertyId)
        .eq("status", "active")
        .limit(1);

      const stillHasActiveRole = Boolean(activeRoles.data?.length);

      if (!stillHasActiveRole) {
        await adminClient.from("profiles").delete().eq("id", profileId);
        await adminClient.auth.admin.deleteUser(profileId);
      }
    }

    await adminClient.from("operations").insert({
      property_id: requestContext.profile.property_id,
      title: "Residente eliminado",
      note: `${fullName}${email ? ` (${email})` : ""} fue retirado del conjunto.`,
      priority: "low",
      icon: "person_remove",
      status: "closed",
    });

    return NextResponse.json({
      deleted: true,
      message: "Residente eliminado correctamente.",
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "No fue posible eliminar el residente.",
      },
      { status: 500 },
    );
  }
}
