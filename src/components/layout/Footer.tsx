import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { FaFacebookF, FaInstagram, FaWhatsapp } from "react-icons/fa";
import type { ComponentType, ReactNode } from "react";

import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type IconComponent = ComponentType<{ size?: number | string; className?: string }>;
type FooterLink = { href: string; label: string };
type FooterSection = { title: string; links: FooterLink[] };
type SocialLink = { href: string; label: string; icon: IconComponent; size?: number };
type PaymentMethod = { src: string; alt: string };

const socialLinks: SocialLink[] = [
  {
    href: "https://www.instagram.com/feticheshop_sexshop/",
    label: "Instagram",
    icon: FaInstagram,
    size: 18,
  },
  {
    href: "https://www.facebook.com/feticheshopleiria?locale=pt_PT",
    label: "Facebook",
    icon: FaFacebookF,
    size: 17,
  },
  {
    href: "https://wa.me/351919292567",
    label: "WhatsApp",
    icon: FaWhatsapp,
    size: 19,
  },
];

const paymentMethods: PaymentMethod[] = [
  { src: "/images/MB_WAY.jpg", alt: "MB WAY" },
  { src: "/images/Multibanco.svg", alt: "Multibanco" },
];

const linkClass = "text-sm text-zinc-400 transition hover:text-pink-500";
const socialButtonClass =
  "flex h-10 w-10 items-center justify-center rounded-full border border-zinc-800 text-pink-500 transition-all duration-300 hover:border-pink-500 hover:bg-pink-500 hover:text-white hover:scale-110";

function FooterColumn({ title, links }: FooterSection) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-white">{title}</h3>

      <ul className="mt-5 space-y-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className={linkClass}>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ContactLink({
  href,
  icon: Icon,
  children,
}: {
  href: string;
  icon: IconComponent;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      className="flex items-center gap-3 text-sm text-zinc-400 transition hover:text-pink-500"
    >
      <Icon size={17} className="shrink-0 text-pink-500" />
      <span>{children}</span>
    </a>
  );
}

export async function Footer() {
  const user = await getCurrentUser();
  const isAuthenticated = !!user;

  // Verifica se há produtos novos e em promoção
  const [newCount, saleCount] = await Promise.all([
    prisma.product.count({
      where: { status: "ACTIVE", isNew: true },
    }),
    prisma.product.count({
      where: { status: "ACTIVE", isOnSale: true },
    }),
  ]);

  const hasNewProducts = newCount > 0;
  const hasSaleProducts = saleCount > 0;

  const shopLinks: FooterLink[] = [
    { href: "/product", label: "Todos os produtos" },
    ...(hasNewProducts
      ? [{ href: "/new", label: "Novidades" }]
      : []),
    ...(hasSaleProducts
      ? [{ href: "/sale", label: "Promoções" }]
      : []),
  ];

  const footerSections: FooterSection[] = [
    {
      title: "Loja",
      links: shopLinks,
    },
    {
      title: "Sobre Nós",
      links: [
        { href: "/about", label: "A nossa história" },
        { href: "/contact", label: "Contactos" },
        { href: "/faq", label: "Perguntas frequentes" },
      ],
    },
    {
      title: "A minha conta",
      links: [
        isAuthenticated
          ? { href: "/account", label: "A minha conta" }
          : { href: "/login", label: "Entrar" },
        { href: "/wishlist", label: "Favoritos" },
        { href: "/cart", label: "Carrinho" },
      ],
    },
    {
      title: "Apoio",
      links: [
        { href: "/payments", label: "Envios e Entregas" },
        { href: "/reembolso", label: "Trocas e Devoluções" },
        { href: "/livro-reclamacoes", label: "Livro de Reclamações" },
      ],
    },
    {
      title: "Legal",
      links: [
        { href: "/privacy", label: "Política de privacidade" },
        { href: "/terms", label: "Termos e condições" },
        { href: "/cookies", label: "Política de cookies" },
      ],
    },
  ];

  return (
    <footer className="border-t border-zinc-800 bg-black text-white">
      <div className="container-custom py-14">
        <div className="grid gap-10 sm:grid-cols-3 lg:grid-cols-7">
          {/* Marca + contactos - ocupa 2 colunas */}
          <div className="lg:col-span-2">
            <div className="space-y-3">
              <ContactLink
                href="mailto:feticheshop.leiria@gmail.com"
                icon={Mail}
              >
                feticheshop.leiria@gmail.com
              </ContactLink>

              <ContactLink href="tel:+351919292567" icon={Phone}>
                +351 919 292 567
              </ContactLink>

              <div className="flex items-start gap-3 text-sm leading-6 text-zinc-400">
                <MapPin size={17} className="mt-1 shrink-0 text-pink-500" />

                <span>
                  Rua da Nazaré, Lote 3, R/C Loja A
                  <br />
                  2415-780 Leiria
                  <br />
                  Portugal
                </span>
              </div>
            </div>

            <div className="mt-7 flex items-center gap-2">
              {socialLinks.map(({ href, label, icon: Icon, size = 18 }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className={socialButtonClass}
                >
                  <Icon size={size} />
                </a>
              ))}
            </div>
          </div>

          {/* 5 colunas de links */}
          {footerSections.map((section) => (
            <FooterColumn key={section.title} {...section} />
          ))}
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-zinc-800">
        <div className="container-custom flex flex-col gap-4 py-6 text-xs text-zinc-500 md:flex-row md:items-center md:justify-between">
          {/* Esquerda: Copyright */}
          <p>
            © {new Date().getFullYear()} Fetiche Shop. Todos os
            direitos reservados.
          </p>

          {/* Direita: Pagamento seguro */}
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-xs font-medium text-zinc-400">
              Pagamento seguro
            </span>

            <div className="flex items-center gap-2">
              {paymentMethods.map(({ src, alt }) => (
                <div
                  key={alt}
                  className="flex h-8 items-center rounded border border-zinc-800 bg-white px-2.5"
                >
                  <Image
                    src={src}
                    alt={alt}
                    width={60}
                    height={30}
                    className="h-5 w-auto"
                  />
                </div>
              ))}
            </div>

            <span className="text-zinc-500">|</span>

            <span className="text-zinc-500">
              Pagamentos processados de forma segura.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}