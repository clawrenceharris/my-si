"use client";
import { useProfile, useUser } from "@/shared/hooks";
import { OnboardingModal } from "@/features/profile/components/OnboardingModal";

export default function Home() {
  const { user } = useUser();
  const { profile } = useProfile(user?.id);

  // Show onboarding modal if user hasn't completed onboarding
  const needsOnboarding = profile && !profile.onboarding_complete;

  return (
    <div>
      <h1>Welcome, {profile?.full_name || user?.email}</h1>

      {/* Onboarding Modal */}
      <OnboardingModal
        isOpen={!!needsOnboarding}
        onClose={() => {
          // Optional: Allow closing but mark as incomplete
          console.log("Onboarding closed without completion");
        }}
      />
    </div>
  );
}
