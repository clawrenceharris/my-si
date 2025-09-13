import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  COMMON_COURSES,
  COURSE_DEPARTMENTS,
} from "../domain/onboarding.config";
// Removed unused import

interface CourseSelectionStepProps {
  selectedCourses: string[];
  onCoursesChange: (courses: string[]) => void;
  onNext: () => void;
  onSkip: () => void;
}

export function CourseSelectionStep({
  selectedCourses,
  onCoursesChange,
  onNext,
  onSkip,
}: CourseSelectionStepProps) {
  const handleCourseToggle = (courseId: string) => {
    const isSelected = selectedCourses.includes(courseId);

    if (isSelected) {
      onCoursesChange(selectedCourses.filter((id) => id !== courseId));
    } else {
      onCoursesChange([...selectedCourses, courseId]);
    }
  };

  const getCoursesByDepartment = (department: string) => {
    return COMMON_COURSES.filter(
      (course) =>
        course.department.toLowerCase().replace(/[^a-z]/g, "-") === department
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
          Courses You Instruct
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Select the courses you provide SI support for to help students find
          your sessions
        </p>
        {selectedCourses.length > 0 && (
          <p className="text-sm text-blue-600 dark:text-blue-400">
            {selectedCourses.length} courses selected
          </p>
        )}
      </div>

      <div className="space-y-8">
        {COURSE_DEPARTMENTS.map((department) => {
          const courses = getCoursesByDepartment(department.id);

          if (courses.length === 0) return null;

          return (
            <div key={department.id} className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  {department.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {department.description}
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {courses.map((course) => {
                  const isSelected = selectedCourses.includes(course.id);

                  return (
                    <button
                      key={course.id}
                      onClick={() => handleCourseToggle(course.id)}
                      aria-pressed={isSelected}
                      className={cn(
                        "p-4 rounded-lg border text-left transition-all duration-200",
                        "hover:border-blue-300 hover:shadow-sm",
                        "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                        isSelected
                          ? "border-blue-500 bg-blue-50 ring-2 ring-blue-500 dark:bg-blue-950 dark:border-blue-400"
                          : "border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
                      )}
                    >
                      <div className="space-y-1">
                        <h4 className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                          {course.code}
                        </h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {course.name}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
        <Button
          variant="ghost"
          onClick={onSkip}
          className="text-gray-600 dark:text-gray-400"
        >
          Skip for now
        </Button>

        <Button onClick={onNext} className="px-8">
          Continue
        </Button>
      </div>
    </div>
  );
}
