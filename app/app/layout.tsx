import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Live tool",
  description:
    "Load data, ask a question in plain language, get a chart. Runs entirely in your browser.",
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return children;
}
