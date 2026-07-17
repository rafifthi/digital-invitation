"use client";

import { useState } from "react";
import { Crown, User, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
import { RSVP_STATUS_STYLES, RSVP_LABELS } from "@/lib/constants";
import { useGuests } from "@/hooks/useGuests";

type GuestListProps = {
  onAddGuest: () => void;
};

export function GuestList({ onAddGuest }: GuestListProps) {
  const { guests } = useGuests();
  const [selectedGuest, setSelectedGuest] = useState<(typeof guests)[number] | null>(null);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            {guests.length} total guests
          </p>
        </div>
        <Button onClick={onAddGuest} size="sm">
          <User className="size-4" />
          Add Guest
        </Button>
      </div>

      <Card className="overflow-hidden rounded-3xl">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Guest</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Pax</TableHead>
              <TableHead>Labels</TableHead>
              <TableHead>RSVP</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {guests.map((guest) => (
              <TableRow
                key={guest.id}
                className="cursor-pointer focus-within:bg-muted/50"
                onClick={() => setSelectedGuest(guest)}
              >
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    {guest.vip && (
                      <Crown className="size-3.5 text-amber-500" />
                    )}
                    {guest.salutation && (
                      <span className="text-muted-foreground">
                        {guest.salutation}
                      </span>
                    )}
                    {guest.name}
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  <Badge variant="outline" className="capitalize">
                    {guest.type === "personal" ? (
                      <User className="mr-1 size-3" />
                    ) : (
                      <Users className="mr-1 size-3" />
                    )}
                    {guest.type}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {guest.pax}
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {guest.labels.map((label) => (
                      <Badge key={label} variant="secondary" className="text-xs">
                        {label}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  {guest.rsvp ? (
                    <Badge className={RSVP_STATUS_STYLES[guest.rsvp]}>
                      {RSVP_LABELS[guest.rsvp]}
                    </Badge>
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      Belum Confirm
                    </span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Sheet
        open={selectedGuest !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedGuest(null);
        }}
      >
        <SheetContent side="right" className="sm:max-w-md">
          {selectedGuest && (
            <>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  {selectedGuest.vip && (
                    <Crown className="size-5 text-amber-500" />
                  )}
                  {selectedGuest.salutation} {selectedGuest.name}
                </SheetTitle>
                <SheetDescription>Guest details</SheetDescription>
              </SheetHeader>
              <div className="mt-6 grid gap-5">
                <DetailRow label="Guest Type">
                  <Badge variant="outline" className="capitalize">
                    {selectedGuest.type === "personal" ? (
                      <User className="mr-1 size-3" />
                    ) : (
                      <Users className="mr-1 size-3" />
                    )}
                    {selectedGuest.type}
                  </Badge>
                </DetailRow>

                <DetailRow label="VIP Status">
                  {selectedGuest.vip ? (
                    <Badge className="bg-[#fff4d9] text-[#8f5d00]">
                      <Crown className="mr-1 size-3" />
                      VIP
                    </Badge>
                  ) : (
                    <span className="text-sm text-muted-foreground">Regular</span>
                  )}
                </DetailRow>

                <DetailRow label="Salutation">
                  <span className="text-sm">
                    {selectedGuest.salutation || (
                      <span className="italic text-muted-foreground">Not set</span>
                    )}
                  </span>
                </DetailRow>

                <DetailRow label="Pax">
                  <span className="text-sm font-bold">
                    {selectedGuest.pax} {selectedGuest.pax > 1 ? "people" : "person"}
                  </span>
                </DetailRow>

                <DetailRow label="RSVP Status">
                  {selectedGuest.rsvp ? (
                    <Badge className={RSVP_STATUS_STYLES[selectedGuest.rsvp]}>
                      {RSVP_LABELS[selectedGuest.rsvp]}
                    </Badge>
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      Belum Confirm
                    </span>
                  )}
                </DetailRow>

                <DetailRow label="Labels">
                  <div className="flex flex-wrap gap-1">
                    {selectedGuest.labels.length > 0 ? (
                      selectedGuest.labels.map((label) => (
                        <Badge key={label} variant="secondary" className="text-xs">
                          {label}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-sm italic text-muted-foreground">
                        No labels
                      </span>
                    )}
                  </div>
                </DetailRow>

                <DetailRow label="WhatsApp">
                  <span className="text-sm font-mono">
                    {selectedGuest.whatsapp}
                  </span>
                </DetailRow>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function DetailRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <div className="mt-1">{children}</div>
    </div>
  );
}
