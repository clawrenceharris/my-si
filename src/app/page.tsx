"use client";
import { useRouter } from "next/navigation";
import { ChatFormData, ChatInput } from "@/features/chat";
import { useAsyncOperation } from "@/shared";

export default function Dashboard() {
  const router = useRouter();
  const { execute: handleSubmit, loading } = useAsyncOperation<
    [{ topic: string; mode: string }],
    void
  >(async (data) => await create(data));
  const create = async (data: ChatFormData) => {
    const { topic, mode } = data;
    const r = await fetch("/api/lessons/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic, mode }),
    });
    const out = await r.json();
    if (out.lessonId) router.push(`/lessons/${out.lessonId}`);
  };

  return (
    <div className="mx-auto max-w-xl p-6 space-y-4">
      <section className="px-6">
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
                    AI Lesson Builder
                  </h3>
                  <p className="text-sm text-gray-600">
                    Describe your topic and I&apos;ll create a comprehensive
                    lesson plan with activities, discussion questions, and
                    assessments.
                  </p>
                </div>

                <ChatInput
                  placeholder="What topic would you like to create a lesson for?"
                  disabled={loading}
                  loading={loading}
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
                "Algebra basics for 9th graders",
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
    </div>
  );
}
