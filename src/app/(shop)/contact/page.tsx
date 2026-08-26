"use client";

import { useState } from "react";
import {
  Clock3,
  Mail,
  MapPin,
  Phone,
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ChevronDown,
} from "lucide-react";
import { FaFacebookF, FaInstagram, FaWhatsapp } from "react-icons/fa";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMessage("");

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setStatus("idle"), 5000);
    } catch (error) {
      setStatus("error");
      setErrorMessage("Erro ao enviar mensagem. Tenta novamente.");
    }
  };

  const contactInfo = [
    {
      icon: Phone,
      label: "WhatsApp",
      value: "+351 919 292 567",
      sub: "Seg. a Sex., 09:00 - 18:00",
      href: "whatsapp://send?phone=351919292567",
    },
    {
      icon: Mail,
      label: "Email",
      value: "feticheshop.leiria@gmail.com",
      sub: "Resposta em até 24h",
      href: "mailto:feticheshop.leiria@gmail.com",
    },
    {
      icon: MapPin,
      label: "Localização",
      value: "Leiria, Portugal",
      sub: "Ver no mapa →",
      href: "https://maps.google.com/?q=FeticheShop,+Rua+da+Nazaré+3,+Leiria,+Portugal",
      external: true,
    },
    {
      icon: Clock3,
      label: "Horário",
      value: "Segunda a Sexta",
      sub: "11:00 - 14:00 • 15:30 - 18:30",
      sub2: "Sábado: 15:30 - 19:00",
      sub3: "Domingo: Encerrado",
    },
  ];

  const socialLinks = [
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
      size: 16,
    },
    {
      href: "whatsapp://send?phone=351919292567",
      label: "WhatsApp",
      icon: FaWhatsapp,
      size: 18,
    },
  ];

  return (
    <main className="arabesque-bg relative overflow-hidden min-h-screen">
      <section className="container-custom py-16 sm:py-20">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="section-eyebrow">Contactos</p>
          <h1 className="section-title mt-4">
            <span 
              className="text-transparent bg-clip-text"
              style={{
                backgroundImage: "linear-gradient(135deg, #d1105a 0%, #ff2e88 50%, #d1105a 100%)",
              }}
            >
              Fala Connosco
            </span>
          </h1>
          <p className="mt-5 text-lg leading-8 text-zinc-600">
            Tens alguma dúvida sobre um produto ou uma encomenda?
            A nossa equipa está pronta para ajudar.
          </p>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-[340px_1fr] lg:gap-8">
          {/* Coluna Esquerda - Informações */}
          <div className="space-y-5">
            <div className="rounded-3xl border border-pink-100 bg-white p-6 shadow-sm">
              <h2 className="font-display text-xl text-zinc-900">Informações</h2>

              <div className="mt-6 space-y-5">
                {contactInfo.map((item) => {
                  const Icon = item.icon;
                  const Wrapper = item.href ? "a" : "div";

                  return (
                    <Wrapper
                      key={item.label}
                      {...(item.href ? {
                        href: item.href,
                        ...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {}),
                        className: "group flex gap-3.5 items-start",
                      } : {
                        className: "group flex gap-3.5 items-start",
                      })}
                    >
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-pink-500/10 text-pink-500 transition-all duration-300 group-hover:bg-pink-500 group-hover:text-white group-hover:scale-110">
                        <Icon size={19} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-400">
                          {item.label}
                        </p>
                        <p className="mt-0.5 font-semibold text-zinc-900 text-sm">
                          {item.value}
                        </p>
                        {item.sub && (
                          <p className="text-sm text-zinc-500 mt-0.5">
                            {item.sub}
                          </p>
                        )}
                        {item.sub2 && (
                          <p className="text-sm text-zinc-500 mt-0.5">
                            {item.sub2}
                          </p>
                        )}
                        {item.sub3 && (
                          <p className="text-sm text-zinc-500 mt-0.5">
                            {item.sub3}
                          </p>
                        )}
                      </div>
                    </Wrapper>
                  );
                })}
              </div>
            </div>

            {/* Redes Sociais - Todas em rosa */}
            <div className="rounded-3xl border border-pink-100 bg-white p-5 shadow-sm">
              <h3 className="font-display text-base text-zinc-900">Siga-nos</h3>
              <div className="mt-3 flex gap-2">
                {socialLinks.map(({ href, label, icon: Icon, size = 18 }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    title={label}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-pink-200 bg-pink-50 transition-all duration-300 hover:scale-110 hover:bg-pink-500 hover:border-pink-500 cursor-pointer"
                    style={{ color: "#ec4899" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "#ffffff";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "#ec4899";
                    }}
                  >
                    <Icon size={size} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Coluna Direita - Formulário */}
          <div className="rounded-3xl border border-pink-100 bg-white p-6 sm:p-8 shadow-sm">
            <h2 className="font-display text-xl sm:text-2xl text-zinc-900">Envia Mensagem</h2>
            <p className="text-zinc-500 mt-1 text-sm">
              Preenche o formulário abaixo e responderemos o mais breve possível.
            </p>

            <form onSubmit={handleSubmit} className="mt-7 space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                {/* Nome */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-zinc-700 mb-1.5">
                    Nome *
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="O teu nome"
                    className="h-11 w-full rounded-xl border border-pink-200 bg-white px-4 text-sm text-zinc-900 outline-none transition-all hover:border-pink-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 placeholder:text-zinc-400"
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-zinc-700 mb-1.5">
                    Email *
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="teu@email.com"
                    className="h-11 w-full rounded-xl border border-pink-200 bg-white px-4 text-sm text-zinc-900 outline-none transition-all hover:border-pink-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 placeholder:text-zinc-400"
                  />
                </div>
              </div>

              {/* Assunto */}
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-zinc-700 mb-1.5">
                  Assunto *
                </label>
                <div className="relative">
                  <select
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="h-11 w-full appearance-none rounded-xl border border-pink-200 bg-white px-4 pr-10 text-sm text-zinc-900 outline-none transition-all hover:border-pink-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 cursor-pointer"
                  >
                    <option value="" disabled className="text-zinc-400">Seleciona um assunto</option>
                    <option value="duvida" className="text-zinc-900">Dúvida sobre produto</option>
                    <option value="encomenda" className="text-zinc-900">Estado da encomenda</option>
                    <option value="troca" className="text-zinc-900">Trocas e devoluções</option>
                    <option value="pagamento" className="text-zinc-900">Problemas de pagamento</option>
                    <option value="outro" className="text-zinc-900">Outro assunto</option>
                  </select>
                  <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" size={17} />
                </div>
              </div>

              {/* Mensagem */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-zinc-700 mb-1.5">
                  Mensagem *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  maxLength={1000}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Escreve a tua mensagem..."
                  className="w-full rounded-xl border border-pink-200 bg-white p-4 text-sm text-zinc-900 outline-none transition-all resize-none hover:border-pink-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 placeholder:text-zinc-400"
                />
                <p className="mt-1 text-right text-xs text-zinc-400">
                  {formData.message.length}/1000
                </p>
              </div>

              {/* Status Messages */}
              {status === "success" && (
                <div className="flex items-center gap-2.5 rounded-xl bg-emerald-50 border border-emerald-200 p-3.5">
                  <CheckCircle2 className="text-emerald-500 flex-shrink-0" size={18} />
                  <p className="text-sm text-emerald-600">
                    Mensagem enviada com sucesso! Entraremos em contacto brevemente.
                  </p>
                </div>
              )}

              {status === "error" && (
                <div className="flex items-center gap-2.5 rounded-xl bg-red-50 border border-red-200 p-3.5">
                  <AlertCircle className="text-red-500 flex-shrink-0" size={18} />
                  <p className="text-sm text-red-500">{errorMessage}</p>
                </div>
              )}

              {/* Botão */}
              <div className="pt-1">
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="group flex h-12 w-full sm:w-auto items-center justify-center gap-2.5 rounded-full bg-pink-500 px-8 text-sm font-semibold text-white transition-all duration-300 cursor-pointer hover:scale-105 hover:bg-pink-600 hover:shadow-[0_0_30px_rgba(255,46,136,.35)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {status === "sending" ? (
                    <>
                      <Loader2 className="animate-spin" size={17} />
                      A Enviar...
                    </>
                  ) : (
                    <>
                      <Send size={17} className="transition-transform group-hover:translate-x-1" />
                      Enviar Mensagem
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}