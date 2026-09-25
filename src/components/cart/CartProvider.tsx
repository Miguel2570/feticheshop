// src/components/cart/CartProvider.tsx

"use client";

import { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";

export interface CartItem {
  id: string;                    // chave única: productId ou productId:variantId
  productId: string;
  variantId?: string;
  variantName?: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    slug: string;
    image: string;
    price: number;
  };
}

interface CartContextType {
  cart: {
    items: CartItem[];
    summary: {
      items: number;
      subtotal: number;
      shipping: number;
      discount: number;
      total: number;
    };
  } | null;
  loading: boolean;
  items: CartItem[];
  itemCount: number;
  total: number;
  isOpen: boolean;
  isHydrated: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addToCart: (
    productId: string,
    quantity?: number,
    productData?: {
      name?: string;
      slug?: string;
      image?: string;
      price?: number;
    },
    variantId?: string,
    variantName?: string
  ) => Promise<boolean>;
  removeFromCart: (productId: string) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

const STORAGE_KEY = "pleasure-shop-cart";

interface LegacyCartItem {
  id?: string;
  productId?: string;
  name?: string;
  slug?: string;
  image?: string;
  price?: number;
  quantity?: number;
  product?: {
    id: string;
    name: string;
    slug: string;
    image: string;
    price: number;
  };
}

function migrateCartItems(items: LegacyCartItem[]): CartItem[] {
  const migrated: CartItem[] = [];

  for (const item of items) {
    if (item.product && typeof item.product.price === "number") {
      const productId = item.productId ?? item.product.id;
      migrated.push({
        id: item.id ?? productId,
        productId,
        quantity: item.quantity ?? 1,
        product: item.product,
      });
      continue;
    }

    if (typeof item.name === "string" && typeof item.price === "number") {
      const id = item.productId ?? item.id ?? "";
      migrated.push({
        id,
        productId: id,
        quantity: item.quantity ?? 1,
        product: {
          id,
          name: item.name,
          slug: item.slug ?? "",
          image: item.image ?? "/placeholder-product.png",
          price: item.price,
        },
      });
      continue;
    }

    if (item.productId) {
      migrated.push({
        id: item.productId,
        productId: item.productId,
        quantity: item.quantity ?? 1,
        product: {
          id: item.productId,
          name: item.name ?? "Produto",
          slug: item.slug ?? "",
          image: item.image ?? "/placeholder-product.png",
          price: item.price ?? 0,
        },
      });
    }
  }

  return migrated;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [loading] = useState(false);
  const previousOverflow = useRef<string>("");

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed: unknown = JSON.parse(stored);

          if (Array.isArray(parsed)) {
            setItems(migrateCartItems(parsed as LegacyCartItem[]));
          } else if (
            typeof parsed === "object" &&
            parsed !== null &&
            "items" in parsed &&
            Array.isArray((parsed as { items: LegacyCartItem[] }).items)
          ) {
            setItems(
              migrateCartItems(
                (parsed as { items: LegacyCartItem[] }).items
              )
            );
          }
        }
      } catch {
        // Ignorar
      } finally {
        setIsHydrated(true);
      }
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Ignorar
    }
  }, [items, isHydrated]);

  const itemCount = items.reduce(
    (total, item) => total + (item.quantity ?? 1),
    0
  );
  const subtotal = items.reduce(
    (sum, item) => sum + (item.product?.price ?? 0) * (item.quantity ?? 1),
    0
  );
  const shipping = 0;
  const discount = 0;
  const total = subtotal + shipping - discount;

  const cart = {
    items,
    summary: { items: itemCount, subtotal, shipping, discount, total },
  };

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const toggleCart = useCallback(() => setIsOpen((prev) => !prev), []);

  useEffect(() => {
    if (isOpen) {
      previousOverflow.current = document.body.style.overflow;
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = previousOverflow.current;
    }
    return () => {
      document.body.style.overflow = previousOverflow.current;
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    if (isOpen) document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen]);

  const addToCart = async (
    productId: string,
    quantity: number = 1,
    productData?: {
      name?: string;
      slug?: string;
      image?: string;
      price?: number;
    },
    variantId?: string,
    variantName?: string
  ): Promise<boolean> => {
    // Chave única: productId se não há variante; productId:variantId se há
    const itemId = variantId ? `${productId}:${variantId}` : productId;

    setItems((prev) => {
      const existing = prev.find((item) => item.id === itemId);

      if (existing) {
        return prev.map((item) =>
          item.id === itemId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      const newItem: CartItem = {
        id: itemId,
        productId,
        variantId,
        variantName,
        quantity,
        product: {
          id: productId,
          name: productData?.name ?? "Produto",
          slug: productData?.slug ?? "",
          image: productData?.image ?? "/placeholder-product.png",
          price: productData?.price ?? 0,
        },
      };

      return [...prev, newItem];
    });

    return true;
  };

  const removeFromCart = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.productId !== productId));
  };

  const removeItem = (itemId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? { ...item, quantity: Math.max(1, quantity) }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    setIsOpen(false);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignorar
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        items,
        itemCount,
        total,
        isOpen,
        isHydrated,
        openCart,
        closeCart,
        toggleCart,
        addToCart,
        removeFromCart,
        removeItem,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart deve ser usado dentro de CartProvider");
  }
  return context;
}