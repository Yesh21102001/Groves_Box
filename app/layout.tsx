
import { Lexend } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/src/context/CartContext";
import { WishlistProvider } from "@/src/context/WishlistContext";
import CartSidebar from "@/src/components/CartSidebar";

const lexend = Lexend({
  variable: "--font-lexend",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${lexend.variable} antialiased`}
      >
        <WishlistProvider>
          <CartProvider>
            {children}
            <CartSidebar />
          </CartProvider>
        </WishlistProvider>
      </body>
    </html>
  );
}
