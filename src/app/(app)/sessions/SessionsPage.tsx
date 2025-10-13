"use client";

import { CreateSessionForm, SessionCard } from "@/components/features/sessions";
import { FormLayout } from "@/components/layouts";
import { EmptyState, ErrorState, LoadingState } from "@/components/states";
import {
  CreateSessionInput,
  createSessionSchema,
} from "@/features/sessions/domain";
import { useSessions } from "@/features/sessions/hooks";
import { useModal } from "@/hooks";
import { useUser } from "@/providers";
import {
  getFormattedCurrentDateTime,
  getFormattedCurrentTime,
} from "@/utils/date-time";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

export default function SessionsPage() {
  const { user } = useUser();
  const { sessions, addSession, refetch, isLoading, error } = useSessions(
    user.id
  );
  const router = useRouter();
  const {
    modal: createSessionModal,
    openModal: openSessionCreationModal,
    closeModal: closeSessionCreationModal,
  } = useModal({
    title: "New Session",
    description: "Create a new session",
    hidesDescription: true,
    children: (
      <FormLayout<CreateSessionInput>
        defaultValues={{
          topic: "",
          course_name: "",
          description: "",
          start_date: getFormattedCurrentDateTime(),
          start_time: getFormattedCurrentTime(),
        }}
        isLoading={addSession.isPending}
        resolver={zodResolver(createSessionSchema)}
        onCancel={() => closeSessionCreationModal()}
        onSuccess={() => closeSessionCreationModal()}
        onSubmit={(data) => {
          const { start_date, start_time, ...rest } = data; //exclude start date and time

          const startDateTime = `${start_date.split("T")[0]}T${start_time}`;
          addSession.mutateAsync({ ...rest, scheduled_start: startDateTime });
          refetch();
        }}
      >
        <CreateSessionForm />
      </FormLayout>
    ),
  });

  if (isLoading) {
    return <LoadingState />;
  }
  if (error || !sessions) {
    return (
      <ErrorState
        variant="card"
        onRetry={router.refresh}
        message="There was an error loading your sessions. Come back later and try again."
      />
    );
  }
  if (!sessions.length) {
    return (
      <>
        {createSessionModal}
        <EmptyState
          variant="card"
          className="text-white"
          message="You don't have any sessions at the moment."
          onAction={openSessionCreationModal}
          actionLabel="Create Session"
        />
      </>
    );
  }

  return (
    <main>
      {createSessionModal}

      <div className="container py-30 ">
        <h1 className="text-white">My Sessions</h1>

        <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
          {sessions.map((session) => (
            <SessionCard key={session.id} session={session} />
          ))}
        </div>
      </div>
    </main>
  );
}
