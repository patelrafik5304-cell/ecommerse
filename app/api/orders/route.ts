import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase";

async function getUser(req: NextRequest) {
  const token = req.cookies.get("sb-access-token")?.value;
  if (!token) return null;
  const supabase = getSupabaseServer();
  const { data } = await supabase.auth.getUser(token);
  return data.user;
}

export async function POST(req: NextRequest) {
  const user = await getUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = getSupabaseServer();
  const { data: cart } = await supabase
    .from("cart")
    .select("*, product:products(*)")
    .eq("user_id", user.id);

  if (!cart || cart.length === 0) {
    return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
  }

  const total = cart.reduce((sum: number, item: any) => sum + item.product.price * item.quantity, 0);
  const items = cart.map((i: any) => ({ name: i.product.name, quantity: i.quantity, price: i.product.price }));

  await supabase.from("orders").insert({
    user_id: user.id,
    total,
    status: "confirmed",
    items: JSON.stringify(items),
  });

  await supabase.from("cart").delete().eq("user_id", user.id);

  return NextResponse.json({ success: true });
}

export async function GET(req: NextRequest) {
  const user = await getUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = getSupabaseServer();
  const { data: orders, error } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ orders });
}
