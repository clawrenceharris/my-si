"use client";

import { GeneratePlaybookForm } from "@/components/features/playbooks";
import { EmptyState, ErrorState, LoadingState } from "@/components/states";
import {
  Button,
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import { GeneratePlaybookInput } from "@/features/playbooks/domain";
import { useUserPlaybooks } from "@/features/playbooks/hooks/useUserPlaybooks";
import { useAsyncOperation, useModal } from "@/hooks";
import { useUser } from "@/providers";
import { useRouter } from "next/navigation";

export default function PlaybooksPage() {
  const router = useRouter();
  const { user } = useUser();
  const { playbooks, isLoadingPlaybooks } = useUserPlaybooks(user.id);
  const {
    execute: handleSubmit,
    error,
    loading: creatingPlaybook,
  } = useAsyncOperation<[GeneratePlaybookInput], void>(async (data) => {
    const r = await generatePlaybook(data);
    if (r.playbookId) router.push(`/playbooks/${r.playbookId}`);
  });

  const {
    modal: createPlaybookModal,
    closeModal: closeCreatePlaybookModal,
    openModal: openCreatePlaybookModal,
  } = useModal({
    title: "Generate Playbook",
    hidesDescription: true,
    description:
      "Enter your course name and topic to generate a basic Playbook that you can build off of.",
    children: (
      <GeneratePlaybookForm
        error={error?.message}
        onCancel={() => closeCreatePlaybookModal()}
        isLoading={creatingPlaybook}
        onSubmit={handleSubmit}
      />
    ),
  });
  async function generatePlaybook(data: GeneratePlaybookInput) {
    const { topic, virtual, course_name, contexts } = data;
    const r = await fetch("/api/lessons/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contexts, topic, virtual, course_name }),
    });
    return await r.json();
  }
  if (isLoadingPlaybooks) {
    return <LoadingState />;
  }
  if (error || !playbooks) {
    return (
      <main>
        <ErrorState
          variant="card"
          message="There was an error finding your Playbooks"
        />
      </main>
    );
  }
  if (!playbooks.length) {
    return (
      <main>
        {createPlaybookModal}
        <EmptyState
          actionLabel="Create Playbook"
          onAction={openCreatePlaybookModal}
          variant="card"
          message="You don't have any Playbooks at the moment."
        />
      </main>
    );
  }
  return (
    <main>
      {createPlaybookModal}
      <div className="container py-30 space-y-10">
        <h1 className="text-white">My Playbooks</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {playbooks.map((p) => (
            <Card
              key={p.id}
              className="overflow-hidden flex justify-between flex-col max-w-md hover:shadow-md transition-shadow duration-200"
            >
              <CardHeader>
                <div className="flex justify-between items-center"></div>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-md font-semibold">
                    {`${p.course_name ? p.course_name + ":" : ""}`}{" "}
                    <span className="font-light">{p.topic}</span>
                  </CardTitle>
                </div>
              </CardHeader>

              <CardFooter className="flex gap-5 justify-end">
                <div className="flex gap-0.5 items-center">
                  <Button onClick={() => router.push(`/playbooks/${p.id}`)}>
                    View
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}
