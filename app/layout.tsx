import { DM_Sans, Inter, Lexend } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/src/context/CartContext";
import { WishlistProvider } from "@/src/context/WishlistContext";
import { Initializer } from "@/src/components/Initializer";
import Navbar from "@/src/components/Navbar";
import Footer from "@/src/components/Footer";

const lexend = Lexend({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-lexend",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-dm-sans",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-inter",
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
        className={`${lexend.variable} ${dmSans.variable} ${inter.variable} antialiased`}
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