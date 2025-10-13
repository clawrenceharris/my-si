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
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

export default function SessionsPage() {
  const { user } = useUser();
  const { sessions, refetch, isLoading, error } = useSessions(user.id);
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
        resolver={zodResolver(createSessionSchema)}
        onCancel={() => closeSessionCreationModal()}
        onSubmit={() => {
          closeSessionCreationModal();
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
      <div className="container py-30 ">
        <h1 className="text-white">My Sessions</h1>
        {createSessionModal}
        <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
          {sessions?.map((session) => (
            <SessionCard key={session.id} session={session} />
          ))}
        </div>
      </div>
    </main>
  );
}
