"use client";

import { Button, Card } from "@/components";
import { useLesson } from "@/features/lessons/hooks/use-lesson";
import { closestCenter, DndContext } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

export default function LessonPageClient({ id }: { id: string }) {
  const { lesson, cards, isLoading, updateCardSteps, reorderCards } =
    useLesson(id);

  if (isLoading) return <p>Loading...</p>;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = cards.findIndex((c) => c.id === active.id);
    const newIndex = cards.findIndex((c) => c.id === over.id);
    const next = arrayMove(cards, oldIndex, newIndex).map((c, i) => ({
      id: c.id,
      position: i,
    }));
    reorderCards(next);
  };

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-semibold">Lesson: {lesson?.topic}</h1>
      <Button>Save</Button>
      <ul className="flex space-y-4 gap-5 flex-col xl:flex-row">
        {cards.map((c) => (
          <Card className="strategy-card" key={c.id}>
            <h3 className="font-bold text-xl">{c.title}</h3>
            <ol>
              {c.steps.map((s: string, i: number) => (
                <li className="flex items-center gap-4 py-3" key={i}>
                  <div className="text-primary-600 text-pr w-7 h-7 bg-primary-100 rounded-full items-center justify-center flex">
                    <span>{i + 1}</span>
                  </div>

                  <p
                    className="hover:bg-foreground/5 p-3 rounded-md"
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) =>
                      updateCardSteps({
                        cardId: c.id,
                        steps: [
                          ...c.steps.slice(0, i),
                          e.currentTarget.textContent || "",
                          ...c.steps.slice(i + 1),
                        ],
                      })
                    }
                  >
                    {s}
                  </p>
                </li>
              ))}
            </ol>
          </Card>
        ))}
      </ul>
    </div>
  );
}
