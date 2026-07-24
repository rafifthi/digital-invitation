"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Printer } from "lucide-react";
import type { GuestReviewSession } from "@/components/dashboard/types";
import { Button } from "@/components/ui/button";
import { guestSideFilterLabel, readReviewSessions } from "@/lib/guest-planning";

export function PrintReviewSheet({ token }: { token: string }) {
  const [session, setSession] = useState<GuestReviewSession | null | undefined>(undefined);

  useEffect(() => {
    setSession(readReviewSessions().find((record) => record.token === token) ?? null);
  }, [token]);

  if (session === undefined) return <div className="p-8 text-sm">Menyiapkan versi cetak…</div>;
  if (!session) return <div className="p-8 text-sm">Sesi sortir tidak ditemukan.</div>;

  const filterSide = session.filterSide ?? session.side;
  const filterLabels = session.filterLabels ?? [];
  const targetPercent = filterSide === "all"
    ? 100
    : filterSide === "groom"
      ? session.capacityPlan.groomPercent
      : 100 - session.capacityPlan.groomPercent;
  const targetPax = Math.round(session.capacityPlan.maxPax * targetPercent / 100);
  const totalPax = session.items.reduce((total, item) => total + item.pax, 0);

  return (
    <div className="min-h-screen bg-[#f3f3f5] text-[#181925] print:bg-white">
      <div className="print-hidden sticky top-0 z-10 flex items-center justify-between border-b bg-white px-5 py-3">
        <Button type="button" variant="ghost" onClick={() => window.history.back()}>
          <ArrowLeft className="size-4" /> Kembali
        </Button>
        <Button type="button" onClick={() => window.print()}>
          <Printer className="size-4" /> Print / Save PDF
        </Button>
      </div>

      <main className="review-print-sheet mx-auto my-6 max-w-[210mm] bg-white p-[14mm] shadow-sm print:my-0 print:max-w-none print:shadow-none">
        <header className="flex items-start justify-between gap-8 border-b-2 border-[#181925] pb-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em]">Riuh Merekah · Sortir Tamu</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em]">{session.reviewerName}</h1>
            <p className="mt-2 text-sm text-[#66666f]">
              {[guestSideFilterLabel(filterSide), ...filterLabels, `${session.items.length} kandidat`, `${totalPax} pax`].join(" · ")}
            </p>
          </div>
          <div className="text-right text-sm">
            <p className="font-semibold">Target fleksibel</p>
            <p className="mt-1 text-2xl font-semibold tabular-nums">{targetPax} pax</p>
            <p className="text-xs text-[#66666f]">{targetPercent}% dari cap {session.capacityPlan.maxPax}</p>
          </div>
        </header>

        <div className="mt-5 rounded-xl border bg-[#fafafa] px-4 py-3 text-xs leading-5 text-[#4d4d55]">
          Beri satu tanda pada setiap baris: <b>Setuju</b>, <b>Tinjau lagi</b>, atau <b>Coret</b>. Daftar yang sudah ditandai dapat difoto dan diunggah kembali oleh pasangan.
        </div>

        <div className="mt-5 overflow-hidden rounded-xl border">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="bg-[#f3f3f5]">
                <th className="w-10 border-b px-3 py-3">No.</th>
                <th className="border-b px-3 py-3">Nama tamu</th>
                <th className="w-14 border-b px-3 py-3 text-center">Pax</th>
                <th className="w-[31%] border-b px-3 py-3 text-center">Keputusan</th>
              </tr>
            </thead>
            <tbody>
              {session.items.map((item, index) => (
                <tr key={item.guestId} className="review-print-row">
                  <td className="border-b px-3 py-3 tabular-nums text-[#66666f]">{String(index + 1).padStart(2, "0")}</td>
                  <td className="border-b px-3 py-3">
                    <p className="font-semibold">{item.name}</p>
                    <p className="mt-1 text-[10px] text-[#66666f]">{item.type === "group" ? "Grup" : "Personal"}{item.labels.length ? ` · ${item.labels.join(", ")}` : ""}</p>
                  </td>
                  <td className="border-b px-3 py-3 text-center font-semibold tabular-nums">{item.pax}</td>
                  <td className="border-b px-3 py-3">
                    <div className="flex justify-center gap-4">
                      <PrintChoice label="Setuju" />
                      <PrintChoice label="Tinjau" />
                      <PrintChoice label="Coret" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <footer className="mt-5 flex justify-between text-[10px] text-[#777780]">
          <span>Kode sesi: {session.token.slice(0, 8).toUpperCase()}</span>
          <span>Dibuat {new Intl.DateTimeFormat("id-ID", { dateStyle: "medium" }).format(new Date(session.createdAt))}</span>
        </footer>
      </main>
    </div>
  );
}

function PrintChoice({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
      <span className="size-3.5 rounded-[3px] border border-[#181925]" />
      {label}
    </span>
  );
}
