"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { usePathname } from "next/navigation";

export default function Header() {
  const { user, logout, cartCount } = useAuth();
  const pathname = usePathname();

  return (
    <header className="header">
      <div className="header-inner">
        <Link href="/" className="logo">
          🍦 Scoop Paradise
        </Link>

        <nav className="nav">
          <Link href="/" className={pathname === "/" ? "active" : ""}>Home</Link>
          <Link href="/products" className={pathname === "/products" ? "active" : ""}>Flavors</Link>

          {user ? (
            <>
              <Link href="/cart" className={pathname === "/cart" ? "active" : ""}>
                Cart {cartCount > 0 && <span className="badge">{cartCount}</span>}
              </Link>
              <Link href="/orders" className={pathname === "/orders" ? "active" : ""}>Orders</Link>
              <span className="user-name">{user.name}</span>
              <button onClick={logout} className="btn btn-outline">Logout</button>
            </>
          ) : (
            <>
              <Link href="/login" className={pathname === "/login" ? "active" : ""}>Login</Link>
              <Link href="/register" className={pathname === "/register" ? "active" : ""}>
                <span className="btn btn-primary">Sign Up</span>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
