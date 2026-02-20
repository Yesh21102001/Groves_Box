import { DM_Sans, Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/src/context/CartContext";
import { WishlistProvider } from "@/src/context/WishlistContext";
import { Initializer } from "@/src/components/Initializer";
import Navbar from "@/src/components/Navbar";
import Footer from "@/src/components/Footer";

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
        className={`${dmSans.variable} ${inter.variable} antialiased`}
      >
        <Initializer />
        <CartProvider>
          <WishlistProvider>
            <Navbar />
            {children}
          </WishlistProvider>
        </CartProvider>
        <Footer />
      </body>
    </html>
  );
}