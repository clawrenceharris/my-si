import React from "react";
import { Button, Card, CardContent, CardHeader } from "@/components/ui";
import { Brain, Dumbbell, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";
import { LessonCards } from "@/types/tables";
import { SignedIn } from "@clerk/nextjs";

interface VirtualStrategyCardProps {
  card: LessonCards;
  onStartClick: () => void;
  isHost: boolean;
}

const getCardBackgroundColor = (position: number) => {
  switch (position) {
    case 0:
      return "bg-success-500";
    case 1:
      return "bg-secondary-500";
    case 2:
      return "bg-accent-400";
  }
};

export function VirtualStrategyCard({
  card,
  isHost,
  onStartClick,
}: VirtualStrategyCardProps) {
  const getCardIcon = (position: number) => {
    switch (position) {
      case 0:
        return <Brain />;
      case 1:
        return <Dumbbell />;
      default:
        return <Lightbulb />;
    }
  };
  if (card.card_slug === "snowball") console.log(card);

  return (
    <Card className="strategy-card flex-1 p-0 relative rounded-2xl border border-border shadow-md bg-card text-card-foreground transition-transform">
      <CardHeader
        className={cn(
          `flex relative text-background items-center p-3 gap-6 rounded-tl-2xl rounded-tr-2xl`,
          `${getCardBackgroundColor(card.position)}`
        )}
      >
        <div className="min-w-[40px] min-h-[40px] bg-foreground/20 rounded-full flex items-center justify-center">
          {getCardIcon(card.position)}
        </div>
        <div className="w-full">
          <div>
            <h2 className="font-bold text-xl">{card.title} </h2>
          </div>
          <div className="flex items-center  justify-between">
            <span className="uppercase font-light text-background/70 text-sm">
              {card.position === 0
                ? "warmup"
                : card.position === 1
                ? "workout"
                : "closer"}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isHost ? (
          <SignedIn>
            {card.virtualized && (
              <div className="space-y-5">
                <p className="text-muted-foreground bg-muted rounded-xl py-3 px-5 text-sm">
                  This strategy is set up for Virtual Playbook
                </p>

                <Button onClick={onStartClick}>Run Play: {card.title}</Button>
              </div>
            )}
          </SignedIn>
        ) : (
          <p className="text-muted-foreground bg-muted rounded-xl py-3 px-5 text-sm">
            {card.description}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
