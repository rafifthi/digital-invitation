import { DashboardPageFrame } from "@/components/dashboard/dashboard-page-frame";
import { SettingsPanel } from "@/components/dashboard/settings-panel";

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;
  return <DashboardPageFrame><SettingsPanel initialTab={tab} /></DashboardPageFrame>;
}
