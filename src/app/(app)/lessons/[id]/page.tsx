import React from "react";

import LessonPageClient from "./LessonPageClient";

export default function LessonPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params); // <-- unwrap the async params
  return <LessonPageClient id={id} />;
}
