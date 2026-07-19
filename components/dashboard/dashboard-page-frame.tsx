"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function DashboardPageFrame({ children, className }: { children: ReactNode; className?: string }) {
  const pathname = usePathname();
  const frameRef = useRef<HTMLElement>(null);

  useEffect(() => {
    frameRef.current?.scrollTo({ top: 0 });
  }, [pathname]);

  return (
    <main ref={frameRef} className={cn("h-full w-full overflow-y-auto bg-[#fafafa] px-8 pb-16 pt-8 max-[820px]:px-4 max-[560px]:pt-6", className)}>
      {children}
    </main>
  );
}
