import React from "react";
import LoginPage from "./LoginPage";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const searchParams = React.use(params);

  return <LoginPage searchParams={searchParams} />;
}
