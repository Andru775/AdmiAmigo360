import { NextResponse } from "next/server";

import { hasActiveAccountRole, isAppRole } from "@/lib/supabase/account-roles";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { sendPasswordResetEmail } from "@/lib/supabase/auth-emails";

function genericMessage() {
  return "Si el correo pertenece a una cuenta administrativa activa, enviaremos un enlace de recuperación.";
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const email = String(body.email ?? "").trim().toLowerCase();

    if (!email.includes("@")) {
      return NextResponse.json({ error: "Ingresa un correo administrativo válido." }, { status: 400 });
    }

    const adminClient = getSupabaseAdminClient();
    const usersResult = await adminClient.auth.admin.listUsers({ page: 1, perPage: 1000 });
    const user = usersResult.data.users.find((candidate) => candidate.email?.toLowerCase() === email);

    if (user?.id) {
      const profileResult = await adminClient
        .from("profiles")
        .select("role, property_id, full_name")
        .eq("id", user.id)
        .maybeSingle();

      const profileRole = isAppRole(profileResult.data?.role) ? profileResult.data.role : undefined;
      const propertyId =
        typeof profileResult.data?.property_id === "string"
          ? profileResult.data.property_id
          : "";
      const isActiveAdmin = propertyId
        ? await hasActiveAccountRole(adminClient, user.id, propertyId, "admin", profileRole)
        : false;

      if (isActiveAdmin) {
        const redirectTo = `${new URL(request.url).origin}/reset-password?role=admin`;
        const resetResult = await sendPasswordResetEmail(email, redirectTo, {
          fullName:
            typeof profileResult.data?.full_name === "string"
              ? profileResult.data.full_name
              : undefined,
          accountType: "admin",
        });

        if (resetResult.error) {
          return NextResponse.json(
            { error: "No fue posible enviar el correo de recuperación. Intenta nuevamente." },
            { status: 500 },
          );
        }
      }
    }

    return NextResponse.json({
      sent: true,
      message: genericMessage(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "No fue posible iniciar la recuperación administrativa.",
      },
      { status: 500 },
    );
  }
}
