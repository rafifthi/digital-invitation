import { WeddingDashboard } from "@/components/dashboard/wedding-dashboard";
import { getDemoAccount } from "@/lib/auth";

export default function Page() {
  return <WeddingDashboard account={getDemoAccount()} />;
}
