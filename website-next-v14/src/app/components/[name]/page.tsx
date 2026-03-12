import { notFound } from "next/navigation";
import { ComponentPreview } from "@/components/component-preview";
import { getComponent, components } from "@/lib/registry";

export function generateStaticParams() {
  return components.map((c) => ({ name: c.name }));
}

export default function ComponentPage({
  params,
}: {
  params: { name: string };
}) {
  const component = getComponent(params.name);
  if (!component) notFound();

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      {/* Header */}
      <div className="mb-10">
        <div className="mb-2 flex items-center gap-3">
          <h1 className="text-4xl font-bold">{component.displayName}</h1>
          <span className="rounded-full border border-border px-2.5 py-0.5 text-xs text-muted-foreground">
            {component.category}
          </span>
        </div>
        <p className="text-lg text-muted-foreground">{component.description}</p>
      </div>

      {/* Install command */}
      <section className="mb-10">
        <h2 className="mb-3 text-xl font-semibold">Installation</h2>
        <pre className="overflow-x-auto rounded-lg border border-border bg-muted p-4 text-sm">
          <code>npx tamakit add {component.name}</code>
        </pre>
      </section>

      {/* Live preview */}
      <section className="mb-10">
        <h2 className="mb-3 text-xl font-semibold">Preview</h2>
        <ComponentPreview code={component.defaultExample} />
      </section>

      {/* Props table */}
      <section>
        <h2 className="mb-4 text-xl font-semibold">Props</h2>
        <div className="overflow-hidden rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted text-left">
              <tr>
                {["Prop", "Type", "Default", "Description"].map((h) => (
                  <th key={h} className="px-4 py-3 font-medium">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {component.props.map((prop, i) => (
                <tr
                  key={prop.name}
                  className={i % 2 === 0 ? "bg-background" : "bg-muted/30"}
                >
                  <td className="px-4 py-3 font-mono font-medium">
                    {prop.name}
                  </td>
                  <td className="px-4 py-3 font-mono text-muted-foreground">
                    {prop.type}
                  </td>
                  <td className="px-4 py-3 font-mono text-muted-foreground">
                    {prop.default ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {prop.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
