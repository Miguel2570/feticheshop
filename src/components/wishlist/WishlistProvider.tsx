// src/components/wishlist/WishlistProvider.tsx

"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";

interface WishlistProduct {
  id: string;
  slug: string;
  name: string;
  price: number;
  compareAtPrice?: number | null;
  stock?: number;
  brand: {
    name: string;
  };
  images: {
    url: string;
  }[];
}

interface WishlistContextType {
  productIds: string[];
  products: WishlistProduct[];
  count: number;
  loading: boolean;
  isOpen: boolean;
  openWishlist: () => void;
  closeWishlist: () => void;
  toggleWishlist: () => void;
  isFavorite: (productId: string) => boolean;
  toggleFavorite: (productId: string, productData?: WishlistProduct) => void; // ✅ Removido Promise
}

const WishlistContext =
  createContext<WishlistContextType | undefined>(undefined);

const STORAGE_KEY = "pleasure-shop-wishlist";

export function WishlistProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [productIds, setProductIds] = useState<string[]>([]);
  const [products, setProducts] = useState<WishlistProduct[]>([]);
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const previousOverflow = useRef<string>("");

  const openWishlist = useCallback(() => setIsOpen(true), []);
  const closeWishlist = useCallback(() => setIsOpen(false), []);
  const toggleWishlist = useCallback(() => setIsOpen(prev => !prev), []);

  // ✅ Carregar do localStorage
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const data = JSON.parse(stored);
          setProductIds(data.ids ?? []);
          setProducts(data.products ?? []);
        }
      } catch {
        // Ignorar
      }
      setMounted(true);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  // ✅ Salvar no localStorage
  useEffect(() => {
    if (!mounted) return;
    
    const timer = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          ids: productIds,
          products: products.filter(p => productIds.includes(p.id)),
        }));
      } catch {
        // Ignorar
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [productIds, products, mounted]);

  // ✅ Bloquear scroll + ESC
  useEffect(() => {
    if (!isOpen) return;

    previousOverflow.current = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleEsc);

    return () => {
      document.body.style.overflow = previousOverflow.current;
      document.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen]);

  const isFavorite = useCallback(
    (productId: string) => productIds.includes(productId),
    [productIds]
  );

  // ✅ Toggle INSTANTÂNEO (sem fetch à API - só localStorage)
  const toggleFavorite = useCallback(
    (productId: string, productData?: WishlistProduct) => {
      const favorite = productIds.includes(productId);

      // ✅ Atualização síncrona imediata
      setProductIds((current) =>
        favorite
          ? current.filter((id) => id !== productId)
          : [...current, productId]
      );

      if (favorite) {
        setProducts((current) => current.filter(p => p.id !== productId));
      } else if (productData) {
        setProducts((current) => {
          const exists = current.find(p => p.id === productId);
          return exists ? current : [...current, productData];
        });
      }

      // ✅ API em background (não bloqueia a UI)
      fetch(
        favorite ? "/api/wishlist/remove" : "/api/wishlist/add",
        {
          method: favorite ? "DELETE" : "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ productId }),
        }
      ).catch((error) => {
        console.error("Erro na API (não bloqueia UI):", error);
      });
    },
    [productIds]
  );

  return (
    <WishlistContext.Provider
      value={{
        productIds,
        products,
        count: productIds.length,
        loading: !mounted,
        isOpen,
        openWishlist,
        closeWishlist,
        toggleWishlist,
        isFavorite,
        toggleFavorite,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);

  if (!context) {
    throw new Error("useWishlist must be used inside WishlistProvider");
  }

  return context;
}