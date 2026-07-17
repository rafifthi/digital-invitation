"use client";

import { Bell, ChevronRight, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Language } from "@/lib/types";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { tr } from "@/lib/i18n";

type TopbarProps = {
  activeTitle: string;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onProfileClick: () => void;
};

export function Topbar({ activeTitle, language, onLanguageChange, onProfileClick }: TopbarProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6 max-[560px]:gap-2 max-[560px]:px-4">
      <SidebarTrigger className="hidden max-[819px]:inline-flex" />
      <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <span className="hidden font-medium text-foreground md:inline">Riuh Merekah</span>
        <ChevronRight className="size-3.5 max-md:hidden" />
        <span className="font-semibold text-foreground">{activeTitle}</span>
      </nav>

      <div className="ml-auto flex items-center gap-3 max-[560px]:gap-1.5">
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#999999]" />
          <input
            type="search"
            placeholder={tr(language, "search")}
            className="h-9 w-52 rounded-full border border-input bg-[#fafafa] pl-9 pr-3 text-sm outline-none transition-[border-color,box-shadow] placeholder:text-[#999999] focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/25"
          />
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="relative max-[430px]:hidden"
          aria-label={tr(language, "notifications")}
        >
          <Bell className="size-4" />
          <Badge className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-destructive p-0 text-[10px] text-destructive-foreground">
            3
          </Badge>
        </Button>

        <div className="flex items-center rounded-full border border-input bg-[#fafafa] p-0.5">
          <button
            type="button"
            onClick={() => onLanguageChange("EN")}
            className={cn(
              "h-7 rounded-full px-2.5 text-xs font-semibold transition-colors",
              language === "EN"
                ? "bg-white text-foreground shadow-[0_1px_2px_rgba(24,25,37,0.08)]"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            EN
          </button>
          <button
            type="button"
            onClick={() => onLanguageChange("ID")}
            className={cn(
              "h-7 rounded-full px-2.5 text-xs font-semibold transition-colors",
              language === "ID"
                ? "bg-white text-foreground shadow-[0_1px_2px_rgba(24,25,37,0.08)]"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            ID
          </button>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="size-9 rounded-full bg-[#181925] text-xs font-semibold text-white hover:bg-[#2b2c3b] max-[430px]:hidden"
          aria-label={tr(language, "profile")}
          onClick={onProfileClick}
        >
          RM
        </Button>
      </div>
    </header>
  );
}
