"use client";

import Link from "next/link";
import {
  ShieldCheck,
  Truck,
  Headphones,
} from "lucide-react";

export function AnnouncementBar() {
  return (
    <div className="hidden border-b border-zinc-900 bg-zinc-950 text-xs text-zinc-400 lg:block">
      <div className="mx-auto flex h-10 max-w-7xl items-center justify-between px-6">

        {/* Esquerda */}

        <div className="flex items-center gap-6">

          <div className="flex items-center gap-2">
            <ShieldCheck
              size={14}
              className="text-pink-500"
            />
            <span>Loja 100% Segura</span>
          </div>

          <div className="flex items-center gap-2">
            <Truck
              size={14}
              className="text-pink-500"
            />
            <span>
              Envio grátis acima de 49€
            </span>
          </div>

        </div>

        {/* Centro */}

        <div>
          <span>
            🚚 Envio discreto para todo o país
          </span>
        </div>

        {/* Direita */}

        <div className="flex items-center gap-5">

          <Link
            href="/contact"
            className="flex items-center gap-2 transition hover:text-white"
          >
            <Headphones size={14} />
            Apoio
          </Link>

          <Link
            href="/faq"
            className="transition hover:text-white"
          >
            FAQ
          </Link>

        </div>

      </div>
    </div>
  );
}