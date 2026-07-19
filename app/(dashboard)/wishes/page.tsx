"use client";

import { DashboardPageFrame } from "@/components/dashboard/dashboard-page-frame";
import { SectionHeading } from "@/components/dashboard/shared";
import { WishManagement } from "@/components/dashboard/wishes/wish-management";
import { useDashboard } from "@/context";

export default function WishesPage() {
  const { language } = useDashboard();
  const isId = language === "ID";

  return (
    <DashboardPageFrame>
      <section className="mx-auto max-w-[1180px] space-y-5">
        <SectionHeading
          eyebrow={isId ? "Interaksi tamu" : "Guest interaction"}
          title={isId ? "Ucapan" : "Wishes"}
        />
        <WishManagement />
      </section>
    </DashboardPageFrame>
  );
}
