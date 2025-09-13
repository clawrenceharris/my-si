import { UserRole } from "./profiles.types";

// Onboarding step identifiers
export enum OnboardingStep {
  ROLE_SELECTION = "role_selection",
  COURSES_TAUGHT = "courses_taught",
  COMPLETE = "complete",
}

// Onboarding state
export interface OnboardingState {
  currentStep: OnboardingStep;
  completedSteps: OnboardingStep[];
  data: OnboardingData;
  isComplete: boolean;
  canSkipCurrentStep: boolean;
}

// Collected onboarding data
export interface OnboardingData {
  role?: UserRole;
  coursesInstructed?: string[];
  preferences?: Record<string, unknown>;
}

// Step configuration
export interface OnboardingStepConfig {
  id: OnboardingStep;
  title: string;
  description: string;
  component: string; // Component name for dynamic loading
  isRequired: boolean;
  canSkip: boolean;
  showFor: (data: OnboardingData) => boolean;
  validate: (data: OnboardingData) => boolean;
  nextStep: (data: OnboardingData) => OnboardingStep | null;
}

// Course options for SI Leaders
export interface Course {
  id: string;
  name: string;
  code: string;
  department: string;
}

// Onboarding actions
export type OnboardingAction =
  | { type: "SET_STEP"; step: OnboardingStep }
  | { type: "UPDATE_DATA"; data: Partial<OnboardingData> }
  | { type: "COMPLETE_STEP"; step: OnboardingStep }
  | { type: "SKIP_STEP" }
  | { type: "GO_BACK" }
  | { type: "RESET" };

// Hook return type
export interface UseOnboardingReturn {
  state: OnboardingState;
  actions: {
    setStep: (step: OnboardingStep) => void;
    updateData: (data: Partial<OnboardingData>) => void;
    completeStep: (step: OnboardingStep) => void;
    skipStep: () => void;
    goBack: () => void;
    reset: () => void;
    goToNextStep: () => void;
  };
  helpers: {
    getCurrentStepConfig: () => OnboardingStepConfig | null;
    getProgress: () => { current: number; total: number; percentage: number };
    canGoBack: boolean;
    canGoNext: boolean;
  };
}
