// components/ui/Breadcrumb.tsx
import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex flex-wrap items-center gap-1.5 text-sm"
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <div key={index} className="flex items-center gap-1.5">
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className="font-medium transition hover:text-pink-500"
                style={{ color: "#18181b" }}
              >
                {item.label}
              </Link>
            ) : (
              <span
                className="font-semibold"
                style={{ color: isLast ? "#ec4899" : "#18181b" }}
              >
                {item.label}
              </span>
            )}

            {!isLast && (
              <ChevronRight size={14} style={{ color: "#a1a1aa" }} />
            )}
          </div>
        );
      })}
    </nav>
  );
}