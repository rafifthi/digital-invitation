"use client";

import { useState } from "react";
import { DashboardPageFrame } from "@/components/dashboard/dashboard-page-frame";
import { CreateGuestForm } from "@/components/dashboard/guests/create-guest-form";
import { GuestList } from "@/components/dashboard/guests/guest-list";
import {
  CreateReviewSessionDialog,
  GuestCapacityPlanner,
  GuestReviewSessions,
} from "@/components/dashboard/guests/guest-planning";
import { WABlast } from "@/components/dashboard/guests/wa-blast";
import { SectionHeading } from "@/components/dashboard/shared";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useDashboard } from "@/context";
import { tr } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export default function GuestListPage() {
  const { language, guestDialogOpen, setGuestDialogOpen, addGuest, guests } = useDashboard();
  const [blastRecipientIds, setBlastRecipientIds] = useState<string[] | null>(null);
  const [activeView, setActiveView] = useState<"guests" | "sessions">("guests");
  const [reviewGuestIds, setReviewGuestIds] = useState<string[]>([]);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const isId = language === "ID";

  const startReview = (guestIds: string[]) => {
    setReviewGuestIds(guestIds);
    setReviewDialogOpen(true);
  };

  const startAllCandidatesReview = () => {
    const candidateIds = guests
      .filter((guest) => guest.planningStatus !== "removed")
      .map((guest) => guest.id);
    startReview(candidateIds);
  };

  return (
    <>
      <DashboardPageFrame>
        <section className="mx-auto max-w-[1180px] space-y-5">
          <SectionHeading
            eyebrow={language === "ID" ? "Manajemen tamu" : "Guest management"}
            title={blastRecipientIds === null ? tr(language, "guestList") : "WA Blast"}
          />
          {blastRecipientIds === null ? (
            <>
              <GuestCapacityPlanner />
              <div
                className="inline-flex rounded-full bg-[#f0f0f3] p-1"
                role="tablist"
                aria-label={isId ? "Tampilan Guest List" : "Guest List view"}
              >
                {[
                  { id: "guests" as const, label: isId ? "Daftar Tamu" : "Guest List" },
                  { id: "sessions" as const, label: isId ? "Sesi Sortir" : "Sorting Sessions" },
                ].map((item) => (
                  <Button
                    key={item.id}
                    type="button"
                    role="tab"
                    aria-selected={activeView === item.id}
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "min-w-28 shadow-none",
                      activeView === item.id && "bg-white text-foreground shadow-[0_1px_2px_rgba(24,25,37,0.08)] hover:bg-white",
                    )}
                    onClick={() => setActiveView(item.id)}
                  >
                    {item.label}
                  </Button>
                ))}
              </div>

              {activeView === "guests" ? (
                <GuestList
                  onAddGuest={() => setGuestDialogOpen(true)}
                  onStartBlast={setBlastRecipientIds}
                  onStartReview={startReview}
                />
              ) : (
                <GuestReviewSessions onCreate={startAllCandidatesReview} />
              )}
            </>
          ) : (
            <WABlast initialRecipientIds={blastRecipientIds} onBack={() => setBlastRecipientIds(null)} />
          )}
        </section>
      </DashboardPageFrame>

      <Dialog open={guestDialogOpen} onOpenChange={setGuestDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{tr(language, "createGuest")}</DialogTitle>
            <DialogDescription>{tr(language, "createGuestHelp")}</DialogDescription>
          </DialogHeader>
          <CreateGuestForm onSubmit={addGuest} onSuccess={() => setGuestDialogOpen(false)} />
        </DialogContent>
      </Dialog>

      <CreateReviewSessionDialog
        open={reviewDialogOpen}
        onOpenChange={setReviewDialogOpen}
        guestIds={reviewGuestIds}
        onCreated={() => setActiveView("sessions")}
      />
    </>
  );
}
