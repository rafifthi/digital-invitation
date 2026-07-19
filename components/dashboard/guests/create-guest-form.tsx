"use client";

import { useMemo, useState } from "react";
import { Check, Plus, Tags, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useDashboard } from "@/context";
import { cn } from "@/lib/utils";
import { Field } from "../shared";
import type { Guest, GuestLabel } from "../types";
import type { GuestType, RSVPStatus } from "@/lib/types";

type CreateGuestFormProps = {
  onSubmit: (guest: Guest) => void;
  onSuccess: () => void;
};

const EMPTY_GUEST: Guest = {
  type: "personal",
  vip: false,
  salutation: "",
  name: "",
  pax: 1,
  rsvp: null,
  labels: [],
  whatsapp: "",
  wish: "",
  wishStatus: null,
  wishSubmittedAt: null,
};

export function CreateGuestForm({ onSubmit, onSuccess }: CreateGuestFormProps) {
  const { language, guestLabels, createGuestLabel, setGuestLabelColor } = useDashboard();
  const [form, setForm] = useState<Guest>(EMPTY_GUEST);
  const isId = language === "ID";

  const setField = <K extends keyof Guest>(field: K, value: Guest[K]) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = () => {
    if (!form.name.trim() || !form.whatsapp.trim()) return;
    onSubmit({ ...form, name: form.name.trim(), whatsapp: form.whatsapp.trim() });
    setForm({ ...EMPTY_GUEST, labels: [] });
    onSuccess();
  };

  return (
    <>
      <div className="grid gap-5 py-4">
        <Field label={isId ? "Tipe tamu" : "Guest type"}>
          <RadioCards
            name="guest-type"
            value={form.type}
            options={[
              { value: "personal", label: isId ? "Personal" : "Personal", description: isId ? "Satu orang" : "One person" },
              { value: "group", label: isId ? "Grup" : "Group", description: isId ? "Keluarga atau rombongan" : "Family or party" },
            ]}
            onChange={(value) => setField("type", value as GuestType)}
          />
        </Field>

        <div className="grid grid-cols-[minmax(0,1fr)_120px] gap-3 max-[520px]:grid-cols-1">
          <Field label={isId ? "Nama tamu" : "Guest name"}>
            <Input
              placeholder={isId ? "Nama lengkap" : "Full name"}
              value={form.name}
              onChange={(event) => setField("name", event.target.value)}
            />
          </Field>
          <Field label="Pax">
            <Input
              type="number"
              min={1}
              value={form.pax}
              onChange={(event) => setField("pax", Math.max(1, Number(event.target.value) || 1))}
            />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-3 max-[520px]:grid-cols-1">
          <Field label={isId ? "Sapaan" : "Salutation"}>
            <Input
              placeholder="Mr./Mrs./Ms."
              value={form.salutation}
              onChange={(event) => setField("salutation", event.target.value)}
            />
          </Field>
          <Field label={isId ? "Nomor WhatsApp" : "WhatsApp number"}>
            <Input
              placeholder="+62 812 3456 7890"
              inputMode="tel"
              value={form.whatsapp}
              onChange={(event) => setField("whatsapp", event.target.value)}
            />
          </Field>
        </div>

        <Field label="RSVP">
          <RadioCards
            name="rsvp-status"
            value={form.rsvp ?? "not-confirmed"}
            options={[
              { value: "not-confirmed", label: isId ? "Belum confirm" : "Not confirmed" },
              { value: "Attending", label: isId ? "Hadir" : "Attend" },
              { value: "Not Attending", label: isId ? "Tidak hadir" : "Not attend" },
            ]}
            onChange={(value) => setField("rsvp", value === "not-confirmed" ? null : value as RSVPStatus)}
          />
        </Field>

        <MultiTagPicker
          labels={guestLabels}
          selected={form.labels}
          language={language}
          onChange={(labels) => setField("labels", labels)}
          onCreate={createGuestLabel}
          onColorChange={setGuestLabelColor}
        />

        <div className="flex items-center justify-between rounded-xl border bg-[#fafafa] p-4">
          <div>
            <strong className="text-sm">{isId ? "Tamu VIP" : "VIP guest"}</strong>
            <p className="mt-1 text-sm text-muted-foreground">
              {isId ? "Tandai untuk kebutuhan perlakuan khusus." : "Mark this guest for special handling."}
            </p>
          </div>
          <Switch
            checked={form.vip}
            onCheckedChange={(checked) => setField("vip", checked)}
            aria-label={isId ? "Tamu VIP" : "VIP guest"}
            className="shrink-0"
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 border-t pt-4">
        <Button type="button" variant="outline" onClick={onSuccess}>{isId ? "Batal" : "Cancel"}</Button>
        <Button type="button" onClick={handleSubmit} disabled={!form.name.trim() || !form.whatsapp.trim()}>
          {isId ? "Simpan tamu" : "Save guest"}
        </Button>
      </div>
    </>
  );
}

