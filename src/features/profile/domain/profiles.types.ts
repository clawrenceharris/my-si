export interface UserProfile {
  id: string;
  full_name: string | null;
  avatar_url?: string;
  role?: UserRole;
  onboarding_complete: boolean;
  courses_instructed: string[];
  created_at: string | null;
}

export type UserRole = "si_leader" | "student" | "coordinator";
