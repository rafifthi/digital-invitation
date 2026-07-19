"use client";

import { useMemo, useState } from "react";
import {
  CheckCircle2,
  Clock3,
  Eye,
  EyeOff,
  Grid2X2,
  MessageCircleHeart,
  Search,
  Table2,
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
import { useDashboard } from "@/context";
import { cn } from "@/lib/utils";
import type { GuestWithId } from "../types";

type WishFilter = "all" | "review" | "published";
type WishView = "table" | "cards";

export function WishManagement() {
  const { guests, language, setGuestWishStatus } = useDashboard();
  const [filter, setFilter] = useState<WishFilter>("all");
  const [view, setView] = useState<WishView>("table");
  const [query, setQuery] = useState("");
  const isId = language === "ID";
  const wishes = useMemo(() => guests.filter((guest) => Boolean(guest.wish.trim())), [guests]);
  const counts = useMemo(() => ({
    all: wishes.length,
    review: wishes.filter((guest) => guest.wishStatus === "review").length,
    published: wishes.filter((guest) => guest.wishStatus === "published").length,
  }), [wishes]);
  const filteredWishes = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase();
    return wishes.filter((guest) => {
      const matchesStatus = filter === "all" || guest.wishStatus === filter;
      const matchesQuery = !needle || guest.name.toLocaleLowerCase().includes(needle) || guest.wish.toLocaleLowerCase().includes(needle);
      return matchesStatus && matchesQuery;
    });
  }, [filter, query, wishes]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {counts.all} {isId ? "ucapan masuk" : "wishes received"}
          <span className="mx-2 text-[#d6d6dc]">•</span>
          {counts.review} {isId ? "perlu direview" : "need review"}
        </p>
        <ViewToggle value={view} onChange={setView} isId={isId} />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative min-w-[240px] max-w-md flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={isId ? "Cari nama atau isi ucapan" : "Search guest or wish"}
            aria-label={isId ? "Cari ucapan" : "Search wishes"}
            className="pl-9"
          />
        </div>
        <div className="flex max-w-full gap-1 overflow-x-auto rounded-full bg-[#f0f0f3] p-1" aria-label={isId ? "Filter status ucapan" : "Wish status filters"}>
          <FilterButton active={filter === "all"} onClick={() => setFilter("all")}>{isId ? "Semua" : "All"} <span>{counts.all}</span></FilterButton>
          <FilterButton active={filter === "review"} onClick={() => setFilter("review")}>{isId ? "Perlu review" : "Needs review"} <span>{counts.review}</span></FilterButton>
          <FilterButton active={filter === "published"} onClick={() => setFilter("published")}>{isId ? "Dipublikasikan" : "Published"} <span>{counts.published}</span></FilterButton>
        </div>
      </div>

      {filteredWishes.length === 0 ? (
        <EmptyWishes isId={isId} hasQuery={Boolean(query.trim()) || filter !== "all"} />
      ) : view === "table" ? (
        <WishTable guests={filteredWishes} isId={isId} onStatusChange={setGuestWishStatus} />
      ) : (
        <WishCards guests={filteredWishes} isId={isId} onStatusChange={setGuestWishStatus} />
      )}
    </div>
  );
}