function RadioCards({
  name,
  value,
  options,
  onChange,
}: {
  name: string;
  value: string;
  options: Array<{ value: string; label: string; description?: string }>;
  onChange: (value: string) => void;
}) {
  return (
    <div className={cn("grid gap-2 max-[520px]:grid-cols-1", options.length === 2 ? "grid-cols-2" : "grid-cols-3")} role="radiogroup">
      {options.map((option) => {
        const selected = value === option.value;
        return (
          <label
            key={option.value}
            className={cn(
              "flex min-h-11 cursor-pointer items-center gap-3 rounded-xl border bg-white px-3 py-2.5 transition-colors hover:bg-[#fafafa] focus-within:ring-2 focus-within:ring-ring",
              selected && "border-[#bdb9ff] bg-[#faf9ff]",
            )}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={selected}
              onChange={() => onChange(option.value)}
              className="size-4 accent-[#7772df]"
            />
            <span className="min-w-0">
              <strong className="block text-sm font-medium">{option.label}</strong>
              {option.description && <span className="block text-xs text-muted-foreground">{option.description}</span>}
            </span>
          </label>
        );
      })}
    </div>
  );
}

function MultiTagPicker({
  labels,
  selected,
  language,
  onChange,
  onCreate,
  onColorChange,
}: {
  labels: GuestLabel[];
  selected: string[];
  language: "EN" | "ID";
  onChange: (labels: string[]) => void;
  onCreate: (name: string) => GuestLabel;
  onColorChange: (id: string, color: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const isId = language === "ID";
  const matchingLabels = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase();
    return labels.filter((label) => !needle || label.name.toLocaleLowerCase().includes(needle));
  }, [labels, query]);
  const exactMatch = labels.some((label) => label.name.toLocaleLowerCase() === query.trim().toLocaleLowerCase());

  const toggleLabel = (name: string) => {
    onChange(selected.includes(name) ? selected.filter((label) => label !== name) : [...selected, name]);
  };

  const createAndSelect = () => {
    const name = query.trim();
    if (!name) return;
    const created = onCreate(name);
    if (!selected.includes(created.name)) onChange([...selected, created.name]);
    setQuery("");
    setOpen(true);
  };

  return (
    <div className="grid gap-2">
      <Label>{isId ? "Label" : "Labels"}</Label>
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selected.map((name) => {
            const definition = labels.find((label) => label.name === name);
            return (
              <button
                key={name}
                type="button"
                onClick={() => toggleLabel(name)}
                className="flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium focus-visible:ring-2 focus-visible:ring-ring"
                style={{ borderColor: definition ? `${definition.color}55` : undefined, backgroundColor: definition ? `${definition.color}14` : undefined }}
                aria-label={`${isId ? "Hapus label" : "Remove label"} ${name}`}
              >
                <span className="size-2 rounded-full" style={{ backgroundColor: definition?.color ?? "#999999" }} />
                {name}
                <X className="size-3" />
              </button>
            );
          })}
        </div>
      )}

      <div
        className="relative"
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOpen(false);
        }}
      >
        <div className="relative">
          <Tags className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => { setQuery(event.target.value); setOpen(true); }}
            onFocus={() => setOpen(true)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && query.trim() && !exactMatch) {
                event.preventDefault();
                createAndSelect();
              }
            }}
            role="combobox"
            aria-expanded={open}
            aria-controls="guest-label-options"
            aria-autocomplete="list"
            placeholder={isId ? "Cari atau buat label" : "Search or create labels"}
            className="pl-9"
          />
        </div>

        {open && (
          <div id="guest-label-options" role="listbox" aria-multiselectable="true" className="absolute inset-x-0 top-[calc(100%+6px)] z-30 max-h-64 overflow-y-auto rounded-xl border bg-white p-1.5 shadow-[0_8px_24px_rgba(24,25,37,0.10)]">
            {matchingLabels.map((label) => {
              const checked = selected.includes(label.name);
              return (
                <div key={label.id} className="flex items-center gap-1 rounded-lg hover:bg-[#fafafa]">
                  <button
                    type="button"
                    role="option"
                    aria-selected={checked}
                    onClick={() => toggleLabel(label.name)}
                    className="flex min-w-0 flex-1 items-center gap-3 rounded-lg px-2.5 py-2 text-left text-sm focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <span className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: label.color }} />
                    <span className="truncate">{label.name}</span>
                    {checked && <Check className="ml-auto size-4 shrink-0 text-[#625cc7]" />}
                  </button>
                  <label className="mr-2 grid size-7 cursor-pointer place-items-center rounded-full hover:bg-[#ededf2]" title={`${isId ? "Ubah warna" : "Change color"} ${label.name}`}>
                    <input
                      type="color"
                      value={label.color}
                      onChange={(event) => onColorChange(label.id, event.target.value)}
                      className="sr-only"
                      aria-label={`${isId ? "Ubah warna" : "Change color"} ${label.name}`}
                    />
                    <span className="size-4 rounded-full border border-black/10" style={{ backgroundColor: label.color }} />
                  </label>
                </div>
              );
            })}

            {query.trim() && !exactMatch && (
              <button type="button" onClick={createAndSelect} className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm font-medium hover:bg-[#fafafa] focus-visible:ring-2 focus-visible:ring-ring">
                <Plus className="size-4 text-[#625cc7]" />
                {isId ? `Tambah “${query.trim()}”` : `Add “${query.trim()}”`}
              </button>
            )}

            {!query.trim() && matchingLabels.length === 0 && (
              <p className="px-3 py-5 text-center text-sm text-muted-foreground">{isId ? "Ketik untuk membuat label pertama." : "Type to create the first label."}</p>
            )}
          </div>
        )}
      </div>
      <p className="text-xs text-muted-foreground">
        {isId ? "Ketik untuk mencari, tekan Enter untuk membuat. Klik titik warna untuk menggantinya." : "Type to search, press Enter to create. Select a color dot to change it."}
      </p>
    </div>
  );
}
