import type { User } from "@supabase/supabase-js";

import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { getRequestSupabaseUser } from "@/lib/supabase/request-user";

export type RequestProfile = {
  id: string;
  property_id: string;
  role: "admin" | "resident";
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

async function resolveResidentProfileFromVerifiedEmail(user: User) {
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

  const { data: existingProfile } = await adminClient
    .from("profiles")
    .select("title")
    .eq("id", existingProfileId)
    .maybeSingle();

  const profile: RequestProfile = {
    id: user.id,
    property_id: String(resident.property_id),
    role: "resident",
    full_name: String(resident.full_name ?? "Residente"),
    title:
      typeof existingProfile?.title === "string" && existingProfile.title
        ? existingProfile.title
        : unitCode
          ? `Residente ${unitCode}`
          : "Residente del conjunto",
  };

  const profileUpsert = await adminClient.from("profiles").upsert(
    {
      ...profile,
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

  return profile;
}

export async function getRequestContext(request: Request): Promise<RequestContext | null> {
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
    return {
      user,
      profile: profile as RequestProfile,
    };
  }

  const linkedProfile = await resolveResidentProfileFromVerifiedEmail(user);

  if (!linkedProfile) {
    return null;
  }

  return {
    user,
    profile: linkedProfile,
  };
}
