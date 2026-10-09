import { Lexend } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/src/context/CartContext";
import { WishlistProvider } from "@/src/context/WishlistContext";
import { Initializer } from "@/src/components/Initializer";
import Navbar from "@/src/components/Navbar";
import Footer from "@/src/components/Footer";
import CartConfirmationBar from "@/src/components/CartConfirmationBar";

const lexend = Lexend({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-lexend",
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
        className={`${lexend.variable} antialiased`}
      >
        <CartProvider>
          <WishlistProvider>
            <Initializer />
            <Navbar />
            {children}
            <CartConfirmationBar />
            <Footer />
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
