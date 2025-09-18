import React from "react";

import LessonPage from "./LessonPage";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params); // <-- unwrap the async params
  return <LessonPage lessonId={id} />;
}
