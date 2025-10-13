import { Brain, Dumbbell, Lightbulb } from "lucide-react";

export const getCardBackgroundColor = (position: number) => {
  switch (position) {
    case 0:
      return "bg-success-500";
    case 1:
      return "bg-secondary-500";
    case 2:
      return "bg-accent-400";
  }
};

export const getCardIcon = (position: number) => {
  switch (position) {
    case 0:
      return <Brain />;
    case 1:
      return <Dumbbell />;
    default:
      return <Lightbulb />;
  }
};
