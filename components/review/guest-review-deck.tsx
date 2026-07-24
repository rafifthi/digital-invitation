"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  Eye,
  LockKeyhole,
  RotateCcw,
  Users,
  X,
} from "lucide-react";
import type {
  GuestPlanningStatus,
  GuestReviewSession,
} from "@/components/dashboard/types";
import {
  guestSideLabel,
  readReviewSessions,
  updateStoredReviewSession,
} from "@/lib/guest-planning";
import { cn } from "@/lib/utils";

type Decision = Exclude<GuestPlanningStatus, "candidate">;
type ExitDirection = "left" | "right" | "up" | null;

const DECISIONS = {
  removed: {
    label: "Coret",
    icon: X,
    className: "border-[#e68c7b] bg-[#fff4f1] text-[#b83a21]",
    solidClassName: "bg-[#d94b31] text-white",
    direction: "left" as const,
  },
  review: {
    label: "Tinjau lagi",
    icon: Eye,
    className: "border-[#e5bd63] bg-[#fff9e9] text-[#8a6512]",
    solidClassName: "bg-[#d69b22] text-white",
    direction: "up" as const,
  },
  approved: {
    label: "Setuju",
    icon: Check,
    className: "border-[#7fc18e] bg-[#f0faf2] text-[#247f3b]",
    solidClassName: "bg-[#36a653] text-white",
    direction: "right" as const,
  },
};

