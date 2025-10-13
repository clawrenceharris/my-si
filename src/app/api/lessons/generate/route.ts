export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server";
import { openai } from "@/lib/openai/client";

import {} from "@/types";
import { LessonCards, LessonsInsert, Strategies } from "@/types/tables";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const { topic, course_name, contexts, virtual = false } = await req.json();

  const client = await createClient();
  const {
    data: { user },
  } = await client.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { data: strategies, error: se } = await client.rpc(
    "get_strategies_by_contexts",
    {
      contexts,
    }
  );

  if (se) return NextResponse.json({ error: se.message }, { status: 500 });

  // Builds a small, prompt-safe catalog

  if (strategies.length < 3) {
    return NextResponse.json(
      {
        error:
          "Playbooks need at least 3 strategies but your filters returned less than that",
      },
      { status: 404 }
    );
  }

  const catalog = strategies.map((c: Strategies) => ({
    slug: c.slug,
    title: c.title,
    category: c.category,
    good_for: c.good_for ?? [],
    session_size: c.session_size ?? null,
  })) as Strategies[];
  // Prompt for GPT
  const sys = `You are an Supplement Instruction lesson planner for college students.
Use ONLY the provided catalog of official strategies by slug.
Choose exactly 3 SI strategies: one warmup, one workout (main activity), one closer.
Selection rules:
- Prefer strategies whose "good_for" tags work together to create a cohesive, well rounded lesson, with a beginning middle and end.
Return STRICT JSON with no commentary:
{
  "cards": [
    { "slug": string, "phase": "warmup"|"workout"|"closer" }
  ]
}`;

  const usr = `Topic: ${topic} Course: ${course_name}
Catalog (slug | title | category | good_for | session_size):
${catalog
  .map(
    (c) =>
      `${c.slug} | ${c.title} | ${c.category} | [${c.good_for.join(
        ", "
      )}] | size:${c.session_size}`
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
    cards: { slug: string; phase: LessonCards["phase"] }[];
  };

  // Create the playbook
  const { data: playbook, error: le } = await client
    .from("lessons")
    .insert<LessonsInsert>({
      owner: user.id,
      topic,
      course_name,
      virtual,
    })
    .select()
    .single();
  if (le) return NextResponse.json({ error: le.message }, { status: 500 });

  // Rehydrates selected cards from database and copy steps into lesson_cards with editable copies
  const slugs = choice.cards.map((c) => c.slug);
  const { data: fullCards, error: ce } = await client
    .from("strategies")
    .select("slug,title,category,steps")
    .in("slug", slugs);
  if (ce) return NextResponse.json({ error: ce.message }, { status: 500 });

  const orderMap = { warmup: 0, workout: 1, closer: 2 } as const;

  const rows = choice.cards.map((sel) => {
    const c = fullCards.find((fc) => fc.slug === sel.slug)!;
    return {
      lesson_id: playbook.id,
      card_slug: c.slug,
      title: c.title,
      category: c.category,
      steps: c.steps,
      phase: sel.phase,
      position: orderMap[sel.phase],
    } as LessonCards;
  });

  const { error: li } = await client.from("lesson_cards").insert(rows);
  if (li) return NextResponse.json({ error: li.message }, { status: 500 });

  return NextResponse.json({ playbookId: playbook.id }, { status: 200 });
}
