import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { email, password, name } = await req.json();

    const supabase = getSupabaseServer();

    const { data: existing, error: fetchError } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .single();

    if (existing) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
      },
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (data.user) {
      await supabase.from("profiles").insert({
        id: data.user.id,
        email: data.user.email,
        name,
      });
    }

    const { data: sessionData } = await supabase.auth.signInWithPassword({ email, password });

    const response = NextResponse.json({
      user: { id: data.user?.id, name, email },
    });

    if (sessionData?.session) {
      response.cookies.set("sb-access-token", sessionData.session.access_token, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60,
        path: "/",
      });
      response.cookies.set("sb-refresh-token", sessionData.session.refresh_token, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60,
        path: "/",
      });
    }

    return response;
  } catch {
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