function WishTable({ guests, isId, onStatusChange }: {
  guests: GuestWithId[];
  isId: boolean;
  onStatusChange: (id: string, status: "review" | "published") => void;
}) {
  return (
    <Card className="overflow-hidden rounded-3xl">
      <Table className="min-w-[720px]">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[22%]">{isId ? "Nama" : "Name"}</TableHead>
            <TableHead>{isId ? "Ucapan" : "Wish"}</TableHead>
            <TableHead className="w-[250px] text-right">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {guests.map((guest) => (
            <TableRow key={guest.id}>
              <TableCell className="font-medium">{guest.name}</TableCell>
              <TableCell className="max-w-[540px]"><p className="line-clamp-2 leading-5 text-[#54545d]">“{guest.wish}”</p></TableCell>
              <TableCell>
                <div className="flex items-center justify-end gap-2">
                  <WishStatusBadge status={guest.wishStatus} isId={isId} />
                  <WishAction guest={guest} isId={isId} onStatusChange={onStatusChange} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}

function WishCards({ guests, isId, onStatusChange }: {
  guests: GuestWithId[];
  isId: boolean;
  onStatusChange: (id: string, status: "review" | "published") => void;
}) {
  return (
    <div className="grid grid-cols-3 gap-3 max-[1020px]:grid-cols-2 max-[680px]:grid-cols-1">
      {guests.map((guest) => (
        <article key={guest.id} className="flex h-full flex-col rounded-2xl border bg-white p-4">
          <div className="flex items-start justify-between gap-3">
            <h3 className="min-w-0 truncate text-sm font-semibold">{guest.name}</h3>
            <WishStatusBadge status={guest.wishStatus} isId={isId} />
          </div>
          <blockquote className="mt-3 line-clamp-3 flex-1 text-sm leading-6 text-[#484850]">“{guest.wish}”</blockquote>
          <div className="mt-3 flex justify-end border-t pt-3">
            <WishAction guest={guest} isId={isId} onStatusChange={onStatusChange} />
          </div>
        </article>
      ))}
    </div>
  );
}

function WishAction({ guest, isId, onStatusChange }: {
  guest: GuestWithId;
  isId: boolean;
  onStatusChange: (id: string, status: "review" | "published") => void;
}) {
  return guest.wishStatus === "published" ? (
    <Button type="button" variant="secondary" size="sm" onClick={() => onStatusChange(guest.id, "review")}>
      <EyeOff />{isId ? "Tarik" : "Unpublish"}
    </Button>
  ) : (
    <Button type="button" size="sm" onClick={() => onStatusChange(guest.id, "published")}>
      <Eye />{isId ? "Publikasikan" : "Publish"}
    </Button>
  );
}

function ViewToggle({ value, onChange, isId }: { value: WishView; onChange: (view: WishView) => void; isId: boolean }) {
  return (
    <div className="flex gap-1 rounded-full bg-[#f0f0f3] p-1" role="group" aria-label={isId ? "Mode tampilan ucapan" : "Wish view mode"}>
      <button type="button" aria-pressed={value === "table"} onClick={() => onChange("table")} className={cn("grid size-8 place-items-center rounded-full text-muted-foreground transition-colors focus-visible:ring-2 focus-visible:ring-ring", value === "table" && "bg-white text-[#303039] shadow-[0_1px_2px_rgba(24,25,37,0.08)]")} aria-label={isId ? "Tampilan tabel" : "Table view"}><Table2 className="size-4" /></button>
      <button type="button" aria-pressed={value === "cards"} onClick={() => onChange("cards")} className={cn("grid size-8 place-items-center rounded-full text-muted-foreground transition-colors focus-visible:ring-2 focus-visible:ring-ring", value === "cards" && "bg-white text-[#303039] shadow-[0_1px_2px_rgba(24,25,37,0.08)]")} aria-label={isId ? "Tampilan kartu" : "Card view"}><Grid2X2 className="size-4" /></button>
    </div>
  );
}

function FilterButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" aria-pressed={active} onClick={onClick} className={cn("flex shrink-0 items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors focus-visible:ring-2 focus-visible:ring-ring", active && "bg-white text-[#303039] shadow-[0_1px_2px_rgba(24,25,37,0.08)]")}>
      {children}
    </button>
  );
}

function WishStatusBadge({ status, isId }: { status: "review" | "published" | null; isId: boolean }) {
  if (status === "published") return <Badge className="border-0 bg-[#def6e4] text-[#247f3b]"><CheckCircle2 className="mr-1 size-3" />{isId ? "Dipublikasikan" : "Published"}</Badge>;
  return <Badge className="border-0 bg-[#fff4d9] text-[#8f5d00]"><Clock3 className="mr-1 size-3" />{isId ? "Perlu review" : "Needs review"}</Badge>;
}

function EmptyWishes({ isId, hasQuery }: { isId: boolean; hasQuery: boolean }) {
  return (
    <div className="rounded-3xl border border-dashed bg-white px-5 py-16 text-center">
      <MessageCircleHeart className="mx-auto size-6 text-muted-foreground" />
      <h3 className="mt-3 font-semibold">{hasQuery ? (isId ? "Ucapan tidak ditemukan" : "No matching wishes") : (isId ? "Belum ada ucapan" : "No wishes yet")}</h3>
      <p className="mx-auto mt-1 max-w-sm text-sm leading-6 text-muted-foreground">
        {hasQuery ? (isId ? "Ubah filter atau kata kunci pencarian." : "Change the filter or search term.") : (isId ? "Ucapan dari form RSVP akan masuk ke halaman ini untuk direview." : "Wishes from the RSVP form will appear here for review.")}
      </p>
    </div>
  );
}
