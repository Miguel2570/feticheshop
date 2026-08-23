import {
  forwardRef,
  TextareaHTMLAttributes,
} from "react";

import { cn } from "@/lib/utils";

type TextareaProps =
  TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaProps
>(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={cn(
        "flex min-h-[120px] w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-white placeholder:text-zinc-500",
        "outline-none transition-colors",
        "focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "resize-y",
        className
      )}
      {...props}
    />
  );
});

Textarea.displayName = "Textarea";