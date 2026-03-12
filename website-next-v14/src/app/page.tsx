import Link from "next/link";

const features = [
  {
    title: "Cross-Platform",
    description:
      "Components work on both React Native and Web from a single codebase.",
  },
  {
    title: "Fully Customizable",
    description:
      "Components live in your project — tweak, extend, or replace anything.",
  },
  {
    title: "Accessible",
    description:
      "Built on Tamagui primitives that follow accessibility best practices.",
  },
  {
    title: "Dark Mode",
    description: "Light and dark themes work out of the box, no extra setup.",
  },
];

export default function Home() {
  return (
    <main>
      {/* Hero */}
      <section className="container mx-auto px-4 py-24 text-center">
        <h1 className="mb-4 text-5xl font-bold tracking-tight text-balance">
          UI components for Tamagui
        </h1>
        <p className="mx-auto mb-10 max-w-xl text-lg text-muted-foreground">
          A collection of copy-paste components for React Native and Web, built
          on top of Tamagui. Initialize your project, add what you need, own
          every line.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/docs"
            className="rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Get Started
          </Link>
          <Link
            href="/components"
            className="rounded-md border border-border px-6 py-3 text-sm font-medium transition-colors hover:bg-muted"
          >
            Browse Components
          </Link>
        </div>
      </section>

      {/* Quick install */}
      <section className="border-y border-border bg-muted/40 py-10">
        <div className="container mx-auto px-4 text-center">
          <p className="mb-3 text-sm text-muted-foreground">
            Get started in seconds
          </p>
          <div className="inline-flex items-center gap-3 rounded-lg border border-border bg-card px-5 py-3 font-mono text-sm">
            <span className="select-none text-muted-foreground">$</span>
            <span>npx tamakit init</span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="mb-10 text-center text-3xl font-bold">Why TamaKit?</h2>
        <div className="mx-auto grid max-w-3xl gap-6 sm:grid-cols-2">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-lg border border-border bg-card p-6"
            >
              <h3 className="mb-2 text-lg font-semibold">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold">Ready to build?</h2>
          <p className="mb-8 text-muted-foreground">
            Pick a component, add it to your project, make it yours.
          </p>
          <Link
            href="/components"
            className="rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Browse Components
          </Link>
        </div>
      </section>

      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          Built with Tamagui. Released under the MIT License.
        </div>
      </footer>
    </main>
  );
}
