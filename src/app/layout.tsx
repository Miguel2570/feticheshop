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
  icons: {
    icon: "/images/favicon.jpg",
    shortcut: "/images/favicon.jpg",
    apple: "/images/favicon.jpg",
  },
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
      <head>
        <link rel="icon" href="/images/favicon.jpg" sizes="any" />
        <link rel="shortcut icon" href="/images/favicon.jpg" />
        <link rel="apple-touch-icon" href="/images/favicon.jpg" />
      </head>
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