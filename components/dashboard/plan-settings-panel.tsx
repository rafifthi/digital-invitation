"use client";

import { useEffect, useState } from "react";
import { Check, CheckCircle2, CreditCard, Landmark, PackageCheck, ReceiptText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useDashboard } from "@/context";
import { WORKSPACE_PLANS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { WorkspacePlanName } from "./types";

type PaymentMethod = "bank-transfer" | "card";

const PAYMENT_METHODS: Array<{
  id: PaymentMethod;
  label: string;
  description: string;
  icon: typeof Landmark;
}> = [
  { id: "bank-transfer", label: "Bank transfer", description: "Complete the transfer after checkout is connected.", icon: Landmark },
  { id: "card", label: "Credit or debit card", description: "Continue through a secure payment provider in production.", icon: CreditCard },
];

export function PlanSettingsPanel() {
  const { workspaces, activeWorkspaceId, setWorkspacePlan } = useDashboard();
  const activeWorkspace = workspaces.find((workspace) => workspace.id === activeWorkspaceId) ?? workspaces[0];
  const [selectedPlan, setSelectedPlan] = useState<WorkspacePlanName>(activeWorkspace?.packageName ?? "Signature");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("bank-transfer");
  const [receipt, setReceipt] = useState<{ workspaceId: string; plan: WorkspacePlanName; method: PaymentMethod } | null>(null);
  const currentPlan = WORKSPACE_PLANS.find((plan) => plan.name === activeWorkspace?.packageName) ?? WORKSPACE_PLANS[1];
  const selectedPlanDetails = WORKSPACE_PLANS.find((plan) => plan.name === selectedPlan) ?? WORKSPACE_PLANS[1];
  const planChanged = selectedPlan !== activeWorkspace?.packageName;

  useEffect(() => {
    setSelectedPlan(activeWorkspace?.packageName ?? "Signature");
    setReceipt((current) => current?.workspaceId === activeWorkspaceId && current.plan === activeWorkspace?.packageName ? current : null);
  }, [activeWorkspace?.packageName, activeWorkspaceId]);

  const choosePlan = (plan: WorkspacePlanName) => {
    setSelectedPlan(plan);
    setReceipt(null);
  };

  const confirmPayment = () => {
    if (!planChanged) return;
    setWorkspacePlan(selectedPlan);
    setReceipt({ workspaceId: activeWorkspaceId, plan: selectedPlan, method: paymentMethod });
  };

  return (
    <div className="grid gap-6">
      {receipt && (
        <div className="flex items-start gap-3 rounded-2xl border border-[#bfe5c8] bg-[#f1fbf3] p-4" role="status">
          <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-[#247f3b]" />
          <div>
            <p className="text-sm font-semibold text-[#1f6631]">Plan updated to {receipt.plan}</p>
            <p className="mt-1 text-sm text-[#3e704a]">Demo payment recorded via {paymentMethodLabel(receipt.method)} for this workspace.</p>
          </div>
        </div>
      )}

      <Card>
        <CardHeader className="border-b">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <CardTitle className="font-medium tracking-[-0.02em]">Current plan</CardTitle>
              <CardDescription className="mt-1">Plan access belongs to {activeWorkspace?.name ?? "this workspace"}.</CardDescription>
            </div>
            <Badge className="border-0 bg-[#def6e4] text-[#247f3b]">Paid</Badge>
          </div>
        </CardHeader>
        <CardContent className="flex flex-wrap items-end justify-between gap-5 pt-5">
          <div>
            <p className="text-2xl font-semibold tracking-[-0.03em]">{currentPlan.name}</p>
            <p className="mt-1 text-sm text-muted-foreground">One-time payment, lifetime access</p>
          </div>
          <div className="text-right">
            <p className="text-xl font-semibold">{currentPlan.price}</p>
            <p className="mt-1 text-xs text-muted-foreground">Current workspace</p>
          </div>
        </CardContent>
      </Card>

      <section aria-labelledby="compare-plans-title">
        <div className="mb-4">
          <h3 id="compare-plans-title" className="text-base font-semibold">Compare plans</h3>
          <p className="mt-1 text-sm text-muted-foreground">Select the package that matches this workspace.</p>
        </div>
        <div className="grid grid-cols-3 gap-3 max-[760px]:grid-cols-1">
          {WORKSPACE_PLANS.map((plan) => {
            const selected = selectedPlan === plan.name;
            const current = activeWorkspace?.packageName === plan.name;
            return (
              <button
                key={plan.name}
                type="button"
                data-testid={`plan-${plan.name.toLowerCase()}`}
                onClick={() => choosePlan(plan.name)}
                aria-pressed={selected}
                className={cn(
                  "flex min-h-60 flex-col rounded-2xl border bg-white p-5 text-left outline-none transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-[#c9c7f8] focus-visible:ring-2 focus-visible:ring-ring",
                  selected && "border-[#aaa6ff] shadow-[0_0_0_2px_rgba(145,141,246,0.12)]",
                )}
              >
                <span className="flex items-start justify-between gap-3">
                  <span className="text-lg font-semibold">{plan.name}</span>
                  {current ? (
                    <Badge variant="outline" className="border-[#d9d7ff] bg-[#f8f7ff] text-[#625cc7]">Current</Badge>
                  ) : selected ? (
                    <span className="grid size-6 place-items-center rounded-full bg-[#eeedff] text-[#625cc7]"><Check className="size-3.5" /></span>
                  ) : null}
                </span>
                <span className="mt-5 text-xl font-semibold">{plan.price}</span>
                <span className="mt-1 text-xs text-muted-foreground">One-time payment</span>
                <span className="mt-5 grid gap-2 text-sm text-muted-foreground">
                  <span className="flex items-center gap-2"><PackageCheck className="size-4 text-[#625cc7]" /> {plan.guests}</span>
                  <span className="flex items-center gap-2"><PackageCheck className="size-4 text-[#625cc7]" /> {plan.credits}</span>
                  <span className="flex items-center gap-2"><PackageCheck className="size-4 text-[#625cc7]" /> Custom subdomain</span>
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <Card id="payment" className="scroll-mt-6">
        <CardHeader className="border-b">
          <div className="flex items-center gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[#eeedff] text-[#625cc7]">
              <ReceiptText className="size-4" />
            </span>
            <div>
              <CardTitle className="font-medium tracking-[-0.02em]">Payment</CardTitle>
              <CardDescription className="mt-1">Review the selected plan and payment method.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-5 pt-5">
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl bg-[#fafafa] p-4">
            <div>
              <p className="text-sm font-medium">{selectedPlanDetails.name} plan</p>
              <p className="mt-1 text-xs text-muted-foreground">Lifetime access for {activeWorkspace?.name ?? "this workspace"}</p>
            </div>
            <p className="text-lg font-semibold">{selectedPlanDetails.price}</p>
          </div>

          {planChanged ? (
            <>
              <div>
                <p className="mb-3 text-sm font-medium">Payment method</p>
                <div className="grid grid-cols-2 gap-3 max-[640px]:grid-cols-1">
                  {PAYMENT_METHODS.map((method) => {
                    const Icon = method.icon;
                    const selected = paymentMethod === method.id;
                    return (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => setPaymentMethod(method.id)}
                        aria-pressed={selected}
                        className={cn(
                          "flex items-start gap-3 rounded-xl border p-4 text-left outline-none transition-colors hover:bg-[#fafafa] focus-visible:ring-2 focus-visible:ring-ring",
                          selected && "border-[#aaa6ff] bg-[#f8f7ff]",
                        )}
                      >
                        <Icon className="mt-0.5 size-4 shrink-0 text-[#625cc7]" />
                        <span>
                          <span className="block text-sm font-medium">{method.label}</span>
                          <span className="mt-1 block text-xs leading-5 text-muted-foreground">{method.description}</span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-4 border-t pt-5">
                <p className="max-w-[55ch] text-xs leading-5 text-muted-foreground">
                  Demo flow only. This records the plan locally; connect a payment provider before production.
                </p>
                <Button type="button" onClick={confirmPayment} className="max-[560px]:w-full">
                  Confirm demo payment
                </Button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3 rounded-xl border border-[#d9d7ff] bg-[#f8f7ff] p-4">
              <CheckCircle2 className="size-5 shrink-0 text-[#625cc7]" />
              <p className="text-sm text-[#4f4a9a]">This is your active plan. Select another package above to start a plan change.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function paymentMethodLabel(method: PaymentMethod) {
  return method === "bank-transfer" ? "bank transfer" : "credit or debit card";
}
