import { HERO_BG_SVG } from "@/lib/constants";
import type { TemplateId } from "./types";

export function ThemeThumbnail({ templateId, name }: { templateId: TemplateId; name: string }) {
  if (templateId === "serene") {
    return (
      <div className="relative aspect-[16/9] overflow-hidden rounded-xl border bg-[#eeeae0]" aria-hidden="true">
        <div
          className="absolute inset-y-0 left-1/2 w-[46%] -translate-x-1/2 bg-cover bg-center grayscale"
          style={{ backgroundImage: `url("${HERO_BG_SVG}")` }}
        />
        <div className="absolute inset-y-0 left-1/2 w-[46%] -translate-x-1/2 bg-[#4c4c4c]/30" />
        <div className="absolute inset-x-[31%] top-[29%] text-center text-[#f8f5ed]">
          <span className="block font-serif text-[7px] uppercase tracking-[0.08em]">The wedding of</span>
          <strong className="mt-1 block font-serif text-[13px] font-normal leading-none">Rafif</strong>
          <span className="my-0.5 block text-[6px] uppercase">and</span>
          <strong className="block font-serif text-[13px] font-normal leading-none">Kanza</strong>
        </div>
        <span className="absolute bottom-2 left-3 rounded-full bg-[#f8f5ed]/95 px-2 py-1 text-[9px] font-semibold text-[#4c4c4c]">{name}</span>
      </div>
    );
  }

  if (templateId === "sienna") {
    return (
      <div className="relative aspect-[16/9] overflow-hidden rounded-xl border bg-[#f4efe3]" aria-hidden="true">
        <div className="absolute inset-x-[22%] bottom-[-16%] top-[12%] rounded-t-[48%] border border-[#afaa91] bg-[#faf7ef] shadow-[0_6px_18px_rgba(31,64,84,0.08)]" />
        <div className="absolute left-[15%] top-[16%] h-[55%] w-px -rotate-[18deg] bg-[#87977b]" />
        <div className="absolute left-[11%] top-[28%] size-4 rotate-[28deg] rounded-[70%_30%_70%_30%] border border-[#87977b]" />
        <div className="absolute left-[16%] top-[40%] size-5 -rotate-[18deg] rounded-[70%_30%_70%_30%] border border-[#87977b]" />
        <div className="absolute right-[15%] top-[18%] h-[58%] w-px rotate-[17deg] bg-[#87977b]" />
        <div className="absolute right-[11%] top-[31%] size-4 -rotate-[30deg] rounded-[30%_70%_30%_70%] border border-[#87977b]" />
        <div className="absolute inset-x-[29%] top-[35%] text-center text-[#1f4054]">
          <span className="block font-serif text-[10px] uppercase tracking-[0.22em]">The wedding of</span>
          <strong className="mt-1 block font-serif text-lg leading-none">R & K</strong>
          <span className="mt-2 block text-[8px] uppercase tracking-[0.18em]">29 · 08 · 2026</span>
        </div>
        <span className="absolute bottom-2 left-3 rounded-full bg-[#fefdf8]/90 px-2 py-1 text-[9px] font-semibold text-[#1f4054]">{name}</span>
      </div>
    );
  }

  return (
    <div
      className="relative aspect-[16/9] overflow-hidden rounded-xl border bg-[#d5b69c] bg-cover bg-center"
      style={{ backgroundImage: `url("${HERO_BG_SVG}")` }}
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-[#4d3024]/10" />
      <div className="absolute inset-x-[23%] bottom-[10%] rounded-t-[48%] bg-[#fff9ee]/92 px-3 pb-3 pt-5 text-center text-[#604838] shadow-[0_8px_20px_rgba(74,47,35,0.14)]">
        <span className="block font-serif text-[8px] uppercase tracking-[0.16em]">Together with joy</span>
        <strong className="mt-1 block font-serif text-base leading-none">R & K</strong>
        <span className="mt-1 block text-[7px] uppercase tracking-[0.12em]">29 August 2026</span>
      </div>
      <span className="absolute bottom-2 left-3 rounded-full bg-[#fff9ee]/90 px-2 py-1 text-[9px] font-semibold text-[#604838]">{name}</span>
    </div>
  );
}
