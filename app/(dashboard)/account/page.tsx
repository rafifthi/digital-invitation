import { AccountSettingsPanel } from "@/components/dashboard/account-settings-panel";
import { DashboardPageFrame } from "@/components/dashboard/dashboard-page-frame";
import { getDemoAccount } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;
  if (tab === "plan") redirect("/account/plan");
  return <DashboardPageFrame><AccountSettingsPanel account={getDemoAccount()} section="profile" /></DashboardPageFrame>;
}
