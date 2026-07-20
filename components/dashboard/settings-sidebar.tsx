"use client";

import {
  ArrowLeft,
  CreditCard,
  UserRound,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import type { Language } from "@/lib/types";

const ACCOUNT_SETTINGS_ITEMS = [
  { href: "/account", label: { EN: "Profile", ID: "Profil" }, icon: UserRound },
  { href: "/account/plan", label: { EN: "Plan & payment", ID: "Paket & pembayaran" }, icon: CreditCard },
] as const;

export function AccountSettingsSidebar({ language }: { language: Language }) {
  const pathname = usePathname();
  const router = useRouter();
  const { setOpenMobile } = useSidebar();

  const navigate = (href: string) => {
    setOpenMobile(false);
    router.push(href);
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="h-16 shrink-0 justify-center border-b border-sidebar-border px-3 py-0 group-data-[collapsible=icon]/sidebar:px-2">
        <div className="flex h-full items-center gap-1 group-data-[collapsible=icon]/sidebar:justify-center">
          <SidebarMenu className="flex-1">
            <SidebarMenuItem>
              <SidebarMenuButton
                type="button"
                size="lg"
                tooltip={language === "ID" ? "Kembali ke aplikasi" : "Back to app"}
                onClick={() => navigate("/")}
                className="hover:bg-[#f5f5f5]"
              >
                <span className="grid size-8 shrink-0 place-items-center rounded-lg border bg-white text-foreground">
                  <ArrowLeft className="size-4" />
                </span>
                <span className="grid min-w-0 flex-1 text-left leading-tight">
                  <span className="truncate text-sm font-semibold tracking-[-0.02em]">
                    {language === "ID" ? "Kembali ke aplikasi" : "Back to app"}
                  </span>
                  <span className="truncate text-xs text-muted-foreground">Riuh Merekah</span>
                </span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          <SidebarTrigger className="size-8 shrink-0 group-data-[collapsible=icon]/sidebar:hidden" />
        </div>
      </SidebarHeader>

      <SidebarContent className="py-2">
        <SidebarGroup>
          <SidebarGroupLabel>{language === "ID" ? "Pengaturan akun" : "Account settings"}</SidebarGroupLabel>
          <SidebarMenu>
            {ACCOUNT_SETTINGS_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    type="button"
                    isActive={pathname === item.href}
                    tooltip={item.label[language]}
                    onClick={() => navigate(item.href)}
                  >
                    <Icon className="size-4" />
                    <span>{item.label[language]}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

export function accountSettingsTitle(pathname: string, language: Language) {
  const item = ACCOUNT_SETTINGS_ITEMS.find((candidate) => candidate.href === pathname);
  if (item) return item.label[language];
  return language === "ID" ? "Pengaturan" : "Settings";
}
