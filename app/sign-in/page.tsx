import { AuthForm } from "@/components/auth/auth-form";
import { AuthShell } from "@/components/auth/auth-shell";

export default function SignInPage() {
  return (
    <AuthShell eyebrow="Welcome back" title="Sign in" description="Use the demo credentials configured in .env.local to open your wedding workspace.">
      <AuthForm mode="sign-in" />
    </AuthShell>
  );
}
