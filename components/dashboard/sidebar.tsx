"use client";

import { useState } from "react";
import { Check, ChevronRight, ChevronsUpDown, Plus } from "lucide-react";
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
import type { MenuId, WorkspaceCreationInput, WorkspaceSummary } from "./types";
import { MENU_ITEMS } from "@/lib/constants";
import { DASHBOARD_ROUTES } from "@/lib/dashboard-routes";
import type { Language } from "@/lib/types";
import { menuLabel, tr } from "@/lib/i18n";
import { WorkspaceCreatorDialog } from "./workspace-creator-dialog";

export function AppSidebar({
  activeMenu,
  onSelect,
  language,
  workspaces,
  activeWorkspaceId,
  onWorkspaceSelect,
  onWorkspaceCreate,
}: {
  activeMenu: MenuId;
  onSelect: (id: MenuId) => void;
  language: Language;
  workspaces: WorkspaceSummary[];
  activeWorkspaceId: string;
  onWorkspaceSelect: (id: string) => void;
  onWorkspaceCreate: (input: WorkspaceCreationInput) => string;
}) {
  const { setOpenMobile } = useSidebar();
  const [workspaceMenuOpen, setWorkspaceMenuOpen] = useState(false);
  const [addWorkspaceOpen, setAddWorkspaceOpen] = useState(false);
  const activeWorkspace = workspaces.find((workspace) => workspace.id === activeWorkspaceId) ?? workspaces[0];
  const isId = language === "ID";

  const handleSelect = (id: MenuId) => {
    onSelect(id);
    setOpenMobile(false);
  };

  const handleWorkspaceSelect = (id: string) => {
    onWorkspaceSelect(id);
    setWorkspaceMenuOpen(false);
    setOpenMobile(false);
  };

  return (
    <>
      <Sidebar collapsible="icon" className="border-r border-sidebar-border">
        <SidebarHeader className="relative h-16 shrink-0 justify-center overflow-visible border-b border-sidebar-border px-3 py-0 group-data-[collapsible=icon]/sidebar:px-2">
          <div className="flex h-full items-center gap-1 group-data-[collapsible=icon]/sidebar:justify-center">
            <SidebarMenu className="flex-1 group-data-[collapsible=icon]/sidebar:hidden">
              <SidebarMenuItem
                className="relative"
                onBlur={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setWorkspaceMenuOpen(false);
                }}
              >
                <SidebarMenuButton
                  size="lg"
                  type="button"
                  onClick={() => setWorkspaceMenuOpen((current) => !current)}
                  aria-haspopup="menu"
                  aria-expanded={workspaceMenuOpen}
                  className="hover:bg-[#f5f5f5]"
                >
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-[#181925] text-[#fefeff]">
                    <span className="text-[10px] font-semibold tracking-[-0.04em]" aria-hidden="true">
                      {workspaceInitials(activeWorkspace?.name ?? "RM")}
                    </span>
                  </div>
                  <div className="grid min-w-0 flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold tracking-[-0.02em]">{activeWorkspace?.name}</span>
                    <span className="truncate text-xs text-muted-foreground">
                      {activeWorkspace?.packageName} {isId ? "workspace" : "workspace"}
                    </span>
                  </div>
                  <ChevronsUpDown className="size-3.5 text-muted-foreground" />
                </SidebarMenuButton>

                {workspaceMenuOpen && (
                  <div
                    role="menu"
                    aria-label={isId ? "Pilih workspace" : "Choose workspace"}
                    className="absolute left-0 top-[calc(100%+8px)] z-50 w-[272px] rounded-2xl border bg-white p-2 shadow-[0_8px_24px_rgba(24,25,37,0.10)]"
                  >
                    <div className="px-2 pb-2 pt-1">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">Riuh Merekah</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {isId ? "Satu akun, beberapa workspace berbayar" : "One account, multiple paid workspaces"}
                      </p>
                    </div>
                    <div className="grid gap-1">
                      {workspaces.map((workspace) => {
                        const selected = workspace.id === activeWorkspaceId;
                        return (
                          <button
                            key={workspace.id}
                            type="button"
                            role="menuitemradio"
                            aria-checked={selected}
                            onClick={() => handleWorkspaceSelect(workspace.id)}
                            className="flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-left transition-colors hover:bg-[#f5f5f5] focus-visible:ring-2 focus-visible:ring-ring"
                          >
                            <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-[#eeedff] text-[10px] font-semibold text-[#625cc7]">
                              {workspaceInitials(workspace.name)}
                            </span>
                            <span className="min-w-0 flex-1">
                              <strong className="block truncate text-sm font-medium">{workspace.name}</strong>
                              <span className="block truncate text-xs text-muted-foreground">{workspace.packageName} · {workspace.status === "active" ? (isId ? "Aktif" : "Active") : "Draft"}</span>
                            </span>
                            {selected && <Check className="size-4 shrink-0 text-[#625cc7]" />}
                          </button>
                        );
                      })}
                    </div>
                    <div className="my-2 h-px bg-border" />
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        setWorkspaceMenuOpen(false);
                        setAddWorkspaceOpen(true);
                      }}
                      className="flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-left transition-colors hover:bg-[#f5f5f5] focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <span className="grid size-8 shrink-0 place-items-center rounded-lg border border-dashed border-[#bdb9ff] text-[#625cc7]">
                        <Plus className="size-4" />
                      </span>
                      <span>
                        <strong className="block text-sm font-medium">{isId ? "Tambah workspace" : "Add workspace"}</strong>
                        <span className="block text-xs text-muted-foreground">{isId ? "Memerlukan paket baru" : "Requires a new package"}</span>
                      </span>
                    </button>
                  </div>
                )}
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
                const label = item.children?.length ? (isId ? "Tamu" : "Guest") : menuLabel(language, item.id);
                const isActive = activeMenu === item.id || (item.children?.some((child) => child.id === activeMenu) ?? false);

                if (item.children?.length) {
                  return (
                    <Collapsible key={item.label} defaultOpen={isActive} className="group/collapsible">
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton isActive={isActive} tooltip={label}>
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
                                  href={DASHBOARD_ROUTES[child.id]}
                                  isActive={activeMenu === child.id}
                                  onClick={(event) => {
                                    event.preventDefault();
                                    handleSelect(child.id);
                                  }}
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
                    <SidebarMenuButton onClick={() => handleSelect(item.id)} isActive={isActive} tooltip={label}>
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
              <SidebarMenuButton size="lg" className="hover:bg-white" onClick={() => handleSelect("account")} tooltip={tr(language, "accountSettings")}>
                <div className="flex aspect-square size-8 items-center justify-center rounded-full bg-[#181925] text-[#fefeff]">
                  <span className="text-xs font-semibold">RM</span>
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{isId ? "Akun saya" : "My account"}</span>
                  <span className="truncate text-xs text-muted-foreground">{tr(language, "accountSettings")}</span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      <WorkspaceCreatorDialog
        open={addWorkspaceOpen}
        onOpenChange={setAddWorkspaceOpen}
        language={language}
        onCreate={onWorkspaceCreate}
      />
    </>
  );
}

function workspaceInitials(name: string) {
  return name
    .split(/\s|&/)
    .map((part) => part.trim()[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}
