import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const accessToken = req.cookies.get("sb-access-token")?.value;
  const refreshToken = req.cookies.get("sb-refresh-token")?.value;

  if (!accessToken) {
    return NextResponse.json({ user: null });
  }

  const { data, error } = await supabaseServer.auth.getUser(accessToken);

  if (error || !data.user) {
    return NextResponse.json({ user: null });
  }

  const { data: profile } = await supabaseServer
    .from("profiles")
    .select("*")
    .eq("id", data.user.id)
    .single();

  return NextResponse.json({
    user: {
      id: data.user.id,
      name: profile?.name || "",
      email: data.user.email,
    },
  });
}
