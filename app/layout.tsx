
import { Lexend } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/src/context/CartContext";
import { WishlistProvider } from "@/src/context/WishlistContext";
import { Initializer } from "@/src/components/Initializer";
import CartSidebar from "@/src/components/CartSidebar";
import Navbar from "@/src/components/Navbar";
import Footer from "@/src/components/Footer";

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
        <Initializer />
        <Navbar />
        <CartProvider>
          <WishlistProvider>
            {children}
          </WishlistProvider>
        </CartProvider>
        <Footer />
      </body>
    </html>
  );
}
