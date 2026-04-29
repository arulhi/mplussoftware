"use client";

import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";

export function ConditionalThemeToggle() {
  const pathname = usePathname();
  
  if (pathname?.startsWith("/login")) {
    return null;
  }
  
  return (
    <div className="fixed top-4 right-4 z-50">
      <ThemeToggle />
    </div>
  );
}
