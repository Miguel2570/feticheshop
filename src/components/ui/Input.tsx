import {
  forwardRef,
  InputHTMLAttributes,
} from "react";

import { cn } from "@/lib/utils";

type InputProps =
  InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<
  HTMLInputElement,
  InputProps
>(({ className, type = "text", ...props }, ref) => {
  return (
    <input
      ref={ref}
      type={type}
      className={cn(
        "flex h-11 w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm text-white placeholder:text-zinc-500",
        "outline-none transition-colors",
        "focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
});

Input.displayName = "Input";