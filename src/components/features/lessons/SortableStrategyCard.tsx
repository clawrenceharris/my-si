import { useSortable } from "@dnd-kit/sortable";
import React from "react";
import { CSS } from "@dnd-kit/utilities";
import { Button, Card, CardContent, CardHeader } from "@/components/ui";
import { Bookmark, Brain, Dumbbell, Lightbulb, Wand2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { LessonCards } from "@/types/tables";
import clsx from "clsx";

interface SortableStrategyCardProps {
  card: LessonCards;
  onCardStepsUpdate: (data: string[]) => void;
  onImproveClick: () => Promise<void>;
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

export function CardGhost({ position }: { position: number }) {
  return (
    <div className="rounded-2xl border border-border bg-card text-card-foreground shadow-lg p-4 opacity-90 transform-gpu">
      <div
        className={`h-10 ${getCardBackgroundColor(position)} rounded-md mb-3`}
      />
      <div className="space-y-2">
        <div className="h-3 bg-muted rounded" />
        <div className="h-3 bg-muted rounded" />
        <div className="h-3 bg-muted rounded" />
      </div>
    </div>
  );
}

export function SortableStrategyCard({
  card,
  onImproveClick,
  onCardStepsUpdate,
}: SortableStrategyCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef, // <-- handle is the activator
    transform,
    transition,
    index,
    isDragging,
  } = useSortable({ id: card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

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
  const handleImproveClick = async () => {
    await onImproveClick();
  };
  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={` strategy-card flex-1 p-0 relative rounded-2xl border border-border shadow-md
                  bg-card text-card-foreground transition-transform
                  ${isDragging ? "ring-2 ring-primary-500" : ""}`}
    >
      {/* Notch handle */}
      <button
        ref={setActivatorNodeRef}
        {...attributes}
        {...listeners}
        aria-label="Drag to reorder"
        className="absolute z-9 -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full
                     bg-white text-foreground shadow border border-border
                     cursor-grab active:cursor-grabbing touch-none"
      />
      <CardHeader
        className={cn(
          `flex relative text-background items-center p-3 gap-6 rounded-tl-2xl rounded-tr-2xl`,
          `${getCardBackgroundColor(index)}`
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
            <div className="flex">
              <Button
                className="rounded-full"
                variant={"ghost"}
                size={"sm"}
                aria-label="Add to favorites"
                onMouseEnter={(e) => {
                  const text = document.createElement("p");
                  text.textContent = "Save";

                  e.currentTarget.appendChild(text);
                }}
                onMouseLeave={(e) => {
                  if (e.currentTarget.lastChild) {
                    e.currentTarget.removeChild(e.currentTarget.lastChild);
                  }
                }}
              >
                <Bookmark />
              </Button>

              <Button
                className="rounded-full"
                variant={"ghost"}
                onClick={handleImproveClick}
                size={"sm"}
                aria-label="Add to favorites"
                onMouseEnter={(e) => {
                  const text = document.createElement("p");
                  text.textContent = "AI Enhance";

                  e.currentTarget.appendChild(text);
                }}
                onMouseLeave={(e) => {
                  if (e.currentTarget.lastChild) {
                    e.currentTarget.removeChild(e.currentTarget.lastChild);
                  }
                }}
              >
                <Wand2 />
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <ol className="text-foreground/80 space-y-4">
          {card.steps.map((s: string, i: number) => (
            <li className="flex items-center gap-1 " key={i}>
              <div
                className={`text-pr min-w-7 min-h-7  rounded-full items-center justify-center flex ${clsx(
                  {
                    "text-success-500 bg-success-100": card.position === 0,
                    "text-secondary-500 bg-secondary-100": card.position === 1,
                    "text-accent-400 bg-accent-100": card.position === 2,
                  }
                )}`}
              >
                <span>{i + 1}</span>
              </div>

              <p
                className="hover:bg-foreground/4 p-3 rounded-md max-w-sm"
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => {
                  onCardStepsUpdate([
                    ...card.steps.slice(0, i),
                    e.currentTarget.textContent || "",
                    ...card.steps.slice(i + 1),
                  ]);
                }}
              >
                {s}
              </p>
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  );
}
