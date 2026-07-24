"use client";

import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import {
  AlertTriangle,
  Check,
  CheckCircle2,
  CircleStop,
  ClipboardCheck,
  Eye,
  FileImage,
  FileText,
  MessageCircle,
  Printer,
  SearchCheck,
  Upload,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useDashboard } from "@/context";
import {
  calculateGuestCapacity,
  capacityState,
  guestSideFilterLabel,
} from "@/lib/guest-planning";
import { cn } from "@/lib/utils";
import type {
  GuestPlanningStatus,
  GuestReviewAttachment,
  GuestReviewFilterSide,
  GuestReviewSession,
} from "../types";

const CAPACITY_STATE_COPY = {
  sorting: {
    id: "Belum selesai",
    en: "Sorting in progress",
    className: "border-[#d9d7ff] bg-[#f5f4ff] text-[#514ba5]",
  },
  safe: {
    id: "Aman",
    en: "On track",
    className: "border-[#b7dfc0] bg-[#edf9f0] text-[#247f3b]",
  },
  decision: {
    id: "Perlu keputusan",
    en: "Needs a decision",
    className: "border-[#efd18a] bg-[#fff8e5] text-[#8a6512]",
  },
  over: {
    id: "Melebihi kapasitas",
    en: "Over capacity",
    className: "border-[#efc0b4] bg-[#fff1ec] text-[#b62d00]",
  },
} as const;

export function GuestCapacityPlanner() {
  const { guests, capacityPlan, setCapacityPlan, language } = useDashboard();
  const isId = language === "ID";
  const metrics = useMemo(() => calculateGuestCapacity(guests), [guests]);
  const state = capacityState(metrics, capacityPlan.maxPax);
  const stateCopy = CAPACITY_STATE_COPY[state];
  const bridePercent = 100 - capacityPlan.groomPercent;
  const groomTarget = Math.round(capacityPlan.maxPax * capacityPlan.groomPercent / 100);
  const brideTarget = capacityPlan.maxPax - groomTarget;
  const groomDelta = metrics.potentialBySide.groom - groomTarget;
  const brideDelta = metrics.potentialBySide.bride - brideTarget;
  const progress = Math.min(100, Math.round(metrics.potential / capacityPlan.maxPax * 100));

  return (
    <Card className="overflow-hidden rounded-3xl">
      <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(280px,0.6fr)]">
        <div className="min-w-0">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.09em] text-muted-foreground">
                {isId ? "Rencana kapasitas" : "Capacity plan"}
              </p>
              <div className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                <span className="text-2xl font-semibold tabular-nums">{metrics.potential.toLocaleString("id-ID")}</span>
                <span className="text-sm text-muted-foreground">
                  {isId ? `dari ${capacityPlan.maxPax.toLocaleString("id-ID")} pax potensial` : `of ${capacityPlan.maxPax.toLocaleString("en-US")} potential pax`}
                </span>
              </div>
            </div>
            <Badge variant="outline" className={cn("px-3 py-1", stateCopy.className)}>
              {isId ? stateCopy.id : stateCopy.en}
            </Badge>
          </div>

          <div className="mt-5 h-2 overflow-hidden rounded-full bg-[#ececf0]" aria-hidden="true">
            <div
              className={cn(
                "h-full rounded-full transition-[width,background-color] duration-200",
                state === "over" ? "bg-[#d94b21]" : state === "decision" ? "bg-[#d89613]" : "bg-[#7772df]",
              )}
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-[140px_minmax(0,1fr)] sm:items-end">
            <label className="block">
              <span className="text-xs font-medium text-muted-foreground">{isId ? "Cap keseluruhan" : "Overall cap"}</span>
              <Input
                className="mt-1.5 font-semibold tabular-nums"
                type="number"
                min={1}
                max={100000}
                value={capacityPlan.maxPax}
                onChange={(event) => setCapacityPlan({ maxPax: Number(event.target.value) || 1 })}
              />
            </label>
            <div>
              <div className="flex justify-between gap-4 text-sm font-medium">
                <span>{isId ? "Pihak pria" : "Groom"} <b className="tabular-nums">{capacityPlan.groomPercent}%</b></span>
                <span>{isId ? "Pihak wanita" : "Bride"} <b className="tabular-nums">{bridePercent}%</b></span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                step={5}
                value={capacityPlan.groomPercent}
                onChange={(event) => setCapacityPlan({ groomPercent: Number(event.target.value) })}
                aria-label={isId ? "Persentase alokasi pihak pria" : "Groom-side allocation percentage"}
                className="capacity-range mt-3 w-full"
                style={{ "--capacity-progress": `${capacityPlan.groomPercent}%` } as CSSProperties}
              />
              <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                <span className="tabular-nums">{groomTarget.toLocaleString("id-ID")} pax</span>
                <span className="tabular-nums">{brideTarget.toLocaleString("id-ID")} pax</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-5 gap-y-4 border-t pt-5 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
          <CapacityFact label={isId ? "Disetujui" : "Approved"} value={metrics.approved} tone="positive" />
          <CapacityFact label={isId ? "Tinjau lagi" : "Review"} value={metrics.review} tone="warning" />
          <CapacityFact label={isId ? "Belum disortir" : "Not sorted"} value={metrics.candidate} />
          <CapacityFact label={isId ? "Maksimum saat ini" : "Current maximum"} value={metrics.maximum} />
          {(groomDelta > 0 || brideDelta > 0) && (
            <div className="col-span-2 flex gap-2 rounded-2xl border border-[#efd18a] bg-[#fffaf0] p-3 text-xs leading-5 text-[#75550e]">
              <AlertTriangle className="mt-0.5 size-4 shrink-0" />
              <p>
                {groomDelta > 0
                  ? (isId ? `Pihak pria ${groomDelta} pax di atas target fleksibel.` : `Groom side is ${groomDelta} pax over its flexible target.`)
                  : (isId ? `Pihak wanita ${brideDelta} pax di atas target fleksibel.` : `Bride side is ${brideDelta} pax over its flexible target.`)}
              </p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

function CapacityFact({
  label,
  value,
  tone = "neutral",
}: {
  label: string;
  value: number;
  tone?: "neutral" | "positive" | "warning";
}) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={cn(
        "mt-1 text-lg font-semibold tabular-nums",
        tone === "positive" && "text-[#247f3b]",
        tone === "warning" && "text-[#8a6512]",
      )}>
        {value.toLocaleString("id-ID")} <span className="text-xs font-medium text-muted-foreground">pax</span>
      </p>
    </div>
  );
}

