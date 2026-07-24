"use client";

import { useMemo, useState } from "react";
import {
  Check,
  ClipboardCheck,
  Copy,
  ListPlus,
  MessageCircle,
  MessageSquareText,
  RotateCcw,
  Search,
  Trash2,
  User,
  UserMinus,
  Users,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useDashboard } from "@/context";
import { RSVP_STATUS_STYLES } from "@/lib/constants";
import { invitationUrl } from "@/lib/invitation-url";
import { guestSideLabel } from "@/lib/guest-planning";
import { MessageTemplateDialog } from "./message-template-dialog";
import type { GuestLabel, GuestWithId } from "../types";

type GuestStatusTab = "guest-list" | "removed" | "review";

type GuestListProps = {
  onAddGuest: () => void;
  onStartBlast: (recipientIds: string[]) => void;
  onStartReview: (guestIds: string[]) => void;
};

export function GuestList({ onAddGuest, onStartBlast, onStartReview }: GuestListProps) {
  const {
    guests,
    guestLabels,
    language,
    invitation,
    waTemplate,
    deleteGuests,
    setGuestsPlanningStatus,
  } = useDashboard();
  const [selectedGuestId, setSelectedGuestId] = useState<string | null>(null);
  const [selectedRecipientIds, setSelectedRecipientIds] = useState<string[]>([]);
  const [copiedGuestId, setCopiedGuestId] = useState<string | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [statusTab, setStatusTab] = useState<GuestStatusTab>("guest-list");
  const isId = language === "ID";
  const selectedGuest = guests.find((guest) => guest.id === selectedGuestId) ?? null;
  const statusTabs: Array<{ id: GuestStatusTab; label: string; count: number }> = [
    {
      id: "guest-list",
      label: "Guest List",
      count: guests.filter((guest) => guest.planningStatus !== "removed" && guest.planningStatus !== "review").length,
    },
    { id: "removed", label: "Removed", count: guests.filter((guest) => guest.planningStatus === "removed").length },
    { id: "review", label: "To Review", count: guests.filter((guest) => guest.planningStatus === "review").length },
  ];
  const filteredGuests = useMemo(() => {
    const guestsInTab = guests.filter((guest) => {
      if (statusTab === "removed") return guest.planningStatus === "removed";
      if (statusTab === "review") return guest.planningStatus === "review";
      return guest.planningStatus !== "removed" && guest.planningStatus !== "review";
    });
    const needle = query.trim().toLocaleLowerCase();
    if (!needle) return guestsInTab;
    return guestsInTab.filter((guest) => [
      guest.name,
      guest.whatsapp,
      guestSideLabel(guest.side, isId),
      ...guest.labels,
    ]
      .some((value) => value.toLocaleLowerCase().includes(needle)));
  }, [guests, isId, query, statusTab]);
  const allVisibleSelected = filteredGuests.length > 0
    && filteredGuests.every((guest) => selectedRecipientIds.includes(guest.id));

  const toggleRecipient = (guestId: string) => {
    setDeleteConfirmation(false);
    setSelectedRecipientIds((current) => current.includes(guestId)
      ? current.filter((id) => id !== guestId)
      : [...current, guestId]);
  };

  const toggleAllVisible = () => {
    const visibleIds = filteredGuests.map((guest) => guest.id);
    setDeleteConfirmation(false);
    setSelectedRecipientIds((current) => allVisibleSelected
      ? current.filter((id) => !visibleIds.includes(id))
      : Array.from(new Set([...current, ...visibleIds])));
  };

  const copyGuestMessage = async (guest: GuestWithId) => {
    try {
      await navigator.clipboard.writeText(buildGuestMessage(guest, invitation.customSlug, waTemplate));
      setCopiedGuestId(guest.id);
      window.setTimeout(() => setCopiedGuestId((current) => current === guest.id ? null : current), 1400);
    } catch {
      setCopiedGuestId(null);
    }
  };

  const removeSelectedGuests = () => {
    deleteGuests(selectedRecipientIds);
    setSelectedRecipientIds([]);
    setDeleteConfirmation(false);
  };

  const changeStatusTab = (nextTab: GuestStatusTab) => {
    setStatusTab(nextTab);
    setSelectedRecipientIds([]);
    setDeleteConfirmation(false);
  };

  const moveSelectedGuests = (planningStatus: GuestWithId["planningStatus"]) => {
    setGuestsPlanningStatus(selectedRecipientIds, planningStatus);
    setSelectedRecipientIds([]);
    setDeleteConfirmation(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {guests.length} {isId ? "tamu" : "total guests"}
        </p>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="secondary" size="sm" onClick={() => setTemplateDialogOpen(true)}>
            <MessageSquareText className="size-4" />
            {isId ? "Edit template pesan" : "Edit message template"}
          </Button>
          <Button onClick={onAddGuest} size="sm">
            <User className="size-4" />
            {isId ? "Tambah tamu" : "Add guest"}
          </Button>
        </div>
      </div>

      <div className="flex max-w-full gap-1 overflow-x-auto rounded-2xl border bg-muted/25 p-1" role="tablist" aria-label={isId ? "Filter status tamu" : "Guest status filters"}>
        {statusTabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={statusTab === tab.id}
            onClick={() => changeStatusTab(tab.id)}
            className={`inline-flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
              statusTab === tab.id
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:bg-background/60 hover:text-foreground"
            }`}
          >
            {tab.label}
            <span className={`rounded-full px-1.5 py-0.5 text-[11px] leading-none ${
              statusTab === tab.id ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      <div className="flex min-h-10 flex-wrap items-center gap-3">
        <div className="relative w-full max-w-md sm:min-w-72 sm:flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={isId ? "Cari nama, pihak, atau label" : "Search name, side, or label"}
            aria-label={isId ? "Cari tamu" : "Search guests"}
            className="pl-9"
          />
        </div>

        {selectedRecipientIds.length > 0 && (
          <div className="ml-auto flex flex-wrap items-center justify-end gap-2" aria-live="polite">
            {deleteConfirmation ? (
              <>
                <p className="mr-1 text-sm font-medium">
                  {isId ? `Hapus permanen ${selectedRecipientIds.length} tamu?` : `Permanently delete ${selectedRecipientIds.length} guests?`}
                </p>
                <Button type="button" variant="ghost" size="sm" onClick={() => setDeleteConfirmation(false)}>
                  <X className="size-4" /> {isId ? "Batal" : "Cancel"}
                </Button>
                <Button type="button" variant="outline" size="sm" className="border-[#efc0b4] text-[#b62d00] hover:bg-[#fff1ec] hover:text-[#9b2600]" onClick={removeSelectedGuests}>
                  <Trash2 className="size-4" /> {isId ? "Hapus permanen" : "Delete permanently"}
                </Button>
              </>
            ) : (
              <>
                <p className="mr-1 text-sm font-medium">
                  {selectedRecipientIds.length} {isId ? "tamu dipilih" : "guests selected"}
                </p>
                {statusTab !== "removed" && (
                  <Button type="button" size="sm" variant="secondary" onClick={() => onStartReview(selectedRecipientIds)}>
                    <ClipboardCheck className="size-4" /> Card Sorting
                  </Button>
                )}
                {statusTab === "guest-list" && (
                  <Button type="button" size="sm" onClick={() => onStartBlast(selectedRecipientIds)}>
                    <MessageCircle className="size-4" /> WA Blast
                  </Button>
                )}
                {statusTab === "review" && (
                  <Button type="button" size="sm" onClick={() => moveSelectedGuests("approved")}>
                    <ListPlus className="size-4" /> {isId ? "Masuk Guest List" : "Add to Guest List"}
                  </Button>
                )}
                {statusTab === "removed" && (
                  <Button type="button" size="sm" onClick={() => moveSelectedGuests("approved")}>
                    <RotateCcw className="size-4" /> {isId ? "Pulihkan ke Guest List" : "Restore to Guest List"}
                  </Button>
                )}
                {statusTab === "guest-list" && (
                  <Button type="button" variant="outline" size="sm" onClick={() => moveSelectedGuests("review")}>
                    <Search className="size-4" /> {isId ? "Tinjau lagi" : "To Review"}
                  </Button>
                )}
                {statusTab !== "removed" && (
                  <Button type="button" variant="outline" size="sm" className="border-[#efc0b4] text-[#b62d00] hover:bg-[#fff1ec] hover:text-[#9b2600]" onClick={() => moveSelectedGuests("removed")}>
                    <UserMinus className="size-4" /> {isId ? "Coret" : "Remove"}
                  </Button>
                )}
                {statusTab === "removed" && (
                  <Button type="button" variant="outline" size="sm" className="border-[#efc0b4] text-[#b62d00] hover:bg-[#fff1ec] hover:text-[#9b2600]" onClick={() => setDeleteConfirmation(true)}>
                    <Trash2 className="size-4" /> {isId ? "Hapus permanen" : "Delete permanently"}
                  </Button>
                )}
              </>
            )}
          </div>
        )}
      </div>

      <Card className="overflow-hidden rounded-3xl">
        <div className="overflow-x-auto max-[760px]:hidden">
          <Table className="min-w-[920px]">
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <SelectionCheckbox
                    checked={allVisibleSelected}
                    onChange={toggleAllVisible}
                    label={isId ? "Pilih semua tamu yang tampil" : "Select all visible guests"}
                  />
                </TableHead>
                <TableHead>{isId ? "Tamu" : "Guest"}</TableHead>
                <TableHead>Pax</TableHead>
                <TableHead>RSVP</TableHead>
                <TableHead>{isId ? "Label" : "Labels"}</TableHead>
                <TableHead className="text-right">{isId ? "Aksi" : "Actions"}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredGuests.map((guest) => (
                <TableRow
                  key={guest.id}
                  data-state={selectedRecipientIds.includes(guest.id) ? "selected" : undefined}
                  className="cursor-pointer focus-within:bg-muted/50 hover:bg-muted/35"
                  onClick={() => setSelectedGuestId(guest.id)}
                >
                  <TableCell onClick={(event) => event.stopPropagation()}>
                    <SelectionCheckbox
                      checked={selectedRecipientIds.includes(guest.id)}
                      onChange={() => toggleRecipient(guest.id)}
                      label={`${isId ? "Pilih" : "Select"} ${guest.name}`}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex min-w-0 items-center gap-3">
                      <SideAvatar side={guest.side} isId={isId} />
                      <div className="min-w-0">
                        <p className="truncate font-medium">
                          {guest.salutation && <span className="mr-1 text-muted-foreground">{guest.salutation}</span>}
                          {guest.name}
                        </p>
                        <p className="mt-1 truncate text-xs text-muted-foreground">{guest.whatsapp}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{guest.pax}</TableCell>
                  <TableCell><RsvpBadge status={guest.rsvp} isId={isId} /></TableCell>
                  <TableCell>
                    <ColoredLabels names={guest.labels} definitions={guestLabels} isId={isId} />
                  </TableCell>
                  <TableCell onClick={(event) => event.stopPropagation()}>
                    <GuestActions
                      guest={guest}
                      isId={isId}
                      copied={copiedGuestId === guest.id}
                      onSend={() => sendGuestWhatsApp(guest, invitation.customSlug, waTemplate)}
                      onCopy={() => void copyGuestMessage(guest)}
                    />
                  </TableCell>
                </TableRow>
              ))}
              {filteredGuests.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-40 text-center">
                    <Users className="mx-auto size-5 text-muted-foreground" />
                    <p className="mt-2 text-sm font-medium">{isId ? "Tamu tidak ditemukan" : "No guests found"}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{isId ? "Coba kata kunci lain." : "Try another search term."}</p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="hidden divide-y max-[760px]:block">
          {filteredGuests.map((guest) => (
            <div key={guest.id} className="grid grid-cols-[auto_minmax(0,1fr)] gap-3 px-4 py-4">
              <SelectionCheckbox
                checked={selectedRecipientIds.includes(guest.id)}
                onChange={() => toggleRecipient(guest.id)}
                label={`${isId ? "Pilih" : "Select"} ${guest.name}`}
              />
              <div className="min-w-0">
                <button type="button" className="w-full text-left focus-visible:ring-2 focus-visible:ring-ring" onClick={() => setSelectedGuestId(guest.id)}>
                  <div className="flex items-start gap-3">
                    <span className="flex min-w-0 items-center gap-3">
                      <SideAvatar side={guest.side} isId={isId} size="large" />
                      <span className="min-w-0">
                        <span className="block truncate font-medium">{guest.salutation} {guest.name}</span>
                        <span className="mt-1 block truncate text-sm text-muted-foreground">{guest.whatsapp} · {guest.pax} pax</span>
                      </span>
                    </span>
                  </div>
                </button>
                <div className="mt-3"><ColoredLabels names={guest.labels} definitions={guestLabels} isId={isId} /></div>
                <div className="mt-3">
                  <GuestActions
                    guest={guest}
                    isId={isId}
                    copied={copiedGuestId === guest.id}
                    onSend={() => sendGuestWhatsApp(guest, invitation.customSlug, waTemplate)}
                    onCopy={() => void copyGuestMessage(guest)}
                  />
                </div>
              </div>
            </div>
          ))}
          {filteredGuests.length === 0 && (
            <div className="px-5 py-12 text-center">
              <Users className="mx-auto size-5 text-muted-foreground" />
              <p className="mt-2 text-sm font-medium">{isId ? "Tamu tidak ditemukan" : "No guests found"}</p>
            </div>
          )}
        </div>
      </Card>

      <Sheet open={selectedGuest !== null} onOpenChange={(open) => { if (!open) setSelectedGuestId(null); }}>
        <SheetContent side="right" className="overflow-y-auto sm:max-w-md">
          {selectedGuest && (
            <>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-3">
                  <SideAvatar side={selectedGuest.side} isId={isId} size="large" />
                  <span>{selectedGuest.salutation} {selectedGuest.name}</span>
                </SheetTitle>
                <SheetDescription>{isId ? "Detail tamu dan status RSVP" : "Guest details and RSVP status"}</SheetDescription>
              </SheetHeader>
              <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-5">
                <DetailRow label={isId ? "Tipe tamu" : "Guest type"}>
                  <Badge variant="outline" className="capitalize">
                    {selectedGuest.type === "personal" ? <User className="mr-1 size-3" /> : <Users className="mr-1 size-3" />}
                    {selectedGuest.type}
                  </Badge>
                </DetailRow>
                <DetailRow label="Pax"><span className="text-sm font-semibold">{selectedGuest.pax}</span></DetailRow>
                <DetailRow label="RSVP"><RsvpBadge status={selectedGuest.rsvp} isId={isId} /></DetailRow>
                <DetailRow label="WhatsApp"><span className="text-sm">{selectedGuest.whatsapp}</span></DetailRow>
                <DetailRow label={isId ? "Label" : "Labels"} className="col-span-2">
                  <ColoredLabels names={selectedGuest.labels} definitions={guestLabels} isId={isId} />
                </DetailRow>
              </div>
              <div className="mt-7">
                <GuestActions
                  guest={selectedGuest}
                  isId={isId}
                  copied={copiedGuestId === selectedGuest.id}
                  wide
                  onSend={() => sendGuestWhatsApp(selectedGuest, invitation.customSlug, waTemplate)}
                  onCopy={() => void copyGuestMessage(selectedGuest)}
                />
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
      <MessageTemplateDialog open={templateDialogOpen} onOpenChange={setTemplateDialogOpen} />
    </div>
  );
}

function SideAvatar({
  side,
  isId,
  size = "default",
}: {
  side: GuestWithId["side"];
  isId: boolean;
  size?: "default" | "large";
}) {
  const label = guestSideLabel(side, isId);
  const initial = side === "groom" ? (isId ? "P" : "G") : (isId ? "W" : "B");

  return (
    <span
      role="img"
      aria-label={label}
      title={label}
      className={`inline-flex shrink-0 items-center justify-center rounded-full border font-semibold ${
        size === "large" ? "size-9 text-sm" : "size-8 text-xs"
      } ${
        side === "groom"
          ? "border-[#d7d3ff] bg-[#f4f2ff] text-[#514ba5]"
          : "border-[#f0d7c9] bg-[#fff6ef] text-[#9a572d]"
      }`}
    >
      {initial}
    </span>
  );
}

function GuestActions({
  guest,
  isId,
  copied,
  wide = false,
  onSend,
  onCopy,
}: {
  guest: GuestWithId;
  isId: boolean;
  copied: boolean;
  wide?: boolean;
  onSend: () => void;
  onCopy: () => void;
}) {
  return (
    <div className={`flex items-center gap-2 ${wide ? "w-full" : "justify-end"}`}>
      <Button type="button" size="sm" variant="outline" className={wide ? "flex-1" : undefined} onClick={onSend} disabled={!guest.whatsapp.trim()}>
        <MessageCircle className="size-4" /> {isId ? "Kirim WA" : "Send WA"}
      </Button>
      <Button type="button" size="sm" variant="ghost" className={wide ? "flex-1" : undefined} onClick={onCopy}>
        {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
        {copied ? (isId ? "Disalin" : "Copied") : (isId ? "Salin" : "Copy")}
      </Button>
    </div>
  );
}

function ColoredLabels({ names, definitions, isId }: { names: string[]; definitions: GuestLabel[]; isId: boolean }) {
  if (names.length === 0) return <span className="text-sm text-muted-foreground">{isId ? "Tanpa label" : "No labels"}</span>;
  return (
    <div className="flex flex-wrap gap-1.5">
      {names.map((name) => {
        const color = definitions.find((label) => label.name === name)?.color ?? "#77727e";
        return (
          <span key={name} className="inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs font-medium" style={{ borderColor: `${color}55`, backgroundColor: `${color}14` }}>
            <span className="size-1.5 rounded-full" style={{ backgroundColor: color }} />
            {name}
          </span>
        );
      })}
    </div>
  );
}

function RsvpBadge({ status, isId }: { status: GuestWithId["rsvp"]; isId: boolean }) {
  if (!status) {
    return <Badge variant="outline" className="border-[#ead9aa] bg-[#fff9e8] text-[#8a6512] transition-none">{isId ? "Belum confirm" : "Not confirmed"}</Badge>;
  }
  const label = status === "Attending" ? (isId ? "Hadir" : "Attend") : (isId ? "Tidak hadir" : "Not attend");
  return <Badge variant="outline" className={`${RSVP_STATUS_STYLES[status]} transition-none`}>{label}</Badge>;
}

function buildGuestMessage(guest: GuestWithId, invitationHost: string, template: string) {
  return template
    .replaceAll("[Guest_Name]", guest.name)
    .replaceAll("[Invitation_Link]", invitationUrl(invitationHost));
}

function sendGuestWhatsApp(guest: GuestWithId, invitationHost: string, template: string) {
  const number = guest.whatsapp.replace(/\D/g, "").replace(/^0/, "62");
  if (!number) return;
  window.open(`https://wa.me/${number}?text=${encodeURIComponent(buildGuestMessage(guest, invitationHost, template))}`, "_blank", "noopener,noreferrer");
}

function SelectionCheckbox({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) {
  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      aria-label={label}
      className="size-4 shrink-0 cursor-pointer rounded border-[#c8c8d0] accent-[#7772df] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    />
  );
}

function DetailRow({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">{label}</p>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}
