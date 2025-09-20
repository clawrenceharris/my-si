import React from "react";
import MeetingPage from "./MeetingPage";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  return (
    <main className="bg-foreground">
      <MeetingPage id={id} />
    </main>
  );
}
