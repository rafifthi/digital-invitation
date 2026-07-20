import { AuthForm } from "@/components/auth/auth-form";
import { AuthShell } from "@/components/auth/auth-shell";

export default function SignUpPage() {
  return (
    <AuthShell eyebrow="Demo registration" title="Create account" description="This temporary flow activates the demo workspace. No user data is persisted yet.">
      <AuthForm mode="sign-up" />
    </AuthShell>
  );
}
