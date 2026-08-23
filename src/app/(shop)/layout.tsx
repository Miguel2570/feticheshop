import { ReactNode } from "react";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

interface ShopLayoutProps {
  children: ReactNode;
}

export default function ShopLayout({
  children,
}: ShopLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">

      <Navbar />

      <main className="flex-1 bg-black text-white">
        {children}
      </main>

      <Footer />

    </div>
  );
}