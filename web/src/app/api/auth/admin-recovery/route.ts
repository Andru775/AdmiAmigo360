import { NextResponse } from "next/server";

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
        .select("role")
        .eq("id", user.id)
        .maybeSingle();

      if (profileResult.data?.role === "admin") {
        const redirectTo = `${new URL(request.url).origin}/reset-password`;
        await sendPasswordResetEmail(email, redirectTo);
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
