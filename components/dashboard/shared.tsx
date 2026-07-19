"use client";

import type { ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import type { SectionId } from "./types";
import type { Language } from "@/lib/types";
import { tr } from "@/lib/i18n";
import { blockText } from "@/lib/templates";

export function SectionHeading({
  eyebrow,
  title,
  action,
}: {
  eyebrow: string;
  title: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-end justify-between gap-4 pb-2 max-[560px]:items-stretch max-[560px]:flex-col">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.12em] text-[#999999]">
          {eyebrow}
        </p>
        <h2 className="mt-1 text-2xl font-semibold tracking-[-0.03em]">{title}</h2>
      </div>
      {action}
    </div>
  );
}

export function AccordionSection({
  id,
  index,
  isOpen,
  isVisible,
  onToggleOpen,
  onToggleVisible,
  language,
  children,
}: {
  id: SectionId;
  index?: number;
  isOpen: boolean;
  isVisible: boolean;
  onToggleOpen: () => void;
  onToggleVisible: (checked: boolean) => void;
  language: Language;
  children: ReactNode;
}) {
  return (
    <Card
      className={cn(
        "overflow-hidden transition-[border-color,box-shadow] duration-200",
        isOpen && "border-primary/60 shadow-[0_8px_24px_rgba(24,25,37,0.05)]",
      )}
    >
      <div className="p-3">
        <button
          type="button"
          onClick={onToggleOpen}
          className="flex h-10 w-full min-w-0 items-center justify-between rounded-xl px-2 text-left font-medium transition-colors hover:bg-[#fafafa] focus-visible:ring-2 focus-visible:ring-ring"
          aria-expanded={isOpen}
        >
          <span className="flex min-w-0 items-center gap-3">
            {typeof index === "number" && (
              <span className="grid size-7 shrink-0 place-items-center rounded-full bg-[#f1f0ff] text-[11px] font-semibold text-[#625cc7]">
                {String(index + 1).padStart(2, "0")}
              </span>
            )}
            <span className="truncate">{blockText(id, language).label}</span>
          </span>
          <ChevronDown
            className={cn(
              "size-4 shrink-0 text-muted-foreground transition-transform",
              isOpen && "rotate-180",
            )}
          />
        </button>
        <div className="mt-1 flex items-center justify-between gap-3 rounded-xl bg-[#f7f6ff] px-3 py-2.5">
          <span className="text-xs font-medium text-[#625cc7]">
            {language === "ID" ? "Tampilkan bagian ini" : "Show this section"}
          </span>
          <div className="flex shrink-0 items-center gap-2">
            <span className="hidden text-xs text-muted-foreground min-[480px]:inline">
            {isVisible
              ? language === "ID" ? "Tampil" : "Shown"
              : language === "ID" ? "Tersembunyi" : "Hidden"}
            </span>
            <Switch
              data-testid={`section-visibility-${id}`}
              checked={isVisible}
              onCheckedChange={onToggleVisible}
              aria-label={`${tr(language, "showSection")}: ${blockText(id, language).label}`}
            />
          </div>
        </div>
      </div>
      {isOpen && (
        <CardContent className="grid gap-4 border-t bg-[#fdfdff] p-5">
          <p className="text-sm leading-5 text-muted-foreground">
            {blockText(id, language).description}
          </p>
          {children}
        </CardContent>
      )}
    </Card>
  );
}

export function ToggleRow({
  title,
  description,
  checked,
  onCheckedChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex min-h-16 items-center justify-between gap-4 rounded-xl border bg-[#fafafa] p-4 max-[560px]:items-start">
      <div>
        <strong className="text-sm font-medium">{title}</strong>
        <p className="mt-1 text-sm leading-5 text-muted-foreground">{description}</p>
      </div>
      <Switch
        checked={checked}
        onCheckedChange={onCheckedChange}
        aria-label={title}
        className="shrink-0"
      />
    </div>
  );
}

export function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="grid gap-2">
      <Label>{label}</Label>
      {children}
    </div>
  );
}

export function UploadField({
  label,
  text,
  compact,
}: {
  label: string;
  text: string;
  compact?: boolean;
}) {
  return (
    <div className="grid gap-2">
      <Label>{label}</Label>
      <input type="file" className="sr-only" />
      <span
        className={cn(
          "grid min-h-[74px] cursor-pointer place-items-center rounded-lg border border-dashed border-[#c9c7f8] bg-[#fafaff] text-sm font-medium text-[#666666] transition-colors hover:border-primary hover:bg-[#f4f3ff]",
          compact && "min-h-10",
        )}
      >
        {text}
      </span>
    </div>
  );
}

export function PreviewCard({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <section className="m-3 rounded-2xl border border-[#e8e8e8] bg-white p-5 text-center">
      <p className="text-xs font-semibold uppercase tracking-widest text-[#666666]">
        {label}
      </p>
      {children}
    </section>
  );
}
