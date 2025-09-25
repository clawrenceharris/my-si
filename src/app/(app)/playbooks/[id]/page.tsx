import React from "react";

import PlaybookPage from "./PlaybookPage";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  return <PlaybookPage playbookId={id} />;
}
