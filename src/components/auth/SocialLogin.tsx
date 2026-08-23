"use client";

import { FaGoogle } from "react-icons/fa";
import { authClient } from "@/lib/auth-client";

export function SocialLogin() {
  async function handleGoogleLogin() {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/",
    });
  }

  return (
    <div className="mt-10">
      <div className="relative mb-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-pink-100" />
        </div>

        <div className="relative flex justify-center">
          <span className="bg-white px-5 text-sm text-zinc-400">
            ou continua com
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={handleGoogleLogin}
        className="
          flex
          h-12
          w-full
          items-center
          justify-center
          gap-2.5
          rounded-xl
          border
          border-pink-200
          bg-white
          text-sm
          font-medium
          text-zinc-700
          transition-all
          duration-300
          cursor-pointer
          hover:border-pink-300
          hover:bg-pink-50
          hover:text-pink-500
        "
      >
        <FaGoogle className="text-lg" style={{ color: "#4285F4" }} />
        Continuar com Google
      </button>
    </div>
  );
}