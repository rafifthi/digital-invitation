"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { WORKSPACE_PLANS } from "@/lib/constants";
import { INVITATION_DOMAIN, sanitizeSubdomain } from "@/lib/invitation-url";
import { INVITATION_TEMPLATES, templateText } from "@/lib/templates";
import { cn } from "@/lib/utils";
import type { Language } from "@/lib/types";
import type {
  InvitationEvent,
  TemplateId,
  WorkspaceCreationInput,
  WorkspacePlanName,
} from "./types";
import { Field } from "./shared";
import { ThemeThumbnail } from "./theme-thumbnail";

const STEP_IDS = ["identity", "event", "template", "package"] as const;
type StepId = (typeof STEP_IDS)[number];

const INITIAL_EVENT: Omit<InvitationEvent, "id"> = {
  type: "ceremony",
  title: "Wedding Ceremony",
  date: "",
  startTime: "10:00",
  endTime: "12:00",
  venueName: "",
  venueAddress: "",
  mapsUrl: "",
};

export function WorkspaceCreatorDialog({
  open,
  onOpenChange,
  language,
  onCreate,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  language: Language;
  onCreate: (input: WorkspaceCreationInput) => string;
}) {
  const [stepIndex, setStepIndex] = useState(0);
  const [name, setName] = useState("");
  const [subdomain, setSubdomain] = useState("");
  const [subdomainTouched, setSubdomainTouched] = useState(false);
  const [event, setEvent] = useState<Omit<InvitationEvent, "id">>(INITIAL_EVENT);
  const [templateId, setTemplateId] = useState<TemplateId>("sunny");
  const [packageName, setPackageName] = useState<WorkspacePlanName>("Signature");
  const copy = useMemo(() => workspaceCopy(language), [language]);
  const currentStep = STEP_IDS[stepIndex];
  const selectedPlan = WORKSPACE_PLANS.find((plan) => plan.name === packageName) ?? WORKSPACE_PLANS[1];

  useEffect(() => {
    if (!open) return;
    setStepIndex(0);
    setName("");
    setSubdomain("");
    setSubdomainTouched(false);
    setEvent({ ...INITIAL_EVENT, date: suggestedEventDate() });
    setTemplateId("sunny");
    setPackageName("Signature");
  }, [open]);

  const handleNameChange = (value: string) => {
    setName(value);
    if (!subdomainTouched) setSubdomain(sanitizeSubdomain(value.replace(/\s*&\s*/g, "-and-").replace(/\s+/g, "-")));
  };

  const updateEvent = <Key extends keyof Omit<InvitationEvent, "id">>(
    field: Key,
    value: Omit<InvitationEvent, "id">[Key],
  ) => {
    setEvent((current) => ({ ...current, [field]: value }));
  };

  const canContinue = currentStep === "identity"
    ? name.trim().length >= 2 && subdomain.length >= 3
    : currentStep === "event"
      ? Boolean(event.title.trim() && event.date && event.startTime && event.venueName.trim())
      : currentStep === "template"
        ? Boolean(templateId)
        : Boolean(packageName);

  const completeWorkspace = () => {
    if (!canContinue) return;
    onCreate({
      name: name.trim(),
      subdomain,
      event: {
        ...event,
        title: event.title.trim(),
        venueName: event.venueName.trim(),
        venueAddress: event.venueAddress.trim(),
        mapsUrl: event.mapsUrl.trim(),
      },
      templateId,
      packageName,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92svh] overflow-hidden p-0 sm:max-w-[760px]">
        <DialogHeader className="border-b px-6 pb-5 pt-6 pr-14 text-left">
          <div className="mb-3 flex items-center gap-2">
            <span className="grid size-9 place-items-center rounded-full bg-[#eeedff] text-[#625cc7]">
              <Plus className="size-4" />
            </span>
            <span className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
              {copy.step} {stepIndex + 1} {copy.of} {STEP_IDS.length}
            </span>
          </div>
          <DialogTitle>{copy.steps[currentStep].title}</DialogTitle>
          <DialogDescription className="max-w-[65ch] leading-5">{copy.steps[currentStep].description}</DialogDescription>

          <div className="mt-5 grid grid-cols-4 gap-2" aria-label={copy.progressLabel}>
            {STEP_IDS.map((step, index) => {
              const active = index === stepIndex;
              const completed = index < stepIndex;
              return (
                <button
                  key={step}
                  type="button"
                  disabled={index > stepIndex}
                  onClick={() => index <= stepIndex && setStepIndex(index)}
                  aria-current={active ? "step" : undefined}
                  className="group min-w-0 text-left disabled:cursor-default"
                >
                  <span className={cn("block h-1 rounded-full bg-[#e8e8e8] transition-colors", (active || completed) && "bg-[#918df6]")} />
                  <span className={cn("mt-2 block truncate text-[11px] font-medium text-muted-foreground", active && "text-foreground", completed && "text-[#625cc7]")}>
                    {copy.steps[step].short}
                  </span>
                </button>
              );
            })}
          </div>
        </DialogHeader>

        <div className="min-h-0 overflow-y-auto px-6 py-6">
          {currentStep === "identity" && (
            <div className="grid gap-5">
              <Field label={copy.workspaceName}>
                <Input
                  autoFocus
                  value={name}
                  onChange={(inputEvent) => handleNameChange(inputEvent.target.value)}
                  placeholder={copy.workspacePlaceholder}
                />
              </Field>
              <Field label={copy.invitationAddress}>
                <div className="flex h-10 min-w-0 items-center overflow-hidden rounded-lg border bg-white focus-within:border-primary focus-within:ring-2 focus-within:ring-ring/25">
                  <span className="pl-3 text-xs text-muted-foreground">https://</span>
                  <Input
                    value={subdomain}
                    onChange={(inputEvent) => {
                      setSubdomainTouched(true);
                      setSubdomain(sanitizeSubdomain(inputEvent.target.value));
                    }}
                    aria-label={copy.subdomain}
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck={false}
                    className="min-w-16 flex-1 border-0 bg-transparent px-1 shadow-none focus-visible:ring-0"
                  />
                  <span className="shrink-0 pr-3 text-xs font-medium text-muted-foreground">.{INVITATION_DOMAIN}</span>
                </div>
              </Field>
              <p className="rounded-xl bg-[#fafafa] p-4 text-sm leading-5 text-muted-foreground">{copy.identityHelp}</p>
            </div>
          )}

          {currentStep === "event" && (
            <div className="grid grid-cols-2 gap-4 max-[640px]:grid-cols-1">
              <Field label={copy.eventType}>
                <Select value={event.type} onValueChange={(value) => updateEvent("type", value as InvitationEvent["type"])}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ceremony">{copy.ceremony}</SelectItem>
                    <SelectItem value="reception">{copy.reception}</SelectItem>
                    <SelectItem value="other">{copy.other}</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label={copy.eventName}>
                <Input value={event.title} onChange={(inputEvent) => updateEvent("title", inputEvent.target.value)} />
              </Field>
              <Field label={copy.eventDate}>
                <Input type="date" value={event.date} onChange={(inputEvent) => updateEvent("date", inputEvent.target.value)} />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label={copy.startTime}>
                  <Input type="time" value={event.startTime} onChange={(inputEvent) => updateEvent("startTime", inputEvent.target.value)} />
                </Field>
                <Field label={copy.endTime}>
                  <Input type="time" value={event.endTime} onChange={(inputEvent) => updateEvent("endTime", inputEvent.target.value)} />
                </Field>
              </div>
              <div className="col-span-2 max-[640px]:col-span-1">
                <Field label={copy.venueName}>
                  <Input value={event.venueName} onChange={(inputEvent) => updateEvent("venueName", inputEvent.target.value)} placeholder={copy.venuePlaceholder} />
                </Field>
              </div>
              <div className="col-span-2 max-[640px]:col-span-1">
                <Field label={copy.venueAddress}>
                  <Textarea rows={3} value={event.venueAddress} onChange={(inputEvent) => updateEvent("venueAddress", inputEvent.target.value)} />
                </Field>
              </div>
              <div className="col-span-2 max-[640px]:col-span-1">
                <Field label={copy.mapsUrl}>
                  <Input type="url" value={event.mapsUrl} onChange={(inputEvent) => updateEvent("mapsUrl", inputEvent.target.value)} placeholder="https://maps.google.com/..." />
                </Field>
              </div>
            </div>
          )}

          {currentStep === "template" && (
            <div className="grid grid-cols-2 gap-4 max-[600px]:grid-cols-1">
              {INVITATION_TEMPLATES.map((template) => {
                const selected = template.id === templateId;
                const text = templateText(template, language);
                return (
                  <button
                    key={template.id}
                    type="button"
                    onClick={() => setTemplateId(template.id)}
                    aria-pressed={selected}
                    className={cn(
                      "rounded-2xl border bg-white p-3 text-left transition-[border-color,box-shadow] hover:border-[#c9c7f8] focus-visible:ring-2 focus-visible:ring-ring",
                      selected && "border-primary shadow-[0_0_0_2px_rgba(145,141,246,0.12)]",
                    )}
                  >
                    <div className="relative">
                      <ThemeThumbnail templateId={template.id} name={text.name} />
                      {selected && (
                        <span className="absolute right-2 top-2 grid size-7 place-items-center rounded-full bg-white text-[#625cc7] shadow-[0_1px_4px_rgba(24,25,37,0.12)]">
                          <Check className="size-4" />
                        </span>
                      )}
                    </div>
                    <strong className="mt-4 block px-1 text-base font-semibold">{text.name}</strong>
                    <p className="mt-2 px-1 text-sm leading-5 text-muted-foreground">{text.description}</p>
                    <span className="mt-4 block px-1 pb-1 text-xs font-medium text-muted-foreground">{text.interaction}</span>
                  </button>
                );
              })}
            </div>
          )}

          {currentStep === "package" && (
            <div className="grid gap-5">
              <div className="grid grid-cols-3 gap-3 max-[680px]:grid-cols-1">
                {WORKSPACE_PLANS.map((plan) => {
                  const selected = plan.name === packageName;
                  return (
                    <button
                      key={plan.name}
                      type="button"
                      onClick={() => setPackageName(plan.name)}
                      aria-pressed={selected}
                      className={cn(
                        "rounded-2xl border bg-white p-4 text-left transition-[border-color,box-shadow] hover:border-[#c9c7f8] focus-visible:ring-2 focus-visible:ring-ring",
                        selected && "border-primary shadow-[0_0_0_2px_rgba(145,141,246,0.12)]",
                      )}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <strong className="text-sm font-semibold">{plan.name}</strong>
                        {selected && <Check className="size-4 text-[#625cc7]" />}
                      </div>
                      <span className="mt-3 block text-lg font-semibold">{plan.price}</span>
                      <span className="mt-2 block text-xs text-muted-foreground">{plan.guests}</span>
                      <span className="mt-1 block text-xs text-muted-foreground">{plan.credits}</span>
                    </button>
                  );
                })}
              </div>

              <section className="rounded-2xl border bg-[#fafafa] p-5" aria-label={copy.reviewTitle}>
                <div className="flex items-center justify-between gap-4 border-b pb-4">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">{copy.reviewTitle}</p>
                    <h3 className="mt-1 text-base font-semibold">{name}</h3>
                  </div>
                  <span className="rounded-full bg-[#eeedff] px-3 py-1 text-xs font-medium text-[#625cc7]">{selectedPlan.name}</span>
                </div>
                <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3 text-sm max-[520px]:grid-cols-1">
                  <ReviewRow label={copy.invitationAddress} value={`${subdomain}.${INVITATION_DOMAIN}`} />
                  <ReviewRow label={copy.eventName} value={event.title} />
                  <ReviewRow label={copy.eventDate} value={event.date || "—"} />
                  <ReviewRow label={copy.template} value={templateText(INVITATION_TEMPLATES.find((template) => template.id === templateId) ?? INVITATION_TEMPLATES[0], language).name} />
                  <ReviewRow label={copy.package} value={`${selectedPlan.name} · ${selectedPlan.price}`} />
                </dl>
              </section>
              <p className="text-xs leading-5 text-muted-foreground">{copy.packageHelp}</p>
            </div>
          )}
        </div>

        <DialogFooter className="border-t bg-[#fafafa] px-6 py-4 sm:justify-between">
          <Button
            type="button"
            variant="secondary"
            onClick={() => stepIndex === 0 ? onOpenChange(false) : setStepIndex((current) => current - 1)}
          >
            {stepIndex > 0 && <ArrowLeft />}
            {stepIndex === 0 ? copy.cancel : copy.back}
          </Button>
          {stepIndex < STEP_IDS.length - 1 ? (
            <Button type="button" disabled={!canContinue} onClick={() => setStepIndex((current) => current + 1)}>
              {copy.continue}
              <ArrowRight />
            </Button>
          ) : (
            <Button type="button" disabled={!canContinue} onClick={completeWorkspace}>
              <Check />
              {copy.createAndSwitch}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 truncate font-medium">{value}</dd>
    </div>
  );
}

function suggestedEventDate() {
  const date = new Date();
  date.setDate(date.getDate() + 30);
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

function workspaceCopy(language: Language) {
  const isId = language === "ID";
  return {
    step: isId ? "Langkah" : "Step",
    of: isId ? "dari" : "of",
    progressLabel: isId ? "Progres pembuatan workspace" : "Workspace creation progress",
    cancel: isId ? "Batal" : "Cancel",
    back: isId ? "Kembali" : "Back",
    continue: isId ? "Lanjut" : "Continue",
    createAndSwitch: isId ? "Buat & pindah workspace" : "Create & switch workspace",
    workspaceName: isId ? "Nama workspace" : "Workspace name",
    workspacePlaceholder: isId ? "Contoh: Dimas & Ayu" : "Example: Dimas & Ayu",
    invitationAddress: isId ? "Alamat undangan" : "Invitation address",
    subdomain: isId ? "Subdomain undangan" : "Invitation subdomain",
    identityHelp: isId ? "Nama workspace tampil di switcher sidebar. Data mempelai yang lebih lengkap dapat diisi setelah workspace dibuat." : "The workspace name appears in the sidebar switcher. Detailed couple information can be completed after creation.",
    eventType: isId ? "Jenis acara" : "Event type",
    ceremony: isId ? "Akad / pemberkatan" : "Ceremony",
    reception: isId ? "Resepsi" : "Reception",
    other: isId ? "Acara lainnya" : "Other event",
    eventName: isId ? "Nama acara" : "Event name",
    eventDate: isId ? "Tanggal" : "Date",
    startTime: isId ? "Mulai" : "Start",
    endTime: isId ? "Selesai" : "End",
    venueName: isId ? "Nama tempat" : "Venue name",
    venuePlaceholder: isId ? "Contoh: The Langham Jakarta" : "Example: The Langham Jakarta",
    venueAddress: isId ? "Alamat lengkap" : "Full address",
    mapsUrl: isId ? "Tautan Google Maps" : "Google Maps link",
    template: isId ? "Template" : "Template",
    package: isId ? "Paket" : "Package",
    reviewTitle: isId ? "Ringkasan workspace" : "Workspace summary",
    packageHelp: isId ? "Paket ini hanya berlaku untuk workspace baru. Pada versi produksi, workspace diprovisikan setelah pembayaran berhasil." : "This package applies only to the new workspace. In production, provisioning occurs after successful payment.",
    steps: {
      identity: {
        short: isId ? "Workspace" : "Workspace",
        title: isId ? "Beri nama workspace" : "Name the workspace",
        description: isId ? "Tentukan nama yang mudah dikenali dan alamat undangan yang unik." : "Choose a recognizable name and a unique invitation address.",
      },
      event: {
        short: isId ? "Acara" : "Event",
        title: isId ? "Isi detail acara" : "Add event details",
        description: isId ? "Satu workspace memiliki satu acara yang dipakai oleh countdown dan halaman undangan." : "One workspace has one event used by the countdown and invitation page.",
      },
      template: {
        short: isId ? "Template" : "Template",
        title: isId ? "Pilih template undangan" : "Choose an invitation template",
        description: isId ? "Template dapat diganti lagi dari modul Design setelah workspace dibuat." : "The template can be changed later from Design after the workspace is created.",
      },
      package: {
        short: isId ? "Paket" : "Package",
        title: isId ? "Pilih paket workspace" : "Choose a workspace package",
        description: isId ? "Setiap workspace memakai paket terpisah. Periksa ringkasan sebelum membuatnya." : "Each workspace uses a separate package. Review the details before creation.",
      },
    } satisfies Record<StepId, { short: string; title: string; description: string }>,
  };
}
