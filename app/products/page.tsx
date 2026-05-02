"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
}

export default function ProductsPage() {
  const { addToCart, user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [filter, setFilter] = useState("All");
  const [addedId, setAddedId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/products").then((r) => r.json()).then((data) => setProducts(data.products || []));
  }, []);

  const categories = ["All", ...Array.from(new Set(products.map((p) => p.category)))];
  const filtered = filter === "All" ? products : products.filter((p) => p.category === filter);

  const handleAdd = async (id: string) => {
    if (!user) {
      alert("Please login to add items to cart");
      return;
    }
    await addToCart(id);
    setAddedId(id);
    setTimeout(() => setAddedId(null), 1000);
  };

  return (
    <main className="page">
      <h1 className="page-title">Our Flavors 🍨</h1>

      <div className="filters">
        {categories.map((c) => (
          <button key={c} className={filter === c ? "filter-btn active" : "filter-btn"} onClick={() => setFilter(c)}>
            {c}
          </button>
        ))}
      </div>

      <div className="grid">
        {filtered.map((p) => (
          <div key={p.id} className="card">
            <div className="card-emoji">{p.image}</div>
            <div className="card-body">
              <span className="category-tag">{p.category}</span>
              <h3>{p.name}</h3>
              <p>{p.description}</p>
              <div className="card-footer">
                <span className="price">${p.price.toFixed(2)}</span>
                <button className={addedId === p.id ? "btn btn-success" : "btn btn-primary"} onClick={() => handleAdd(p.id)} disabled={addedId === p.id}>
                  {addedId === p.id ? "Added!" : "Add to Cart"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
