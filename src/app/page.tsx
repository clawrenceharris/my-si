"use client";
import { useRouter } from "next/navigation";
import { useAsyncOperation } from "@/hooks";
import { GeneratePlaybookInput } from "@/features/playbooks/domain/playbooks.schema";
import { GeneratePlaybookForm } from "@/components/features";

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
      <section className="container">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="mb-6 text-4xl font-bold leading-tight text-background">
              MySI Playbook
            </h2>
          </div>

          <div className="w-full max-w-2xl mx-auto">
            <div className="gradient-border">
              <div className="bg-white rounded-xl p-8 shadow-lg">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Create a Playbook
                  </h3>
                  <p className="text-sm text-gray-600">
                    Enter the course and topic you plan to instruct to compose a
                    comprehensive Playbook (or lesson plan) plan with engaging
                    SI strategies.
                  </p>
                </div>

                <GeneratePlaybookForm
                  isLoading={loading}
                  onSubmit={handleSubmit}
                />
              </div>
            </div>
          </div>

          {/* Quick Start Examples */}
          <div className="mt-12 text-center">
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
          </div>
        </div>
      </section>
    </main>
  );
}
