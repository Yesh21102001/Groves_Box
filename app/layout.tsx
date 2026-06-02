import { DM_Sans, Lexend } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/src/context/CartContext";
import { WishlistProvider } from "@/src/context/WishlistContext";
import { Initializer } from "@/src/components/Initializer";
import Navbar from "@/src/components/Navbar";
import Footer from "@/src/components/Footer";

const lexend = Lexend({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-lexend",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dm-sans",
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning={true}
        className={`${lexend.variable} ${dmSans.variable} antialiased`}
      >
        {/* All consumers (Initializer, Navbar, page content, Footer) must live
            inside the providers — otherwise useCart()/useWishlist() throw. */}
        <CartProvider>
          <WishlistProvider>
            <Initializer />
            <Navbar />
            {children}
            <Footer />
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}