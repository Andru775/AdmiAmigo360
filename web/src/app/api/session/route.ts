import { NextResponse } from "next/server";

import { getRequestContext } from "@/lib/supabase/request-context";

function resolveHomeHref(role: "admin" | "resident") {
  return role === "admin" ? "/dashboard" : "/resident";
}

export async function GET(request: Request) {
  try {
    const context = await getRequestContext(request);

    if (!context) {
      return NextResponse.json({ error: "No hay sesión activa." }, { status: 401 });
    }

    const { user, profile } = context;

    return NextResponse.json({
      session: {
        role: profile.role,
        name: profile.full_name ?? "Usuario AdmiAmigo",
        title:
          profile.title ??
          (profile.role === "admin"
            ? "Administración del conjunto"
            : "Residente del conjunto"),
        email: user.email ?? "",
        homeHref: resolveHomeHref(profile.role),
        userId: user.id,
        propertyId: profile.property_id,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "No fue posible resolver la sesión actual.",
      },
      { status: 500 },
    );
  }
}
