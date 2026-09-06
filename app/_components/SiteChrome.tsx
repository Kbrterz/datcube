"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/product", label: "Product" },
  { href: "/value", label: "Time & money" },
  { href: "/pricing", label: "Pricing" },
  { href: "/for", label: "Who it's for" },
];

export function Nav() {
  const path = usePathname();
  return (
    <nav className="nav">
      <div className="wrap nav-in">
        <Link href="/" className="brand">
          Dat<em>Cube</em>
        </Link>
        <div className="nav-links">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} aria-current={path === l.href ? "page" : undefined}>
              {l.label}
            </Link>
          ))}
        </div>
        <Link href="/app" className="btn">
          Open the tool
        </Link>
      </div>
    </nav>
  );
}

export function Footer() {
  return (
    <footer className="foot">
      <div className="wrap">
        <div className="foot-grid">
          <div>
            <Link href="/" className="brand">
              Dat<em>Cube</em>
            </Link>
            <p style={{ marginTop: 10, color: "var(--ink-soft)", fontSize: "0.95rem", maxWidth: "38ch" }}>
              Two things a small team never has enough of: hours and budget. DatCube gives some of both
              back.
            </p>
          </div>
          <div>
            <h4>Product</h4>
            <ul>
              <li>
                <Link href="/product">What it does</Link>
              </li>
              <li>
                <Link href="/value">Time &amp; money</Link>
              </li>
              <li>
                <Link href="/pricing">Pricing</Link>
              </li>
              <li>
                <Link href="/app">Live tool</Link>
              </li>
            </ul>
          </div>
          <div>
            <h4>More</h4>
            <ul>
              <li>
                <Link href="/for">Who it's for</Link>
              </li>
              <li>
                <Link href="/product">Templates</Link>
              </li>
            </ul>
          </div>
        </div>
        <p className="fine">
          DatCube is a concept product built as a portfolio piece. No accounts, no billing, no data
          leaves your browser.
        </p>
      </div>
    </footer>
  );
}
