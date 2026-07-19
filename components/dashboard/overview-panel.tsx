"use client";

import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  CalendarClock,
  Check,
  CheckCircle2,
  ChevronDown,
  Circle,
  CircleDot,
  Copy,
  Crown,
  ListChecks,
  PackageCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  INVITATION_DOMAIN,
  invitationHost,
  invitationSubdomain,
} from "@/lib/invitation-url";
import type { Language } from "@/lib/types";
import { WORKSPACE_PLANS } from "@/lib/constants";
import type { MenuId, WorkspacePlanName } from "./types";
import { SectionHeading } from "./shared";

const ATTENDANCE_DATA = [
  { key: "attending", count: 88, color: "oklch(0.69 0.16 148)" },
  { key: "pending", count: 43, color: "oklch(0.76 0.11 78)" },
  { key: "declined", count: 12, color: "oklch(0.66 0.17 31)" },
] as const;

type CountdownValue = {
  days: number;
  hours: number;
  minutes: number;
  completed: boolean;
};

export function OverviewPanel({
  slug,
  setSlug,
  copied,
  onCopy,
  weddingDate,
  venueName,
  language,
  onNavigate,
  packageName,
}: {
  slug: string;
  setSlug: (value: string) => void;
  copied: boolean;
  onCopy: () => void;
  weddingDate: string;
  venueName: string;
  language: Language;
  onNavigate: (menu: MenuId) => void;
  packageName: WorkspacePlanName;
}) {
  const [showPlans, setShowPlans] = useState(false);
  const countdown = useCountdown(weddingDate);
  const isId = language === "ID";
  const totalGuests = ATTENDANCE_DATA.reduce((total, item) => total + item.count, 0);
  const completedTasks = 2;
  const eventDate = formatEventDate(weddingDate, language);
  const currentPlan = WORKSPACE_PLANS.find((plan) => plan.name === packageName) ?? WORKSPACE_PLANS[1];
  const tasks: Array<{
    title: string;
    description: string;
    status: "complete" | "progress" | "pending";
    menu: MenuId;
  }> = [
    {
      title: isId ? "Lengkapi informasi acara" : "Complete event information",
      description: isId ? "Tanggal, waktu, dan lokasi sudah terisi." : "Date, time, and venue are ready.",
      status: "complete",
      menu: "settings",
    },
    {
      title: isId ? "Atur desain undangan" : "Set invitation design",
      description: isId ? "Template dan struktur undangan sudah dipilih." : "A template and invitation structure are selected.",
      status: "complete",
      menu: "design",
    },
    {
      title: isId ? "Input daftar undangan" : "Input guest list",
      description: isId ? "Tambahkan tamu dan kelompok penerima." : "Add guests and recipient groups.",
      status: "progress",
      menu: "guest-list",
    },
    {
      title: isId ? "Edit template WA Blast" : "Edit WA Blast template",
      description: isId ? "Sesuaikan pesan sebelum pengiriman." : "Personalize the message before sending.",
      status: "pending",
      menu: "guest-list",
    },
    {
      title: isId ? "Kirim undangan" : "Send invitations",
      description: isId ? "Periksa penerima lalu mulai pengiriman." : "Review recipients and start delivery.",
      status: "pending",
      menu: "guest-list",
    },
  ];

  return (
    <section className="mx-auto max-w-[1180px] space-y-6">
      <SectionHeading
        eyebrow={isId ? "Ringkasan pernikahan" : "Wedding overview"}
        title={isId ? "Selamat datang kembali" : "Welcome back"}
        action={
          <Badge className="border-0 bg-[#def6e4] text-[#247f3b]">
            {isId ? "Undangan aktif" : "Invitation live"}
          </Badge>
        }
      />

      <div className="flex items-center gap-2 rounded-2xl border bg-white p-2 max-[720px]:flex-col max-[720px]:items-stretch">
        <div className="flex min-w-0 flex-1 items-center overflow-hidden rounded-xl bg-[#fafafa] focus-within:ring-2 focus-within:ring-ring/25">
          <span className="pl-3 text-sm text-muted-foreground">https://</span>
          <Input
            value={invitationSubdomain(slug)}
            onChange={(event) => setSlug(invitationHost(event.target.value))}
            aria-label={isId ? "Subdomain undangan" : "Invitation subdomain"}
            className="min-w-20 flex-1 border-0 bg-transparent px-1 shadow-none focus-visible:ring-0"
          />
          <span className="shrink-0 pr-3 text-sm font-medium text-muted-foreground">
            .{INVITATION_DOMAIN}
          </span>
        </div>
        <Button type="button" variant="secondary" size="sm" onClick={onCopy}>
          {copied ? <Check /> : <Copy />}
          {copied ? (isId ? "Tersalin" : "Copied") : (isId ? "Salin tautan" : "Copy link")}
        </Button>
      </div>

      <div className="grid grid-cols-12 gap-5 max-[980px]:grid-cols-1">
        <section className="col-span-7 rounded-3xl border bg-white p-6 max-[980px]:col-span-1">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
                {isId ? "Kehadiran tamu" : "Guest attendance"}
              </p>
              <h2 className="mt-1 text-xl font-semibold tracking-[-0.03em]">
                {isId ? "Status RSVP" : "RSVP status"}
              </h2>
            </div>
            <Button type="button" variant="ghost" size="sm" onClick={() => onNavigate("guest-list")}>
              {isId ? "Lihat tamu" : "View guests"}
              <ArrowUpRight />
            </Button>
          </div>

          <div className="mt-6 grid grid-cols-[220px_minmax(0,1fr)] items-center gap-7 max-[620px]:grid-cols-1">
            <AttendanceDonut total={totalGuests} language={language} />
            <div className="divide-y">
              {ATTENDANCE_DATA.map((item) => {
                const percent = Math.round((item.count / totalGuests) * 100);
                return (
                  <div key={item.key} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                    <span className="size-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="flex-1 text-sm text-muted-foreground">
                      {attendanceLabel(item.key, language)}
                    </span>
                    <strong className="text-sm font-semibold">{item.count}</strong>
                    <span className="w-10 text-right text-xs text-muted-foreground">{percent}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="relative col-span-5 overflow-hidden rounded-3xl bg-[#181925] p-6 text-[#fefeff] max-[980px]:col-span-1">
          <div className="absolute -right-12 -top-16 size-48 rounded-full border border-[#918df6]/25" />
          <div className="absolute -right-4 -top-8 size-28 rounded-full border border-[#918df6]/30" />
          <div className="relative">
            <div className="flex items-center justify-between gap-3">
              <span className="grid size-10 place-items-center rounded-full bg-[#2c2d3b] text-[#bdb9ff]">
                <CalendarClock className="size-4" />
              </span>
              <span className="rounded-full bg-[#2c2d3b] px-3 py-1 text-xs text-[#d8d5ff]">
                {isId ? "Acara utama" : "Main event"}
              </span>
            </div>
            <p className="mt-7 text-sm text-[#aaaab7]">{eventDate}</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-[-0.03em]">{venueName}</h2>

            {countdown?.completed ? (
              <div className="mt-8 rounded-2xl bg-[#242532] p-5">
                <strong className="text-base">{isId ? "Acara telah berlangsung" : "The event has passed"}</strong>
                <p className="mt-1 text-sm leading-5 text-[#aaaab7]">
                  {isId ? "Perbarui tanggal acara untuk memulai countdown baru." : "Update the event date to start a new countdown."}
                </p>
                <Button type="button" variant="secondary" size="sm" className="mt-4" onClick={() => onNavigate("settings")}>
                  {isId ? "Ubah tanggal" : "Update date"}
                </Button>
              </div>
            ) : (
              <div className="mt-8 grid grid-cols-3 gap-2" aria-label={isId ? "Hitung mundur acara" : "Event countdown"}>
                <CountdownUnit value={countdown?.days} label={isId ? "Hari" : "Days"} />
                <CountdownUnit value={countdown?.hours} label={isId ? "Jam" : "Hours"} />
                <CountdownUnit value={countdown?.minutes} label={isId ? "Menit" : "Minutes"} />
              </div>
            )}
          </div>
        </section>
      </div>

      <div className="grid grid-cols-12 items-start gap-5 max-[980px]:grid-cols-1">
        <section className="col-span-7 overflow-hidden rounded-3xl border bg-white max-[980px]:col-span-1">
          <div className="flex items-center justify-between gap-4 border-b px-6 py-5">
            <div className="flex items-center gap-3">
              <span className="grid size-9 place-items-center rounded-full bg-[#eeedff] text-[#625cc7]">
                <ListChecks className="size-4" />
              </span>
              <div>
                <h2 className="text-base font-semibold">{isId ? "To-do list" : "To-do list"}</h2>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {completedTasks}/5 {isId ? "langkah selesai" : "steps completed"}
                </p>
              </div>
            </div>
            <span className="text-sm font-semibold text-[#625cc7]">40%</span>
          </div>
          <div className="h-1 bg-[#f1f0ff]">
            <div className="h-full w-2/5 bg-[#918df6]" />
          </div>
          <div className="divide-y">
            {tasks.map((task, index) => (
              <button
                key={task.title}
                type="button"
                onClick={() => onNavigate(task.menu)}
                className="flex w-full items-center gap-4 px-6 py-4 text-left transition-colors hover:bg-[#fafafa] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
              >
                <TaskStatusIcon status={task.status} />
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium">{index + 1}. {task.title}</span>
                  <span className="mt-0.5 block truncate text-xs text-muted-foreground">{task.description}</span>
                </span>
                <ArrowUpRight className="size-4 shrink-0 text-muted-foreground" />
              </button>
            ))}
          </div>
        </section>

        <section id="current-package" className="col-span-5 scroll-mt-6 rounded-3xl border bg-white p-6 max-[980px]:col-span-1">
          <div className="flex items-start justify-between gap-4">
            <span className="grid size-10 place-items-center rounded-full bg-[#fff4d9] text-[#8f5d00]">
              <Crown className="size-4" />
            </span>
            <Badge className="border-0 bg-[#def6e4] text-[#247f3b]">
              {isId ? "Aktif" : "Active"}
            </Badge>
          </div>
          <p className="mt-5 text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
            {isId ? "Paket saat ini" : "Current package"}
          </p>
          <div className="mt-1 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold tracking-[-0.03em]">{currentPlan.name}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{isId ? "Sekali bayar" : "One-time payment"}</p>
            </div>
            <div className="text-right">
              <strong className="text-xl font-semibold">{currentPlan.price}</strong>
              <span className="block text-xs text-muted-foreground">{isId ? "selamanya" : "lifetime"}</span>
            </div>
          </div>

          <ul className="mt-5 grid gap-2.5 text-sm text-muted-foreground">
            <PackageFeature text={planGuestFeature(currentPlan.guests, language)} />
            <PackageFeature text={planCreditFeature(currentPlan.credits, language)} />
            <PackageFeature text={isId ? "Subdomain kustom" : "Custom subdomain"} />
          </ul>

          <Button
            type="button"
            variant="secondary"
            className="mt-6 w-full"
            onClick={() => setShowPlans((current) => !current)}
            aria-expanded={showPlans}
          >
            {isId ? "Bandingkan paket" : "Compare plans"}
            <ChevronDown className={cn("transition-transform", showPlans && "rotate-180")} />
          </Button>

          {showPlans && (
            <div className="mt-4 divide-y rounded-2xl border bg-[#fafafa] px-4">
              {WORKSPACE_PLANS.map((plan) => (
                <div key={plan.name} className="flex items-center gap-3 py-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <strong className="text-sm font-medium">{plan.name}</strong>
                      {plan.name === packageName && <span className="text-[10px] font-medium uppercase tracking-wider text-[#625cc7]">{isId ? "Saat ini" : "Current"}</span>}
                    </div>
                    <span className="text-xs text-muted-foreground">{plan.guests}</span>
                  </div>
                  <span className="text-sm font-semibold">{plan.price}</span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </section>
  );
}

function AttendanceDonut({ total, language }: { total: number; language: Language }) {
  let offset = 0;

  return (
    <div className="relative mx-auto size-48">
      <svg viewBox="0 0 120 120" className="size-full -rotate-90" role="img" aria-label={language === "ID" ? "Diagram status kehadiran tamu" : "Guest attendance status chart"}>
        <circle cx="60" cy="60" r="46" pathLength="100" fill="none" stroke="oklch(0.96 0.01 292)" strokeWidth="13" />
        {ATTENDANCE_DATA.map((item) => {
          const percent = (item.count / total) * 100;
          const segment = (
            <circle
              key={item.key}
              cx="60"
              cy="60"
              r="46"
              pathLength="100"
              fill="none"
              stroke={item.color}
              strokeWidth="13"
              strokeLinecap="round"
              strokeDasharray={`${Math.max(percent - 1.2, 0)} ${100 - Math.max(percent - 1.2, 0)}`}
              strokeDashoffset={-offset}
            />
          );
          offset += percent;
          return segment;
        })}
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <strong className="block text-3xl font-semibold tracking-[-0.04em]">{total}</strong>
          <span className="mt-1 block text-xs text-muted-foreground">
            {language === "ID" ? "Tamu diundang" : "Guests invited"}
          </span>
        </div>
      </div>
    </div>
  );
}

function CountdownUnit({ value, label }: { value: number | undefined; label: string }) {
  return (
    <div className="rounded-2xl bg-[#242532] px-3 py-4 text-center">
      <strong className="block text-2xl font-semibold tabular-nums">{value === undefined ? "--" : String(value).padStart(2, "0")}</strong>
      <span className="mt-1 block text-[10px] font-medium uppercase tracking-[0.12em] text-[#aaaab7]">{label}</span>
    </div>
  );
}

function TaskStatusIcon({ status }: { status: "complete" | "progress" | "pending" }) {
  if (status === "complete") {
    return <CheckCircle2 className="size-5 shrink-0 text-[#33a953]" />;
  }
  if (status === "progress") {
    return <CircleDot className="size-5 shrink-0 text-[#918df6]" />;
  }
  return <Circle className="size-5 shrink-0 text-[#b8b8c2]" />;
}

function PackageFeature({ text }: { text: string }) {
  return (
    <li className="flex items-center gap-2.5">
      <PackageCheck className="size-4 shrink-0 text-[#625cc7]" />
      {text}
    </li>
  );
}

function useCountdown(weddingDate: string) {
  const [countdown, setCountdown] = useState<CountdownValue | null>(null);

  useEffect(() => {
    const update = () => setCountdown(calculateCountdown(weddingDate));
    update();
    const interval = window.setInterval(update, 60_000);
    return () => window.clearInterval(interval);
  }, [weddingDate]);

  return countdown;
}

function calculateCountdown(weddingDate: string): CountdownValue {
  const target = new Date(`${weddingDate}T10:00:00+07:00`).getTime();
  const difference = target - Date.now();
  if (!Number.isFinite(target) || difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, completed: true };
  }

  return {
    days: Math.floor(difference / 86_400_000),
    hours: Math.floor((difference % 86_400_000) / 3_600_000),
    minutes: Math.floor((difference % 3_600_000) / 60_000),
    completed: false,
  };
}

function formatEventDate(value: string, language: Language) {
  const date = new Date(`${value}T10:00:00+07:00`);
  if (Number.isNaN(date.getTime())) return language === "ID" ? "Tanggal belum diatur" : "Date not set";
  return new Intl.DateTimeFormat(language === "ID" ? "id-ID" : "en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Jakarta",
  }).format(date);
}

function attendanceLabel(key: typeof ATTENDANCE_DATA[number]["key"], language: Language) {
  if (key === "attending") return language === "ID" ? "Hadir" : "Attending";
  if (key === "pending") return language === "ID" ? "Menunggu jawaban" : "Awaiting response";
  return language === "ID" ? "Tidak hadir" : "Not attending";
}

function planGuestFeature(value: string, language: Language) {
  if (language === "EN") return value === "Unlimited guests" ? value : `Up to ${value}`;
  if (value === "Unlimited guests") return "Tamu tanpa batas";
  return `Hingga ${value.replace(" guests", " tamu")}`;
}

function planCreditFeature(value: string, language: Language) {
  if (language === "EN") return value;
  if (value === "Unlimited WA Blast") return "WA Blast tanpa batas";
  return value.replace("WA Blast credits", "kuota WA Blast");
}
