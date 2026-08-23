"use client";

import { useState } from "react";

import {
  Eye,
  EyeOff,
} from "lucide-react";

interface PasswordInputProps {
  label?: string;
  placeholder?: string;
  name?: string;
  value?: string;
  onChange?: (value: string) => void;
}

export function PasswordInput({
  label,
  placeholder = "••••••••",
  name,
  value = "",
  onChange,
}: PasswordInputProps) {
  const [showPassword, setShowPassword] =
    useState(false);

  return (
    <div>
      {label && (
        <label className="mb-2 block text-sm font-medium text-zinc-700">
          {label}
        </label>
      )}

      <div className="relative">
        <input
          name={name}
          type={
            showPassword
              ? "text"
              : "password"
          }
          value={value}
          onChange={(event) =>
            onChange?.(
              event.target.value
            )
          }
          autoComplete="new-password"
          placeholder={placeholder}
          className="
            h-12
            w-full
            rounded-xl
            border
            border-pink-200
            bg-white
            px-4
            pr-12
            text-sm
            text-zinc-900
            outline-none
            transition-all
            placeholder:text-zinc-400
            hover:border-pink-300
            focus:border-pink-500
            focus:ring-2
            focus:ring-pink-200
          "
        />

        <button
          type="button"
          onClick={() =>
            setShowPassword(
              (prev) => !prev
            )
          }
          aria-label={
            showPassword
              ? "Ocultar palavra-passe"
              : "Mostrar palavra-passe"
          }
          className="
            absolute
            right-3
            top-1/2
            -translate-y-1/2
            text-zinc-400
            transition
            hover:text-pink-500
            cursor-pointer
          "
        >
          {showPassword ? (
            <EyeOff size={18} />
          ) : (
            <Eye size={18} />
          )}
        </button>
      </div>
    </div>
  );
}