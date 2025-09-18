"use client";
import { Button } from "@/components/ui";
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
  DragOverlay,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  rectSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { LoadingState } from "@/components/states";
import { useLesson } from "@/features/lessons/hooks/useLesson";
import {
  CreateSessionInput,
  createSessionSchema,
} from "@/features/sessions/domain";
import { useSession } from "@/features/sessions/hooks";
import { useModal } from "@/shared";
import { zodResolver } from "@hookform/resolvers/zod";

import { useEffect, useState } from "react";
import {
  restrictToFirstScrollableAncestor,
  restrictToWindowEdges,
} from "@dnd-kit/modifiers";
import { useIsMobile } from "@/hooks/useIsMobile";
import { LessonCards } from "@/types/tables";
import { FormLayout } from "@/components/forms";
import {
  CreateSessionForm,
  SortableStrategyCard,
  CardGhost,
} from "@/components/features";

export default function LessonPage({ lessonId }: { lessonId: string }) {
  const { createSession, isCreatingSession: creatingSession } = useSession();
  const [cards, setCards] = useState<LessonCards[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const isMobile = useIsMobile();

  const { refetch, lesson, isLoading, updateCardSteps, reorderCards } =
    useLesson(lessonId);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  );
  useEffect(() => {
    setCards(lesson?.cards || []);
  }, [lesson]);

  const {
    modal: sessionCreationModal,
    openModal: openSessionCreationModal,
    closeModal: closeSessionCreationModal,
  } = useModal({
    title: "Create Session",
    description: "Create a session from this lesson plan",
    hidesDescription: true,
    children: (
      <FormLayout<CreateSessionInput>
        onCancel={() => closeSessionCreationModal()}
        isLoading={creatingSession}
        defaultValues={{ topic: lesson?.topic || "" }}
        resolver={zodResolver(createSessionSchema)}
        onSubmit={async (data) => {
          try {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { start_date, start_time, ...rest } = data; //exclude start date and time

            const startDate = `${data.start_date.split("T")[0]}T${
              data.start_time
            }`;
            await createSession({
              ...rest,
              lesson_id: lesson?.id,
              scheduled_start: new Date(startDate).toISOString(),
            });
            closeSessionCreationModal();
          } catch {}
        }}
      >
        <CreateSessionForm />
      </FormLayout>
    ),
  });

  const improve = async (id: string) => {
    try {
      await fetch("/api/cards/improve", {
        method: "POST",
        body: JSON.stringify({ lessonCardId: id }),
      });
      refetch();
    } catch (error) {
      console.error(
        `An error occured." ${error instanceof Error ? error.message : ""}`
      );
    }
  };
  if (isLoading) return <LoadingState />;

  return (
    <div className="p-6 space-y-12">
      {sessionCreationModal}
      <div className="flex flex-col items-start md:flex-row gap-6 bg-background p-6 rounded-xl shadow-md justify-between md:items-center">
        <h1 className="text-2xl font-semibold">Lesson: {lesson?.topic}</h1>

        <Button onClick={openSessionCreationModal}>Create Session</Button>
      </div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        modifiers={[restrictToFirstScrollableAncestor, restrictToWindowEdges]}
        onDragStart={({ active }) => {
          setActiveId(String(active.id));
          document.body.style.overscrollBehavior = "contain";
          document.body.style.cursor = "grabbing";
        }}
        onDragEnd={({ active, over }) => {
          document.body.style.overscrollBehavior = "";
          document.body.style.cursor = "";
          setActiveId(null);

          if (!over || active.id === over.id) return;
          const oldIndex = cards.findIndex((c) => c.id === active.id);
          const newIndex = cards.findIndex((c) => c.id === over.id);
          const next = arrayMove(cards, oldIndex, newIndex).map((c, i) => ({
            ...c,
            position: i,
          }));
          reorderCards(next);
          setCards(next);
        }}
        onDragCancel={() => {
          document.body.style.overscrollBehavior = "";
          document.body.style.cursor = "";
          setActiveId(null);
        }}
      >
        <SortableContext
          items={cards}
          strategy={
            isMobile ? verticalListSortingStrategy : rectSortingStrategy
          }
        >
          <ul className=" grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-md lg:max-w-7xl m-auto">
            {cards.map((card) => (
              <SortableStrategyCard
                key={card.id}
                onCardStepsUpdate={(steps) =>
                  updateCardSteps({ id: card.id, steps })
                }
                onImproveClick={async () => await improve(card.id)}
                card={card}
              />
            ))}
          </ul>
        </SortableContext>

        {/*This lifts the dragged card out of the layout for buttery effect */}
        <DragOverlay dropAnimation={{ duration: 150 }}>
          {activeId ? (
            <CardGhost
              position={cards.find((c) => c.id === activeId)!.position}
            />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
