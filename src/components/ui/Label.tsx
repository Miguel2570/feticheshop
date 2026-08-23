import {
  LabelHTMLAttributes,
} from "react";

import { cn } from "@/lib/utils";

type LabelProps =
  LabelHTMLAttributes<HTMLLabelElement>;

export function Label({
  className,
  ...props
}: LabelProps) {
  return (
    <label
      className={cn(
        "mb-2 block text-sm font-medium text-zinc-200",
        className
      )}
      {...props}
    />
  );
}