import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase";

async function getUser(req: Request) {
  const token = req.headers.get("cookie")?.split("sb-access-token=")[1]?.split(";")[0];
  if (!token) return null;
  const supabase = getSupabaseServer();
  const { data } = await supabase.auth.getUser(token);
  return data.user;
}

export async function POST(req: Request) {
  const user = await getUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file") as File;
  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

  const { getStorage, ref, uploadBytes, getDownloadURL } = await import("firebase/storage");
  const { storage } = await import("@/lib/firebase");

  const storageRef = ref(storage, `products/${Date.now()}-${file.name}`);
  const bytes = await file.arrayBuffer();
  await uploadBytes(storageRef, Buffer.from(bytes));
  const url = await getDownloadURL(storageRef);

  return NextResponse.json({ url });
}
