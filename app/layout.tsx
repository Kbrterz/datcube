import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://datcube-design-site.vercel.app"),
  title: {
    default: "DatCube: hours and money back",
    template: "%s · DatCube",
  },
  description:
    "A no-code analytics tool that gives your team back the hours it loses to manual reporting, and defers the cost of a data hire.",
  openGraph: {
    title: "DatCube: hours and money back",
    description:
      "Connect a dataset, ask in plain language, share a live board. Built to save your team time and money.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;0,6..72,600;1,6..72,400&family=Hanken+Grotesk:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
