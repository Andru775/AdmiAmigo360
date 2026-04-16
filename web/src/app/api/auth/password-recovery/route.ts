import { NextResponse } from "next/server";

import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { sendPasswordResetEmail } from "@/lib/supabase/auth-emails";

function genericMessage() {
  return "Si existe una cuenta con ese correo, enviaremos un enlace para cambiar la contraseña.";
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const email = String(body.email ?? "").trim().toLowerCase();

    if (!email.includes("@")) {
      return NextResponse.json({ error: "Ingresa un correo válido para continuar." }, { status: 400 });
    }

    const adminClient = getSupabaseAdminClient();
    const usersResult = await adminClient.auth.admin.listUsers({ page: 1, perPage: 1000 });
    const user = usersResult.data.users.find((candidate) => candidate.email?.toLowerCase() === email);

    if (user?.id) {
      const profileResult = await adminClient
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .maybeSingle();

      const redirectTo = `${new URL(request.url).origin}/reset-password`;
      const resetResult = await sendPasswordResetEmail(email, redirectTo, {
        fullName:
          typeof profileResult.data?.full_name === "string"
            ? profileResult.data.full_name
            : undefined,
        accountType: "resident",
      });

      if (resetResult.error) {
        return NextResponse.json(
          { error: "No fue posible enviar el correo de recuperación. Intenta nuevamente." },
          { status: 500 },
        );
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
            : "No fue posible iniciar la recuperación de contraseña.",
      },
      { status: 500 },
    );
  }
}
