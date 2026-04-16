import { NextResponse } from "next/server";

import { ensureAccountRole, isAppRole } from "@/lib/supabase/account-roles";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import {
  sendAccessRequestRejectedEmail,
  sendAccountActivationEmail,
} from "@/lib/supabase/auth-emails";
import { getRequestContext } from "@/lib/supabase/request-context";

function makeTemporaryPassword() {
  return `Admi360-${crypto.randomUUID().slice(0, 10)}`;
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const requestContext = await getRequestContext(request, "admin");

    if (!requestContext) {
      return NextResponse.json({ error: "Debes iniciar sesión como administrador." }, { status: 401 });
    }

    if (requestContext.profile.role !== "admin") {
      return NextResponse.json({ error: "Solo un administrador puede revisar solicitudes." }, { status: 403 });
    }

    const body = (await request.json()) as Record<string, unknown>;
    const action = String(body.action ?? "");
    const adminClient = getSupabaseAdminClient();

    const residentResult = await adminClient
      .from("residents")
      .select(
        "id, property_id, unit_id, full_name, email, phone, resident_type, notes, unit:units!residents_unit_id_fkey(tower, unit_code)",
      )
      .eq("id", id)
      .eq("property_id", requestContext.profile.property_id)
      .eq("status", "pending")
      .is("profile_id", null)
      .maybeSingle();

    if (residentResult.error || !residentResult.data) {
      return NextResponse.json({ error: "No encontramos una solicitud pendiente con ese ID." }, { status: 404 });
    }

    const resident = residentResult.data;
    const email = String(resident.email ?? "").trim().toLowerCase();
    const fullName = String(resident.full_name ?? "Residente");
    const unitValue = resident.unit as unknown;
    const unit = (Array.isArray(unitValue) ? unitValue[0] : unitValue ?? {}) as Record<string, unknown>;
    const tower = String(unit.tower ?? "Torre");
    const apartment = String(unit.unit_code ?? "Apartamento");

    if (action === "reject") {
      const rejectionEmail = await sendAccessRequestRejectedEmail(email, fullName);

      if (!rejectionEmail.sent) {
        const message = rejectionEmail.skipped
          ? "Falta configurar correo transaccional para rechazar y avisar por email."
          : "No fue posible enviar el correo de rechazo. Intenta nuevamente.";

        return NextResponse.json({ error: message }, { status: 503 });
      }

      const deleteResult = await adminClient.from("residents").delete().eq("id", resident.id);

      if (deleteResult.error) {
        return NextResponse.json({ error: "No fue posible rechazar la solicitud." }, { status: 500 });
      }

      await adminClient.from("operations").insert({
        property_id: requestContext.profile.property_id,
        title: "Solicitud rechazada",
        note: `${fullName} fue rechazado para ${tower} apartamento ${apartment}.`,
        priority: "low",
        icon: "person_add",
        status: "closed",
      });

      return NextResponse.json({
        reviewed: true,
        message: "Solicitud rechazada. Enviamos la notificación al correo del residente.",
      });
    }

    if (action !== "approve") {
      return NextResponse.json({ error: "Acción inválida para la solicitud." }, { status: 400 });
    }

    const listResult = await adminClient.auth.admin.listUsers({ page: 1, perPage: 1000 });
    const existingUser = listResult.data.users.find(
      (candidate) => candidate.email?.toLowerCase() === email,
    );

    let authUserId = existingUser?.id;

    if (!authUserId) {
      const createResult = await adminClient.auth.admin.createUser({
        email,
        password: makeTemporaryPassword(),
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
              "No fue posible crear la cuenta de acceso.",
          },
          { status: 500 },
        );
      }

      authUserId = createResult.data.user.id;
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
        property_id: requestContext.profile.property_id,
        role: currentRole,
        full_name: fullName,
        title:
          currentRole === "admin" && existingProfile.data?.title
            ? existingProfile.data.title
            : `Residente ${apartment}`,
        phone: String(resident.phone ?? ""),
      },
      { onConflict: "id" },
    );

    if (profileUpsert.error) {
      return NextResponse.json({ error: "No fue posible crear el perfil del residente." }, { status: 500 });
    }

    const residentRole = await ensureAccountRole(adminClient, {
      user_id: authUserId,
      property_id: requestContext.profile.property_id,
      role: "resident",
      granted_by: requestContext.user.id,
    });

    if (residentRole.error) {
      return NextResponse.json({ error: "No fue posible activar el rol de residente." }, { status: 500 });
    }

    const residentUpdate = await adminClient
      .from("residents")
      .update({
        profile_id: authUserId,
        status: "paid",
        created_by: requestContext.user.id,
      })
      .eq("id", resident.id);

    if (residentUpdate.error) {
      return NextResponse.json({ error: "No fue posible activar el residente." }, { status: 500 });
    }

    const redirectTo = `${new URL(request.url).origin}/create-password`;
    const activationEmail = await sendAccountActivationEmail(email, fullName, redirectTo);

    await adminClient.from("operations").insert({
      property_id: requestContext.profile.property_id,
      title: "Solicitud aprobada",
      note: `${fullName} fue activado para ${tower} apartamento ${apartment}.`,
      priority: "low",
      icon: "person_add",
      status: "closed",
    });

    return NextResponse.json({
      reviewed: true,
      message: activationEmail.error
        ? "Solicitud aprobada. No fue posible enviar el correo de activación."
        : activationEmail.customEmailSent
          ? "Solicitud aprobada. Enviamos el correo para crear contraseña."
          : "Solicitud aprobada. Enviamos un enlace de activación al residente.",
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "No fue posible revisar la solicitud.",
      },
      { status: 500 },
    );
  }
}
