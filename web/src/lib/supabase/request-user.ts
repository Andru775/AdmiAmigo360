import { createClient, type User } from "@supabase/supabase-js";

import { assertSupabaseConfigured } from "@/lib/supabase/env";
import { getSupabaseServerClient } from "@/lib/supabase/server";

function getBearerToken(request: Request) {
  const authorization = request.headers.get("authorization")?.trim() ?? "";

  if (!authorization.toLowerCase().startsWith("bearer ")) {
    return null;
  }

  const token = authorization.slice(7).trim();
  return token || null;
}

async function getUserFromBearerToken(token: string) {
  const { supabaseUrl, supabaseAnonKey } = assertSupabaseConfigured();
  const authClient = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  const {
    data: { user },
    error,
  } = await authClient.auth.getUser(token);

  if (error) {
    return null;
  }

  return user;
}

export async function getRequestSupabaseUser(request: Request): Promise<User | null> {
  const bearerToken = getBearerToken(request);

  if (bearerToken) {
    const bearerUser = await getUserFromBearerToken(bearerToken);

    if (bearerUser?.id) {
      return bearerUser;
    }
  }

  const supabase = await getSupabaseServerClient();

  if (!supabase) {
    return null;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user ?? null;
}
