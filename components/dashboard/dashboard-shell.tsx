"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { DashboardProvider, useDashboard } from "@/context";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { ErrorBoundary } from "@/components/error-boundary";
import { AppSidebar } from "./sidebar";
import { Topbar } from "./topbar";
import { DashboardRouteSkeleton } from "./dashboard-route-skeleton";
import { AccountSettingsSidebar, accountSettingsTitle } from "./settings-sidebar";

export function DashboardShell({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider className="h-svh overflow-hidden">
      <DashboardProvider>
        <DashboardShellContent>{children}</DashboardShellContent>
      </DashboardProvider>
    </SidebarProvider>
  );
}

function DashboardShellContent({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const {
    activeMenu,
    setActiveMenu,
    isNavigating,
    activeTitle,
    language,
    setLanguage,
    workspaces,
    activeWorkspaceId,
    setActiveWorkspaceId,
    createWorkspace,
  } = useDashboard();
  const isAccountSettingsArea = pathname === "/account"
    || pathname.startsWith("/account/");

  return (
    <>
      {isAccountSettingsArea ? (
        <AccountSettingsSidebar language={language} />
      ) : (
        <AppSidebar
          activeMenu={activeMenu}
          onSelect={setActiveMenu}
          language={language}
          workspaces={workspaces}
          activeWorkspaceId={activeWorkspaceId}
          onWorkspaceSelect={setActiveWorkspaceId}
          onWorkspaceCreate={createWorkspace}
        />
      )}
      <SidebarInset className="h-svh min-h-0 overflow-hidden">
        <Topbar
          activeTitle={isAccountSettingsArea ? accountSettingsTitle(pathname, language) : activeTitle}
          language={language}
          onLanguageChange={setLanguage}
          onProfileClick={() => setActiveMenu("account")}
        />
        <div className="relative min-h-0 flex-1 overflow-hidden" aria-busy={isNavigating}>
          <ErrorBoundary>{children}</ErrorBoundary>
          {isNavigating && (
            <div className="absolute inset-0 z-20 bg-[#fafafa]">
              <DashboardRouteSkeleton variant={activeMenu} />
            </div>
          )}
        </div>
      </SidebarInset>
    </>
  );
}