export function GuestReviewDeck({ token }: { token: string }) {
  const [session, setSession] = useState<GuestReviewSession | null | undefined>(undefined);
  const [index, setIndex] = useState(0);
  const [history, setHistory] = useState<Array<{ guestId: string; previous: GuestPlanningStatus; index: number }>>([]);
  const [exitDirection, setExitDirection] = useState<ExitDirection>(null);
  const [drag, setDrag] = useState({ x: 0, y: 0, active: false });
  const actionLocked = useRef(false);

  useEffect(() => {
    const found = readReviewSessions().find((record) => record.token === token) ?? null;
    setSession(found);
    if (found) {
      const firstPending = found.items.findIndex((item) => item.decision === "candidate");
      setIndex(firstPending >= 0 ? firstPending : found.items.length);
      setHistory(found.items
        .map((item, itemIndex) => ({ item, itemIndex }))
        .filter(({ item }) => item.decision !== "candidate" && item.decidedAt)
        .sort((a, b) => (a.item.decidedAt ?? "").localeCompare(b.item.decidedAt ?? ""))
        .map(({ item, itemIndex }) => ({ guestId: item.guestId, previous: "candidate", index: itemIndex })));
    }
  }, [token]);

  const current = session?.items[index] ?? null;
  const nextItems = session?.items.slice(index + 1, index + 3) ?? [];
  const counts = useMemo(() => {
    const items = session?.items ?? [];
    return {
      approved: items.filter((item) => item.decision === "approved").length,
      review: items.filter((item) => item.decision === "review").length,
      removed: items.filter((item) => item.decision === "removed").length,
    };
  }, [session]);

  const saveDecision = (decision: Decision) => {
    if (!session || !current || actionLocked.current) return;
    actionLocked.current = true;
    const previous = current.decision;
    const direction = DECISIONS[decision].direction;
    setExitDirection(direction);
    window.setTimeout(() => {
      const updated = updateStoredReviewSession(token, (record) => {
        const items = record.items.map((item) => item.guestId === current.guestId
          ? { ...item, decision, decidedAt: new Date().toISOString() }
          : item);
        const completed = items.every((item) => item.decision !== "candidate");
        return {
          ...record,
          items,
          status: completed ? "completed" : "active",
          completedAt: completed ? new Date().toISOString() : null,
        };
      });
      setHistory((entries) => [...entries, { guestId: current.guestId, previous, index }]);
      setSession(updated);
      setIndex((value) => value + 1);
      setDrag({ x: 0, y: 0, active: false });
      setExitDirection(null);
      actionLocked.current = false;
    }, 190);
  };

  const undo = () => {
    const last = history.at(-1);
    if (!last || !session || actionLocked.current) return;
    const updated = updateStoredReviewSession(token, (record) => ({
      ...record,
      status: "active",
      completedAt: null,
      items: record.items.map((item) => item.guestId === last.guestId
        ? { ...item, decision: last.previous, decidedAt: last.previous === "candidate" ? null : item.decidedAt }
        : item),
    }));
    setHistory((entries) => entries.slice(0, -1));
    setSession(updated);
    setIndex(last.index);
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!current) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    setDrag({ x: 0, y: 0, active: true });
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!drag.active) return;
    setDrag((currentDrag) => ({
      ...currentDrag,
      x: currentDrag.x + event.movementX,
      y: currentDrag.y + event.movementY,
    }));
  };

  const handlePointerEnd = () => {
    if (!drag.active) return;
    if (drag.x > 88) saveDecision("approved");
    else if (drag.x < -88) saveDecision("removed");
    else if (drag.y < -88) saveDecision("review");
    setDrag({ x: 0, y: 0, active: false });
  };

  if (session === undefined) {
    return (
      <ReviewShell>
        <div className="flex min-h-[60vh] items-center justify-center text-sm text-[#6f6874]">Membuka sesi sortir…</div>
      </ReviewShell>
    );
  }

  if (!session) {
    return (
      <ReviewShell>
        <div className="mx-auto flex min-h-[70vh] max-w-sm flex-col items-center justify-center px-6 text-center">
          <div className="flex size-14 items-center justify-center rounded-full bg-[#f1eff7] text-[#6f67bf]">
            <X className="size-6" />
          </div>
          <h1 className="mt-5 text-xl font-semibold">Link tidak ditemukan</h1>
          <p className="mt-2 text-sm leading-6 text-[#716b75]">
            Sesi mungkin sudah ditutup atau link dibuka di perangkat lain pada mode demo lokal.
          </p>
        </div>
      </ReviewShell>
    );
  }

  if (session.status === "closed") {
    const undecided = session.items.filter((item) => item.decision === "candidate").length;
    return (
      <ReviewShell>
        <header className="flex items-center justify-between px-5 py-4">
          <button type="button" onClick={() => window.history.back()} className="review-icon-button" aria-label="Kembali">
            <ArrowLeft className="size-5" />
          </button>
          <span className="text-sm font-semibold">Sesi Sortir</span>
          <span className="size-11" aria-hidden="true" />
        </header>
        <main className="mx-auto flex min-h-[calc(100svh-80px)] max-w-sm flex-col items-center justify-center px-6 pb-10 text-center">
          <div className="flex size-16 items-center justify-center rounded-full bg-[#f1eff3] text-[#69626d]">
            <LockKeyhole className="size-7" />
          </div>
          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.12em] text-[#7a7280]">{session.reviewerName}</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em]">Sesi sortir sudah berakhir</h1>
          <p className="mt-3 max-w-xs text-sm leading-6 text-[#716b75]">
            Keputusan tidak dapat diubah lagi melalui link ini. Hasil terakhir sudah tersimpan.
          </p>
          <div className="mt-8 grid w-full grid-cols-3 gap-2">
            <SummaryCount label="Setuju" value={counts.approved} className="bg-[#edf9f0] text-[#247f3b]" />
            <SummaryCount label="Tinjau" value={counts.review} className="bg-[#fff8e5] text-[#8a6512]" />
            <SummaryCount label="Coret" value={counts.removed} className="bg-[#fff1ec] text-[#b62d00]" />
          </div>
          {undecided > 0 && (
            <p className="mt-4 rounded-full bg-[#f3f2f4] px-3 py-1.5 text-xs font-medium text-[#6b6570]">
              {undecided} tamu belum diputuskan
            </p>
          )}
        </main>
      </ReviewShell>
    );
  }

  if (!current) {
    return (
      <ReviewShell>
        <header className="flex items-center justify-between px-5 py-4">
          <button type="button" onClick={() => window.history.back()} className="review-icon-button" aria-label="Kembali">
            <ArrowLeft className="size-5" />
          </button>
          <span className="text-sm font-semibold">Sesi Sortir</span>
          <span className="size-11" aria-hidden="true" />
        </header>
        <main className="mx-auto flex min-h-[calc(100svh-80px)] max-w-sm flex-col items-center justify-center px-6 pb-10 text-center">
          <div className="flex size-16 items-center justify-center rounded-full bg-[#eaf7ed] text-[#278141]">
            <CheckCircle2 className="size-8" />
          </div>
          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.12em] text-[#7a7280]">{session.reviewerName}</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em]">Semua tamu sudah ditinjau</h1>
          <p className="mt-3 max-w-xs text-sm leading-6 text-[#716b75]">Hasil tersimpan dan siap dilihat kembali oleh pasangan.</p>
          <div className="mt-8 grid w-full grid-cols-3 gap-2">
            <SummaryCount label="Setuju" value={counts.approved} className="bg-[#edf9f0] text-[#247f3b]" />
            <SummaryCount label="Tinjau" value={counts.review} className="bg-[#fff8e5] text-[#8a6512]" />
            <SummaryCount label="Coret" value={counts.removed} className="bg-[#fff1ec] text-[#b62d00]" />
          </div>
          <button type="button" onClick={undo} disabled={history.length === 0} className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-full border bg-white px-5 text-sm font-semibold shadow-sm disabled:opacity-40">
            <RotateCcw className="size-4" /> Urungkan keputusan terakhir
          </button>
        </main>
      </ReviewShell>
    );
  }

  const completed = session.items.filter((item) => item.decision !== "candidate").length;
  const progress = session.items.length ? Math.round(completed / session.items.length * 100) : 0;
  const cardTransform = exitDirection
    ? exitDirection === "left"
      ? "translate3d(-135%, 8%, 0) rotate(-18deg)"
      : exitDirection === "right"
        ? "translate3d(135%, 8%, 0) rotate(18deg)"
        : "translate3d(0, -135%, 0) rotate(4deg)"
    : `translate3d(${drag.x}px, ${drag.y}px, 0) rotate(${drag.x / 24}deg)`;

  return (
    <ReviewShell>
      <header className="relative z-20 border-b border-[#ece9ef] bg-[#fffdfd]/95 px-5 pb-4 pt-[max(16px,env(safe-area-inset-top))]">
        <div className="flex items-center justify-between">
          <button type="button" onClick={() => window.history.back()} className="review-icon-button" aria-label="Kembali">
            <ArrowLeft className="size-5" />
          </button>
          <div className="text-center">
            <p className="text-sm font-semibold">Sortir Tamu</p>
            <p className="mt-0.5 max-w-52 truncate text-xs text-[#7b747f]">{session.reviewerName}</p>
          </div>
          <button type="button" onClick={undo} disabled={history.length === 0} className="review-icon-button disabled:opacity-30" aria-label="Urungkan keputusan terakhir">
            <RotateCcw className="size-4.5" />
          </button>
        </div>
        <div className="mt-4 flex items-center gap-3">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#e9e6ec]">
            <div className="h-full rounded-full bg-[#8b82e8] transition-[width] duration-200" style={{ width: `${progress}%` }} />
          </div>
          <span className="text-xs font-semibold tabular-nums text-[#635d67]">{Math.min(index + 1, session.items.length)} / {session.items.length}</span>
        </div>
      </header>

      <main className="relative mx-auto flex min-h-0 w-full max-w-[470px] flex-1 flex-col overflow-hidden px-4 pb-[max(16px,env(safe-area-inset-bottom))] pt-5 sm:px-5">
        <div className="relative min-h-0 flex-1">
          {nextItems.slice().reverse().map((item, reverseIndex) => {
            const depth = nextItems.length - reverseIndex;
            return (
              <div
                key={item.guestId}
                aria-hidden="true"
                className="absolute inset-x-3 bottom-3 top-0 rounded-[30px] border border-[#e7e2e8] bg-[#f8f2f4] shadow-[0_10px_28px_rgba(58,38,54,0.08)]"
                style={{
                  transform: `translateY(${depth * 8}px) scale(${1 - depth * 0.025}) rotate(${depth % 2 ? 1.6 : -1.2}deg)`,
                }}
              />
            );
          })}

          <div
            className={cn(
              "absolute inset-0 touch-none select-none overflow-hidden rounded-[30px] border border-[#ddd6df] bg-[#fffdfd] shadow-[0_18px_48px_rgba(75,48,67,0.14)]",
              drag.active ? "cursor-grabbing" : "cursor-grab",
              !drag.active && "transition-[transform,opacity] duration-200 ease-out",
              exitDirection && "opacity-0",
            )}
            style={{ transform: cardTransform }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerEnd}
            onPointerCancel={handlePointerEnd}
          >
            <div className="flex h-full min-h-[390px] flex-col">
              <div className="relative flex min-h-0 flex-1 flex-col justify-between overflow-hidden bg-[#f3e8ec] p-6 sm:p-7">
                <div className="absolute -right-16 -top-20 size-52 rounded-full border-[36px] border-[#ead8df]" aria-hidden="true" />
                <div className="absolute -bottom-28 -left-20 size-64 rounded-full border-[42px] border-[#ebe5fa]" aria-hidden="true" />
                <div className="relative flex items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/85 px-3 py-1.5 text-xs font-semibold text-[#625c67]">
                    <Users className="size-3.5" /> {guestSideLabel(current.side)}
                  </span>
                  <span className="rounded-full bg-[#27232a] px-3 py-1.5 text-xs font-semibold text-white">{current.pax} pax</span>
                </div>

                <div className="relative py-8">
                  <p className="text-xs font-semibold uppercase tracking-[0.13em] text-[#80747d]">
                    {current.type === "group" ? "Tamu grup" : "Tamu personal"}
                  </p>
                  <h1 className="mt-3 max-w-[13ch] break-words text-[clamp(2.2rem,11vw,4rem)] font-semibold leading-[1.02] tracking-[-0.038em] text-[#29242b]">
                    {current.name}
                  </h1>
                </div>

                <div className="relative flex flex-wrap gap-2">
                  {current.labels.length > 0 ? current.labels.map((label) => (
                    <span key={label} className="rounded-full border border-white/90 bg-white/70 px-3 py-1.5 text-xs font-medium text-[#5f5861]">{label}</span>
                  )) : (
                    <span className="rounded-full border border-white/90 bg-white/70 px-3 py-1.5 text-xs font-medium text-[#7b747d]">Tanpa tag</span>
                  )}
                </div>
              </div>
              <div className="bg-white px-6 py-5">
                <p className="text-sm font-semibold">Apakah tamu ini masuk daftar undangan?</p>
                <p className="mt-1 text-xs leading-5 text-[#817a84]">Geser kartu atau gunakan tombol di bawah.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 mt-4 grid grid-cols-3 gap-3 px-2">
          {(Object.keys(DECISIONS) as Decision[]).map((decision) => {
            const option = DECISIONS[decision];
            const Icon = option.icon;
            return (
              <button
                key={decision}
                type="button"
                onClick={() => saveDecision(decision)}
                className="group flex min-h-[86px] flex-col items-center justify-center gap-2 rounded-2xl px-2 text-xs font-semibold text-[#665f69] transition-transform duration-200 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-[#8b82e8] active:translate-y-0"
              >
                <span className={cn(
                  "flex size-14 items-center justify-center rounded-full border bg-white shadow-[0_7px_22px_rgba(58,38,54,0.13)] transition-[transform,box-shadow] duration-200 group-hover:scale-[1.04] group-hover:shadow-[0_10px_26px_rgba(58,38,54,0.16)]",
                  option.className,
                )}>
                  <Icon className="size-6" />
                </span>
                {option.label}
              </button>
            );
          })}
        </div>
      </main>
    </ReviewShell>
  );
}

function ReviewShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-svh bg-[#f5eef1] text-[#29242b] sm:p-5">
      <div className="mx-auto flex min-h-svh max-w-[520px] flex-col overflow-hidden bg-[#fffdfd] sm:min-h-[calc(100svh-40px)] sm:rounded-[34px] sm:border sm:border-[#e5dfe6] sm:shadow-[0_24px_70px_rgba(75,48,67,0.16)]">
        {children}
      </div>
    </div>
  );
}

function SummaryCount({ label, value, className }: { label: string; value: number; className: string }) {
  return (
    <div className={cn("rounded-2xl px-3 py-4", className)}>
      <p className="text-xl font-semibold tabular-nums">{value}</p>
      <p className="mt-1 text-xs font-medium">{label}</p>
    </div>
  );
}
