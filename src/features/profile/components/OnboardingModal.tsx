import { Modal } from "@/components/ui/Modal";
import { OnboardingFlow } from "./OnboardingFlow";
import { useAsyncOperation } from "@/shared/hooks";
import { onboardingService } from "../domain/onboarding.service";
import { ErrorDisplay } from "@/shared/components";
import type { OnboardingData } from "../domain/onboarding.types";

interface OnboardingModalProps {
  isOpen: boolean;
  onClose?: () => void;
}

export function OnboardingModal({ isOpen, onClose }: OnboardingModalProps) {
  const {
    execute: completeOnboarding,
    loading: completing,
    error,
  } = useAsyncOperation(onboardingService.completeOnboarding);

  const handleOnboardingComplete = async (data: OnboardingData) => {
    const result = await completeOnboarding(data);

    if (result?.success) {
      onClose?.();
      // Refresh the page to update user state
      window.location.reload();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Welcome to MySI"
      size="lg"
      closeOnOverlayClick={false} // Prevent closing during onboarding
    >
      <div className="relative">
        {/* Loading overlay during completion */}
        {completing && (
          <div className="absolute inset-0 bg-white/80 dark:bg-gray-800/80 flex items-center justify-center z-10 rounded-lg">
            <div className="text-center space-y-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto" />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Setting up your account...
              </p>
            </div>
          </div>
        )}

        {/* Error display */}
        {error && (
          <div className="mb-6">
            <ErrorDisplay
              error={error}
              onDismiss={() => window.location.reload()}
            />
          </div>
        )}

        {/* Onboarding flow */}
        <OnboardingFlow onComplete={handleOnboardingComplete} />
      </div>
    </Modal>
  );
}
