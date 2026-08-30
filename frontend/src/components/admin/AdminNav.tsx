"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin/cakes", label: "Cakes" },
  { href: "/admin/orders", label: "Orders" },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-4 border-b border-border/60 pb-3 text-sm font-medium">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={cn(
            "text-muted-foreground hover:text-foreground",
            pathname === link.href && "text-foreground underline underline-offset-4"
          )}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
