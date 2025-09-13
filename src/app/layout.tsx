import { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "mySI",
  description: "Your one tool for Supplemental Instruction management",
};

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
