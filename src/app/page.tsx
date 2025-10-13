"use client";
import { useRouter } from "next/navigation";
import { useAsyncOperation } from "@/hooks";
import { GeneratePlaybookInput } from "@/features/playbooks/domain/playbooks.schema";
import { GeneratePlaybookForm } from "@/components/features/playbooks";

export default function Dashboard() {
  const router = useRouter();
  const { execute: handleSubmit, loading } = useAsyncOperation<
    [GeneratePlaybookInput],
    void
  >(async (data) => {
    const r = await generatePlaybook(data);
    if (r.playbookId) router.push(`/playbooks/${r.playbookId}`);
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
  return (
    <main>
      <div className="container overflow-hidden">
        <div className="w-full max-w-2xl mx-auto">
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <h3 className="text-lg  text-center font-semibold text-gray-900 mb-4">
              Create a Playbook
            </h3>
            <div className="max-w-md space-y-4  mx-auto">
              <p className="text-sm text-center text-muted-foreground">
                Enter the course and topic you plan to instruct to compose
                acomprehensive Playbook (or lesson plan) with engaging SI
                strategies.
              </p>
              <GeneratePlaybookForm
                isLoading={loading}
                onSubmit={handleSubmit}
              />
            </div>
          </div>
        </div>

        {/* Quick Start Examples */}
        {/* <div className="mt-12 text-center">
          <p className="text-sm text-foreground/40 mb-4">
            Try these popular topics:
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              "College Algebra ",
              "Introduction to photosynthesis",
              "Creative writing techniques",
              "World War II timeline",
            ].map((topic) => (
              <button
                key={topic}
                className="px-4 py-2 bg-white/60 hover:bg-white/80 rounded-full text-sm text-gray-700 border border-white/40 hover:border-primary/30 transition-all duration-200 hover:shadow-sm"
              >
                {topic}
              </button>
            ))}
          </div>
        </div> */}
      </div>
    </main>
  );
}
