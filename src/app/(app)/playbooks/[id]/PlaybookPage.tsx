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
import { ErrorState, LoadingState } from "@/components/states";
import { usePlaybook } from "@/features/playbooks/hooks/usePlaybook";

import { useEffect, useState } from "react";
import {
  restrictToFirstScrollableAncestor,
  restrictToWindowEdges,
} from "@dnd-kit/modifiers";
import { useIsMobile } from "@/hooks/useIsMobile";
import { LessonCards, Strategies } from "@/types/tables";
import {
  CreateSessionForm,
  SortableStrategyCard,
  CardGhost,
} from "@/components/features";
import { useSessions } from "@/features/sessions/hooks";
import { useUser } from "@/providers";
import { CreateSessionInput } from "@/features/sessions/domain";
import { FormLayout } from "@/components/layouts";
import { useModal } from "@/hooks";
import { StrategySelectionForm } from "@/components/features/strategies/StrategySelectionForm";
import { useRouter } from "next/navigation";

export default function PlaybookPage({ playbookId }: { playbookId: string }) {
  const [strategies, setStrategies] = useState<LessonCards[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const isMobile = useIsMobile();
  const { user } = useUser();
  const { addSession } = useSessions(user.id);
  const [selectedStrategy, setSelectedStrategy] = useState<LessonCards | null>(
    null
  );
  const {
    refetch,
    playbook,
    isLoading,
    updatePlaybookStrategy,
    updateStrategySteps,
    reorderStrategies,
  } = usePlaybook(playbookId);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  );
  const router = useRouter();
  useEffect(() => {
    setStrategies(playbook?.strategies || []);
  }, [playbook]);

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
        defaultValues={{
          course_name: playbook?.course_name || "",
          topic: playbook?.topic || "",
        }}
        onCancel={() => closeSessionCreationModal()}
        isLoading={addSession.isPending}
        onSubmit={async (data) => {
          try {
            await handleSessionSubmit(data);
            closeStrategySelectionModal();
          } catch (error) {
            throw error;
          }
        }}
      >
        <CreateSessionForm />
      </FormLayout>
    ),
  });

  const {
    modal: strategySelectionModal,
    openModal: openStrategySelectionModal,
    closeModal: closeStrategySelectionModal,
  } = useModal({
    title: "Strategy Select",
    description: "Select a strategy to add in replacement",
    hidesDescription: true,

    children: (
      <FormLayout<{ strategy: Strategies }>
        onCancel={() => closeStrategySelectionModal()}
        enableBeforeUnloadProtection={false}
        submitButtonClassName="bg-gradient-to-r from-primary-400 to-secondary-500 hover:from-primary-400/90 hover:to-secondary-500/90 text-white border-0 shadow-md hover:shadow-xl transition-all duration-200"
        showsCancelButton={false}
        isLoading={updatePlaybookStrategy.isPending}
        onSubmit={async (data) => {
          if (selectedStrategy) {
            const { steps, slug, title } = data.strategy;
            await updatePlaybookStrategy.mutateAsync({
              playbookId: playbookId,
              cardSlug: selectedStrategy.card_slug,
              data: { steps, card_slug: slug, title },
            });
          }

          closeStrategySelectionModal();
        }}
      >
        <StrategySelectionForm />
      </FormLayout>
    ),
  });
  const handleSessionSubmit = async (data: CreateSessionInput) => {
    try {
      const { start_date, start_time, ...rest } = data; //exclude start date and time

      const startDate = `${start_date.split("T")[0]}T${start_time}`;
      await addSession.mutateAsync({
        ...rest,
        lesson_id: playbookId || "",
        scheduled_start: new Date(startDate).toISOString(),
      });
      closeSessionCreationModal();
      router.push("/sessions");
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

  const handleReplaceClick = (strategy: LessonCards) => {
    setSelectedStrategy(strategy);
    openStrategySelectionModal();
  };
  if (isLoading) return <LoadingState />;
  if (!playbook) {
    return (
      <ErrorState variant="card" message="This lesson could not be found." />
    );
  }

  return (
    <main>
      {sessionCreationModal}
      {strategySelectionModal}
      <div className="container">
        <div className="flex flex-col items-start md:flex-row gap-6 bg-background p-6 rounded-xl shadow-md justify-between md:items-center">
          <h1 className="text-2xl font-semibold">Lesson: {playbook.topic}</h1>

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
            const oldIndex = strategies.findIndex((c) => c.id === active.id);
            const newIndex = strategies.findIndex((c) => c.id === over.id);
            const next = arrayMove(strategies, oldIndex, newIndex).map(
              (c, i) => ({
                ...c,
                position: i,
              })
            );
            reorderStrategies({ playbookId: playbook.id, strategies: next });
            setStrategies(next);
          }}
          onDragCancel={() => {
            document.body.style.overscrollBehavior = "";
            document.body.style.cursor = "";
            setActiveId(null);
          }}
        >
          <SortableContext
            items={strategies}
            strategy={
              isMobile ? verticalListSortingStrategy : rectSortingStrategy
            }
          >
            <ul className=" grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-md lg:max-w-7xl m-auto">
              {strategies.map((s) => (
                <SortableStrategyCard
                  onReplaceClick={() => handleReplaceClick(s)}
                  key={s.id}
                  onCardStepsUpdate={(steps) =>
                    updateStrategySteps({
                      playbookId: playbook.id,
                      strategyId: s.id,
                      steps,
                    })
                  }
                  onImproveClick={async () => await improve(s.id)}
                  strategy={s}
                />
              ))}
            </ul>
          </SortableContext>

          {/*This lifts the dragged card out of the layout for buttery effect */}
          <DragOverlay dropAnimation={{ duration: 150 }}>
            {activeId ? (
              <CardGhost
                position={strategies.find((c) => c.id === activeId)!.position}
              />
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </main>
  );
}
