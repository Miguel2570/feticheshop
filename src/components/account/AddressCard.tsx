"use client";

import { Edit, Home, MapPin, Phone, Trash2 } from "lucide-react";

interface AddressCardProps {
  name: string;
  street: string;
  postalCode: string;
  city: string;
  country: string;
  phone: string;
  isDefault?: boolean;
}

export function AddressCard({
  name,
  street,
  postalCode,
  city,
  country,
  phone,
  isDefault = false,
}: AddressCardProps) {
  return (
    <div className="group rounded-2xl border border-pink-100 bg-white p-6 shadow-sm transition-all duration-300 hover:border-pink-300 hover:shadow-lg hover:shadow-pink-500/10">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-pink-500/10 text-pink-500">
            <Home size={22} />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-zinc-900">{name}</h3>
              {isDefault && (
                <span className="rounded-full bg-pink-500 px-2.5 py-0.5 text-[10px] font-semibold text-white">
                  Principal
                </span>
              )}
            </div>
            <p className="mt-0.5 text-xs text-zinc-500">
              {city}, {country}
            </p>
          </div>
        </div>

        <div className="flex gap-1.5">
          <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-pink-100 text-zinc-400 transition hover:border-pink-500 hover:text-pink-500 cursor-pointer">
            <Edit size={16} />
          </button>
          <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-pink-100 text-zinc-400 transition hover:border-red-400 hover:text-red-500 cursor-pointer">
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="mt-5 space-y-2 border-t border-pink-50 pt-4">
        <div className="flex items-start gap-2.5">
          <MapPin size={16} className="mt-0.5 shrink-0 text-pink-400" />
          <div>
            <p className="text-sm text-zinc-700">{street}</p>
            <p className="text-sm text-zinc-500">
              {postalCode} • {city}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Phone size={16} className="shrink-0 text-pink-400" />
          <p className="text-sm text-zinc-600">{phone}</p>
        </div>
      </div>
    </div>
  );
}