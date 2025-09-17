export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { openai } from "@/lib/openai/client";
import createClerkSupabaseClient from "@/lib/supabase/client";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
  const { lessonCardId } = await req.json();

  const { sessionId, getToken } = await auth();
  if (!sessionId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const client = createClerkSupabaseClient({
    getTokenFn: () => getToken({ template: "supabase" }),
  });

  // Load card copy
  const { data: card, error } = await client
    .from("lesson_cards")
    .select("id, steps, title")
    .eq("id", lessonCardId)
    .single();
  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  const sys = `Rewrite the steps for clarity and actionability. Keep 3–6 concise steps. Return JSON: { "steps": string[] }`;
  const usr = `Title: ${card.title}\nCurrent steps:\n${card.steps
    .map((s: string, i: number) => `${i + 1}. ${s}`)
    .join("\n")}`;

  const resp = await openai.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [
      { role: "system", content: sys },
      { role: "user", content: usr },
    ],
    response_format: { type: "json_object" },
  });
  const out = JSON.parse(resp.choices[0].message?.content ?? "{}") as {
    steps: string[];
  };
  const { error: up } = await client
    .from("lesson_cards")
    .update({ steps: out.steps })
    .eq("id", lessonCardId);
  if (up) return NextResponse.json({ error: up.message }, { status: 500 });

  return NextResponse.json({ ok: true, steps: out.steps });
}
