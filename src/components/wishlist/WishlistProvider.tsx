"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

interface WishlistContextType {
  productIds: string[];
  count: number;
  loading: boolean;
  isFavorite: (productId: string) => boolean;
  toggleFavorite: (productId: string) => Promise<void>;
}

const WishlistContext =
  createContext<WishlistContextType | undefined>(
    undefined
  );

export function WishlistProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [productIds, setProductIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  /*
   * Carregar favoritos quando o Provider monta.
   */
  useEffect(() => {
    let cancelled = false;

    async function loadWishlist() {
      try {
        const response = await fetch(
          "/api/wishlist",
          {
            method: "GET",
            credentials: "include",
            cache: "no-store",
          }
        );

        /*
         * Utilizador não autenticado.
         * Não é um erro para o Provider.
         */
        if (response.status === 401) {
          if (!cancelled) {
            setProductIds([]);
            setLoading(false);
          }

          return;
        }

        if (!response.ok) {
          throw new Error(
            "Failed to load wishlist"
          );
        }

        const wishlist = await response.json();

        const ids =
          wishlist.items?.map(
            (item: { productId: string }) =>
              item.productId
          ) ?? [];

        if (!cancelled) {
          setProductIds(ids);
          setLoading(false);
        }
      } catch (error) {
        console.error(
          "Erro ao carregar favoritos:",
          error
        );

        if (!cancelled) {
          setProductIds([]);
          setLoading(false);
        }
      }
    }

    loadWishlist();

    return () => {
      cancelled = true;
    };
  }, []);

  /*
   * Verificar se determinado produto está nos favoritos.
   */
  const isFavorite = useCallback(
    (productId: string) => {
      return productIds.includes(productId);
    },
    [productIds]
  );

  /*
   * Adicionar / remover favorito.
   */
  const toggleFavorite = useCallback(
    async (productId: string) => {
      const favorite =
        productIds.includes(productId);

      /*
       * Atualização otimista.
       *
       * O coração muda imediatamente,
       * sem esperar pela API.
       */
      setProductIds((current) =>
        favorite
          ? current.filter(
              (id) => id !== productId
            )
          : [...current, productId]
      );

      try {
        const response = await fetch(
          favorite
            ? "/api/wishlist/remove"
            : "/api/wishlist/add",
          {
            method: favorite
              ? "DELETE"
              : "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            credentials: "include",

            body: JSON.stringify({
              productId,
            }),
          }
        );

        /*
         * Não autenticado.
         *
         * Reverter a alteração otimista
         * e mandar o utilizador para login.
         */
        if (response.status === 401) {
          setProductIds((current) =>
            favorite
              ? [...current, productId]
              : current.filter(
                  (id) => id !== productId
                )
          );

          const redirect =
            `${window.location.pathname}` +
            `${window.location.search}`;

          window.location.href =
            `/login?redirect=${encodeURIComponent(
              redirect
            )}`;

          return;
        }

        /*
         * API devolveu outro erro.
         */
        if (!response.ok) {
          throw new Error(
            "Não foi possível atualizar os favoritos"
          );
        }
      } catch (error) {
        console.error(
          "Erro ao atualizar favorito:",
          error
        );

        /*
         * Reverter alteração otimista.
         */
        setProductIds((current) =>
          favorite
            ? [...current, productId]
            : current.filter(
                (id) => id !== productId
              )
        );
      }
    },
    [productIds]
  );

  return (
    <WishlistContext.Provider
      value={{
        productIds,
        count: productIds.length,
        loading,
        isFavorite,
        toggleFavorite,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context =
    useContext(WishlistContext);

  if (!context) {
    throw new Error(
      "useWishlist must be used inside WishlistProvider"
    );
  }

  return context;
}