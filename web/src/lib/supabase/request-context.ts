import type { User } from "@supabase/supabase-js";

import {
  ensureAccountRole,
  isAppRole,
  loadAccountRoles,
  type AppRole,
} from "@/lib/supabase/account-roles";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { getRequestSupabaseUser } from "@/lib/supabase/request-user";

export type RequestProfile = {
  id: string;
  property_id: string;
  role: AppRole;
  full_name: string;
  title: string | null;
};

export type RequestContext = {
  user: User;
  profile: RequestProfile;
};

function normalizeEmail(value: unknown) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

function collectVerifiedUserEmails(user: User) {
  const emails = new Set<string>();
  const metadata = user.user_metadata as Record<string, unknown>;

  const addEmail = (value: unknown) => {
    const email = normalizeEmail(value);

    if (email) {
      emails.add(email);
    }
  };

  if (user.email_confirmed_at || user.confirmed_at) {
    addEmail(user.email);
    addEmail(metadata.email);
    addEmail(metadata.preferred_username);
    addEmail(metadata.upn);
  }

  user.identities?.forEach((identity) => {
    const identityData = identity.identity_data as Record<string, unknown> | null;
    const emailIsVerified =
      identityData?.email_verified === true ||
      identityData?.verified === true ||
      identityData?.email_verified === "true";

    if (!emailIsVerified) {
      return;
    }

    addEmail(identityData?.email);
    addEmail(identityData?.preferred_username);
    addEmail(identityData?.upn);
  });

  return [...emails];
}

function selectEffectiveRole(
  roles: AppRole[],
  preferredRole?: AppRole,
  fallbackRole?: AppRole,
) {
  const activeRoles = new Set(roles);

  if (preferredRole) {
    return activeRoles.has(preferredRole) ? preferredRole : null;
  }

  if (fallbackRole && activeRoles.has(fallbackRole)) {
    return fallbackRole;
  }

  if (activeRoles.has("admin")) {
    return "admin";
  }

  if (activeRoles.has("resident")) {
    return "resident";
  }

  return null;
}

async function resolveRolesForProfile(
  adminClient: ReturnType<typeof getSupabaseAdminClient>,
  profile: RequestProfile,
  preferredRole?: AppRole,
) {
  const rolesResult = await loadAccountRoles(adminClient, profile.id, profile.property_id);

  if (!rolesResult.ready || rolesResult.error) {
    return preferredRole && preferredRole !== profile.role ? null : profile.role;
  }

  const hasRoleRecords = rolesResult.rows.length > 0;
  const activeRoles = rolesResult.rows
    .filter((row) => row.status === "active")
    .map((row) => row.role);

  if (!hasRoleRecords) {
    activeRoles.push(profile.role);
  }

  return selectEffectiveRole(activeRoles, preferredRole, profile.role);
}

async function resolveResidentProfileFromVerifiedEmail(user: User, preferredRole?: AppRole) {
  const emails = collectVerifiedUserEmails(user);

  if (!emails.length) {
    return null;
  }

  const adminClient = getSupabaseAdminClient();
  const { data: resident, error } = await adminClient
    .from("residents")
    .select("id, profile_id, property_id, full_name, phone, unit:units!residents_unit_id_fkey(unit_code)")
    .in("email", emails)
    .not("profile_id", "is", null)
    .maybeSingle();

  if (error || !resident) {
    return null;
  }

  const existingProfileId = String(resident.profile_id);
  const unitValue = resident.unit as unknown;
  const unit = (Array.isArray(unitValue) ? unitValue[0] : unitValue ?? {}) as Record<
    string,
    unknown
  >;
  const unitCode = typeof unit.unit_code === "string" ? unit.unit_code : "";

  const { data: residentProfile } = await adminClient
    .from("profiles")
    .select("title")
    .eq("id", existingProfileId)
    .maybeSingle();

  const { data: currentProfile } = await adminClient
    .from("profiles")
    .select("role, full_name, title, phone")
    .eq("id", user.id)
    .maybeSingle();

  const currentRole = isAppRole(currentProfile?.role) ? currentProfile.role : "resident";
  const effectiveRole = preferredRole === "admin" ? null : "resident";

  if (!effectiveRole) {
    return null;
  }

  const profile: RequestProfile = {
    id: user.id,
    property_id: String(resident.property_id),
    role: effectiveRole,
    full_name: String(resident.full_name ?? "Residente"),
    title:
      typeof residentProfile?.title === "string" && residentProfile.title
        ? residentProfile.title
        : unitCode
          ? `Residente ${unitCode}`
          : "Residente del conjunto",
  };

  const profileUpsert = await adminClient.from("profiles").upsert(
    {
      id: user.id,
      property_id: profile.property_id,
      role: currentRole,
      full_name: profile.full_name,
      title: currentRole === "admin" && currentProfile?.title ? currentProfile.title : profile.title,
      phone: String(resident.phone ?? ""),
    },
    { onConflict: "id" },
  );

  if (profileUpsert.error) {
    return null;
  }

  if (existingProfileId !== user.id) {
    const residentUpdate = await adminClient
      .from("residents")
      .update({ profile_id: user.id })
      .eq("id", resident.id);

    if (residentUpdate.error) {
      return null;
    }
  }

  await ensureAccountRole(adminClient, {
    user_id: user.id,
    property_id: profile.property_id,
    role: "resident",
  });

  return profile;
}

export async function getRequestContext(
  request: Request,
  preferredRole?: AppRole,
): Promise<RequestContext | null> {
  const user = await getRequestSupabaseUser(request);

  if (!user?.id) {
    return null;
  }

  const adminClient = getSupabaseAdminClient();
  const { data: profile, error } = await adminClient
    .from("profiles")
    .select("id, property_id, role, full_name, title")
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    return null;
  }

  if (profile) {
    const typedProfile = profile as RequestProfile;
    const role = await resolveRolesForProfile(adminClient, typedProfile, preferredRole);

    if (!role) {
      return null;
    }

    return {
      user,
      profile: {
        ...typedProfile,
        role,
      },
    };
  }

  const linkedProfile = await resolveResidentProfileFromVerifiedEmail(user, preferredRole);

  if (!linkedProfile) {
    return null;
  }

  return {
    user,
    profile: linkedProfile,
  };
}
