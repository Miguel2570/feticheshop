import Link from "next/link";

import {
  Truck,
  Phone,
  Headphones,
  Info,
  HelpCircle,
} from "lucide-react";

export function TopBar() {
  return (
    <div className="arabesque-bg border-b border-pink-100">
      <div className="container-custom">
        {/* DESKTOP (≥768px) - Tudo na mesma linha */}
        <div className="hidden md:flex h-10 items-center justify-between text-xs font-medium">
          <div className="flex items-center gap-6">
            <Link
              href="/about"
              className="flex items-center gap-1.5 whitespace-nowrap font-semibold hover:text-pink-600 transition"
              style={{ color: "#18181b" }}
            >
              <Info size={14} className="text-pink-600 shrink-0" />
              <span>Sobre Nós</span>
            </Link>

            <Link
              href="/faq"
              className="flex items-center gap-1.5 whitespace-nowrap font-semibold hover:text-pink-600 transition"
              style={{ color: "#18181b" }}
            >
              <HelpCircle size={14} className="text-pink-600 shrink-0" />
              <span>Perguntas Frequentes</span>
            </Link>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1.5 whitespace-nowrap">
              <Truck size={14} className="shrink-0 text-pink-600" />
              <span className="font-semibold" style={{ color: "#18181b" }}>
                Portes grátis a partir de{" "}
                <strong style={{ color: "#be185d" }}>50€</strong>
              </span>
            </div>

            <Link
              href="/contact"
              className="flex items-center gap-1.5 whitespace-nowrap font-semibold hover:text-pink-600 transition"
              style={{ color: "#18181b" }}
            >
              <Headphones size={14} className="text-pink-600 shrink-0" />
              <span>Apoio ao Cliente</span>
            </Link>

            <a
              href="https://wa.me/351919292567"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 whitespace-nowrap font-semibold hover:text-pink-600 transition"
              style={{ color: "#18181b" }}
            >
              <Phone size={14} className="text-pink-600 shrink-0" />
              <span>+351 919 292 567</span>
            </a>
          </div>
        </div>

        {/* MOBILE (<768px) - Marquee animado - tamanho intermediário */}
        <div className="md:hidden h-9 flex items-center overflow-hidden">
          <div className="flex items-center whitespace-nowrap animate-marquee text-[11px]">
            {[...Array(2)].map((_, groupIndex) => (
              <div key={groupIndex} className="flex items-center gap-5 pr-5">
                <Link
                  href="/about"
                  className="flex items-center gap-1.5 font-semibold transition"
                  style={{ color: "#18181b" }}
                >
                  <Info size={13} className="text-pink-600 shrink-0" />
                  <span>Sobre Nós</span>
                </Link>

                <Link
                  href="/faq"
                  className="flex items-center gap-1.5 font-semibold transition"
                  style={{ color: "#18181b" }}
                >
                  <HelpCircle size={13} className="text-pink-600 shrink-0" />
                  <span>Perguntas Frequentes</span>
                </Link>

                <div className="flex items-center gap-1.5">
                  <Truck size={13} className="shrink-0 text-pink-600" />
                  <span className="font-semibold" style={{ color: "#18181b" }}>
                    Portes grátis a partir de{" "}
                    <strong style={{ color: "#be185d" }}>50€</strong>
                  </span>
                </div>

                <Link
                  href="/contact"
                  className="flex items-center gap-1.5 font-semibold transition"
                  style={{ color: "#18181b" }}
                >
                  <Headphones size={13} className="text-pink-600 shrink-0" />
                  <span>Apoio ao Cliente</span>
                </Link>

                <a
                  href="https://wa.me/351919292567"
                  className="flex items-center gap-1.5 font-semibold transition"
                  style={{ color: "#18181b" }}
                >
                  <Phone size={13} className="text-pink-600 shrink-0" />
                  <span>+351 919 292 567</span>
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}