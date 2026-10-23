import { Suspense } from "react";
import AgeVerificationClient from "./AgeVerificationClient";

export default function AgeVerificationPage() {
  return (
    <Suspense fallback={
      <main className="flex min-h-screen items-center justify-center bg-[#080808] text-white">
        <div className="animate-pulse text-sm text-zinc-500">A carregar...</div>
      </main>
    }>
      <AgeVerificationClient />
    </Suspense>
  );
}