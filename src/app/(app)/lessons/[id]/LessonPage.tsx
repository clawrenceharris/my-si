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

import { useEffect, useState } from "react";
import {
  restrictToFirstScrollableAncestor,
  restrictToWindowEdges,
} from "@dnd-kit/modifiers";
import { useIsMobile } from "@/hooks/useIsMobile";
import { LessonCards } from "@/types/tables";
import {
  CreateSessionForm,
  SortableStrategyCard,
  CardGhost,
} from "@/components/features";
import { useSessions } from "@/features/sessions/hooks";
import { useUser } from "@/providers";
import { CreateSessionInput } from "@/features/sessions/domain";
import { useVirtualMeeting } from "@/features/sessions/hooks/useVirtualMeeting";
import { FormLayout } from "@/components/forms";
import { useModal } from "@/hooks";

export default function LessonPage({ lessonId }: { lessonId: string }) {
  const [cards, setCards] = useState<LessonCards[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const isMobile = useIsMobile();
  const { user } = useUser();
  const { addSession } = useSessions(user.id);
  const { createVirtualMeeting } = useVirtualMeeting();
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
        defaultValues={{ topic: lesson?.topic || "" }}
        onCancel={() => closeSessionCreationModal()}
        isLoading={addSession.isPending}
        onSubmit={async (data) => await handleSessionSubmit(data)}
      >
        <CreateSessionForm />
      </FormLayout>
    ),
  });
  const handleSessionSubmit = async (data: CreateSessionInput) => {
    try {
      const { start_date, start_time, ...rest } = data; //exclude start date and time

      const startDate = `${start_date.split("T")[0]}T${start_time}`;
      let callId: string | null = null;
      if (data.virtual) {
        const call = await createVirtualMeeting({
          ...data,
          scheduled_start: startDate,
        });
        if (!call) {
          throw new Error("Call not created.");
        }
        callId = call.id;
      }

      await addSession.mutateAsync({
        ...rest,
        lesson_id: lessonId || "",
        call_id: callId,
        scheduled_start: new Date(startDate).toISOString(),
      });
      closeSessionCreationModal();
    } catch {}
  };

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
    <div className="container space-y-12">
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
