import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase";

async function getUser(req: NextRequest) {
  const token = req.cookies.get("sb-access-token")?.value;
  if (!token) return null;
  const { data } = await supabaseServer.auth.getUser(token);
  return data.user;
}

export async function GET(req: NextRequest) {
  const user = await getUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: cart, error } = await supabaseServer
    .from("cart")
    .select("*, product:products(*)")
    .eq("user_id", user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ cart });
}

export async function POST(req: NextRequest) {
  const user = await getUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { productId, quantity } = await req.json();

  const { data: existing } = await supabaseServer
    .from("cart")
    .select("*")
    .eq("user_id", user.id)
    .eq("product_id", productId)
    .single();

  if (existing) {
    await supabaseServer
      .from("cart")
      .update({ quantity: existing.quantity + quantity })
      .eq("id", existing.id);
  } else {
    await supabaseServer
      .from("cart")
      .insert({ user_id: user.id, product_id: productId, quantity });
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const user = await getUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { cartId } = await req.json();
  await supabaseServer.from("cart").delete().eq("id", cartId);
  return NextResponse.json({ success: true });
}

export async function PATCH(req: NextRequest) {
  const user = await getUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { cartId, quantity } = await req.json();
  await supabaseServer.from("cart").update({ quantity }).eq("id", cartId);
  return NextResponse.json({ success: true });
}
