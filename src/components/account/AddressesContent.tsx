"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { NewAddressForm } from "@/components/account/NewAddressForm";
import { AddressCard } from "@/components/account/AddressCard";

type Address = {
  id: string;
  firstName: string;
  lastName: string;
  addressLine1: string;
  postalCode: string;
  city: string;
  country: string;
  phone: string;
  isDefault: boolean;
};

interface AddressesContentProps {
  addresses: Address[];
}

export function AddressesContent({
  addresses,
}: AddressesContentProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-w-0">

      {/* TÍTULO + BOTÃO */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-display text-3xl text-zinc-900 sm:text-4xl">
            As Minhas Moradas
          </h1>

          <p className="mt-2 text-sm leading-6 text-zinc-500 sm:mt-3 sm:text-base">
            Gere as tuas moradas de faturação e entrega.
          </p>
        </div>

        {/* BOTÃO */}
        {!isOpen && (
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="
              inline-flex h-10 shrink-0
              items-center justify-center gap-2
              rounded-xl
              bg-pink-500
              px-4
              text-sm font-semibold
              text-white
              transition-all
              hover:bg-pink-600
              cursor-pointer
              sm:mt-1
            "
          >
            <Plus size={16} />
            Nova Morada
          </button>
        )}
      </div>

      {/* FORMULÁRIO - AGORA FICA REALMENTE POR BAIXO DO TÍTULO */}
      {isOpen && (
        <div className="mt-6 w-full sm:mt-8">
          <div className="rounded-2xl border border-pink-100 bg-white p-5 shadow-sm sm:p-6">

            {/* FORMULÁRIO */}
            <NewAddressForm
              onClose={() => setIsOpen(false)}
            />
          </div>
        </div>
      )}

      {/* MORADAS EXISTENTES */}
      {addresses.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-pink-100 bg-white p-6 text-center shadow-sm sm:mt-8 sm:p-10 md:p-12">
          <p className="text-sm text-zinc-500 sm:text-base">
            Ainda não tens moradas guardadas.
          </p>
        </div>
      ) : (
        <div className="mt-6 grid gap-5 sm:mt-8 sm:gap-6 lg:grid-cols-2">
          {addresses.map((address) => (
            <AddressCard
              key={address.id}
              name={`${address.firstName} ${address.lastName}`}
              street={address.addressLine1}
              postalCode={address.postalCode}
              city={address.city}
              country={address.country}
              phone={address.phone}
              isDefault={address.isDefault}
            />
          ))}
        </div>
      )}
    </div>
  );
}