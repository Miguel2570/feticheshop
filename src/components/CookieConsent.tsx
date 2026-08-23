"use client";

import { useEffect, useState } from "react";
import {
  Cookie,
  X,
  Check,
  ShieldCheck,
  Settings,
} from "lucide-react";

type ConsentState = {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
};

const CONSENT_KEY = "cookieConsent";

const defaultConsent: ConsentState = {
  essential: true,
  analytics: false,
  marketing: false,
};

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] =
    useState<ConsentState>(defaultConsent);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const saved = localStorage.getItem(CONSENT_KEY);

        if (!saved) {
          setIsVisible(true);
          return;
        }

        const parsed = JSON.parse(saved);

        const validConsent: ConsentState = {
          essential: true,
          analytics: parsed?.analytics === true,
          marketing: parsed?.marketing === true,
        };

        setPreferences(validConsent);
        setIsVisible(false);
      } catch {
        setPreferences(defaultConsent);
        setIsVisible(true);
      }
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  const saveConsent = (consent: ConsentState) => {
    try {
      localStorage.setItem(
        CONSENT_KEY,
        JSON.stringify({
          essential: true,
          analytics: consent.analytics,
          marketing: consent.marketing,
        })
      );
    } catch {
      // Se o localStorage estiver indisponível,
      // simplesmente mantém o estado em memória.
    }

    setPreferences({
      essential: true,
      analytics: consent.analytics,
      marketing: consent.marketing,
    });

    setIsVisible(false);
    setShowPreferences(false);

    /*
      Aqui podes inicializar serviços dependendo
      das preferências escolhidas.

      Exemplo:

      if (consent.analytics) {
        // Google Analytics
      }

      if (consent.marketing) {
        // Meta Pixel / Facebook Pixel
      }
    */
  };

  const handleAcceptAll = () => {
    saveConsent({
      essential: true,
      analytics: true,
      marketing: true,
    });
  };

  const handleRejectAll = () => {
    saveConsent({
      essential: true,
      analytics: false,
      marketing: false,
    });
  };

  const handleClose = () => {
    // Fechar equivale a rejeitar os cookies não essenciais.
    handleRejectAll();
  };

  const handleSavePreferences = () => {
    saveConsent(preferences);
  };

  const togglePreference = (
    key: keyof ConsentState
  ) => {
    if (key === "essential") {
      return;
    }

    setPreferences((previous) => ({
      ...previous,
      [key]: !previous[key],
    }));
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className="
        fixed
        inset-x-0
        bottom-0
        z-50
        px-4
        pb-4
        sm:px-6
        sm:pb-6
      "
    >
      <div
        className="
          mx-auto
          w-full
          max-w-3xl
          rounded-3xl
          border
          border-zinc-700
          bg-[#111111]
          p-5
          shadow-[0_20px_70px_rgba(0,0,0,0.7)]
          sm:p-6
        "
      >
        {/* HEADER */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <div
              className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-pink-500/10
                text-pink-500
              "
            >
              <Cookie size={20} />
            </div>

            <h3
              className="
                font-display
                text-lg
                font-semibold
                text-white
                sm:text-xl
              "
            >
              Cookies e Privacidade
            </h3>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="
              flex
              h-8
              w-8
              shrink-0
              items-center
              justify-center
              rounded-full
              text-zinc-500
              transition
              hover:bg-zinc-800
              hover:text-white
            "
            aria-label="Fechar"
            title="Rejeitar cookies não essenciais"
          >
            <X size={18} />
          </button>
        </div>

        {/* =========================
            BANNER NORMAL
        ========================= */}

        {!showPreferences && (
          <div className="mt-4">
            <p
              className="
                max-w-2xl
                text-sm
                leading-6
                text-zinc-400
              "
            >
              Utilizamos cookies para garantir o
              funcionamento correto da loja, melhorar
              a tua experiência e analisar o tráfego.
              Podes aceitar todos, rejeitar os não
              essenciais ou personalizar as tuas preferências.
            </p>

            <div
              className="
                mt-5
                flex
                flex-col
                gap-3
                sm:flex-row
                sm:flex-wrap
              "
            >
              {/* ACEITAR */}
              <button
                type="button"
                onClick={handleAcceptAll}
                className="
                  flex
                  items-center
                  justify-center
                  gap-2
                  rounded-full
                  bg-pink-500
                  px-6
                  py-3
                  text-sm
                  font-semibold
                  text-white
                  transition
                  hover:bg-pink-600
                "
              >
                <Check size={16} />

                Aceitar todos
              </button>

              {/* REJEITAR */}
              <button
                type="button"
                onClick={handleRejectAll}
                className="
                  rounded-full
                  border
                  border-zinc-700
                  px-6
                  py-3
                  text-sm
                  font-semibold
                  text-zinc-300
                  transition
                  hover:border-zinc-600
                  hover:bg-zinc-800
                  hover:text-white
                "
              >
                Rejeitar não essenciais
              </button>

              {/* PERSONALIZAR */}
              <button
                type="button"
                onClick={() => setShowPreferences(true)}
                className="
                  flex
                  items-center
                  justify-center
                  gap-2
                  rounded-full
                  border
                  border-zinc-700
                  px-6
                  py-3
                  text-sm
                  font-semibold
                  text-zinc-300
                  transition
                  hover:border-zinc-600
                  hover:bg-zinc-800
                  hover:text-white
                "
              >
                <Settings size={16} />

                Personalizar
              </button>
            </div>
          </div>
        )}

        {/* =========================
            PREFERÊNCIAS
        ========================= */}

        {showPreferences && (
          <div className="mt-4">
            <p
              className="
                text-sm
                leading-6
                text-zinc-400
              "
            >
              Gere as tuas preferências de cookies.
              Os cookies essenciais são necessários
              para o funcionamento da loja e não podem
              ser desativados.
            </p>

            <div className="mt-5 space-y-3">
              {/* ESSENCIAIS */}
              <div
                className="
                  flex
                  flex-col
                  gap-4
                  rounded-2xl
                  bg-zinc-900
                  p-4
                  sm:flex-row
                  sm:items-center
                  sm:justify-between
                "
              >
                <div className="flex items-center gap-3">
                  <ShieldCheck
                    size={20}
                    className="shrink-0 text-pink-500"
                  />

                  <div>
                    <p className="text-sm font-semibold text-white">
                      Essenciais
                    </p>

                    <p className="mt-1 text-xs text-zinc-500">
                      Necessários para o funcionamento da loja.
                    </p>
                  </div>
                </div>

                <span
                  className="
                    w-fit
                    rounded-full
                    bg-pink-500/20
                    px-3
                    py-1
                    text-xs
                    font-semibold
                    text-pink-500
                  "
                >
                  Sempre ativos
                </span>
              </div>

              {/* ANALYTICS */}
              <div
                className="
                  flex
                  flex-col
                  gap-4
                  rounded-2xl
                  bg-zinc-900
                  p-4
                  sm:flex-row
                  sm:items-center
                  sm:justify-between
                "
              >
                <div className="flex items-center gap-3">
                  <Settings
                    size={20}
                    className="shrink-0 text-zinc-400"
                  />

                  <div>
                    <p className="text-sm font-semibold text-white">
                      Análise e desempenho
                    </p>

                    <p className="mt-1 text-xs text-zinc-500">
                      Ajudam a melhorar a experiência no site.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    togglePreference("analytics")
                  }
                  className={`
                    relative
                    h-6
                    w-11
                    shrink-0
                    rounded-full
                    transition
                    ${
                      preferences.analytics
                        ? "bg-pink-500"
                        : "bg-zinc-700"
                    }
                  `}
                  aria-label="Ativar cookies de análise e desempenho"
                  aria-pressed={preferences.analytics}
                >
                  <span
                    className={`
                      absolute
                      left-0.5
                      top-0.5
                      h-5
                      w-5
                      rounded-full
                      bg-white
                      transition-transform
                      ${
                        preferences.analytics
                          ? "translate-x-5"
                          : "translate-x-0"
                      }
                    `}
                  />
                </button>
              </div>

              {/* MARKETING */}
              <div
                className="
                  flex
                  flex-col
                  gap-4
                  rounded-2xl
                  bg-zinc-900
                  p-4
                  sm:flex-row
                  sm:items-center
                  sm:justify-between
                "
              >
                <div className="flex items-center gap-3">
                  <Settings
                    size={20}
                    className="shrink-0 text-zinc-400"
                  />

                  <div>
                    <p className="text-sm font-semibold text-white">
                      Marketing
                    </p>

                    <p className="mt-1 text-xs text-zinc-500">
                      Utilizados para publicidade personalizada.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    togglePreference("marketing")
                  }
                  className={`
                    relative
                    h-6
                    w-11
                    shrink-0
                    rounded-full
                    transition
                    ${
                      preferences.marketing
                        ? "bg-pink-500"
                        : "bg-zinc-700"
                    }
                  `}
                  aria-label="Ativar cookies de marketing"
                  aria-pressed={preferences.marketing}
                >
                  <span
                    className={`
                      absolute
                      left-0.5
                      top-0.5
                      h-5
                      w-5
                      rounded-full
                      bg-white
                      transition-transform
                      ${
                        preferences.marketing
                          ? "translate-x-5"
                          : "translate-x-0"
                      }
                    `}
                  />
                </button>
              </div>
            </div>

            {/* BOTÕES */}
            <div
              className="
                mt-5
                flex
                flex-col-reverse
                gap-3
                sm:flex-row
              "
            >
              <button
                type="button"
                onClick={() => setShowPreferences(false)}
                className="
                  rounded-full
                  border
                  border-zinc-700
                  px-6
                  py-3
                  text-sm
                  font-semibold
                  text-zinc-300
                  transition
                  hover:bg-zinc-800
                  hover:text-white
                  sm:w-auto
                "
              >
                Voltar
              </button>

              <button
                type="button"
                onClick={handleSavePreferences}
                className="
                  flex-1
                  rounded-full
                  bg-pink-500
                  px-6
                  py-3
                  text-sm
                  font-semibold
                  text-white
                  transition
                  hover:bg-pink-600
                "
              >
                Guardar preferências
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}