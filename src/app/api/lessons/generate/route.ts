export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { openai } from "@/lib/openai/client";
import { auth } from "@clerk/nextjs/server";

import createClerkSupabaseClient from "@/lib/supabase/client";
import {} from "@/types";
import { LessonCards } from "@/types/tables";

export async function POST(req: NextRequest) {
  const { topic, mode = "in_person" } = await req.json();
  const { sessionId, getToken, userId } = await auth();
  if (!sessionId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const client = createClerkSupabaseClient({
    getTokenFn: () => getToken(),
  });

  // Pull data for prompting
  const { data: cards, error } = await client
    .from("strategy_cards")
    .select("slug,title,category,good_for");
  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  // Build a small, prompt-safe catalog
  const catalog = cards.map((c) => ({
    slug: c.slug,
    title: c.title,
    category: c.category,
    good_for: c.good_for ?? [],
  }));

  // Asks AI to choose exactly 3 cards and assign lesson roles
  const sys = `You are an SI lesson planner.
Use only the provided catalog of official strategy cards by slug.
Pick exactly 3 cards: one warmup, one workout (main activity), one closer.
Prefer cards whose "good_for" includes the requested mode.
Return STRICT JSON: { "topic": string, "mode": "in_person"|"virtual",
"cards":[ { "slug": string, "phase": "warmup"|"workout"|"closer" } ] }`;

  const usr = `Topic: ${topic}
Mode: ${mode}
Catalog (slug | title | category | good_for):
${catalog
  .map(
    (c) => `${c.slug} | ${c.title} | ${c.category} | ${c.good_for.join(",")}`
  )
  .join("\n")}
`;

  const resp = await openai.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [
      { role: "system", content: sys },
      { role: "user", content: usr },
    ],
    response_format: { type: "json_object" },
  });

  const choice = JSON.parse(resp.choices[0].message?.content ?? "{}") as {
    topic: string;
    mode: string;
    cards: { slug: string; phase: LessonCards["phase"] }[];
  };

  // Create lesson
  const { data: lesson, error: le } = await client
    .from("lessons")
    .insert({
      id: randomUUID(),
      user_id: userId,
      topic: choice.topic || topic,
      mode,
    })
    .select()
    .single();
  if (le) return NextResponse.json({ error: le.message }, { status: 500 });

  // Rehydrate selected cards from DB, copy steps into lesson_cards with editable copies
  const slugs = choice.cards.map((c) => c.slug);
  const { data: fullCards, error: ce } = await client
    .from("strategy_cards")
    .select("slug,title,category,steps")
    .in("slug", slugs);
  if (ce) return NextResponse.json({ error: ce.message }, { status: 500 });

  const orderMap = { warmup: 0, workout: 1, closer: 2 } as const;

  const rows = choice.cards.map((sel) => {
    const c = fullCards.find((fc) => fc.slug === sel.slug)!;
    return {
      id: randomUUID(),
      lesson_id: lesson.id,
      card_slug: c.slug,
      title: c.title,
      category: c.category,
      steps: c.steps,
      phase: sel.phase,
      position: orderMap[sel.phase],
    };
  });

  const { error: li } = await client.from("lesson_cards").insert(rows);
  if (li) return NextResponse.json({ error: li.message }, { status: 500 });

  return NextResponse.json({ lessonId: lesson.id }, { status: 200 });
}
