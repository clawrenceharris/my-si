"use client";
import { useRouter } from "next/navigation";

import { useAuth } from "@/shared/hooks/use-auth";
import { SignUpForm } from "@/features/auth/components";
import { signupSchema } from "@/features/auth/domain/auth.schema";
import { FormLayout } from "@/components/forms";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignUpFormInput } from "@/features/auth/domain/auth.types";

export default function SignUpPage() {
  const router = useRouter();
  const { signup, loading, error } = useAuth(); // implement with supabase.auth

  // Handle successful signup - redirect to onboarding
  const handleSignup = async (data: SignUpFormInput) => {
    const result = await signup(data);
    if (result) {
      // Redirect to onboarding instead of main app
      router.push("/onboarding");
    }
  };

  // Get nextPath from URL params
  const nextPath = "/";

  return (
    <div className="bg-secondary-background">
      <div className="text-center my-8">
        <h1 className="text-2xl font-semibold">Sign Up</h1>
      </div>
      <FormLayout<SignUpFormInput>
        submitText="Sign In"
        showsCancelButton={false}
        isLoading={loading}
        resolver={zodResolver(signupSchema)}
        error={error}
        onSubmit={handleSignup}
      >
        <SignUpForm
          onSwitchToLogin={() => {
            const url = nextPath
              ? `/auth/login?next=${encodeURIComponent(nextPath)}`
              : "/auth/login";
            router.push(url);
          }}
        />
      </FormLayout>
    </div>
  );
}
