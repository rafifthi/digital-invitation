"use client";

import { useState } from "react";
import { DashboardPageFrame } from "@/components/dashboard/dashboard-page-frame";
import { CreateGuestForm } from "@/components/dashboard/guests/create-guest-form";
import { GuestList } from "@/components/dashboard/guests/guest-list";
import { WABlast } from "@/components/dashboard/guests/wa-blast";
import { SectionHeading } from "@/components/dashboard/shared";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useDashboard } from "@/context";
import { tr } from "@/lib/i18n";

export default function GuestListPage() {
  const { language, guestDialogOpen, setGuestDialogOpen, addGuest } = useDashboard();
  const [blastRecipientIds, setBlastRecipientIds] = useState<string[] | null>(null);

  return (
    <>
      <DashboardPageFrame>
        <section className="mx-auto max-w-[1180px] space-y-5">
          <SectionHeading
            eyebrow={language === "ID" ? "Manajemen tamu" : "Guest management"}
            title={blastRecipientIds === null ? tr(language, "guestList") : "WA Blast"}
          />
          {blastRecipientIds === null ? (
            <GuestList
              onAddGuest={() => setGuestDialogOpen(true)}
              onStartBlast={setBlastRecipientIds}
            />
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
    </>
  );
}
