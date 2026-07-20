import { AccountSettingsPanel } from "@/components/dashboard/account-settings-panel";
import { DashboardPageFrame } from "@/components/dashboard/dashboard-page-frame";
import { getDemoAccount } from "@/lib/auth";

export default function PlanSettingsPage() {
  return <DashboardPageFrame><AccountSettingsPanel account={getDemoAccount()} section="plan" /></DashboardPageFrame>;
}
