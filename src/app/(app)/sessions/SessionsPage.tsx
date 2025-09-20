"use client";

import { CreateSessionForm, SessionCard } from "@/components/features";
import { FormLayout } from "@/components/forms";
import { EmptyState, ErrorState, LoadingState } from "@/components/states";
import {
  CreateSessionInput,
  createSessionSchema,
} from "@/features/sessions/domain";
import { useSessions } from "@/features/sessions/hooks";
import { useUser } from "@/providers";
import { useModal } from "@/shared";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

export default function SessionsPage() {
  const { user } = useUser();
  const { sessionsQuery } = useSessions(user.id);
  const router = useRouter();
  const { data: sessions, error } = sessionsQuery;
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
        resolver={zodResolver(createSessionSchema)}
        onCancel={() => closeSessionCreationModal()}
        onSubmit={() => {
          closeSessionCreationModal();
          sessionsQuery.refetch();
        }}
      >
        <CreateSessionForm />
      </FormLayout>
    ),
  });

  if (sessionsQuery.isLoading) {
    return <LoadingState />;
  }
  if (error) {
    return (
      <ErrorState
        variant="card"
        onRetry={router.refresh}
        message="There was an error loading your sessions. Come back later and try again."
      />
    );
  }
  if (!sessions) {
    return (
      <EmptyState
        variant="card"
        className="text-white"
        title="You don't have any sessions yet."
        onAction={openSessionCreationModal}
      />
    );
  }

  return (
    <main>
      {createSessionModal}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
        {sessions?.map((session) => (
          <SessionCard key={session.id} session={session} />
        ))}
      </div>
    </main>
  );
}
