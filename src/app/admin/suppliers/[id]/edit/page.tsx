import { notFound, redirect } from "next/navigation";
import Link from "next/link";

import { prisma } from "@/lib/prisma";

interface EditSupplierPageProps {
  params: Promise<{
    id: string;
  }>;
}

async function updateSupplier(formData: FormData) {
  "use server";

  const id = String(formData.get("id") ?? "");

  if (!id) {
    throw new Error("Fornecedor inválido.");
  }

  const name = String(formData.get("name") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim() || null;
  const website = String(formData.get("website") ?? "").trim() || null;
  const apiUrl = String(formData.get("apiUrl") ?? "").trim() || null;
  const apiUsername = String(formData.get("apiUsername") ?? "").trim() || null;
  const apiPassword = String(formData.get("apiPassword") ?? "").trim();
  const currency = String(formData.get("currency") ?? "EUR").trim() || "EUR";
  const language = String(formData.get("language") ?? "pt").trim() || "pt";
  const isActive = formData.get("isActive") === "on";

  if (!name) {
    throw new Error("O nome do fornecedor é obrigatório.");
  }

  if (!slug) {
    throw new Error("O slug do fornecedor é obrigatório.");
  }

  const data = {
    name,
    slug,
    description,
    website,
    apiUrl,
    apiUsername,
    currency,
    language,
    isActive,
    ...(apiPassword ? { apiPassword } : {}),
  };

  try {
    await prisma.supplier.update({
      where: { id },
      data,
    });
  } catch (error) {
    console.error("Erro ao atualizar fornecedor:", error);
    throw new Error("Não foi possível atualizar o fornecedor.");
  }

  redirect("/admin/suppliers");
}

export default async function EditSupplierPage({
  params,
}: EditSupplierPageProps) {
  const { id } = await params;

  const supplier = await prisma.supplier.findUnique({
    where: { id },
  });

  if (!supplier) {
    notFound();
  }

  const inputClass =
    "w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-200";

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold" style={{ color: "#18181b" }}>
          Editar fornecedor
        </h1>
        <p style={{ color: "#71717a" }}>
          Editar as informações e configuração do fornecedor.
        </p>
      </div>

      {/* CARD */}
      <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm">
        <div className="border-b border-zinc-100 p-5">
          <h2 className="text-lg font-bold" style={{ color: "#18181b" }}>
            {supplier.name}
          </h2>
        </div>

        <div className="p-5">
          <form action={updateSupplier} className="space-y-6">
            <input type="hidden" name="id" value={supplier.id} />

            <div className="grid gap-5 md:grid-cols-2">
              {/* Nome */}
              <div className="space-y-1.5">
                <label htmlFor="name" className="text-sm font-medium" style={{ color: "#3f3f46" }}>
                  Nome
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  defaultValue={supplier.name}
                  required
                  className={inputClass}
                  style={{ color: "#18181b" }}
                />
              </div>

              {/* Slug */}
              <div className="space-y-1.5">
                <label htmlFor="slug" className="text-sm font-medium" style={{ color: "#3f3f46" }}>
                  Slug
                </label>
                <input
                  id="slug"
                  name="slug"
                  type="text"
                  defaultValue={supplier.slug}
                  required
                  className={inputClass}
                  style={{ color: "#18181b" }}
                />
              </div>

              {/* Website */}
              <div className="space-y-1.5">
                <label htmlFor="website" className="text-sm font-medium" style={{ color: "#3f3f46" }}>
                  Website
                </label>
                <input
                  id="website"
                  name="website"
                  type="url"
                  defaultValue={supplier.website ?? ""}
                  placeholder="https://www.exemplo.pt"
                  className={inputClass}
                  style={{ color: "#18181b" }}
                />
              </div>

              {/* API URL */}
              <div className="space-y-1.5">
                <label htmlFor="apiUrl" className="text-sm font-medium" style={{ color: "#3f3f46" }}>
                  API URL
                </label>
                <input
                  id="apiUrl"
                  name="apiUrl"
                  type="url"
                  defaultValue={supplier.apiUrl ?? ""}
                  placeholder="https://api.exemplo.pt"
                  className={inputClass}
                  style={{ color: "#18181b" }}
                />
              </div>

              {/* API Username */}
              <div className="space-y-1.5">
                <label htmlFor="apiUsername" className="text-sm font-medium" style={{ color: "#3f3f46" }}>
                  API Username
                </label>
                <input
                  id="apiUsername"
                  name="apiUsername"
                  type="text"
                  defaultValue={supplier.apiUsername ?? ""}
                  className={inputClass}
                  style={{ color: "#18181b" }}
                />
              </div>

              {/* API Password */}
              <div className="space-y-1.5">
                <label htmlFor="apiPassword" className="text-sm font-medium" style={{ color: "#3f3f46" }}>
                  Nova API Password
                </label>
                <input
                  id="apiPassword"
                  name="apiPassword"
                  type="password"
                  placeholder="Deixar vazio para manter a atual"
                  autoComplete="new-password"
                  className={inputClass}
                  style={{ color: "#18181b" }}
                />
                <p className="text-xs" style={{ color: "#a1a1aa" }}>
                  Deixa vazio se não quiseres alterar a password.
                </p>
              </div>

              {/* Currency */}
              <div className="space-y-1.5">
                <label htmlFor="currency" className="text-sm font-medium" style={{ color: "#3f3f46" }}>
                  Moeda
                </label>
                <input
                  id="currency"
                  name="currency"
                  type="text"
                  defaultValue={supplier.currency ?? "EUR"}
                  className={inputClass}
                  style={{ color: "#18181b" }}
                />
              </div>

              {/* Language */}
              <div className="space-y-1.5">
                <label htmlFor="language" className="text-sm font-medium" style={{ color: "#3f3f46" }}>
                  Idioma
                </label>
                <input
                  id="language"
                  name="language"
                  type="text"
                  defaultValue={supplier.language ?? "pt"}
                  className={inputClass}
                  style={{ color: "#18181b" }}
                />
              </div>
            </div>

            {/* Descrição */}
            <div className="space-y-1.5">
              <label htmlFor="description" className="text-sm font-medium" style={{ color: "#3f3f46" }}>
                Descrição
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                defaultValue={supplier.description ?? ""}
                className={`${inputClass} resize-none`}
                style={{ color: "#18181b" }}
              />
            </div>

            {/* Estado */}
            <div className="flex items-center gap-3">
              <input
                id="isActive"
                name="isActive"
                type="checkbox"
                defaultChecked={supplier.isActive}
                className="h-4 w-4 rounded border-zinc-300 accent-pink-500 cursor-pointer"
              />
              <label htmlFor="isActive" className="text-sm font-medium" style={{ color: "#3f3f46" }}>
                Fornecedor ativo
              </label>
            </div>

            {/* Botões */}
            <div className="flex justify-end gap-3 border-t border-zinc-100 pt-5">
              {/* CANCELAR - Link do Next.js */}
              <Link
                href="/admin/suppliers"
                className="
                  inline-flex items-center justify-center
                  h-10 px-5 text-sm font-semibold rounded-xl
                  transition-all duration-200 cursor-pointer
                  border-2 border-pink-500 text-pink-500
                  hover:bg-pink-50
                "
              >
                Cancelar
              </Link>

              {/* GUARDAR - rosa sólido */}
              <button
                type="submit"
                className="
                  inline-flex items-center justify-center
                  h-10 px-5 text-sm font-semibold rounded-xl
                  transition-all duration-200 cursor-pointer
                  bg-pink-500 text-white
                  hover:bg-pink-600 hover:shadow-lg hover:shadow-pink-500/25
                "
              >
                Guardar alterações
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}