export function CreateReviewSessionDialog({
  open,
  onOpenChange,
  guestIds,
  onCreated,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  guestIds: string[];
  onCreated?: (token: string) => void;
}) {
  const { guests, guestLabels, language, createGuestReviewSession } = useDashboard();
  const isId = language === "ID";
  const selectedGuests = guests.filter((guest) => guestIds.includes(guest.id));
  const [reviewerName, setReviewerName] = useState("");
  const [filterSide, setFilterSide] = useState<GuestReviewFilterSide>("all");
  const [filterLabels, setFilterLabels] = useState<string[]>([]);
  const availableLabels = Array.from(new Set(selectedGuests.flatMap((guest) => guest.labels)));
  const filteredGuests = selectedGuests.filter((guest) => (
    (filterSide === "all" || guest.side === filterSide)
    && (filterLabels.length === 0 || filterLabels.some((label) => guest.labels.includes(label)))
  ));
  const selectedPax = filteredGuests.reduce((total, guest) => total + guest.pax, 0);

  useEffect(() => {
    if (!open) return;
    setFilterSide("all");
    setFilterLabels([]);
  }, [open]);

  const toggleLabel = (label: string) => {
    setFilterLabels((current) => current.includes(label)
      ? current.filter((item) => item !== label)
      : [...current, label]);
  };

  const createSession = () => {
    if (!reviewerName.trim() || filteredGuests.length === 0) return;
    const token = createGuestReviewSession({
      reviewerName,
      filterSide,
      filterLabels,
      guestIds: filteredGuests.map((guest) => guest.id),
    });
    setReviewerName("");
    onOpenChange(false);
    onCreated?.(token);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{isId ? "Buat sesi sortir" : "Create sorting session"}</DialogTitle>
          <DialogDescription>
            {isId
              ? `${filteredGuests.length} kandidat, ${selectedPax} pax akan masuk ke Card Sorting dan Print/PDF.`
              : `${filteredGuests.length} candidates, ${selectedPax} pax will be included in Card Sorting and Print/PDF.`}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-5 py-2">
          <label>
            <span className="text-sm font-medium">{isId ? "Nama reviewer" : "Reviewer name"}</span>
            <Input
              className="mt-2"
              value={reviewerName}
              onChange={(event) => setReviewerName(event.target.value)}
              placeholder={isId ? "Contoh: Orang Tua Pria" : "Example: Groom's parents"}
              maxLength={80}
              autoFocus
            />
          </label>

          <fieldset>
            <legend className="text-sm font-medium">{isId ? "Tampilkan pihak" : "Show side"}</legend>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {(["all", "groom", "bride"] as const).map((value) => (
                <button
                  key={value}
                  type="button"
                  aria-pressed={filterSide === value}
                  onClick={() => setFilterSide(value)}
                  className={cn(
                    "min-h-11 rounded-2xl border px-3 text-center text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-ring",
                    filterSide === value ? "border-[#918df6] bg-[#f3f2ff] text-[#4f49a5]" : "hover:bg-muted",
                  )}
                >
                  {guestSideFilterLabel(value, isId)}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="text-sm font-medium">{isId ? "Tampilkan label" : "Show labels"}</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              <button
                type="button"
                aria-pressed={filterLabels.length === 0}
                onClick={() => setFilterLabels([])}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:ring-ring",
                  filterLabels.length === 0 ? "border-[#918df6] bg-[#f3f2ff] text-[#4f49a5]" : "hover:bg-muted",
                )}
              >
                {isId ? "Semua label" : "All labels"}
              </button>
              {availableLabels.map((label) => {
                const color = guestLabels.find((item) => item.name === label)?.color ?? "#77727e";
                const active = filterLabels.includes(label);
                return (
                  <button
                    key={label}
                    type="button"
                    aria-pressed={active}
                    onClick={() => toggleLabel(label)}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:ring-ring",
                      active ? "border-[#918df6] bg-[#f3f2ff] text-[#4f49a5]" : "hover:bg-muted",
                    )}
                  >
                    <span className="size-1.5 rounded-full" style={{ backgroundColor: color }} />
                    {label}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-y py-3 text-sm">
            <span className="font-medium">{isId ? "Otomatis tersedia:" : "Automatically available:"}</span>
            <span className="inline-flex items-center gap-2 text-muted-foreground">
              <Eye className="size-4" /> Card Sorting
            </span>
            <span className="inline-flex items-center gap-2 text-muted-foreground">
              <Printer className="size-4" /> Print / PDF
            </span>
          </div>

          {filteredGuests.length === 0 && (
            <p className="text-sm text-[#b62d00]">
              {isId ? "Tidak ada kandidat yang cocok dengan filter ini." : "No candidates match these filters."}
            </p>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
            {isId ? "Kembali" : "Go back"}
          </Button>
          <Button type="button" onClick={createSession} disabled={!reviewerName.trim() || filteredGuests.length === 0}>
            <ClipboardCheck className="size-4" />
            {isId ? "Buat sesi" : "Create session"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function GuestReviewSessions({ onCreate }: { onCreate: () => void }) {
  const { reviewSessions, language } = useDashboard();
  const [reconcileToken, setReconcileToken] = useState<string | null>(null);
  const [endToken, setEndToken] = useState<string | null>(null);
  const isId = language === "ID";
  const reconcileSession = reviewSessions.find((session) => session.token === reconcileToken) ?? null;
  const endSession = reviewSessions.find((session) => session.token === endToken) ?? null;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="max-w-xl text-sm text-muted-foreground">
          {isId ? "Setiap sesi otomatis memiliki Card Sorting interaktif dan versi Print/PDF." : "Every session automatically includes interactive Card Sorting and a Print/PDF version."}
        </p>
        <Button type="button" size="sm" onClick={onCreate}>
          <ClipboardCheck className="size-4" />
          {isId ? "Buat sesi dari semua kandidat" : "Create session from all candidates"}
        </Button>
      </div>

      {reviewSessions.length === 0 ? (
        <Card className="rounded-3xl px-6 py-12 text-center">
          <SearchCheck className="mx-auto size-6 text-muted-foreground" />
          <p className="mt-3 text-sm font-semibold">{isId ? "Belum ada sesi sortir" : "No sorting sessions yet"}</p>
          <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
            {isId ? "Pilih kandidat, filter berdasarkan pihak atau label, lalu buat kedua format sekaligus." : "Select candidates, filter by side or label, then create both formats at once."}
          </p>
        </Card>
      ) : (
        <div className="divide-y overflow-hidden rounded-3xl border bg-card">
          {reviewSessions.map((session) => (
            <ReviewSessionRow
              key={session.id}
              session={session}
              isId={isId}
              onReconcile={() => setReconcileToken(session.token)}
              onEnd={() => setEndToken(session.token)}
            />
          ))}
        </div>
      )}

      <ReconcileReviewDialog
        session={reconcileSession}
        open={reconcileSession !== null}
        onOpenChange={(open) => { if (!open) setReconcileToken(null); }}
      />
      <EndReviewSessionDialog
        session={endSession}
        open={endSession !== null}
        onOpenChange={(open) => { if (!open) setEndToken(null); }}
      />
    </div>
  );
}

function ReviewSessionRow({
  session,
  isId,
  onReconcile,
  onEnd,
}: {
  session: GuestReviewSession;
  isId: boolean;
  onReconcile: () => void;
  onEnd: () => void;
}) {
  const decided = session.items.filter((item) => item.decision !== "candidate").length;
  const progress = session.items.length ? Math.round(decided / session.items.length * 100) : 0;
  const filterSide = session.filterSide ?? session.side;
  const filterLabels = session.filterLabels ?? [];

  const reviewUrl = () => `${window.location.origin}/review/${session.token}`;
  const shareWhatsApp = () => {
    const message = isId
      ? `Mohon bantu Card Sorting daftar calon tamu ${session.reviewerName}. Buka di sini: ${reviewUrl()}`
      : `Please help with Card Sorting for ${session.reviewerName}: ${reviewUrl()}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  };

  return (
    <article className="grid gap-5 p-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="truncate font-semibold">{session.reviewerName}</h3>
          <Badge variant="outline">{guestSideFilterLabel(filterSide, isId)}</Badge>
          {filterLabels.slice(0, 2).map((label) => <Badge key={label} variant="outline">{label}</Badge>)}
          {filterLabels.length > 2 && <Badge variant="outline">+{filterLabels.length - 2}</Badge>}
          <Badge variant="outline" className={cn(
            session.status === "completed" && "border-[#b7dfc0] bg-[#edf9f0] text-[#247f3b]",
            session.status === "reconciling" && "border-[#efd18a] bg-[#fff8e5] text-[#8a6512]",
            session.status === "closed" && "border-[#d7d7dc] bg-[#f3f3f5] text-[#66666f]",
          )}>
            {session.status === "closed"
              ? (isId ? "Diakhiri" : "Ended")
              : session.status === "completed"
              ? (isId ? "Selesai" : "Completed")
              : session.status === "reconciling"
                ? (isId ? "Rekonsiliasi" : "Reconciling")
                : (isId ? "Aktif" : "Active")}
          </Badge>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          {decided} / {session.items.length} {isId ? "kandidat diputuskan" : "candidates decided"}
        </p>
        <div className="mt-3 h-1.5 max-w-md overflow-hidden rounded-full bg-muted">
          <div className="h-full rounded-full bg-[#7772df] transition-[width] duration-200" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 sm:justify-end">
        <Button asChild variant="outline" size="sm">
          <a href={`/review/${session.token}`} target="_blank" rel="noopener noreferrer">
            <Eye className="size-4" /> {session.status === "closed" ? (isId ? "Lihat hasil" : "View results") : "Card Sorting"}
          </a>
        </Button>
        <Button asChild variant="outline" size="sm">
          <a href={`/review/${session.token}/print`} target="_blank" rel="noopener noreferrer">
            <Printer className="size-4" /> PDF
          </a>
        </Button>
        {session.status !== "closed" && (
          <>
            <Button type="button" variant="outline" size="sm" onClick={shareWhatsApp}>
              <MessageCircle className="size-4" /> Send WA
            </Button>
            <Button type="button" variant="secondary" size="sm" onClick={onReconcile}>
              <Upload className="size-4" /> {isId ? "Rekonsiliasi" : "Reconcile"}
            </Button>
            <Button type="button" variant="ghost" size="sm" className="text-[#b62d00] hover:bg-[#fff1ec] hover:text-[#9b2600]" onClick={onEnd}>
              <CircleStop className="size-4" /> {isId ? "Akhiri" : "End"}
            </Button>
          </>
        )}
      </div>
    </article>
  );
}

function EndReviewSessionDialog({
  session,
  open,
  onOpenChange,
}: {
  session: GuestReviewSession | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { language, setGuestReviewSessionStatus } = useDashboard();
  const isId = language === "ID";

  if (!session) return null;
  const undecided = session.items.filter((item) => item.decision === "candidate").length;
  const hasUndecided = undecided > 0;

  const endSession = () => {
    setGuestReviewSessionStatus(session.token, "closed");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isId ? "Akhiri sesi sortir?" : "End sorting session?"}</DialogTitle>
          <DialogDescription>
            {isId
              ? `Sesi untuk ${session.reviewerName} tidak akan menerima keputusan baru setelah diakhiri.`
              : `${session.reviewerName}'s session will no longer accept new decisions after it ends.`}
          </DialogDescription>
        </DialogHeader>

        {hasUndecided ? (
          <div className="flex gap-3 rounded-2xl border border-[#efd18a] bg-[#fff8e5] p-4 text-[#7b5b14]">
            <AlertTriangle className="mt-0.5 size-5 shrink-0" />
            <div>
              <p className="text-sm font-semibold">
                {isId ? `${undecided} tamu belum diputuskan` : `${undecided} guests are still undecided`}
              </p>
              <p className="mt-1 text-sm leading-5">
                {isId
                  ? "Jika sesi diakhiri sekarang, mereka tetap berada di Guest List sebagai belum disortir."
                  : "If you end now, they will remain in the Guest List as not sorted."}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex gap-3 rounded-2xl border border-[#b7dfc0] bg-[#edf9f0] p-4 text-[#247f3b]">
            <CheckCircle2 className="mt-0.5 size-5 shrink-0" />
            <p className="text-sm leading-5">
              {isId
                ? "Semua tamu sudah memiliki keputusan. Hasil terakhir akan tetap tersimpan."
                : "Every guest has a decision. The latest results will remain saved."}
            </p>
          </div>
        )}

        <DialogFooter>
          <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
            {isId ? "Batal" : "Cancel"}
          </Button>
          <Button type="button" variant="outline" className="border-[#d94b31] bg-[#d94b31] text-white hover:bg-[#bf3d27] hover:text-white" onClick={endSession}>
            <CircleStop className="size-4" />
            {hasUndecided
              ? (isId ? `Akhiri dengan ${undecided} belum diputuskan` : `End with ${undecided} undecided`)
              : (isId ? "Akhiri sesi" : "End session")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ReconcileReviewDialog({
  session,
  open,
  onOpenChange,
}: {
  session: GuestReviewSession | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const {
    language,
    addGuestReviewAttachment,
    setGuestReviewDecision,
    setGuestReviewSessionStatus,
  } = useDashboard();
  const [activeAttachmentId, setActiveAttachmentId] = useState<string | null>(null);
  const [fileError, setFileError] = useState("");
  const isId = language === "ID";

  if (!session) return null;
  const activeAttachment = session.attachments.find((attachment) => attachment.id === activeAttachmentId)
    ?? session.attachments[0]
    ?? null;
  const decided = session.items.filter((item) => item.decision !== "candidate").length;

  const uploadFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    setFileError("");
    const remainingSlots = Math.max(0, 4 - session.attachments.length);
    if (remainingSlots === 0) {
      setFileError(isId ? "Maksimal empat lampiran per sesi pada demo lokal." : "The local demo supports up to four attachments per session.");
      return;
    }

    try {
      const selected = Array.from(files).slice(0, remainingSlots);
      for (const file of selected) {
        const dataUrl = await fileToStoredDataUrl(file);
        const attachment: GuestReviewAttachment = {
          id: `attachment-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          name: file.name,
          type: file.type,
          dataUrl,
          uploadedAt: new Date().toISOString(),
        };
        addGuestReviewAttachment(session.token, attachment);
        setActiveAttachmentId(attachment.id);
      }
    } catch (error) {
      setFileError(error instanceof Error ? error.message : (isId ? "File tidak dapat diproses." : "The file could not be processed."));
    }
  };

  const finishReconciliation = () => {
    setGuestReviewSessionStatus(session.token, decided === session.items.length ? "completed" : "reconciling");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-[92svh] max-h-[92svh] flex-col overflow-y-auto p-0 sm:max-w-5xl lg:overflow-hidden">
        <div className="border-b px-6 py-5">
          <DialogHeader>
            <DialogTitle>{isId ? "Rekonsiliasi hasil cetak" : "Reconcile printed results"}</DialogTitle>
            <DialogDescription>
              {isId
                ? "Unggah foto atau PDF bertanda, lalu salin keputusan ke daftar di samping."
                : "Upload the marked photo or PDF, then copy each decision into the list."}
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="grid min-h-0 flex-1 lg:grid-cols-[minmax(0,0.95fr)_minmax(360px,1.05fr)]">
          <div className="min-h-[280px] border-b bg-[#f7f7f9] p-4 lg:border-b-0 lg:border-r">
            <label className="flex min-h-20 cursor-pointer items-center justify-center gap-3 rounded-2xl border border-dashed bg-white px-4 text-sm font-medium text-[#514ba5] hover:bg-[#faf9ff] focus-within:ring-2 focus-within:ring-ring">
              <Upload className="size-4" />
              {isId ? "Unggah foto atau PDF" : "Upload photo or PDF"}
              <input
                className="sr-only"
                type="file"
                accept="image/*,application/pdf"
                multiple
                onChange={(event) => void uploadFiles(event.target.files)}
              />
            </label>
            {fileError && <p className="mt-2 text-xs text-[#b62d00]" role="alert">{fileError}</p>}

            {session.attachments.length > 0 && (
              <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                {session.attachments.map((attachment) => (
                  <button
                    key={attachment.id}
                    type="button"
                    onClick={() => setActiveAttachmentId(attachment.id)}
                    className={cn(
                      "flex min-w-0 items-center gap-2 rounded-full border bg-white px-3 py-2 text-xs focus-visible:ring-2 focus-visible:ring-ring",
                      activeAttachment?.id === attachment.id && "border-[#918df6] bg-[#f3f2ff]",
                    )}
                  >
                    {attachment.type === "application/pdf" ? <FileText className="size-3.5" /> : <FileImage className="size-3.5" />}
                    <span className="max-w-36 truncate">{attachment.name}</span>
                  </button>
                ))}
              </div>
            )}

            <div className="mt-3 h-[240px] overflow-hidden rounded-2xl border bg-white sm:h-[320px] lg:h-[min(48vh,540px)]">
              {activeAttachment ? (
                activeAttachment.type === "application/pdf" ? (
                  <iframe title={activeAttachment.name} src={activeAttachment.dataUrl} className="h-full w-full" />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={activeAttachment.dataUrl} alt={activeAttachment.name} className="h-full w-full object-contain" />
                )
              ) : (
                <div className="flex h-full flex-col items-center justify-center px-6 text-center text-muted-foreground">
                  <FileImage className="size-6" />
                  <p className="mt-2 text-sm font-medium">{isId ? "Lampiran belum diunggah" : "No attachment uploaded"}</p>
                  <p className="mt-1 max-w-xs text-xs">{isId ? "Foto akan tampil di sini sebagai referensi saat memasukkan keputusan." : "The photo will appear here while you enter decisions."}</p>
                </div>
              )}
            </div>
          </div>

          <div className="min-h-0">
            <div className="flex items-center justify-between border-b px-5 py-3">
              <p className="text-sm font-medium">{decided} / {session.items.length} {isId ? "selesai" : "completed"}</p>
              <Badge variant="outline">{session.reviewerName}</Badge>
            </div>
            <div className="max-h-[58vh] divide-y overflow-y-auto">
              {session.items.map((item) => (
                <div key={item.guestId} className="grid gap-3 px-5 py-4 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-center">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{item.name}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{item.pax} pax · {item.type === "group" ? (isId ? "Grup" : "Group") : (isId ? "Personal" : "Personal")}</p>
                  </div>
                  <DecisionButtons
                    value={item.decision}
                    isId={isId}
                    compact
                    onChange={(decision) => setGuestReviewDecision(session.token, item.guestId, decision)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 z-10 flex items-center justify-between gap-3 border-t bg-white px-6 py-4">
          <p className="text-xs text-muted-foreground">
            {isId ? "Tamu yang dicoret tetap tersimpan dan dapat dikembalikan." : "Removed guests stay saved and can be restored."}
          </p>
          <Button type="button" onClick={finishReconciliation}>
            <CheckCircle2 className="size-4" />
            {isId ? "Simpan rekonsiliasi" : "Save reconciliation"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function DecisionButtons({
  value,
  onChange,
  isId,
  compact = false,
}: {
  value: GuestPlanningStatus;
  onChange: (decision: GuestPlanningStatus) => void;
  isId: boolean;
  compact?: boolean;
}) {
  const options = [
    {
      value: "approved" as const,
      label: isId ? "Setuju" : "Approve",
      icon: Check,
      active: "border-[#77bd87] bg-[#edf9f0] text-[#247f3b]",
    },
    {
      value: "review" as const,
      label: isId ? "Tinjau lagi" : "Review",
      icon: Eye,
      active: "border-[#e0b553] bg-[#fff8e5] text-[#8a6512]",
    },
    {
      value: "removed" as const,
      label: isId ? "Coret" : "Remove",
      icon: X,
      active: "border-[#df927f] bg-[#fff1ec] text-[#b62d00]",
    },
  ];

  return (
    <div className="flex flex-wrap gap-1.5" role="group" aria-label={isId ? "Keputusan tamu" : "Guest decision"}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          aria-pressed={value === option.value}
          className={cn(
            "inline-flex min-h-9 items-center justify-center gap-1.5 rounded-full border px-3 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:ring-ring",
            value === option.value ? option.active : "bg-white text-muted-foreground hover:bg-muted",
            compact && "px-2.5",
          )}
        >
          <option.icon className="size-3.5" />
          {option.label}
        </button>
      ))}
    </div>
  );
}

async function fileToStoredDataUrl(file: File) {
  if (file.type === "application/pdf") {
    if (file.size > 1_500_000) {
      throw new Error("PDF terlalu besar untuk demo lokal. Gunakan file di bawah 1,5 MB.");
    }
    return readFileAsDataUrl(file);
  }
  if (!file.type.startsWith("image/")) {
    throw new Error("Gunakan file gambar atau PDF.");
  }

  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, 1600 / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));
  const context = canvas.getContext("2d");
  if (!context) {
    bitmap.close();
    throw new Error("Gambar tidak dapat diproses di browser ini.");
  }
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  return canvas.toDataURL("image/jpeg", 0.72);
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("File tidak dapat dibaca."));
    reader.readAsDataURL(file);
  });
}
