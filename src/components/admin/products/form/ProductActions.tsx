"use client";

export function ProductActions() {
  return (
    <div className="flex justify-end gap-4">
      <button
        type="button"
        className="
          rounded-2xl
          border
          border-zinc-700
          px-6
          py-3
          text-white
          transition
          hover:bg-zinc-800
        "
      >
        Cancelar
      </button>

      <button
        type="submit"
        className="
          rounded-2xl
          bg-pink-500
          px-6
          py-3
          font-semibold
          text-white
          transition
          hover:bg-pink-600
        "
      >
        Guardar Produto
      </button>
    </div>
  );
}