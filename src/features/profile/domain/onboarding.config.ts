import {
  OnboardingStep,
  OnboardingStepConfig,
  Course,
} from "./onboarding.types";

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
  {
    id: OnboardingStep.COURSES_TAUGHT,
    title: "Courses You Instruct",
    description: "Select the courses you provide SI support for (optional)",
    component: "CourseSelectionStep",
    isRequired: false,
    canSkip: true,
    showFor: (data) => data.role === "si_leader",
    validate: () => true, // Optional step, always valid
    nextStep: () => OnboardingStep.COMPLETE,
  },
];

// Common course options for SI Leaders
export const COMMON_COURSES: Course[] = [
  // Mathematics
  {
    id: "math_101",
    name: "College Algebra",
    code: "MATH 101",
    department: "Mathematics",
  },
  {
    id: "math_110",
    name: "Precalculus",
    code: "MATH 110",
    department: "Mathematics",
  },
  {
    id: "math_120",
    name: "Calculus I",
    code: "MATH 120",
    department: "Mathematics",
  },
  {
    id: "math_121",
    name: "Calculus II",
    code: "MATH 121",
    department: "Mathematics",
  },
  {
    id: "math_220",
    name: "Calculus III",
    code: "MATH 220",
    department: "Mathematics",
  },
  {
    id: "math_230",
    name: "Linear Algebra",
    code: "MATH 230",
    department: "Mathematics",
  },
  {
    id: "math_240",
    name: "Differential Equations",
    code: "MATH 240",
    department: "Mathematics",
  },
  {
    id: "stat_101",
    name: "Introduction to Statistics",
    code: "STAT 101",
    department: "Mathematics",
  },

  // Sciences
  {
    id: "chem_101",
    name: "General Chemistry I",
    code: "CHEM 101",
    department: "Chemistry",
  },
  {
    id: "chem_102",
    name: "General Chemistry II",
    code: "CHEM 102",
    department: "Chemistry",
  },
  {
    id: "chem_201",
    name: "Organic Chemistry I",
    code: "CHEM 201",
    department: "Chemistry",
  },
  {
    id: "phys_101",
    name: "Physics I",
    code: "PHYS 101",
    department: "Physics",
  },
  {
    id: "phys_102",
    name: "Physics II",
    code: "PHYS 102",
    department: "Physics",
  },
  {
    id: "bio_101",
    name: "General Biology I",
    code: "BIO 101",
    department: "Biology",
  },
  {
    id: "bio_102",
    name: "General Biology II",
    code: "BIO 102",
    department: "Biology",
  },

  // Computer Science
  {
    id: "cs_101",
    name: "Introduction to Programming",
    code: "CS 101",
    department: "Computer Science",
  },
  {
    id: "cs_102",
    name: "Data Structures",
    code: "CS 102",
    department: "Computer Science",
  },
  {
    id: "cs_201",
    name: "Algorithms",
    code: "CS 201",
    department: "Computer Science",
  },
  {
    id: "cs_250",
    name: "Computer Systems",
    code: "CS 250",
    department: "Computer Science",
  },

  // Engineering
  {
    id: "engr_101",
    name: "Introduction to Engineering",
    code: "ENGR 101",
    department: "Engineering",
  },
  {
    id: "engr_201",
    name: "Statics",
    code: "ENGR 201",
    department: "Engineering",
  },
  {
    id: "engr_202",
    name: "Dynamics",
    code: "ENGR 202",
    department: "Engineering",
  },

  // Business
  {
    id: "econ_101",
    name: "Microeconomics",
    code: "ECON 101",
    department: "Economics",
  },
  {
    id: "econ_102",
    name: "Macroeconomics",
    code: "ECON 102",
    department: "Economics",
  },
  {
    id: "acct_101",
    name: "Financial Accounting",
    code: "ACCT 101",
    department: "Accounting",
  },

  // Other
  {
    id: "psyc_101",
    name: "Introduction to Psychology",
    code: "PSYC 101",
    department: "Psychology",
  },
  {
    id: "engl_101",
    name: "College Writing",
    code: "ENGL 101",
    department: "English",
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

export function getCoursesByDepartment(department?: string): Course[] {
  if (!department) return COMMON_COURSES;
  return COMMON_COURSES.filter((course) => course.department === department);
}

export const COURSE_DEPARTMENTS = [
  {
    id: "mathematics",
    name: "Mathematics",
    description: "Math and Statistics courses",
  },
  { id: "chemistry", name: "Chemistry", description: "Chemistry courses" },
  { id: "physics", name: "Physics", description: "Physics courses" },
  { id: "biology", name: "Biology", description: "Biology and Life Sciences" },
  {
    id: "computer-science",
    name: "Computer Science",
    description: "Programming and CS courses",
  },
  {
    id: "engineering",
    name: "Engineering",
    description: "Engineering courses",
  },
  {
    id: "economics",
    name: "Economics & Business",
    description: "Economics and Business courses",
  },
  { id: "other", name: "Other", description: "Other subjects" },
] as const;
