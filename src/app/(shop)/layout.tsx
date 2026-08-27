import { ReactNode } from "react";

import { TopBar } from "@/components/layout/TopBar";
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
      <TopBar />

      <Navbar />

      <main className="flex-1">
        {children}
      </main>

      <Footer />
    </div>
  );
}