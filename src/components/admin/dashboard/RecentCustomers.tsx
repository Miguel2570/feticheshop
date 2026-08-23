"use client";

import Image from "next/image";
import Link from "next/link";

import {
  ArrowRight,
  User,
} from "lucide-react";

interface RecentCustomersProps {
  customers: {
    id: string;
    name: string;
    email: string;
    avatar?: string | null;
    createdAt: Date;
  }[];
}

export function RecentCustomers({
  customers,
}: RecentCustomersProps) {
  return (
    <div
      className="
        rounded-3xl
        border
        border-zinc-200
        bg-white
        p-8
        shadow-sm
      "
    >
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 
            className="text-2xl font-bold"
            style={{ color: "#18181b" }}
          >
            Clientes Recentes
          </h2>

          <p 
            className="mt-2 text-sm"
            style={{ color: "#71717a" }}
          >
            Últimos clientes registados
          </p>
        </div>

        <Link
          href="/admin/customers"
          className="
            flex
            items-center
            gap-2
            rounded-full
            border
            border-zinc-200
            bg-white
            px-5
            py-2
            text-sm
            text-zinc-700
            transition
            hover:border-pink-300
            hover:bg-pink-50
            hover:text-pink-500
          "
        >
          Ver todos

          <ArrowRight size={16} />
        </Link>
      </div>

      <div className="space-y-5">
        {customers.map((customer) => (
          <div
            key={customer.id}
            className="
              flex
              items-center
              justify-between
              rounded-2xl
              border
              border-zinc-200
              bg-zinc-50
              p-4
              transition
              hover:border-pink-300
              hover:bg-pink-50/50
            "
          >
            <div className="flex items-center gap-4">
              <div
                className="
                  relative
                  h-14
                  w-14
                  overflow-hidden
                  rounded-full
                  bg-zinc-100
                "
              >
                {customer.avatar ? (
                  <Image
                    src={customer.avatar}
                    alt={customer.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div
                    className="
                      flex
                      h-full
                      w-full
                      items-center
                      justify-center
                    "
                  >
                    <User
                      size={24}
                      className="text-zinc-400"
                    />
                  </div>
                )}
              </div>

              <div>
                <h3 
                  className="font-semibold"
                  style={{ color: "#18181b" }}
                >
                  {customer.name}
                </h3>

                <p 
                  className="mt-1 text-sm"
                  style={{ color: "#71717a" }}
                >
                  {customer.email}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-right">
                <p 
                  className="text-sm"
                  style={{ color: "#71717a" }}
                >
                  Registado
                </p>

                <p 
                  className="font-medium"
                  style={{ color: "#18181b" }}
                >
                  {new Date(
                    customer.createdAt,
                  ).toLocaleDateString("pt-PT")}
                </p>
              </div>

              <Link
                href={`/admin/customers/${customer.id}`}
                className="
                  rounded-xl
                  bg-pink-500
                  px-5
                  py-2
                  text-sm
                  font-semibold
                  text-white
                  transition
                  hover:bg-pink-600
                "
              >
                Abrir
              </Link>
            </div>
          </div>
        ))}

        {customers.length === 0 && (
          <div
            className="
              rounded-2xl
              border
              border-dashed
              border-zinc-300
              py-12
              text-center
            "
          >
            <User
              className="mx-auto mb-4 text-zinc-400"
              size={40}
            />

            <h3 
              className="text-lg font-semibold"
              style={{ color: "#18181b" }}
            >
              Ainda não existem clientes
            </h3>

            <p 
              className="mt-2"
              style={{ color: "#71717a" }}
            >
              Os novos clientes aparecerão aqui.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}