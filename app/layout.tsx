import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://datcube-design-site.vercel.app"),
  title: {
    default: "DatCube — ask your data",
    template: "%s · DatCube",
  },
  description:
    "Connect your data, ask in plain language, share a live dashboard. A working demo, not a mockup.",
  openGraph: {
    title: "DatCube — ask your data",
    description:
      "Load a dataset, ask a question in plain English, get a chart. Runs entirely in your browser.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,700;12..96,800&family=Hanken+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
