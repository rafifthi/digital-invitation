"use client";

import { useMemo, useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  ExternalLink,
  MessageCircle,
  PencilLine,
  RotateCcw,
  Search,
  Send,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useDashboard } from "@/context";
import { cn } from "@/lib/utils";
import type { GuestWithId, WABlastCampaign, WABlastRecipient } from "../types";
import { MessageTemplateDialog } from "./message-template-dialog";

type WABlastProps = {
  initialRecipientIds?: string[];
  onBack: () => void;
};

export function WABlast({ initialRecipientIds = [], onBack }: WABlastProps) {
  const {
    guests,
    language,
    invitation,
    waTemplate,
    waBlasts,
    createWABlast,
    setWABlastRecipientStatus,
  } = useDashboard();
  const [selectedRecipientIds, setSelectedRecipientIds] = useState<string[]>(initialRecipientIds);
  const [recipientDialogOpen, setRecipientDialogOpen] = useState(false);
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  const [activeCampaignId, setActiveCampaignId] = useState<string | null>(null);
  const isId = language === "ID";
  const activeCampaign = waBlasts.find((campaign) => campaign.id === activeCampaignId) ?? null;
  const selectedGuests = useMemo(() => guests.filter((guest) => selectedRecipientIds.includes(guest.id)), [guests, selectedRecipientIds]);
  const validGuests = selectedGuests.filter((guest) => isValidWhatsApp(guest.whatsapp));
  const invalidGuests = selectedGuests.filter((guest) => !isValidWhatsApp(guest.whatsapp));
  const previewGuest = validGuests[0] ?? guests.find((guest) => isValidWhatsApp(guest.whatsapp)) ?? null;

  const handleCreateQueue = () => {
    if (!waTemplate.trim() || validGuests.length === 0) return;
    const campaignId = createWABlast({ recipientIds: validGuests.map((guest) => guest.id), template: waTemplate.trim() });
    setActiveCampaignId(campaignId);
  };

  if (activeCampaign) {
    return (
      <DeliveryQueue
        campaign={activeCampaign}
        isId={isId}
        onBack={() => setActiveCampaignId(null)}
        onStatusChange={setWABlastRecipientStatus}
      />
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button type="button" variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft />
          {isId ? "Kembali ke daftar tamu" : "Back to guest list"}
        </Button>
        <p className="text-xs text-muted-foreground">
          {isId ? "Progres pengiriman tersimpan di workspace ini." : "Delivery progress is saved in this workspace."}
        </p>
      </div>

      <div className="grid grid-cols-[minmax(0,1.25fr)_minmax(320px,0.75fr)] items-start gap-5 max-[980px]:grid-cols-1">
        <div className="space-y-5">
          <Card className="overflow-hidden rounded-3xl">
            <div className="flex items-center justify-between gap-4 border-b px-5 py-4">
              <div>
                <h3 className="font-semibold">1. {isId ? "Pilih penerima" : "Choose recipients"}</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  {validGuests.length} {isId ? "nomor valid dipilih" : "valid numbers selected"}
                </p>
              </div>
              <Button type="button" variant="secondary" size="sm" onClick={() => setRecipientDialogOpen(true)}>
                <Users />
                {isId ? "Kelola penerima" : "Manage recipients"}
              </Button>
            </div>
            <CardContent className="p-5">
              <RecipientChips guests={selectedGuests} isId={isId} onOpen={() => setRecipientDialogOpen(true)} />
              {invalidGuests.length > 0 && (
                <p className="mt-3 text-xs text-[#a53a1a]">
                  {isId ? `${invalidGuests.length} nomor tidak valid tidak akan masuk antrean.` : `${invalidGuests.length} invalid numbers will be skipped.`}
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="rounded-3xl">
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-semibold">2. {isId ? "Template pesan" : "Message template"}</h3>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    {isId ? "Variabel diganti otomatis untuk setiap tamu." : "Variables are replaced automatically for every guest."}
                  </p>
                </div>
                <Button type="button" variant="secondary" size="sm" onClick={() => setTemplateDialogOpen(true)}>
                  <PencilLine /> {isId ? "Edit" : "Edit"}
                </Button>
              </div>
              <p className="mt-4 line-clamp-4 whitespace-pre-wrap rounded-2xl bg-[#fafafa] p-4 text-sm leading-6 text-[#4b4b55]">{waTemplate}</p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-5">
          <Card className="rounded-3xl">
            <CardContent className="p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground">3. {isId ? "Preview" : "Preview"}</p>
              <div className="mt-4 rounded-2xl bg-[#f1f7ef] p-4">
                <div className="flex items-center gap-2 text-xs font-medium text-[#247f3b]">
                  <MessageCircle className="size-3.5" />
                  WhatsApp · {previewGuest?.name ?? (isId ? "Belum ada penerima" : "No recipient")}
                </div>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-[#303039]">
                  {previewGuest
                    ? personalizeTemplate(waTemplate, previewGuest, invitation.customSlug)
                    : (isId ? "Pilih tamu untuk melihat pesan." : "Select a guest to preview the message.")}
                </p>
              </div>

              <div className="mt-5 space-y-2 rounded-2xl border bg-[#fafafa] p-4 text-sm">
                <SummaryRow label={isId ? "Dipilih" : "Selected"} value={selectedGuests.length} />
                <SummaryRow label={isId ? "Siap dikirim" : "Ready to send"} value={validGuests.length} />
                <SummaryRow label={isId ? "Nomor bermasalah" : "Invalid numbers"} value={invalidGuests.length} warning={invalidGuests.length > 0} />
              </div>

              <Button type="button" className="mt-5 w-full" disabled={!waTemplate.trim() || validGuests.length === 0} onClick={handleCreateQueue}>
                <Send />
                {isId ? `Buat antrean (${validGuests.length})` : `Create queue (${validGuests.length})`}
              </Button>
              <p className="mt-3 text-xs leading-5 text-muted-foreground">
                {isId
                  ? "WhatsApp akan dibuka satu per satu dengan pesan siap kirim. Setelah mengirim, tandai hasilnya agar progres tetap akurat."
                  : "WhatsApp opens one recipient at a time with a ready-to-send message. Mark each result to keep progress accurate."}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <RecipientPickerDialog
        open={recipientDialogOpen}
        onOpenChange={setRecipientDialogOpen}
        guests={guests}
        selectedIds={selectedRecipientIds}
        onSelectedIdsChange={setSelectedRecipientIds}
        isId={isId}
      />
      <MessageTemplateDialog open={templateDialogOpen} onOpenChange={setTemplateDialogOpen} />

      {waBlasts.length > 0 && (
        <section className="overflow-hidden rounded-3xl border bg-white">
          <div className="border-b px-5 py-4">
            <h3 className="font-semibold">{isId ? "Riwayat WA Blast" : "WA Blast history"}</h3>
            <p className="mt-1 text-xs text-muted-foreground">{isId ? "Buka kembali antrean untuk melanjutkan pengiriman." : "Reopen a queue to continue delivery."}</p>
          </div>
          <div className="divide-y">
            {waBlasts.map((campaign) => {
              const sent = campaign.recipients.filter((recipient) => recipient.status === "sent").length;
              return (
                <button key={campaign.id} type="button" className="flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-[#fafafa] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring" onClick={() => setActiveCampaignId(campaign.id)}>
                  <CampaignStatusIcon campaign={campaign} />
                  <span className="min-w-0 flex-1">
                    <strong className="block text-sm font-medium">{formatDate(campaign.createdAt, language)}</strong>
                    <span className="mt-0.5 block text-xs text-muted-foreground">{sent}/{campaign.recipients.length} {isId ? "terkirim" : "sent"}</span>
                  </span>
                  <CampaignStatusBadge campaign={campaign} isId={isId} />
                  <ChevronRight className="size-4 text-muted-foreground" />
                </button>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}

function RecipientChips({ guests, isId, onOpen }: { guests: GuestWithId[]; isId: boolean; onOpen: () => void }) {
  if (guests.length === 0) {
    return (
      <button type="button" onClick={onOpen} className="flex min-h-20 w-full items-center justify-center rounded-2xl border border-dashed border-[#cbc9df] bg-[#fafafa] px-4 text-sm font-medium text-muted-foreground transition-colors hover:border-[#918df6] hover:text-[#625cc7] focus-visible:ring-2 focus-visible:ring-ring">
        {isId ? "Pilih tamu untuk WA Blast" : "Choose guests for WA Blast"}
      </button>
    );
  }

  const hasOverflow = guests.length > 6;
  const visibleGuests = hasOverflow ? guests.slice(0, 5) : guests.slice(0, 6);
  const overflowCount = guests.length - visibleGuests.length;

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3" aria-label={isId ? "Penerima terpilih" : "Selected recipients"}>
      {visibleGuests.map((guest) => (
        <button key={guest.id} type="button" onClick={onOpen} title={guest.name} className="min-w-0 truncate rounded-full border border-[#dedde8] bg-[#fafafa] px-3 py-2 text-left text-xs font-medium transition-colors hover:border-[#bdb9ff] hover:bg-[#f5f4ff] focus-visible:ring-2 focus-visible:ring-ring">
          {guest.name}
        </button>
      ))}
      {overflowCount > 0 && (
        <button type="button" onClick={onOpen} className="rounded-full border border-[#c9c6ff] bg-[#f1f0ff] px-3 py-2 text-left text-xs font-semibold text-[#625cc7] transition-colors hover:bg-[#e8e6ff] focus-visible:ring-2 focus-visible:ring-ring">
          +{overflowCount} {isId ? "lainnya" : "others"}
        </button>
      )}
    </div>
  );
}

function RecipientPickerDialog({
  open,
  onOpenChange,
  guests,
  selectedIds,
  onSelectedIdsChange,
  isId,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  guests: GuestWithId[];
  selectedIds: string[];
  onSelectedIdsChange: (ids: string[]) => void;
  isId: boolean;
}) {
  const [query, setQuery] = useState("");
  const filteredGuests = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase();
    if (!needle) return guests;
    return guests.filter((guest) => [guest.name, guest.whatsapp].some((value) => value.toLocaleLowerCase().includes(needle)));
  }, [guests, query]);
  const filteredIds = filteredGuests.map((guest) => guest.id);
  const allFilteredSelected = filteredIds.length > 0 && filteredIds.every((id) => selectedIds.includes(id));

  const toggleGuest = (guestId: string) => {
    onSelectedIdsChange(selectedIds.includes(guestId)
      ? selectedIds.filter((id) => id !== guestId)
      : [...selectedIds, guestId]);
  };

  const toggleFiltered = () => {
    onSelectedIdsChange(allFilteredSelected
      ? selectedIds.filter((id) => !filteredIds.includes(id))
      : Array.from(new Set([...selectedIds, ...filteredIds])));
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) setQuery("");
    onOpenChange(nextOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[86svh] overflow-hidden p-0 sm:max-w-2xl">
        <DialogHeader className="px-6 pb-0 pt-6">
          <DialogTitle>{isId ? "Pilih penerima" : "Choose recipients"}</DialogTitle>
          <DialogDescription>
            {isId ? "Cari nama atau nomor WhatsApp, lalu pilih tamu yang akan menerima pesan." : "Search by name or WhatsApp number, then select the guests who should receive the message."}
          </DialogDescription>
        </DialogHeader>

        <div className="relative mx-6 mt-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={isId ? "Cari nama atau nomor WhatsApp" : "Search name or WhatsApp number"}
            aria-label={isId ? "Cari penerima" : "Search recipients"}
            className="pl-9"
          />
        </div>

        <div className="max-h-[390px] overflow-y-auto border-y">
          <Table>
            <TableHeader className="sticky top-0 z-10 bg-[#fafafa]">
              <TableRow>
                <TableHead className="w-12 px-4">
                  <input
                    type="checkbox"
                    checked={allFilteredSelected}
                    onChange={toggleFiltered}
                    aria-label={isId ? "Pilih semua hasil pencarian" : "Select all search results"}
                    className="size-4 rounded border-[#c8c8d0] accent-[#7772df] focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </TableHead>
                <TableHead className="px-4">{isId ? "Nama" : "Name"}</TableHead>
                <TableHead className="px-4">{isId ? "Nomor telepon" : "Phone number"}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredGuests.map((guest) => (
                <TableRow key={guest.id} data-state={selectedIds.includes(guest.id) ? "selected" : undefined}>
                  <TableCell className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(guest.id)}
                      onChange={() => toggleGuest(guest.id)}
                      aria-label={`${isId ? "Pilih" : "Select"} ${guest.name}`}
                      className="size-4 rounded border-[#c8c8d0] accent-[#7772df] focus-visible:ring-2 focus-visible:ring-ring"
                    />
                  </TableCell>
                  <TableCell className="px-4 py-3 font-medium">{guest.name}</TableCell>
                  <TableCell className="px-4 py-3 text-muted-foreground">{guest.whatsapp}</TableCell>
                </TableRow>
              ))}
              {filteredGuests.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="h-32 text-center text-sm text-muted-foreground">
                    {isId ? "Tamu tidak ditemukan." : "No guests found."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <DialogFooter className="items-center px-6 pb-6 sm:justify-between">
          <p className="text-sm text-muted-foreground">{selectedIds.length} {isId ? "tamu dipilih" : "guests selected"}</p>
          <Button type="button" onClick={() => handleOpenChange(false)}>{isId ? "Selesai" : "Done"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function DeliveryQueue({ campaign, isId, onBack, onStatusChange }: {
  campaign: WABlastCampaign;
  isId: boolean;
  onBack: () => void;
  onStatusChange: (blastId: string, guestId: string, status: "queued" | "opened" | "sent" | "failed") => void;
}) {
  const sent = campaign.recipients.filter((recipient) => recipient.status === "sent").length;
  const failed = campaign.recipients.filter((recipient) => recipient.status === "failed").length;
  const progress = campaign.recipients.length ? Math.round(((sent + failed) / campaign.recipients.length) * 100) : 0;

  const openWhatsApp = (recipient: WABlastRecipient) => {
    const url = createWhatsAppUrl(recipient.whatsapp, recipient.message);
    window.open(url, "_blank", "noopener,noreferrer");
    onStatusChange(campaign.id, recipient.guestId, "opened");
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button type="button" variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft />
          {isId ? "Kembali ke editor" : "Back to editor"}
        </Button>
        <CampaignStatusBadge campaign={campaign} isId={isId} />
      </div>

      <section className="rounded-3xl bg-[#181925] p-6 text-[#fefeff]">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.12em] text-[#aaaab7]">{isId ? "Progres pengiriman" : "Delivery progress"}</p>
            <h3 className="mt-2 text-2xl font-semibold">{sent}/{campaign.recipients.length} {isId ? "pesan terkirim" : "messages sent"}</h3>
            {failed > 0 && <p className="mt-1 text-sm text-[#ffb39a]">{failed} {isId ? "perlu dicoba ulang" : "need another attempt"}</p>}
          </div>
          <strong className="text-3xl font-semibold tabular-nums">{progress}%</strong>
        </div>
        <div className="mt-5 h-2 overflow-hidden rounded-full bg-[#30313f]">
          <div className="h-full rounded-full bg-[#918df6] transition-[width] duration-200" style={{ width: `${progress}%` }} />
        </div>
      </section>

      <section className="overflow-hidden rounded-3xl border bg-white">
        <div className="border-b px-5 py-4">
          <h3 className="font-semibold">{isId ? "Antrean penerima" : "Recipient queue"}</h3>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            {isId ? "Buka WhatsApp, kirim pesan yang sudah terisi, lalu tandai sebagai terkirim." : "Open WhatsApp, send the prefilled message, then mark it as sent."}
          </p>
        </div>
        <div className="divide-y">
          {campaign.recipients.map((recipient, index) => (
            <div key={recipient.guestId} className="flex flex-wrap items-center gap-4 px-5 py-4">
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[#f1f0ff] text-xs font-semibold text-[#625cc7]">{index + 1}</span>
              <div className="min-w-[180px] flex-1">
                <strong className="block truncate text-sm font-medium">{recipient.guestName}</strong>
                <span className="mt-0.5 block text-xs text-muted-foreground">{recipient.whatsapp}</span>
              </div>
              <RecipientStatusBadge recipient={recipient} isId={isId} />
              <div className="flex flex-wrap gap-2">
                {recipient.status === "sent" ? (
                  <Button type="button" variant="ghost" size="sm" onClick={() => onStatusChange(campaign.id, recipient.guestId, "queued")}>
                    <RotateCcw />{isId ? "Ulangi" : "Retry"}
                  </Button>
                ) : (
                  <>
                    <Button type="button" variant="secondary" size="sm" onClick={() => openWhatsApp(recipient)}>
                      <ExternalLink />{recipient.status === "opened" ? (isId ? "Buka lagi" : "Open again") : (isId ? "Buka WhatsApp" : "Open WhatsApp")}
                    </Button>
                    {recipient.status === "opened" && (
                      <Button type="button" size="sm" onClick={() => onStatusChange(campaign.id, recipient.guestId, "sent")}>
                        <Check />{isId ? "Sudah dikirim" : "Mark sent"}
                      </Button>
                    )}
                    {recipient.status === "failed" && (
                      <Button type="button" variant="ghost" size="sm" onClick={() => onStatusChange(campaign.id, recipient.guestId, "queued")}>
                        <RotateCcw />{isId ? "Coba lagi" : "Retry"}
                      </Button>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function SummaryRow({ label, value, warning = false }: { label: string; value: number; warning?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      <strong className={cn("font-semibold", warning && "text-[#b62d00]")}>{value}</strong>
    </div>
  );
}

function CampaignStatusIcon({ campaign }: { campaign: WABlastCampaign }) {
  if (campaign.status === "completed") return <span className="grid size-9 place-items-center rounded-full bg-[#def6e4] text-[#247f3b]"><CheckCircle2 className="size-4" /></span>;
  if (campaign.status === "in_progress") return <span className="grid size-9 place-items-center rounded-full bg-[#fff4d9] text-[#8f5d00]"><Clock3 className="size-4" /></span>;
  return <span className="grid size-9 place-items-center rounded-full bg-[#f1f0ff] text-[#625cc7]"><Send className="size-4" /></span>;
}

function CampaignStatusBadge({ campaign, isId }: { campaign: WABlastCampaign; isId: boolean }) {
  if (campaign.status === "completed") return <Badge className="border-0 bg-[#def6e4] text-[#247f3b]">{isId ? "Selesai" : "Completed"}</Badge>;
  if (campaign.status === "in_progress") return <Badge className="border-0 bg-[#fff4d9] text-[#8f5d00]">{isId ? "Sedang dikirim" : "In progress"}</Badge>;
  return <Badge className="border-0 bg-[#eeedff] text-[#625cc7]">{isId ? "Antrean" : "Queued"}</Badge>;
}

function RecipientStatusBadge({ recipient, isId }: { recipient: WABlastRecipient; isId: boolean }) {
  if (recipient.status === "sent") return <Badge className="border-0 bg-[#def6e4] text-[#247f3b]"><CheckCircle2 className="mr-1 size-3" />{isId ? "Terkirim" : "Sent"}</Badge>;
  if (recipient.status === "opened") return <Badge className="border-0 bg-[#fff4d9] text-[#8f5d00]"><Clock3 className="mr-1 size-3" />{isId ? "WhatsApp dibuka" : "WhatsApp opened"}</Badge>;
  if (recipient.status === "failed") return <Badge className="border-0 bg-[#fff1ec] text-[#b62d00]"><AlertCircle className="mr-1 size-3" />{isId ? "Gagal dibuka" : "Open failed"}</Badge>;
  return <Badge variant="outline">{isId ? "Menunggu" : "Queued"}</Badge>;
}

function isValidWhatsApp(value: string) {
  const digits = normalizeWhatsApp(value);
  return digits.length >= 10 && digits.length <= 15;
}

function normalizeWhatsApp(value: string) {
  return value.replace(/\D/g, "").replace(/^0/, "62");
}

function createWhatsAppUrl(phone: string, message: string) {
  return `https://wa.me/${normalizeWhatsApp(phone)}?text=${encodeURIComponent(message)}`;
}

function personalizeTemplate(template: string, guest: GuestWithId, invitationSlug: string) {
  const link = invitationSlug.startsWith("http") ? invitationSlug : `https://${invitationSlug}`;
  return template
    .replaceAll("[Guest_Name]", guest.name)
    .replaceAll("[Invitation_Link]", link);
}

function formatDate(value: string, language: "EN" | "ID") {
  return new Intl.DateTimeFormat(language === "ID" ? "id-ID" : "en-US", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Jakarta",
  }).format(new Date(value));
}
