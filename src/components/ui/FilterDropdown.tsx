"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown } from "lucide-react";

interface Option {
  value: string;
  label: string;
}

interface FilterDropdownProps {
  options: Option[];
  defaultValue: string;
  name: string;
  placeholder?: string;
}

export function FilterDropdown({
  options,
  defaultValue,
  name,
  placeholder = "Selecionar",
}: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(defaultValue || "");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  const selectedOption = options.find((opt) => opt.value === selected);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);

  const handleSelect = (value: string) => {
    setSelected(value);
    setIsOpen(false);

    // Construir URL com os parâmetros existentes + o novo
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set(name, value);
    } else {
      params.delete(name);
    }

    // Resetar página ao mudar filtro
    params.delete("page");

    router.push(`/product?${params.toString()}`);
  };

  return (
    <div ref={dropdownRef} className="relative z-[999] w-full">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="
          flex w-full items-center justify-between
          rounded-xl border border-pink-200 bg-white
          px-4 py-3 text-sm text-zinc-900
          transition hover:border-pink-300
          focus:border-pink-500 focus:ring-2 focus:ring-pink-200 focus:outline-none
        "
      >
        <span className={selected ? "text-zinc-900" : "text-zinc-400"}>
          {selectedOption?.label || placeholder}
        </span>
        <ChevronDown
          size={16}
          className={`ml-2 shrink-0 text-zinc-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <input type="hidden" name={name} value={selected} />

      {isOpen && (
        <div
          className="
            dropdown-scroll absolute left-0 top-full z-[9999]
            mt-1 max-h-60 w-full overflow-y-auto
            rounded-xl border border-pink-200 bg-white
            py-1 shadow-xl shadow-pink-500/10
          "
          style={{
            isolation: "isolate",
            scrollbarWidth: "thin",
            scrollbarColor: "#ec4899 #fce7f3",
          }}
        >
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSelect(option.value)}
              className={`
                block w-full px-4 py-2.5 text-left text-sm transition
                hover:bg-pink-50 hover:text-pink-500
                ${selected === option.value ? "bg-pink-50 text-pink-500 font-medium" : "text-zinc-700"}
              `}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}