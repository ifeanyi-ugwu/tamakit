import Link from "next/link";
import { components } from "@/lib/registry";

const categoryOrder = ["Inputs", "Layout"];

const grouped = categoryOrder.reduce<Record<string, typeof components>>(
  (acc, cat) => {
    acc[cat] = components.filter((c) => c.category === cat);
    return acc;
  },
  {}
);

export default function ComponentsPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <div className="mb-10">
        <h1 className="mb-2 text-4xl font-bold">Components</h1>
        <p className="text-lg text-muted-foreground">
          Copy any component into your project with{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-sm">
            npx tamakit add &lt;name&gt;
          </code>
          .
        </p>
      </div>

      {Object.entries(grouped).map(([category, items]) => (
        <section key={category} className="mb-12">
          <h2 className="mb-4 text-xl font-semibold text-muted-foreground">
            {category}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((c) => (
              <Link
                key={c.name}
                href={`/components/${c.name}`}
                className="group rounded-lg border border-border bg-card p-5 transition-colors hover:border-primary"
              >
                <div className="mb-1 flex items-center justify-between">
                  <span className="font-semibold">{c.displayName}</span>
                  <span className="text-xs text-muted-foreground transition-colors group-hover:text-foreground">
                    →
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{c.description}</p>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
