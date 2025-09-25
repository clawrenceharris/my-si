"use client";
import { FormLayout } from "@/components/layouts";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui";
import { Sessions } from "@/types/tables";
import { Link } from "lucide-react";
import { CreateSessionForm } from "./CreateSessionForm";
import {
  CreateSessionInput,
  createSessionSchema,
} from "@/features/sessions/domain";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSessions } from "@/features/sessions/hooks";
import { useRouter } from "next/navigation";
import { useUser } from "@/providers";
import { useModal } from "@/hooks";

interface SessionCardProps {
  session: Sessions;
}
export function SessionCard({ session }: SessionCardProps) {
  const { user } = useUser();
  const { sessionsQuery, updateSession } = useSessions(user.id);
  const router = useRouter();

  const {
    modal: confirmationModal,
    closeModal: closeConfirmationModal,
    openModal: openConfirmationModal,
  } = useModal({
    title: "Delete Session",
    hidesDescription: true,
    description:
      "Are you sure you want to delete this session. You can't undo this action.",
    children: (
      <FormLayout<{ confirm: boolean }>
        submitText="I'm sure"
        onSuccess={() => closeConfirmationModal()}
        onSubmit={async () => await updateSessionStatus("canceled")}
        onCancel={() => closeConfirmationModal()}
      ></FormLayout>
    ),
  });

  const {
    modal: editSessionModal,
    openModal: openEditSessionModal,
    closeModal: closeEditSessionModal,
  } = useModal({
    title: "Edit Session",
    description: `Edit your ${session.topic || ""} session`,
    hidesDescription: true,
    children: (
      <FormLayout<CreateSessionInput>
        resolver={zodResolver(createSessionSchema)}
        isLoading={updateSession.isPending}
        defaultValues={{
          status: "scheduled",
          topic: session.topic || "Untitled",
          course_name: session.course_name || "",
          description: session.description || "",
          virtual: session.virtual,
          start_date: session.scheduled_start?.split("T")[0] || "",
          start_time: session.scheduled_start?.split("T")[1].slice(0, 5) || "",
        }}
        onCancel={() => closeEditSessionModal()}
        onSuccess={() => closeEditSessionModal()}
        onSubmit={async (data) => await handleEditSession(data)}
      >
        <CreateSessionForm />
      </FormLayout>
    ),
  });
  const handleStartSession = async () => {
    try {
      if (session.status !== "active")
        await updateSession.mutateAsync({
          id: session.id,
          data: { status: "active" },
        });
      else if (session.virtual) {
        router.push(`/session/virtual/${session.id}`);
      }
    } catch {}
  };
  const updateSessionStatus = async (status: Sessions["status"]) => {
    try {
      await updateSession.mutateAsync({ id: session.id, data: { status } });
    } catch {}
  };

  const handleEditSession = async (data: CreateSessionInput) => {
    const { start_date, start_time, ...rest } = data; //exclude start date and time

    const startDate = `${start_date.split("T")[0]}T${start_time}`;
    await updateSession.mutateAsync({
      id: session.id,
      data: { ...rest, scheduled_start: new Date(startDate).toUTCString() },
    });
    sessionsQuery.refetch();
  };
  const handleCopy = () => {
    const link = `${window.location.origin}/session/virtual/${session.id}`;
    navigator.clipboard.writeText(link);
    alert("Link copied to clipboard!");
  };
  const statusColor: Record<Sessions["status"], string> = {
    scheduled: "bg-primary-100 text-primary-500",
    active: "bg-success-100 text-success-500",
    completed: "bg-gray-200 text-muted-foreground",
    canceled: "bg-destructive-100 text-destructive-500",
  };

  return (
    <Card className="overflow-hidden flex justify-between flex-col max-w-md hover:shadow-md transition-shadow duration-200">
      {confirmationModal}
      {editSessionModal}
      <CardHeader>
        <div className="flex justify-between items-center"></div>
        <div className="flex items-center justify-between">
          <CardTitle className="text-md font-semibold">
            {`${session.course_name ? session.course_name + ":" : ""}`}{" "}
            <span className="font-light">{session.topic}</span>
          </CardTitle>
          <span
            className={`text-xs max-w-20 flex items-center justify-center px-2 py-1 rounded-full font-medium capitalize ${
              statusColor[session.status]
            }`}
          >
            {session.status.replace("_", " ")}
          </span>
        </div>
        {session.scheduled_start && (
          <div className="text-sm text-muted-foreground">
            {new Date(session.scheduled_start).toDateString()}
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-3">
        <CardDescription className="line-clamp-3">
          {session.description || "No description"}
        </CardDescription>
      </CardContent>
      <CardFooter className="flex gap-5 justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="cursor-pointer">
            <Button variant={"link"} onClick={openEditSessionModal}>
              Edit
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {session.status !== "canceled" && session.status != "completed" && (
              <>
                <DropdownMenuItem onClick={openEditSessionModal}>
                  Update
                </DropdownMenuItem>
                <DropdownMenuSeparator />

                <DropdownMenuItem
                  variant="destructive"
                  onClick={async () => await updateSessionStatus("canceled")}
                >
                  Cancel Session
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </>
            )}
            {(session.status === "completed" ||
              session.status === "canceled") && (
              <>
                <DropdownMenuItem onClick={openEditSessionModal}>
                  Reschedule
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </>
            )}

            <DropdownMenuItem
              variant="destructive"
              onClick={openConfirmationModal}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex gap-0.5 items-center">
          <Button
            disabled={session.status === "canceled"}
            className="rounded-tr-none rounded-br-none "
            onClick={handleStartSession}
          >
            {session.status === "active" ? "Join" : "Start Session"}
          </Button>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={handleCopy}
                disabled={session.status === "canceled"}
                className="rounded-tl-none rounded-bl-none"
              >
                <Link />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Copy Link</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </CardFooter>
    </Card>
  );
}
