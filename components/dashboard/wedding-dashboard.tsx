"use client";

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DashboardProvider, useDashboard } from "@/context";
import { ErrorBoundary } from "@/components/error-boundary";
import { AppSidebar } from "./sidebar";
import { Topbar } from "./topbar";
import { OverviewPanel } from "./overview-panel";
import { DesignPanel } from "./design-panel";
import { GiftsPanel } from "./gifts-panel";
import { SettingsPanel } from "./settings-panel";
import { LivePreview } from "./live-preview";
import { GuestList } from "./guests/guest-list";
import { WABlast } from "./guests/wa-blast";
import { CreateGuestForm } from "./guests/create-guest-form";
import { SectionHeading } from "./shared";
import { AccountSettingsPanel } from "./account-settings-panel";
import type { AccountProfile } from "./types";
import { tr } from "@/lib/i18n";

function DashboardContent({ account }: { account: AccountProfile }) {
  const {
    activeMenu,
    setActiveMenu,
    activeTitle,
    language,
    setLanguage,
    copied,
    copyInvitationLink,
    musicPlaying,
    setMusicPlaying,
    guestDialogOpen,
    setGuestDialogOpen,
    selectedTemplate,
    setSelectedTemplate,
    blocks,
    toggleBlockOpen,
    toggleBlockVisible,
    setBlockField,
    invitation,
    setField,
  } = useDashboard();

  return (
    <>
      <AppSidebar activeMenu={activeMenu} onSelect={setActiveMenu} language={language} />
      <SidebarInset className="h-svh min-h-0 overflow-hidden">
        <Topbar
          activeTitle={activeTitle}
          language={language}
          onLanguageChange={setLanguage}
          onProfileClick={() => setActiveMenu("account")}
        />
        <div
          className={cn(
            "flex min-h-0 flex-1 overflow-hidden",
            activeMenu === "design"
              ? "max-[1180px]:grid max-[1180px]:grid-cols-[minmax(0,1fr)_auto] max-[820px]:flex max-[820px]:flex-col max-[820px]:overflow-y-auto"
              : "",
          )}
        >
          <main className="h-full min-w-0 flex-1 overflow-y-auto bg-[#fafafa] px-8 pb-16 pt-8 max-[820px]:h-auto max-[820px]:flex-none max-[820px]:overflow-visible max-[820px]:px-4 max-[560px]:pt-6">
            {activeMenu === "overview" && (
              <ErrorBoundary>
                <OverviewPanel
                  slug={invitation.customSlug}
                  setSlug={(value) => setField("customSlug", value)}
                  copied={copied}
                  onCopy={copyInvitationLink}
                />
              </ErrorBoundary>
            )}

            {activeMenu === "design" && (
              <ErrorBoundary>
                <DesignPanel
                  invitation={invitation}
                  setField={setField}
                  musicPlaying={musicPlaying}
                  setMusicPlaying={setMusicPlaying}
                  selectedTemplate={selectedTemplate}
                  setSelectedTemplate={setSelectedTemplate}
                  blocks={blocks}
                  toggleBlockOpen={toggleBlockOpen}
                  toggleBlockVisible={toggleBlockVisible}
                  setBlockField={setBlockField}
                  language={language}
                />
              </ErrorBoundary>
            )}

            {activeMenu === "gifts" && (
              <ErrorBoundary>
                <GiftsPanel />
              </ErrorBoundary>
            )}

            {activeMenu === "guest-list" && (
              <ErrorBoundary>
                <section className="mx-auto max-w-[1180px] space-y-5">
                  <SectionHeading
                    eyebrow={tr(language, "guestList")}
                    title={tr(language, "guestList")}
                  />
                  <GuestList onAddGuest={() => setGuestDialogOpen(true)} />
                </section>
              </ErrorBoundary>
            )}

            {activeMenu === "wablast" && (
              <ErrorBoundary>
                <WABlast />
              </ErrorBoundary>
            )}

            {activeMenu === "settings" && (
              <ErrorBoundary>
                <SettingsPanel />
              </ErrorBoundary>
            )}

            {activeMenu === "account" && (
              <ErrorBoundary>
                <AccountSettingsPanel account={account} />
              </ErrorBoundary>
            )}
          </main>

          {activeMenu === "design" && (
            <LivePreview invitation={invitation} blocks={blocks} selectedTemplate={selectedTemplate} language={language} />
          )}
        </div>
      </SidebarInset>

      <Dialog open={guestDialogOpen} onOpenChange={setGuestDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{tr(language, "createGuest")}</DialogTitle>
            <DialogDescription>
              {tr(language, "createGuestHelp")}
            </DialogDescription>
          </DialogHeader>
          <CreateGuestForm onSuccess={() => setGuestDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
}

export function WeddingDashboard({ account }: { account: AccountProfile }) {
  return (
    <SidebarProvider className="h-svh overflow-hidden">
      <DashboardProvider>
        <DashboardContent account={account} />
      </DashboardProvider>
    </SidebarProvider>
  );
}
