"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Field } from "../shared";
import type { Guest } from "../types";
import type { GuestType, RSVPStatus } from "@/lib/types";

type CreateGuestFormProps = {
  onSuccess: () => void;
};

export function CreateGuestForm({ onSuccess }: CreateGuestFormProps) {
  const [form, setForm] = useState<Guest>({
    type: "personal",
    vip: false,
    salutation: "",
    name: "",
    pax: 1,
    rsvp: null,
    labels: [],
    whatsapp: "",
  });
  const [labelInput, setLabelInput] = useState("");

  const setField = <K extends keyof Guest>(field: K, value: Guest[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const addLabel = () => {
    const trimmed = labelInput.trim();
    if (trimmed && !form.labels.includes(trimmed)) {
      setField("labels", [...form.labels, trimmed]);
      setLabelInput("");
    }
  };

  const removeLabel = (label: string) => {
    setField(
      "labels",
      form.labels.filter((l) => l !== label),
    );
  };

  const handleSubmit = () => {
    if (!form.name.trim() || !form.whatsapp.trim()) return;
    setForm({
      type: "personal",
      vip: false,
      salutation: "",
      name: "",
      pax: 1,
      rsvp: null,
      labels: [],
      whatsapp: "",
    });
    setLabelInput("");
    onSuccess();
  };

  return (
    <>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Guest Type">
            <Select
              value={form.type}
              onValueChange={(v) => setField("type", v as GuestType)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="personal">Personal</SelectItem>
                <SelectItem value="group">Group</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="Pax">
            <Input
              type="number"
              min={1}
              value={form.pax}
              onChange={(e) =>
                setField("pax", Math.max(1, Number(e.target.value) || 1))
              }
            />
          </Field>
        </div>

        <div className="flex items-center justify-between rounded-lg border bg-muted/35 p-3">
          <div>
            <strong className="text-sm">VIP Guest</strong>
            <p className="mt-1 text-sm text-muted-foreground">
              Mark this guest as VIP for special treatment.
            </p>
          </div>
          <Switch
            checked={form.vip}
            onCheckedChange={(c) => setField("vip", c)}
            aria-label="VIP Guest"
            className="shrink-0"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Salutation">
            <Input
              placeholder="Mr./Mrs./Ms."
              value={form.salutation}
              onChange={(e) => setField("salutation", e.target.value)}
            />
          </Field>
          <Field label="Guest Name">
            <Input
              placeholder="Full name"
              value={form.name}
              onChange={(e) => setField("name", e.target.value)}
            />
          </Field>
        </div>

        <Field label="WhatsApp Number">
          <Input
            placeholder="+62 812 3456 7890"
            value={form.whatsapp}
            onChange={(e) => setField("whatsapp", e.target.value)}
          />
        </Field>

        <Field label="RSVP Status">
          <Select
            value={form.rsvp ?? "__null__"}
            onValueChange={(v) =>
              setField(
                "rsvp",
                v === "__null__" ? null : (v as Exclude<RSVPStatus, null>),
              )
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Belum Confirm" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__null__">Belum Confirm</SelectItem>
              <SelectItem value="Attending">Attending</SelectItem>
              <SelectItem value="Not Attending">Not Attending</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </Field>

        <div className="grid gap-2">
          <Label>Labels</Label>
          <div className="flex flex-wrap gap-2">
            {form.labels.map((label) => (
              <Badge
                key={label}
                className="cursor-pointer gap-1 pr-1.5"
                onClick={() => removeLabel(label)}
              >
                {label}
                <X className="size-3" />
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Type label and press Enter"
              value={labelInput}
              onChange={(e) => setLabelInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addLabel();
                }
              }}
            />
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={addLabel}
            >
              <Plus />
            </Button>
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={onSuccess}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!form.name.trim() || !form.whatsapp.trim()}
        >
          Save Guest
        </Button>
      </div>
    </>
  );
}
