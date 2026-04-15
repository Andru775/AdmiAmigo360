import { NextResponse } from "next/server";

import { getSupabaseServerClient } from "@/lib/supabase/server";

function sanitizeNextPath(value: string | null) {
  if (!value || !value.startsWith("/")) {
    return "/login";
  }

  return value;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = sanitizeNextPath(url.searchParams.get("next"));
  const oauthFlag = url.searchParams.get("oauth");
  const errorDescription =
    url.searchParams.get("error_description") ?? url.searchParams.get("error");

  if (errorDescription) {
    return NextResponse.redirect(
      new URL(`/login?oauth_error=${encodeURIComponent(errorDescription)}`, url.origin),
    );
  }

  if (code) {
    const supabase = await getSupabaseServerClient();
    await supabase?.auth.exchangeCodeForSession(code);
  }

  const redirectPath = oauthFlag === "1" ? `${next}?oauth=1` : next;
  return NextResponse.redirect(new URL(redirectPath, url.origin));
}
