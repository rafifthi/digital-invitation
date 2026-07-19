import type { MenuId } from "./types";
import { cn } from "@/lib/utils";

export function DashboardRouteSkeleton({ variant = "overview" }: { variant?: MenuId }) {
  if (variant === "design") return <DesignSkeleton />;
  if (variant === "guest-list" || variant === "wishes") return <TableSkeleton />;

  return (
    <main className="h-full overflow-hidden bg-[#fafafa] px-8 py-8 max-[820px]:px-4" role="status" aria-label="Loading page">
      <div className="mx-auto max-w-[1020px] animate-pulse space-y-7 motion-reduce:animate-none">
        <PageHeadingSkeleton />
        {variant === "settings" ? <SettingsSkeleton /> : <OverviewSkeleton />}
      </div>
    </main>
  );
}

function PageHeadingSkeleton() {
  return (
    <div className="flex items-end justify-between gap-5">
      <div className="space-y-3">
        <SkeletonBlock className="h-3 w-32" />
        <SkeletonBlock className="h-7 w-64" />
      </div>
      <SkeletonBlock className="h-10 w-32 rounded-full" />
    </div>
  );
}

function SettingsSkeleton() {
  return (
    <div className="space-y-5">
      <div className="flex gap-2 border-b pb-3">
        {[24, 20, 28, 18].map((width) => <SkeletonBlock key={width} className="h-9 rounded-full" style={{ width: `${width * 4}px` }} />)}
      </div>
      <div className="rounded-2xl border bg-white p-6">
        <SkeletonBlock className="h-5 w-44" />
        <SkeletonBlock className="mt-3 h-3 w-80 max-w-full" />
        <div className="mt-7 grid grid-cols-2 gap-4 max-[700px]:grid-cols-1">
          {Array.from({ length: 6 }, (_, index) => (
            <div key={index} className="space-y-2">
              <SkeletonBlock className="h-3 w-24" />
              <SkeletonBlock className="h-10 w-full rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function OverviewSkeleton() {
  return (
    <div className="grid grid-cols-12 gap-5 max-[900px]:grid-cols-1">
      <SkeletonBlock className="col-span-7 h-72 rounded-3xl max-[900px]:col-span-1" />
      <SkeletonBlock className="col-span-5 h-72 rounded-3xl max-[900px]:col-span-1" />
      <SkeletonBlock className="col-span-7 h-80 rounded-3xl max-[900px]:col-span-1" />
      <SkeletonBlock className="col-span-5 h-80 rounded-3xl max-[900px]:col-span-1" />
    </div>
  );
}

function TableSkeleton() {
  return (
    <main className="h-full overflow-hidden bg-[#fafafa] px-8 py-8 max-[820px]:px-4" role="status" aria-label="Loading page">
      <div className="mx-auto max-w-[1100px] animate-pulse space-y-6 motion-reduce:animate-none">
        <PageHeadingSkeleton />
        <div className="rounded-3xl border bg-white p-5">
          <SkeletonBlock className="h-10 w-full rounded-xl" />
          <div className="mt-5 divide-y">
            {Array.from({ length: 6 }, (_, index) => <SkeletonBlock key={index} className="h-16 w-full rounded-none" />)}
          </div>
        </div>
      </div>
    </main>
  );
}

function DesignSkeleton() {
  return (
    <main className="flex h-full flex-col overflow-hidden bg-[#fafafa]" role="status" aria-label="Loading design editor">
      <div className="animate-pulse border-b bg-white px-8 py-5 motion-reduce:animate-none max-[820px]:px-4">
        <div className="flex items-center justify-between gap-5">
          <div className="flex items-center gap-4"><SkeletonBlock className="size-12 rounded-2xl" /><div className="space-y-2"><SkeletonBlock className="h-5 w-64" /><SkeletonBlock className="h-3 w-80 max-w-full" /></div></div>
          <div className="flex gap-2"><SkeletonBlock className="h-10 w-32 rounded-full" /><SkeletonBlock className="h-10 w-24 rounded-full" /></div>
        </div>
        <SkeletonBlock className="mt-4 h-12 w-full rounded-xl" />
      </div>
      <div className="grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)_450px] max-[820px]:grid-cols-1">
        <div className="animate-pulse space-y-4 p-8 motion-reduce:animate-none max-[820px]:p-4">
          {Array.from({ length: 5 }, (_, index) => <SkeletonBlock key={index} className="h-20 w-full rounded-2xl" />)}
        </div>
        <div className="animate-pulse border-l bg-white p-6 motion-reduce:animate-none max-[820px]:hidden"><SkeletonBlock className="mx-auto h-[620px] max-h-full w-[310px] rounded-[32px]" /></div>
      </div>
    </main>
  );
}

function SkeletonBlock({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return <div className={cn("rounded-md bg-[#e9e9ed]", className)} style={style} />;
}
