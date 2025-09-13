import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useOnboarding } from "../hooks/use-onboarding";
import { OnboardingStep } from "../domain/onboarding.types";
import { RoleSelectionStep } from "./RoleSelectionStep";
import { CourseSelectionStep } from "./CourseSelectionStep";
import type { OnboardingData } from "../domain/onboarding.types";

interface OnboardingFlowProps {
  onComplete: (data: OnboardingData) => void;
}

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const { state, actions, helpers } = useOnboarding();
  const { currentStep, data, isComplete } = state;
  const { updateData, completeStep, skipStep, goBack } = actions;
  const { getProgress, canGoBack } = helpers;

  const progress = getProgress();

  // Handle completion
  useEffect(() => {
    if (isComplete) {
      onComplete(data);
    }
  }, [isComplete, data, onComplete]);

  // Render current step component
  const renderCurrentStep = () => {
    switch (currentStep) {
      case OnboardingStep.ROLE_SELECTION:
        return (
          <RoleSelectionStep
            selectedRole={data.role}
            onRoleSelect={(role) => updateData({ role })}
            onNext={() => completeStep(OnboardingStep.ROLE_SELECTION)}
            canProceed={!!data.role}
          />
        );

      case OnboardingStep.COURSES_TAUGHT:
        return (
          <CourseSelectionStep
            selectedCourses={data.coursesInstructed || []}
            onCoursesChange={(courses) =>
              updateData({ coursesInstructed: courses })
            }
            onNext={() => completeStep(OnboardingStep.COURSES_TAUGHT)}
            onSkip={skipStep}
          />
        );

      default:
        return null;
    }
  };

  if (isComplete) {
    return null; // Component will unmount after onComplete is called
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Progress Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            {canGoBack && (
              <Button
                variant="ghost"
                size="sm"
                onClick={goBack}
                className="gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                Back
              </Button>
            )}
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Step {progress.current} of {progress.total}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress.percentage}%` }}
            role="progressbar"
            aria-valuenow={progress.percentage}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Onboarding progress: ${progress.percentage}% complete`}
          />
        </div>
      </div>

      {/* Step Content */}
      <div className="space-y-6">{renderCurrentStep()}</div>

      {/* Footer */}
      <div className="mt-6 text-center">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          You can always update these preferences later in your settings
        </p>
      </div>
    </div>
  );
}
