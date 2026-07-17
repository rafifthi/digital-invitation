import type { ReactNode } from "react";

export function AuthShell({ eyebrow, title, description, children }: { eyebrow: string; title: string; description: string; children: ReactNode }) {
  return (
    <main className="grid min-h-svh grid-cols-[minmax(0,0.9fr)_minmax(460px,1.1fr)] bg-white max-[900px]:grid-cols-1">
      <section className="relative flex min-h-svh flex-col justify-between overflow-hidden bg-[#181925] p-10 text-white max-[900px]:hidden">
        <div className="flex items-center gap-3">
          <span className="grid size-9 place-items-center rounded-full bg-white text-[10px] font-semibold text-[#181925]">RM</span>
          <div>
            <p className="text-sm font-semibold">Riuh Merekah</p>
            <p className="text-xs text-white/55">Wedding workspace</p>
          </div>
        </div>
        <div className="relative z-10 max-w-md">
          <span className="mb-6 block h-px w-14 bg-[#918df6]" />
          <h2 className="text-4xl font-semibold leading-[1.05] tracking-[-0.045em]">
            One clear place for every detail before the celebration.
          </h2>
          <p className="mt-5 max-w-[42ch] text-sm leading-6 text-white/60">
            Shape the invitation, manage guests, and keep every update ready to share.
          </p>
        </div>
        <p className="text-xs text-white/40">Private local demo access</p>
      </section>

      <section className="flex min-h-svh items-center justify-center bg-[#fafafa] px-6 py-12">
        <div className="w-full max-w-[440px]">
          <div className="mb-8 flex items-center gap-3 min-[901px]:hidden">
            <span className="grid size-9 place-items-center rounded-full bg-[#181925] text-[10px] font-semibold text-white">RM</span>
            <span className="text-sm font-semibold">Riuh Merekah</span>
          </div>
          <p className="text-xs font-medium uppercase tracking-[0.12em] text-[#999999]">{eyebrow}</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-[-0.045em] text-[#181925]">{title}</h1>
          <p className="mt-3 max-w-[44ch] text-sm leading-6 text-[#666666]">{description}</p>
          <div className="mt-8 rounded-2xl border bg-white p-6 shadow-[0_1px_3px_rgba(24,25,37,0.05)] max-[460px]:p-5">
            {children}
          </div>
        </div>
      </section>
    </main>
  );
}
