"use client";

import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, checkout, user, fetchCart } = useAuth();
  const router = useRouter();

  useEffect(() => {
    fetchCart();
  }, []);

  const total = cart.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  const handleCheckout = async () => {
    if (!user) {
      router.push("/login");
      return;
    }
    const ok = await checkout();
    if (ok) {
      alert("Order placed successfully! 🎉");
      router.push("/orders");
    }
  };

  if (cart.length === 0) {
    return (
      <main className="page">
        <div className="empty-state">
          <h1>Your cart is empty 🛒</h1>
          <p>Looks like you haven&apos;t added any ice cream yet!</p>
        </div>
      </main>
    );
  }

  return (
    <main className="page">
      <h1 className="page-title">Your Cart 🛒</h1>
      <div className="cart-layout">
        <div className="cart-items">
          {cart.map((item) => (
            <div key={item.id} className="cart-item">
              <div className="cart-item-emoji">{item.product.image}</div>
              <div className="cart-item-info">
                <h3>{item.product.name}</h3>
                <p className="price">${item.product.price.toFixed(2)} each</p>
              </div>
              <div className="cart-item-actions">
                <button onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
              </div>
              <div className="cart-item-total">${(item.product.price * item.quantity).toFixed(2)}</div>
              <button className="remove-btn" onClick={() => removeFromCart(item.id)}>✕</button>
            </div>
          ))}
        </div>
        <div className="cart-summary">
          <h2>Order Summary</h2>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Delivery</span>
            <span className="free">Free</span>
          </div>
          <div className="summary-total">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <button className="btn btn-primary btn-block btn-lg" onClick={handleCheckout}>
            Place Order
          </button>
        </div>
      </div>
    </main>
  );
}
