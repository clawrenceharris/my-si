import { useReducer, useCallback, useMemo } from "react";
import {
  OnboardingState,
  OnboardingAction,
  OnboardingStep,
  OnboardingData,
  UseOnboardingReturn,
} from "../domain/onboarding.types";
import {
  getStepConfig,
  getNextStep,
  getVisibleSteps,
} from "../domain/onboarding.config";

// Initial state
const initialState: OnboardingState = {
  currentStep: OnboardingStep.ROLE_SELECTION,
  completedSteps: [],
  data: {},
  isComplete: false,
  canSkipCurrentStep: false,
};

// Reducer function
function onboardingReducer(
  state: OnboardingState,
  action: OnboardingAction
): OnboardingState {
  switch (action.type) {
    case "SET_STEP": {
      const stepConfig = getStepConfig(action.step);
      return {
        ...state,
        currentStep: action.step,
        isComplete: action.step === OnboardingStep.COMPLETE,
        canSkipCurrentStep: stepConfig?.canSkip || false,
      };
    }

    case "UPDATE_DATA": {
      const newData = { ...state.data, ...action.data };
      const stepConfig = getStepConfig(state.currentStep);

      return {
        ...state,
        data: newData,
        canSkipCurrentStep: stepConfig?.canSkip || false,
      };
    }

    case "COMPLETE_STEP": {
      const completedSteps = [...state.completedSteps];
      if (!completedSteps.includes(action.step)) {
        completedSteps.push(action.step);
      }

      const nextStep = getNextStep(action.step, state.data);
      const isComplete =
        nextStep === OnboardingStep.COMPLETE || nextStep === null;

      return {
        ...state,
        completedSteps,
        currentStep: nextStep || OnboardingStep.COMPLETE,
        isComplete,
        canSkipCurrentStep: nextStep
          ? getStepConfig(nextStep)?.canSkip || false
          : false,
      };
    }

    case "SKIP_STEP": {
      const stepConfig = getStepConfig(state.currentStep);
      if (!stepConfig?.canSkip) {
        return state; // Can't skip required steps
      }

      const nextStep = getNextStep(state.currentStep, state.data);
      const isComplete =
        nextStep === OnboardingStep.COMPLETE || nextStep === null;

      return {
        ...state,
        currentStep: nextStep || OnboardingStep.COMPLETE,
        isComplete,
        canSkipCurrentStep: nextStep
          ? getStepConfig(nextStep)?.canSkip || false
          : false,
      };
    }

    case "GO_BACK": {
      const visibleSteps = getVisibleSteps(state.data);
      const currentIndex = visibleSteps.findIndex(
        (step) => step.id === state.currentStep
      );

      if (currentIndex > 0) {
        const previousStep = visibleSteps[currentIndex - 1];
        const stepConfig = getStepConfig(previousStep.id);

        return {
          ...state,
          currentStep: previousStep.id,
          isComplete: false,
          canSkipCurrentStep: stepConfig?.canSkip || false,
        };
      }

      return state;
    }

    case "RESET": {
      return initialState;
    }

    default:
      return state;
  }
}

// Main hook
export function useOnboarding(): UseOnboardingReturn {
  const [state, dispatch] = useReducer(onboardingReducer, initialState);

  // Actions
  const setStep = useCallback((step: OnboardingStep) => {
    dispatch({ type: "SET_STEP", step });
  }, []);

  const updateData = useCallback((data: Partial<OnboardingData>) => {
    dispatch({ type: "UPDATE_DATA", data });
  }, []);

  const completeStep = useCallback((step: OnboardingStep) => {
    dispatch({ type: "COMPLETE_STEP", step });
  }, []);

  const skipStep = useCallback(() => {
    dispatch({ type: "SKIP_STEP" });
  }, []);

  const goBack = useCallback(() => {
    dispatch({ type: "GO_BACK" });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: "RESET" });
  }, []);

  const goToNextStep = useCallback(() => {
    const stepConfig = getStepConfig(state.currentStep);
    if (stepConfig?.validate(state.data)) {
      completeStep(state.currentStep);
    }
  }, [state.currentStep, state.data, completeStep]);

  // Helpers
  const getCurrentStepConfig = useCallback(() => {
    return getStepConfig(state.currentStep);
  }, [state.currentStep]);

  const getProgress = useCallback(() => {
    const visibleSteps = getVisibleSteps(state.data);
    const totalSteps = visibleSteps.length;
    const currentStepIndex = visibleSteps.findIndex(
      (step) => step.id === state.currentStep
    );
    const completedCount = state.completedSteps.length;

    return {
      current: currentStepIndex + 1,
      total: totalSteps,
      percentage:
        totalSteps > 0 ? Math.round((completedCount / totalSteps) * 100) : 0,
    };
  }, [state.currentStep, state.completedSteps, state.data]);

  const canGoBack = useMemo(() => {
    const visibleSteps = getVisibleSteps(state.data);
    const currentIndex = visibleSteps.findIndex(
      (step) => step.id === state.currentStep
    );
    return currentIndex > 0;
  }, [state.currentStep, state.data]);

  const canGoNext = useMemo(() => {
    const stepConfig = getStepConfig(state.currentStep);
    return stepConfig?.validate(state.data) || false;
  }, [state.currentStep, state.data]);

  return {
    state,
    actions: {
      setStep,
      updateData,
      completeStep,
      skipStep,
      goBack,
      reset,
      goToNextStep,
    },
    helpers: {
      getCurrentStepConfig,
      getProgress,
      canGoBack,
      canGoNext,
    },
  };
}
