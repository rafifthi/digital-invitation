"use client";

import { DashboardPageFrame } from "@/components/dashboard/dashboard-page-frame";
import { OverviewPanel } from "@/components/dashboard/overview-panel";
import { useDashboard } from "@/context";
import { useRouter } from "next/navigation";

export default function DashboardHomePage() {
  const router = useRouter();
  const {
    invitation,
    event,
    setField,
    copied,
    copyInvitationLink,
    language,
    setActiveMenu,
    workspaces,
    activeWorkspaceId,
  } = useDashboard();
  const activeWorkspace = workspaces.find((workspace) => workspace.id === activeWorkspaceId) ?? workspaces[0];

  return (
    <DashboardPageFrame>
      <OverviewPanel
        slug={invitation.customSlug}
        setSlug={(value) => setField("customSlug", value)}
        copied={copied}
        onCopy={copyInvitationLink}
        weddingDate={event.date}
        venueName={event.venueName}
        language={language}
        onNavigate={setActiveMenu}
        onOpenEventSettings={() => router.push("/settings?tab=event")}
        onOpenPlanSettings={() => router.push("/account/plan")}
        packageName={activeWorkspace.packageName}
      />
    </DashboardPageFrame>
  );
}
