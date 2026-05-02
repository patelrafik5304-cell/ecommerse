import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";
import Header from "@/components/Header";

export const metadata = {
  title: "Scoop Paradise - Premium Ice Cream",
  description: "The best ice cream delivered to your door",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Header />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
