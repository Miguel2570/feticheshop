import { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

interface SeparatorProps
  extends HTMLAttributes<HTMLHRElement> {
  orientation?: "horizontal" | "vertical";
}

export function Separator({
  orientation = "horizontal",
  className,
  ...props
}: SeparatorProps) {
  if (orientation === "vertical") {
    return (
      <div
        className={cn(
          "w-px self-stretch bg-zinc-800",
          className
        )}
        {...props}
      />
    );
  }

  return (
    <hr
      className={cn(
        "border-zinc-800",
        className
      )}
      {...props}
    />
  );
}