import React from "react";
import VirtualSessionPage from "./VirtualSessionPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Session (Virtual) | MySI Playbook",
};
export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);

  return <VirtualSessionPage id={id} />;
}
