"use client";

import { ServiceUnavailable } from "@/components/errors/ServiceUnavailable";

export default function GlobalError() {
  return (
    <html lang="pt">
      <body>
        <ServiceUnavailable
          title="Ocorreu um problema"
          description="A aplicação encontrou um problema inesperado. Por favor, tenta novamente dentro de alguns instantes."
        />
      </body>
    </html>
  );
}