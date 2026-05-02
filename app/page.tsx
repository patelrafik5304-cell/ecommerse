"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch("/api/seed", { method: "POST" }).then(() => {
      fetch("/api/products").then((r) => r.json()).then((data) => setProducts(data.products || []));
    });
  }, []);

  return (
    <main className="page">
      <section className="hero">
        <h1>Life is Better with Ice Cream 🍦</h1>
        <p>Handcrafted flavors made with love and the finest ingredients</p>
        <Link href="/products" className="btn btn-primary btn-lg">Explore Flavors</Link>
      </section>

      <section className="section">
        <h2 className="section-title">Popular Flavors</h2>
        <div className="grid">
          {products.slice(0, 4).map((p) => (
            <div key={p.id} className="card">
              <div className="card-emoji">{p.image}</div>
              <div className="card-body">
                <h3>{p.name}</h3>
                <p>{p.description.slice(0, 60)}...</p>
                <div className="card-footer">
                  <span className="price">${p.price.toFixed(2)}</span>
                  <Link href="/products" className="btn btn-primary">Order Now</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center" style={{ marginTop: "2rem" }}>
          <Link href="/products" className="btn btn-outline btn-lg">View All Flavors</Link>
        </div>
      </section>

      <section className="section features">
        <div className="feature">
          <span>🥛</span>
          <h3>Fresh Ingredients</h3>
          <p>Made daily with locally sourced dairy and real fruits</p>
        </div>
        <div className="feature">
          <span>🚚</span>
          <h3>Fast Delivery</h3>
          <p>Delivered frozen fresh to your doorstep in under 2 hours</p>
        </div>
        <div className="feature">
          <span>💝</span>
          <h3>Made with Love</h3>
          <p>Every scoop is handcrafted by our expert ice cream makers</p>
        </div>
      </section>
    </main>
  );
}
