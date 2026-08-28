// src/app/layout.tsx

import type { Metadata } from "next";

import {
  Inter,
  Playfair_Display,
} from "next/font/google";

import "./globals.css";

import { CartProvider } from "@/components/cart/CartProvider";
import { CartSidePanel } from "@/components/cart/CartSidePanel";
import { WishlistProvider } from "@/components/wishlist/WishlistProvider";
import { WishlistModal } from "@/components/wishlist/WishlistModal";
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
  icons: {
    icon: "/images/fetichshop_favicon.png",
    shortcut: "/images/fetichshop_favicon.png",
    apple: "/images/fetichshop_favicon.png",
  },
};

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
            <CartSidePanel />
            <WishlistModal />
          </CartProvider>
        </WishlistProvider>
        <CookieConsent />
      </body>
    </html>
  );
}