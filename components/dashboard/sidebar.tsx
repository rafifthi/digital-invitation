"use client";

import { ChevronRight } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import type { MenuId } from "./types";
import { MENU_ITEMS } from "@/lib/constants";
import type { Language } from "@/lib/types";
import { menuLabel, tr } from "@/lib/i18n";

export function AppSidebar({
  activeMenu,
  onSelect,
  language,
}: {
  activeMenu: MenuId;
  onSelect: (id: MenuId) => void;
  language: Language;
}) {
  const { setOpenMobile } = useSidebar();
  const handleSelect = (id: MenuId) => {
    onSelect(id);
    setOpenMobile(false);
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="h-16 shrink-0 justify-center border-b border-sidebar-border px-3 py-0 group-data-[collapsible=icon]/sidebar:px-2">
        <div className="flex h-full items-center gap-1 group-data-[collapsible=icon]/sidebar:justify-center">
          <SidebarMenu className="flex-1 group-data-[collapsible=icon]/sidebar:hidden">
            <SidebarMenuItem>
              <SidebarMenuButton size="lg">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-[#181925] text-white">
                  <span className="text-[10px] font-semibold tracking-[-0.04em]" aria-hidden="true">
                    RM
                  </span>
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]/sidebar:hidden">
                  <span className="truncate font-semibold tracking-[-0.02em]">Riuh Merekah</span>
                  <span className="truncate text-xs text-muted-foreground">{tr(language, "weddingWorkspace")}</span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          <SidebarTrigger className="size-8 shrink-0" />
        </div>
      </SidebarHeader>

      <SidebarContent className="py-2">
        <SidebarGroup>
          <SidebarMenu>
            {MENU_ITEMS.map((item) => {
              const Icon = item.icon;
              const label = menuLabel(language, item.id);
              const isActive =
                activeMenu === item.id ||
                (item.children?.some((child) => child.id === activeMenu) ?? false);
              const hasChildren = Boolean(item.children?.length);

              if (hasChildren && item.children) {
                return (
                  <Collapsible
                    key={item.label}
                    defaultOpen={isActive}
                    className="group/collapsible"
                  >
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton
                          isActive={isActive}
                          tooltip={label}
                        >
                          <Icon className="size-4" />
                          <span>{label}</span>
                          <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.children.map((child) => (
                            <SidebarMenuSubItem key={child.id}>
                              <SidebarMenuSubButton
                                isActive={activeMenu === child.id}
                                onClick={() => handleSelect(child.id)}
                              >
                                <span>{menuLabel(language, child.id)}</span>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                );
              }

              return (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => handleSelect(item.id)}
                    isActive={isActive}
                    tooltip={label}
                  >
                    <Icon className="size-4" />
                    <span>{label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-3 group-data-[collapsible=icon]/sidebar:hidden">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="hover:bg-white"
              onClick={() => handleSelect("account")}
              tooltip={tr(language, "accountSettings")}
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-full bg-[#181925] text-white">
                <span className="text-xs font-semibold">RK</span>
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">Rafif & Kanza</span>
                <span className="truncate text-xs text-muted-foreground">{tr(language, "invitedGuests")}</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
