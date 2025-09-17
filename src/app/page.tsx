"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@clerk/nextjs";

export default function Dashboard() {
  const [topic, setTopic] = useState("");
  const [mode, setMode] = useState<"in_person" | "virtual">("in_person");
  const router = useRouter();

  const create = async () => {
    const r = await fetch("/api/lessons/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic, mode }),
    });
    const out = await r.json();
    if (out.lessonId) router.push(`/lessons/${out.lessonId}`);
  };

  return (
    <main className="mx-auto max-w-xl p-6 space-y-4">
      <h1 className="text-3xl font-semibold">MySI – Lesson Planner</h1>
      <input
        className="w-full rounded border p-2"
        placeholder="Topic (e.g., Stoichiometry, Limits, Supply & Demand)"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
      />
      <div className="flex gap-3">
        <label className="flex items-center gap-2">
          <input
            type="radio"
            checked={mode === "in_person"}
            onChange={() => setMode("in_person")}
          />{" "}
          In-person
        </label>
        <label className="flex items-center gap-2">
          <input
            type="radio"
            checked={mode === "virtual"}
            onChange={() => setMode("virtual")}
          />{" "}
          Virtual
        </label>
      </div>
      <button
        onClick={create}
        className="rounded px-4 py-2 bg-blue-600 text-white"
      >
        Generate Lesson with AI
      </button>
    </main>
  );
}
