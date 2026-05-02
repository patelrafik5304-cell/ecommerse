import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    const { data, error } = await supabaseServer.auth.signInWithPassword({ email, password });

    if (error) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const { data: profile } = await supabaseServer
      .from("profiles")
      .select("*")
      .eq("id", data.user?.id)
      .single();

    const response = NextResponse.json({
      user: { id: data.user?.id, name: profile?.name, email: data.user?.email },
    });

    if (data.session) {
      response.cookies.set("sb-access-token", data.session.access_token, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60,
        path: "/",
      });
      response.cookies.set("sb-refresh-token", data.session.refresh_token, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60,
        path: "/",
      });
    }

    return response;
  } catch {
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
