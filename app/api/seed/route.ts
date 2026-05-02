import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase";

export async function POST() {
  const supabase = getSupabaseServer();

  const { count } = await supabase.from("products").select("*", { count: "exact", head: true });

  if ((count || 0) > 0) {
    return NextResponse.json({ message: "Already seeded" });
  }

  const products = [
    { name: "Vanilla Dream", description: "Classic creamy vanilla ice cream made with real Madagascar vanilla beans", price: 5.99, image: "🍦", category: "Classic", stock: 50 },
    { name: "Chocolate Fudge", description: "Rich dark chocolate ice cream with chunks of fudge throughout", price: 6.49, image: "🍫", category: "Classic", stock: 45 },
    { name: "Strawberry Bliss", description: "Fresh strawberry ice cream made with real strawberries", price: 5.99, image: "🍓", category: "Fruity", stock: 40 },
    { name: "Mint Chip", description: "Cool mint ice cream loaded with chocolate chips", price: 6.99, image: "🌿", category: "Classic", stock: 35 },
    { name: "Mango Sorbet", description: "Refreshing tropical mango sorbet, dairy-free", price: 5.49, image: "🥭", category: "Sorbet", stock: 30 },
    { name: "Cookie Monster", description: "Blue vanilla ice cream packed with cookie dough pieces", price: 7.49, image: "🍪", category: "Specialty", stock: 25 },
    { name: "Salted Caramel", description: "Sweet and salty caramel swirl in buttery ice cream", price: 6.99, image: "🍯", category: "Specialty", stock: 40 },
    { name: "Pistachio Paradise", description: "Authentic pistachio ice cream with real pistachio pieces", price: 7.99, image: "🟢", category: "Premium", stock: 20 },
    { name: "Rocky Road", description: "Chocolate ice cream with marshmallows, nuts and chocolate chips", price: 6.99, image: "🪨", category: "Classic", stock: 35 },
    { name: "Lemon Sorbet", description: "Tangy and refreshing lemon sorbet perfect for summer", price: 4.99, image: "🍋", category: "Sorbet", stock: 30 },
    { name: "Raspberry Cheesecake", description: "Raspberry swirl ice cream with cheesecake chunks", price: 7.49, image: "🍰", category: "Specialty", stock: 25 },
    { name: "Coconut Dream", description: "Creamy coconut ice cream with toasted coconut flakes", price: 6.49, image: "🥥", category: "Premium", stock: 20 },
  ];

  const { error } = await supabase.from("products").insert(products);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ message: "Seeded 12 products!" });
}
