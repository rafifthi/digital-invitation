"use client";

import { CalendarDays, Check, Copy, UserCheck, UserRoundX, UsersRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { OVERVIEW_STATS } from "@/lib/constants";
import { SectionHeading } from "./shared";

export function OverviewPanel({
  slug,
  setSlug,
  copied,
  onCopy,
}: {
  slug: string;
  setSlug: (value: string) => void;
  copied: boolean;
  onCopy: () => void;
}) {
  const statStyles = [
    { icon: UsersRound, surface: "bg-white", iconStyle: "bg-[#f0efff] text-[#7772df]" },
    { icon: UserCheck, surface: "bg-[#def6e4]", iconStyle: "bg-white/80 text-[#248c40]" },
    { icon: UserRoundX, surface: "bg-white", iconStyle: "bg-[#fff1ec] text-[#d93800]" },
    { icon: CalendarDays, surface: "bg-white", iconStyle: "bg-[#eef5ff] text-[#2c78fc]" },
  ];

  return (
    <section className="mx-auto max-w-[1180px] space-y-5">
      <SectionHeading eyebrow="Dashboard overview" title="Invitation at a glance" />
      <div className="grid grid-cols-4 gap-4 max-[1180px]:grid-cols-2 max-[560px]:grid-cols-1">
        {OVERVIEW_STATS.map(([label, value, meta], index) => {
          const style = statStyles[index];
          const Icon = style.icon;
          return (
            <Card key={label} className={cn(style.surface)}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-xs font-medium text-[#666666]">{label}</p>
                  <span className={cn("grid size-8 place-items-center rounded-full", style.iconStyle)}>
                    <Icon className="size-4" />
                  </span>
                </div>
                <strong className="mt-3 block text-2xl font-semibold tracking-[-0.03em]">{value}</strong>
                <span className="mt-1 block text-xs text-[#666666]">{meta}</span>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-medium tracking-[-0.02em]">Invitation link</CardTitle>
          <CardDescription>
            Guests will open the invitation from this URL.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 rounded-xl border bg-[#fafafa] p-1.5 max-[560px]:grid-cols-[auto_minmax(0,1fr)]">
            <span className="pl-2 text-sm font-semibold text-muted-foreground">
              https://
            </span>
            <Input
              value={slug}
              onChange={(event) => setSlug(event.target.value)}
              className="border-0 bg-white shadow-none"
            />
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={onCopy}
              className="max-[560px]:col-span-2"
            >
              {copied ? <Check /> : <Copy />}
              {copied ? "Copied" : "Copy Link"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
