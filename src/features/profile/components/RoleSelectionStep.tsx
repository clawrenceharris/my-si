import { GraduationCap, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { UserRole } from "@/types/user";

interface RoleOption {
  id: UserRole;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
}

const roleOptions: RoleOption[] = [
  {
    id: "student",
    title: "I'm a Student",
    icon: GraduationCap,
  },
  {
    id: "si_leader",
    title: "I'm an SI Leader",
    icon: Users,
  },
];

interface RoleSelectionStepProps {
  selectedRole?: UserRole;
  onRoleSelect: (role: UserRole) => void;
  onNext: () => void;
  canProceed: boolean;
}

export function RoleSelectionStep({
  selectedRole,
  onRoleSelect,
  onNext,
  canProceed,
}: RoleSelectionStepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
          Choose Your Role
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Let us know how you&apos;ll be using MySI to personalize your
          experience
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {roleOptions.map((option) => {
          const Icon = option.icon;
          const isSelected = selectedRole === option.id;

          return (
            <button
              key={option.id}
              onClick={() => onRoleSelect(option.id)}
              aria-pressed={isSelected}
              className={cn(
                "p-3 rounded-lg border-2 text-left transition-all duration-200",
                "hover:border-blue-300 hover:shadow-md",
                "focus:outline-none focus:ring-2 focus:ring-blue-300",
                isSelected
                  ? "bg-blue-50 border-blue-300  dark:bg-blue-950 dark:border-blue-400"
                  : "border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
              )}
            >
              <div className="flex flex-col items-start gap-4">
                <div
                  className={cn(
                    "p-3 rounded-lg",
                    isSelected
                      ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400"
                      : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                  )}
                >
                  <Icon className="h-6 w-6" />
                </div>

                <div className="flex-1 space-y-2">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                    {option.title}
                  </h3>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex justify-end">
        <Button onClick={onNext} disabled={!canProceed} className="px-8">
          Continue
        </Button>
      </div>
    </div>
  );
}
