import type { SupabaseClient } from "@supabase/supabase-js";

export type AppRole = "admin" | "resident";

export type AccountRoleRow = {
  id: string;
  user_id: string;
  property_id: string;
  role: AppRole;
  status: "active" | "revoked";
  granted_by: string | null;
  revoked_by: string | null;
  revoked_at: string | null;
  created_at: string | null;
  updated_at: string | null;
};

type SupabaseLikeError = {
  code?: string;
  message?: string;
};

export function isAppRole(value: unknown): value is AppRole {
  return value === "admin" || value === "resident";
}

export function isMissingAccountRolesTable(error: SupabaseLikeError | null | undefined) {
  const message = String(error?.message ?? "").toLowerCase();

  return (
    error?.code === "42P01" ||
    error?.code === "PGRST205" ||
    (message.includes("account_roles") && (
      message.includes("does not exist") ||
      message.includes("schema cache") ||
      message.includes("not find the table")
    ))
  );
}

function normalizeRoleRow(row: Record<string, unknown>): AccountRoleRow | null {
  const role = row.role;
  const status = row.status;

  if (!isAppRole(role) || (status !== "active" && status !== "revoked")) {
    return null;
  }

  return {
    id: String(row.id ?? ""),
    user_id: String(row.user_id ?? ""),
    property_id: String(row.property_id ?? ""),
    role,
    status,
    granted_by: typeof row.granted_by === "string" ? row.granted_by : null,
    revoked_by: typeof row.revoked_by === "string" ? row.revoked_by : null,
    revoked_at: typeof row.revoked_at === "string" ? row.revoked_at : null,
    created_at: typeof row.created_at === "string" ? row.created_at : null,
    updated_at: typeof row.updated_at === "string" ? row.updated_at : null,
  };
}

export async function loadAccountRoles(
  adminClient: SupabaseClient,
  userId: string,
  propertyId?: string,
) {
  let query = adminClient
    .from("account_roles")
    .select("id, user_id, property_id, role, status, granted_by, revoked_by, revoked_at, created_at, updated_at")
    .eq("user_id", userId);

  if (propertyId) {
    query = query.eq("property_id", propertyId);
  }

  const { data, error } = await query;

  if (isMissingAccountRolesTable(error)) {
    return { ready: false, rows: [] as AccountRoleRow[], error: null };
  }

  if (error) {
    return { ready: true, rows: [] as AccountRoleRow[], error };
  }

  return {
    ready: true,
    rows: ((data ?? []) as Record<string, unknown>[])
      .map(normalizeRoleRow)
      .filter((row): row is AccountRoleRow => row !== null),
    error: null,
  };
}

export async function ensureAccountRole(
  adminClient: SupabaseClient,
  payload: {
    user_id: string;
    property_id: string;
    role: AppRole;
    granted_by?: string | null;
  },
) {
  const { error } = await adminClient.from("account_roles").upsert(
    {
      ...payload,
      status: "active",
      revoked_by: null,
      revoked_at: null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,property_id,role" },
  );

  if (isMissingAccountRolesTable(error)) {
    return { ready: false, error: null };
  }

  return { ready: true, error };
}

export async function hasActiveAccountRole(
  adminClient: SupabaseClient,
  userId: string,
  propertyId: string,
  role: AppRole,
  fallbackRole?: AppRole,
) {
  const rolesResult = await loadAccountRoles(adminClient, userId, propertyId);

  if (!rolesResult.ready) {
    return fallbackRole === role;
  }

  if (rolesResult.error) {
    return false;
  }

  const hasRoleRecords = rolesResult.rows.length > 0;
  const activeRoles = new Set(
    rolesResult.rows
      .filter((row) => row.status === "active")
      .map((row) => row.role),
  );

  if (!hasRoleRecords && fallbackRole) {
    activeRoles.add(fallbackRole);
  }

  return activeRoles.has(role);
}
