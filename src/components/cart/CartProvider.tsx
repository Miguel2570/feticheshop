"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

/* =========================================================
   TYPES
========================================================= */

export interface CartProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  brand: string;
}

export interface CartItem {
  id: string;
  productId: string;
  variantId: string | null;
  quantity: number;
  price: number;
  subtotal: number;
  product: CartProduct;
}

export interface CartSummary {
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  items: number;
}

export interface Cart {
  id: string;
  items: CartItem[];
  summary: CartSummary;
}

interface CartContextType {
  cart: Cart | null;
  loading: boolean;
  itemCount: number;

  refreshCart: () => Promise<void>;

  addToCart: (
    productId: string,
    quantity?: number,
    variantId?: string
  ) => Promise<boolean>;

  updateQuantity: (
    itemId: string,
    quantity: number
  ) => Promise<boolean>;

  removeItem: (
    itemId: string
  ) => Promise<boolean>;

  clearCart: () => Promise<boolean>;
}

/* =========================================================
   CONTEXT
========================================================= */

const CartContext = createContext<
  CartContextType | undefined
>(undefined);

/* =========================================================
   PROVIDER
========================================================= */

export function CartProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);

  /* =======================================================
     REFRESH CART
  ======================================================= */

  const refreshCart = useCallback(async (): Promise<void> => {
    setLoading(true);

    try {
      const response = await fetch("/api/cart", {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });

      /* -----------------------------------------------
         NÃO AUTENTICADO
      ------------------------------------------------ */

      if (response.status === 401) {
        setCart(null);
        return;
      }

      /* -----------------------------------------------
         ERRO
      ------------------------------------------------ */

      if (!response.ok) {
        throw new Error(
          "Não foi possível carregar o carrinho"
        );
      }

      /* -----------------------------------------------
         SUCCESS
      ------------------------------------------------ */

      const data: Cart = await response.json();

      setCart(data);
    } catch (error) {
      console.error(
        "Erro ao carregar carrinho:",
        error
      );

      setCart(null);
    } finally {
      setLoading(false);
    }
  }, []);

  /* =======================================================
     ADD TO CART
     POST /api/cart
  ======================================================= */

  const addToCart = useCallback(
    async (
      productId: string,
      quantity = 1,
      variantId?: string
    ): Promise<boolean> => {
      setLoading(true);

      try {
        const response = await fetch("/api/cart", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            productId,
            quantity,
            ...(variantId
              ? { variantId }
              : {}),
          }),
        });

        /* -----------------------------------------------
           NÃO AUTENTICADO
        ------------------------------------------------ */

        if (response.status === 401) {
          window.location.href =
            `/login?redirect=${encodeURIComponent(
              window.location.pathname
            )}`;

          return false;
        }

        /* -----------------------------------------------
           ERRO
        ------------------------------------------------ */

        if (!response.ok) {
          const data =
            await response
              .json()
              .catch(() => null);

          throw new Error(
            data?.message ??
              "Não foi possível adicionar o produto"
          );
        }

        /* -----------------------------------------------
           SUCCESS
        ------------------------------------------------ */

        const data: Cart =
          await response.json();

        setCart(data);

        return true;
      } catch (error) {
        console.error(
          "Erro ao adicionar ao carrinho:",
          error
        );

        return false;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  /* =======================================================
     REMOVE ITEM
     DELETE /api/cart/remove
  ======================================================= */

  const removeItem = useCallback(
    async (
      itemId: string
    ): Promise<boolean> => {
      setLoading(true);

      try {
        const response = await fetch(
          "/api/cart/remove",
          {
            method: "DELETE",
            headers: {
              "Content-Type":
                "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
              itemId,
            }),
          }
        );

        /* -----------------------------------------------
           NÃO AUTENTICADO
        ------------------------------------------------ */

        if (response.status === 401) {
          window.location.href =
            `/login?redirect=${encodeURIComponent(
              window.location.pathname
            )}`;

          return false;
        }

        /* -----------------------------------------------
           ERRO
        ------------------------------------------------ */

        if (!response.ok) {
          const data =
            await response
              .json()
              .catch(() => null);

          throw new Error(
            data?.message ??
              "Não foi possível remover o produto"
          );
        }

        /* -----------------------------------------------
           REFRESH
        ------------------------------------------------ */

        await refreshCart();

        return true;
      } catch (error) {
        console.error(
          "Erro ao remover produto:",
          error
        );

        return false;
      } finally {
        setLoading(false);
      }
    },
    [refreshCart]
  );

  /* =======================================================
     UPDATE QUANTITY
     PATCH /api/cart/update
  ======================================================= */

  const updateQuantity = useCallback(
    async (
      itemId: string,
      quantity: number
    ): Promise<boolean> => {
      /* -----------------------------------------------
         QUANTIDADE <= 0
         → remover
      ------------------------------------------------ */

      if (quantity <= 0) {
        return removeItem(itemId);
      }

      setLoading(true);

      try {
        const response = await fetch(
          "/api/cart/update",
          {
            method: "PATCH",
            headers: {
              "Content-Type":
                "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
              itemId,
              quantity,
            }),
          }
        );

        /* -----------------------------------------------
           NÃO AUTENTICADO
        ------------------------------------------------ */

        if (response.status === 401) {
          window.location.href =
            `/login?redirect=${encodeURIComponent(
              window.location.pathname
            )}`;

          return false;
        }

        /* -----------------------------------------------
           ERRO
        ------------------------------------------------ */

        if (!response.ok) {
          const data =
            await response
              .json()
              .catch(() => null);

          throw new Error(
            data?.message ??
              "Não foi possível atualizar o carrinho"
          );
        }

        /* -----------------------------------------------
           REFRESH
        ------------------------------------------------ */

        await refreshCart();

        return true;
      } catch (error) {
        console.error(
          "Erro ao atualizar quantidade:",
          error
        );

        return false;
      } finally {
        setLoading(false);
      }
    },
    [refreshCart, removeItem]
  );

  /* =======================================================
     CLEAR CART
     DELETE /api/cart/clear
  ======================================================= */

  const clearCart = useCallback(
    async (): Promise<boolean> => {
      setLoading(true);

      try {
        const response = await fetch(
          "/api/cart/clear",
          {
            method: "DELETE",
            credentials: "include",
          }
        );

        /* -----------------------------------------------
           NÃO AUTENTICADO
        ------------------------------------------------ */

        if (response.status === 401) {
          window.location.href =
            `/login?redirect=${encodeURIComponent(
              window.location.pathname
            )}`;

          return false;
        }

        /* -----------------------------------------------
           ERRO
        ------------------------------------------------ */

        if (!response.ok) {
          const data =
            await response
              .json()
              .catch(() => null);

          throw new Error(
            data?.message ??
              "Não foi possível limpar o carrinho"
          );
        }

        /* -----------------------------------------------
           REFRESH
        ------------------------------------------------ */

        await refreshCart();

        return true;
      } catch (error) {
        console.error(
          "Erro ao limpar carrinho:",
          error
        );

        return false;
      } finally {
        setLoading(false);
      }
    },
    [refreshCart]
  );

  /* =======================================================
     ITEM COUNT
  ======================================================= */

  const itemCount =
    cart?.summary?.items ?? 0;

  /* =======================================================
     CONTEXT VALUE
  ======================================================= */

  const value = useMemo<CartContextType>(
    () => ({
      cart,
      loading,
      itemCount,
      refreshCart,
      addToCart,
      updateQuantity,
      removeItem,
      clearCart,
    }),
    [
      cart,
      loading,
      itemCount,
      refreshCart,
      addToCart,
      updateQuantity,
      removeItem,
      clearCart,
    ]
  );

  /* =======================================================
     PROVIDER
  ======================================================= */

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

/* =========================================================
   HOOK
========================================================= */

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider"
    );
  }

  return context;
}