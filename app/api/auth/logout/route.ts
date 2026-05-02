import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.set("sb-access-token", "", { maxAge: -1, path: "/" });
  response.cookies.set("sb-refresh-token", "", { maxAge: -1, path: "/" });
  return response;
}
