import { GuestReviewDeck } from "@/components/review/guest-review-deck";

export default async function GuestReviewPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  return <GuestReviewDeck token={token} />;
}
