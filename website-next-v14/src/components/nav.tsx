"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";

export function Nav() {
  const pathname = usePathname();

  const linkClass = (prefix: string) =>
    pathname.startsWith(prefix)
      ? "text-foreground font-medium"
      : "text-muted-foreground hover:text-foreground transition-colors";

  return (
    <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-sm font-bold text-primary-foreground">
            T
          </div>
          <span className="text-xl font-bold">TamaKit</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link href="/docs" className={linkClass("/docs")}>
            Docs
          </Link>
          <Link href="/components" className={linkClass("/components")}>
            Components
          </Link>
          <a
            href="https://github.com/ifeanyidike/tamakit"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            GitHub
          </a>
        </nav>

        <ThemeToggle />
      </div>
    </header>
  );
}
