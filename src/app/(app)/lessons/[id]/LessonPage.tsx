"use client";
import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  FormLayout,
} from "@/components";
import { CreateSessionForm } from "@/components/features";
import { LoadingState } from "@/components/states";
import { useLesson } from "@/features/lessons/hooks/useLesson";
import {
  CreateSessionInput,
  createSessionSchema,
} from "@/features/sessions/domain";
import { useSession } from "@/features/sessions/hooks";
import { cn } from "@/lib/utils";
import { useSupabaseClient } from "@/providers";
import { useModal } from "@/shared";
import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";

import {
  Bookmark,
  Brain,
  Dumbbell,
  Heart,
  Lightbulb,
  Redo2,
  Wand2,
} from "lucide-react";
import { createElement } from "react";

export default function LessonPage({ id }: { id: string }) {
  const { lesson, cards, isLoading, updateCardSteps } = useLesson(id);
  const client = useSupabaseClient();
  const { createSession } = useSession();

  const { modal: sessionCreationModal, openModal: openSessionCreationModal } =
    useModal({
      children: (
        <FormLayout<CreateSessionInput>
          defaultValues={{ lessonId: id }}
          resolver={zodResolver(createSessionSchema)}
          onSubmit={createSession}
        >
          <CreateSessionForm />
        </FormLayout>
      ),
      title: "Create Session",
    });

  const improve = async (id: string) => {
    await fetch("/api/cards/improve", {
      method: "POST",
      body: JSON.stringify({ lessonCardId: id }),
    });
  };

  if (isLoading) return <LoadingState />;

  const getCardColor = (phase: "warmup" | "workout" | "closer") => {
    switch (phase) {
      case "warmup":
        return "bg-success-500";
      case "workout":
        return "bg-secondary-500";
      case "closer":
        return "bg-accent-400";
    }
  };

  const getCardIcon = (phase: "warmup" | "workout" | "closer") => {
    switch (phase) {
      case "warmup":
        return <Brain />;
      case "workout":
        return <Dumbbell />;
      default:
        return <Lightbulb />;
    }
  };

  return (
    <div className="p-6 space-y-12">
      {sessionCreationModal}
      <div className="flex flex-col items-start md:flex-row gap-6 bg-background p-6 rounded-xl shadow-md justify-between md:items-center">
        <h1 className="text-2xl font-semibold">Lesson: {lesson?.topic}</h1>

        <Button onClick={openSessionCreationModal}>Create Session</Button>
      </div>
      <div className="flex mx-auto max-w-lg lg:max-w-6xl gap-5 flex-col lg:flex-row ">
        {cards.map((c) => (
          <Card className="strategy-card flex-1 p-0" key={c.id}>
            <CardHeader
              className={cn(
                `flex relative text-background items-center p-3 gap-6 rounded-tl-2xl rounded-tr-2xl`,
                `${getCardColor(c.phase)}`
              )}
            >
              <div className="min-w-[40px] min-h-[40px] bg-foreground/20 rounded-full flex items-center justify-center">
                {getCardIcon(c.phase)}
              </div>
              <div className="w-full">
                <div>
                  <h2 className="font-bold text-xl">{c.title} </h2>
                </div>
                <div className="flex items-center  justify-between">
                  <span className="uppercase font-light text-background/70 text-sm">
                    {c.phase}
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
                          e.currentTarget.removeChild(
                            e.currentTarget.lastChild
                          );
                        }
                      }}
                    >
                      <Bookmark />
                    </Button>

                    <Button
                      className="rounded-full"
                      variant={"ghost"}
                      onClick={async () => await improve(c.id)}
                      size={"sm"}
                      aria-label="Add to favorites"
                      onMouseEnter={(e) => {
                        const text = document.createElement("p");
                        text.textContent = "AI Enhance";

                        e.currentTarget.appendChild(text);
                      }}
                      onMouseLeave={(e) => {
                        if (e.currentTarget.lastChild) {
                          e.currentTarget.removeChild(
                            e.currentTarget.lastChild
                          );
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
                {c.steps.map((s: string, i: number) => (
                  <li className="flex items-center gap-4 " key={i}>
                    <div
                      className={`${clsx({
                        "text-success-500 bg-success-100": c.phase === "warmup",
                        "text-secondary-500 bg-secondary-100":
                          c.phase === "workout",
                        "text-accent-400 bg-accent-100": c.phase === "closer",
                      })} text-pr min-w-7 min-h-7  rounded-full items-center justify-center flex`}
                    >
                      <span>{i + 1}</span>
                    </div>

                    <p
                      className="hover:bg-foreground/4 p-3 rounded-md max-w-sm"
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
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
