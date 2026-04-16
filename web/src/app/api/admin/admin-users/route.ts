import { NextResponse } from "next/server";

import {
  ensureAccountRole,
  isAppRole,
  isMissingAccountRolesTable,
  loadAccountRoles,
} from "@/lib/supabase/account-roles";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { sendAccountActivationEmail } from "@/lib/supabase/auth-emails";
import { getRequestContext } from "@/lib/supabase/request-context";

function makeTemporaryPassword() {
  return `Admi360-${crypto.randomUUID().slice(0, 10)}`;
}

function fallbackNameFromEmail(email: string) {
  return email.split("@")[0]?.replace(/[._-]+/g, " ") || "Administrador";
}

async function requireAdminContext(request: Request) {
  const context = await getRequestContext(request, "admin");

  if (!context || context.profile.role !== "admin") {
    return null;
  }

  return context;
}

export async function GET(request: Request) {
  try {
    const context = await requireAdminContext(request);

    if (!context) {
      return NextResponse.json({ error: "Debes iniciar sesión como administrador." }, { status: 401 });
    }

    const adminClient = getSupabaseAdminClient();
    const readiness = await loadAccountRoles(adminClient, context.user.id, context.profile.property_id);

    if (!readiness.ready) {
      return NextResponse.json(
        { error: "Falta aplicar la migración de roles administrativos en Supabase." },
        { status: 503 },
      );
    }

    const rolesResult = await adminClient
      .from("account_roles")
      .select("id, user_id, property_id, role, status, granted_by, revoked_by, revoked_at, created_at, updated_at")
      .eq("property_id", context.profile.property_id)
      .eq("role", "admin")
      .order("created_at", { ascending: false });

    if (isMissingAccountRolesTable(rolesResult.error)) {
      return NextResponse.json(
        { error: "Falta aplicar la migración de roles administrativos en Supabase." },
        { status: 503 },
      );
    }

    if (rolesResult.error) {
      return NextResponse.json({ error: "No fue posible cargar administradores." }, { status: 500 });
    }

    const roles = (rolesResult.data ?? []) as Array<Record<string, unknown>>;
    const userIds = roles.map((role) => String(role.user_id ?? "")).filter(Boolean);
    const profilesById = new Map<string, Record<string, unknown>>();

    if (userIds.length) {
      const profilesResult = await adminClient
        .from("profiles")
        .select("id, full_name, title, phone")
        .in("id", userIds);

      (profilesResult.data ?? []).forEach((profile) => {
        profilesById.set(String(profile.id), profile as Record<string, unknown>);
      });
    }

    const usersResult = await adminClient.auth.admin.listUsers({ page: 1, perPage: 1000 });
    const usersById = new Map(usersResult.data.users.map((user) => [user.id, user]));

    return NextResponse.json({
      admins: roles.map((role) => {
        const userId = String(role.user_id ?? "");
        const profile = profilesById.get(userId);
        const user = usersById.get(userId);

        return {
          id: String(role.id ?? ""),
          userId,
          email: user?.email ?? "",
          fullName: String(profile?.full_name ?? fallbackNameFromEmail(user?.email ?? "")),
          title: String(profile?.title ?? "Administrador del conjunto"),
          status: String(role.status ?? "active"),
          createdAt: String(role.created_at ?? ""),
          revokedAt: typeof role.revoked_at === "string" ? role.revoked_at : null,
        };
      }),
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "No fue posible cargar administradores.",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const context = await requireAdminContext(request);

    if (!context) {
      return NextResponse.json({ error: "Debes iniciar sesión como administrador." }, { status: 401 });
    }

    const adminClient = getSupabaseAdminClient();
    const readiness = await loadAccountRoles(adminClient, context.user.id, context.profile.property_id);

    if (!readiness.ready) {
      return NextResponse.json(
        { error: "Falta aplicar la migración de roles administrativos en Supabase." },
        { status: 503 },
      );
    }

    const body = (await request.json()) as Record<string, unknown>;
    const email = String(body.email ?? "").trim().toLowerCase();
    const fullName = String(body.fullName ?? "").trim() || fallbackNameFromEmail(email);
    const title = String(body.title ?? "").trim() || "Administrador del conjunto";

    if (!email.includes("@")) {
      return NextResponse.json({ error: "Ingresa un correo válido." }, { status: 400 });
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
          role: "admin",
        },
      });

      if (createResult.error || !createResult.data.user?.id) {
        return NextResponse.json(
          {
            error:
              createResult.error?.message ??
              "No fue posible crear el usuario en Supabase Auth.",
          },
          { status: 500 },
        );
      }

      authUserId = createResult.data.user.id;
    }

    const existingProfile = await adminClient
      .from("profiles")
      .select("role, full_name, title, phone")
      .eq("id", authUserId)
      .maybeSingle();

    const currentRole = isAppRole(existingProfile.data?.role)
      ? existingProfile.data.role
      : "admin";

    const profileUpsert = await adminClient.from("profiles").upsert(
      {
        id: authUserId,
        property_id: context.profile.property_id,
        role: currentRole,
        full_name: fullName,
        title,
        phone: String(existingProfile.data?.phone ?? ""),
      },
      { onConflict: "id" },
    );

    if (profileUpsert.error) {
      return NextResponse.json({ error: "No fue posible guardar el perfil administrativo." }, { status: 500 });
    }

    if (isAppRole(existingProfile.data?.role)) {
      const currentRoleResult = await ensureAccountRole(adminClient, {
        user_id: authUserId,
        property_id: context.profile.property_id,
        role: existingProfile.data.role,
        granted_by: context.user.id,
      });

      if (currentRoleResult.error) {
        return NextResponse.json({ error: "No fue posible conservar el rol actual del usuario." }, { status: 500 });
      }
    }

    const adminRoleResult = await ensureAccountRole(adminClient, {
      user_id: authUserId,
      property_id: context.profile.property_id,
      role: "admin",
      granted_by: context.user.id,
    });

    if (!adminRoleResult.ready) {
      return NextResponse.json(
        { error: "Falta aplicar la migración de roles administrativos en Supabase." },
        { status: 503 },
      );
    }

    if (adminRoleResult.error) {
      return NextResponse.json({ error: "No fue posible activar el rol de administrador." }, { status: 500 });
    }

    const redirectTo = `${new URL(request.url).origin}/create-password`;
    const activationEmail = await sendAccountActivationEmail(email, fullName, redirectTo);

    await adminClient.from("operations").insert({
      property_id: context.profile.property_id,
      title: "Acceso administrativo creado",
      note: `${fullName} recibió permisos administrativos.`,
      priority: "low",
      icon: "admin_panel_settings",
      status: "closed",
    });

    return NextResponse.json({
      admin: {
        userId: authUserId,
        email,
        fullName,
        title,
        status: "active",
      },
      activationEmailSent: !activationEmail.error,
      message: activationEmail.error
        ? "El acceso fue creado. No fue posible enviar el correo de activación."
        : activationEmail.customEmailSent
          ? "El acceso fue creado y se envió el correo para crear contraseña."
          : "El acceso fue creado y se envió un enlace para definir contraseña.",
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "No fue posible crear el administrador.",
      },
      { status: 500 },
    );
  }
}
