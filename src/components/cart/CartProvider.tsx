// src/components/cart/CartProvider.tsx

"use client";

import { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";

export interface CartItem {
  id: string;
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
    }
  ) => Promise<boolean>;
  removeFromCart: (productId: string) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

const STORAGE_KEY = "pleasure-shop-cart";

// ✅ Tipo para dados antigos do localStorage
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

// ✅ Função para migrar dados antigos (sem any)
function migrateCartItems(items: LegacyCartItem[]): CartItem[] {
  const migrated: CartItem[] = [];

  for (const item of items) {
    // Se já tem a estrutura nova
    if (item.product && typeof item.product.price === "number") {
      migrated.push({
        id: item.id ?? item.product.id,
        quantity: item.quantity ?? 1,
        product: item.product,
      });
      continue;
    }

    // Se tem a estrutura antiga (name, image, price diretos)
    if (typeof item.name === "string" && typeof item.price === "number") {
      const id = item.productId ?? item.id ?? "";
      
      migrated.push({
        id,
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

    // Se tem productId mas não product
    if (item.productId) {
      migrated.push({
        id: item.productId,
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

function loadCartFromStorage(): CartItem[] {
  if (typeof window === "undefined") return [];
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    
    const parsed: unknown = JSON.parse(stored);
    
    // Se for array
    if (Array.isArray(parsed)) {
      return migrateCartItems(parsed as LegacyCartItem[]);
    }
    
    // Se for { items: [...] }
    if (
      typeof parsed === "object" && 
      parsed !== null &&
      "items" in parsed &&
      Array.isArray((parsed as { items: LegacyCartItem[] }).items)
    ) {
      return migrateCartItems((parsed as { items: LegacyCartItem[] }).items);
    }
    
    return [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(loadCartFromStorage);
  const [isOpen, setIsOpen] = useState(false);
  const [loading] = useState(false);
  const previousOverflow = useRef<string>("");

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Ignorar
    }
  }, [items]);

  const itemCount = items.reduce((total, item) => total + (item.quantity ?? 1), 0);
  const subtotal = items.reduce((sum, item) => sum + (item.product?.price ?? 0) * (item.quantity ?? 1), 0);
  const shipping = 0;
  const discount = 0;
  const total = subtotal + shipping - discount;

  const cart = {
    items,
    summary: {
      items: itemCount,
      subtotal,
      shipping,
      discount,
      total,
    },
  };

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const toggleCart = useCallback(() => setIsOpen(prev => !prev), []);

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
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen]);

  const addToCart = async (
    productId: string, 
    quantity: number = 1,
    productData?: {
      name?: string;
      slug?: string;
      image?: string;
      price?: number;
    }
  ): Promise<boolean> => {
    setItems(prev => {
      const existing = prev.find(item => item.id === productId);
      
      if (existing) {
        return prev.map(item => 
          item.id === productId 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      
      const newItem: CartItem = {
        id: productId,
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
    setItems(prev => prev.filter(item => item.id !== productId));
  };

  const removeItem = (itemId: string) => {
    setItems(prev => prev.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    setItems(prev => 
      prev.map(item => 
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