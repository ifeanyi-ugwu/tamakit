import Link from "next/link";

const frameworks = [
  { name: "Next.js", note: "App Router and Pages Router" },
  { name: "Expo", note: "React Native with Expo" },
  { name: "Vite", note: "SPA and SSR" },
  { name: "React One", note: "Meta's React One framework" },
];

export default function DocsPage() {
  return (
    <div className="container mx-auto flex max-w-4xl gap-12 px-4 py-12">
      {/* Sidebar TOC */}
      <aside className="hidden w-48 shrink-0 lg:block">
        <nav className="sticky top-24 space-y-1 text-sm">
          {[
            ["#prerequisites", "Prerequisites"],
            ["#installation", "Installation"],
            ["#frameworks", "Supported Frameworks"],
            ["#add-components", "Add Components"],
            ["#usage", "Usage"],
          ].map(([href, label]) => (
            <a
              key={href}
              href={href}
              className="block text-muted-foreground transition-colors hover:text-foreground"
            >
              {label}
            </a>
          ))}
        </nav>
      </aside>

      {/* Content */}
      <article className="min-w-0 flex-1 space-y-12">
        <div>
          <h1 className="mb-3 text-4xl font-bold">Getting Started</h1>
          <p className="text-lg text-muted-foreground">
            TamaKit is a CLI-driven component library for Tamagui. Components
            are copied directly into your project so you own and can modify every
            line.
          </p>
        </div>

        {/* Prerequisites */}
        <section id="prerequisites" className="space-y-4">
          <h2 className="text-2xl font-semibold">Prerequisites</h2>
          <ul className="space-y-2 text-muted-foreground">
            <li className="flex gap-2">
              <span className="text-foreground">—</span>
              <span>
                <strong className="text-foreground">Tamagui</strong> installed
                and configured in your project
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-foreground">—</span>
              <span>
                <strong className="text-foreground">React Native ≥ 0.77</strong>{" "}
                (required for React 18 compatibility with Tamagui)
              </span>
            </li>
          </ul>
        </section>

        {/* Installation */}
        <section id="installation" className="space-y-4">
          <h2 className="text-2xl font-semibold">Installation</h2>
          <p className="text-muted-foreground">
            Run the init command in the root of your project. TamaKit
            auto-detects your framework and sets up the required Tamagui
            configuration.
          </p>
          <CodeBlock code="npx tamakit init" />
          <p className="text-sm text-muted-foreground">
            This installs Tamagui dependencies and creates a{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">
              tamagui.config.ts
            </code>{" "}
            in your project root.
          </p>
        </section>

        {/* Frameworks */}
        <section id="frameworks" className="space-y-4">
          <h2 className="text-2xl font-semibold">Supported Frameworks</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {frameworks.map((f) => (
              <div
                key={f.name}
                className="rounded-lg border border-border bg-card px-4 py-3"
              >
                <p className="font-medium">{f.name}</p>
                <p className="text-sm text-muted-foreground">{f.note}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Add components */}
        <section id="add-components" className="space-y-4">
          <h2 className="text-2xl font-semibold">Add Components</h2>
          <p className="text-muted-foreground">
            Use the{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">add</code>{" "}
            command to copy a component into your project. The file is placed in
            your configured output directory (default:{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">
              components/ui
            </code>
            ).
          </p>
          <CodeBlock code="npx tamakit add button" />
          <p className="text-muted-foreground">
            To see all available components:
          </p>
          <CodeBlock code="npx tamakit ls" />
        </section>

        {/* Usage */}
        <section id="usage" className="space-y-4">
          <h2 className="text-2xl font-semibold">Usage</h2>
          <p className="text-muted-foreground">
            Import directly from your{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">
              components/ui
            </code>{" "}
            folder and use like any Tamagui component:
          </p>
          <CodeBlock
            code={`import { Button } from "@/components/ui/button"

export function MyScreen() {
  return <Button variant="primary">Save changes</Button>
}`}
          />
          <p className="text-sm text-muted-foreground">
            Since the component lives in your project you can modify variants,
            tokens, or styles however you need.
          </p>
        </section>

        <div className="border-t border-border pt-8">
          <Link
            href="/components"
            className="text-sm font-medium hover:underline"
          >
            Browse all components →
          </Link>
        </div>
      </article>
    </div>
  );
}

function CodeBlock({ code }: { code: string }) {
  return (
    <pre className="overflow-x-auto rounded-lg border border-border bg-muted p-4 text-sm">
      <code>{code}</code>
    </pre>
  );
}
