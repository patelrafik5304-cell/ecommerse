"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

interface Order {
  id: string;
  total: number;
  status: string;
  items: string;
  createdAt: string;
}

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }
    fetch("/api/orders").then((r) => r.json()).then((data) => setOrders(data.orders || []));
  }, [user]);

  return (
    <main className="page">
      <h1 className="page-title">Your Orders 📦</h1>
      {orders.length === 0 ? (
        <div className="empty-state">
          <h2>No orders yet</h2>
          <p>Start ordering some delicious ice cream!</p>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => {
            const items = JSON.parse(order.items) as { name: string; quantity: number; price: number }[];
            return (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <div>
                    <h3>Order #{order.id.slice(-8).toUpperCase()}</h3>
                    <p className="date">{new Date(order.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
                  </div>
                  <span className={`status status-${order.status}`}>{order.status}</span>
                </div>
                <div className="order-items">
                  {items.map((item, i) => (
                    <div key={i} className="order-item">
                      <span>{item.name} × {item.quantity}</span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="order-total">
                  <span>Total</span>
                  <span className="price">${order.total.toFixed(2)}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
