import { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type CardProps = HTMLAttributes<HTMLDivElement>;

export function Card({
  className,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-zinc-200 bg-white shadow-sm",
        className
      )}
      {...props}
    />
  );
}

type CardHeaderProps = HTMLAttributes<HTMLDivElement>;

export function CardHeader({
  className,
  ...props
}: CardHeaderProps) {
  return (
    <div
      className={cn(
        "border-b border-zinc-100 p-6",
        className
      )}
      {...props}
    />
  );
}

type CardTitleProps = HTMLAttributes<HTMLHeadingElement>;

export function CardTitle({
  className,
  ...props
}: CardTitleProps) {
  return (
    <h2
      className={cn(
        "text-lg font-bold text-zinc-900",
        className
      )}
      {...props}
    />
  );
}

type CardDescriptionProps =
  HTMLAttributes<HTMLParagraphElement>;

export function CardDescription({
  className,
  ...props
}: CardDescriptionProps) {
  return (
    <p
      className={cn(
        "mt-1 text-sm text-zinc-500",
        className
      )}
      {...props}
    />
  );
}

type CardContentProps = HTMLAttributes<HTMLDivElement>;

export function CardContent({
  className,
  ...props
}: CardContentProps) {
  return (
    <div
      className={cn(
        "p-6",
        className
      )}
      {...props}
    />
  );
}

type CardFooterProps = HTMLAttributes<HTMLDivElement>;

export function CardFooter({
  className,
  ...props
}: CardFooterProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-end gap-3 border-t border-zinc-100 p-6",
        className
      )}
      {...props}
    />
  );
}