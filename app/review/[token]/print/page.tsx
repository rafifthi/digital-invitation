import { PrintReviewSheet } from "@/components/review/print-review-sheet";

export default async function PrintGuestReviewPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  return <PrintReviewSheet token={token} />;
}
