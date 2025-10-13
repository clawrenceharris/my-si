"use client";
import { redirect, useRouter, useSearchParams } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { FormLayout } from "@/components/layouts";
import { LoginFormInput, loginSchema } from "@/features/auth/domain";
import { LoginForm } from "@/features/auth/components";
import { useAuth } from "@/features/auth/hooks";

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, resetPassword } = useAuth();

  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? "/";

  return (
    <main className="flex flex-col justify-center">
      <div className="bg-background w-full max-w-xl p-12 shadow-lg rounded-xl mx-auto">
        <div className="text-center my-8">
          <h1 className="text-2xl font-semibold">Log In</h1>
        </div>
        <FormLayout<LoginFormInput>
          defaultValues={{ email: "", password: "" }}
          submitText="Log In"
          isLoading={isLoading}
          resolver={zodResolver(loginSchema)}
          onSubmit={login}
          onSuccess={() => {
            if (redirectTo) redirect(redirectTo);
            else router.replace("/");
          }}
        >
          <LoginForm
            onForgotPassword={resetPassword}
            onSwitchToSignup={() => {
              if (redirectTo) {
                redirect(redirectTo);
              }
            }}
          />
        </FormLayout>
      </div>
    </main>
  );
}
