"use client";

import {
  ButtonHTMLAttributes,
  forwardRef,
} from "react";

import { Slot } from "@radix-ui/react-slot";

import { cn } from "@/lib/utils";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger";

type ButtonSize =
  | "sm"
  | "md"
  | "lg"
  | "icon";

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  asChild?: boolean;
}

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-pink-500 hover:bg-pink-600 text-white shadow-lg shadow-pink-500/20",

  secondary:
    "bg-zinc-100 hover:bg-zinc-200 text-zinc-900",

  outline:
    "border border-pink-200 bg-white hover:bg-pink-50 hover:border-pink-300 text-zinc-700",

  ghost:
    "bg-transparent hover:bg-pink-50 text-zinc-700",

  danger:
    "bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-8 px-2 text-xs rounded-lg",
  md: "h-11 px-5 rounded-xl",
  lg: "h-12 px-6 text-lg rounded-xl",
  icon: "h-11 w-11 rounded-xl",
};

export const Button = forwardRef<
  HTMLButtonElement,
  ButtonProps
>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      loading = false,
      disabled,
      children,
      asChild = false,
      ...props
    },
    ref,
  ) => {
    const Component = asChild ? Slot : "button";

    return (
      <Component
        ref={ref}
        disabled={!asChild ? disabled || loading : undefined}
        className={cn(
          "inline-flex items-center justify-center font-medium transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 active:scale-95",
          variants[variant],
          sizes[size],
          className,
        )}
        {...props}
      >
        {loading ? (
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : (
          children
        )}
      </Component>
    );
  },
);

Button.displayName = "Button";