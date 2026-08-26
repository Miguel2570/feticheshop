import type { Metadata } from "next";

import {
  Inter,
  Playfair_Display,
} from "next/font/google";

import "./globals.css";

import { CartProvider } from "@/components/cart/CartProvider";
import { WishlistProvider } from "@/components/wishlist/WishlistProvider";
import { CookieConsent } from "@/components/CookieConsent";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "Pleasure Shop",
  description: "Luxury Adult Store",
};

// Forçar renderização dinâmica para leitura correta da sessão
export const dynamic = "force-dynamic";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt"
      suppressHydrationWarning
      className={`${inter.variable} ${playfair.variable}`}
    >
      <body>
          <WishlistProvider>
            <CartProvider>
              {children}
            </CartProvider>
          </WishlistProvider>
        <CookieConsent />
      </body>
    </html>
  );
}