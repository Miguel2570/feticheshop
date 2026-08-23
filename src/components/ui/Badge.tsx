import { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type BadgeVariant =
  | "default"
  | "secondary"
  | "success"
  | "danger"
  | "warning"
  | "info"
  | "outline";

interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variants: Record<BadgeVariant, string> = {
  default:
    "bg-blue-600 text-white",

  secondary:
    "bg-zinc-700 text-white",

  success:
    "bg-green-600 text-white",

  danger:
    "bg-red-600 text-white",

  warning:
    "bg-yellow-500 text-black",
    
  info:
    "bg-sky-600 text-white",

  outline:
    "border border-zinc-700 text-zinc-300",
};

export function Badge({
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}