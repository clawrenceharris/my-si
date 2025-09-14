import { OnboardingStep, OnboardingStepConfig } from "./onboarding.types";

// Step configuration - defines the onboarding flow
export const ONBOARDING_STEPS: OnboardingStepConfig[] = [
  {
    id: OnboardingStep.ROLE_SELECTION,
    title: "Choose Your Role",
    description: "Let us know how you'll be using MySI",
    component: "RoleSelectionStep",
    isRequired: true,
    canSkip: false,
    showFor: () => true, // Always show first step
    validate: (data) => !!data.role,
    nextStep: (data) => {
      // If SI Leader, show courses step, otherwise complete
      return data.role === "si_leader"
        ? OnboardingStep.COURSES_TAUGHT
        : OnboardingStep.COMPLETE;
    },
  },
];

// Helper functions
export function getStepConfig(
  step: OnboardingStep
): OnboardingStepConfig | null {
  return ONBOARDING_STEPS.find((config) => config.id === step) || null;
}

export function getNextStep(
  currentStep: OnboardingStep,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any
): OnboardingStep | null {
  const config = getStepConfig(currentStep);
  return config ? config.nextStep(data) : null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getVisibleSteps(data: any): OnboardingStepConfig[] {
  return ONBOARDING_STEPS.filter((step) => step.showFor(data));
}
