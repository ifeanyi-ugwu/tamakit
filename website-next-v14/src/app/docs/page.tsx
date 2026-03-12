"use client";

import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { ComponentPreview } from "./components/component-preview";

// Sample component data - this would come from your registry
const components = [
  {
    id: "button",
    name: "Button",
    description: "A button component with multiple variants",
    category: "Inputs",
    examples: [
      {
        title: "Default",
        code: `<Button>Click me</Button>`,
      },
      {
        title: "Variants",
        code: `
<Stack space="$2">
  <Button variant="primary">Primary</Button>
  <Button variant="destructive">Destructive</Button>
  <Button variant="outline">Outline</Button>
  <Button variant="ghost">Ghost</Button>
</Stack>`,
      },
      {
        title: "Sizes",
        code: `
<Stack space="$2">
  <Button size="sm">Small</Button>
  <Button size="md">Medium</Button>
  <Button size="lg">Large</Button>
</Stack>`,
      },
    ],
  },
  {
    id: "card",
    name: "Card",
    description: "A card component for containing content",
    category: "Layout",
    examples: [
      {
        title: "Default",
        code: `
<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card Description</CardDescription>
  </CardHeader>
  <CardContent>
    <Text>Card Content</Text>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>`,
      },
    ],
  },
  // Add more components here
];

// Group components by category
const groupedComponents = components.reduce((acc, component) => {
  acc[component.category] = acc[component.category] || [];
  acc[component.category].push(component);
  return acc;
}, {});

export default function Home() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Head>
        <title>TamaKit - UI components for Tamagui</title>
        <meta
          name="description"
          content="Beautifully designed components for React Native and Web with Tamagui"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary text-primary-foreground w-8 h-8 rounded-md flex items-center justify-center font-bold">
              T
            </div>
            <span className="font-bold text-xl">TamaKit</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className={`${
                activeTab === "overview"
                  ? "text-foreground"
                  : "text-muted-foreground"
              } hover:text-foreground`}
              onClick={() => setActiveTab("overview")}
            >
              Overview
            </Link>
            <Link
              href="/docs"
              className={`${
                activeTab === "docs"
                  ? "text-foreground"
                  : "text-muted-foreground"
              } hover:text-foreground`}
              onClick={() => setActiveTab("docs")}
            >
              Documentation
            </Link>
            <Link
              href="/components"
              className={`${
                activeTab === "components"
                  ? "text-foreground"
                  : "text-muted-foreground"
              } hover:text-foreground`}
              onClick={() => setActiveTab("components")}
            >
              Components
            </Link>
            <a
              href="https://github.com/yourusername/tamakit"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground"
            >
              GitHub
            </a>
          </nav>
          <ThemeToggle />
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <section className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">
            Beautiful UI components for Tamagui
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            TamaKit is a collection of reusable components for React Native and
            Web, built on top of Tamagui
          </p>
          <div className="flex gap-4 justify-center">
            <a
              href="#getting-started"
              className="bg-primary text-primary-foreground px-6 py-3 rounded-md font-medium"
            >
              Get Started
            </a>
            <a
              href="https://github.com/yourusername/tamakit"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-transparent border border-border px-6 py-3 rounded-md font-medium"
            >
              GitHub
            </a>
          </div>
        </section>

        <section id="getting-started" className="max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold mb-6">Get Started</h2>
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Installation</h3>
            <div className="bg-muted p-4 rounded-md mb-6">
              <code className="text-sm">npm install tamakit-cli -g</code>
            </div>
            <h3 className="text-xl font-semibold mb-4">
              Initialize in your project
            </h3>
            <div className="bg-muted p-4 rounded-md mb-6">
              <code className="text-sm">tamakit init</code>
            </div>
            <h3 className="text-xl font-semibold mb-4">Add components</h3>
            <div className="bg-muted p-4 rounded-md">
              <code className="text-sm">tamakit add button</code>
            </div>
          </div>
        </section>

        <section className="max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold mb-6">Features</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-2">Cross-Platform</h3>
              <p className="text-muted-foreground">
                Works seamlessly on both React Native and Web
              </p>
            </div>
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-2">Fully Customizable</h3>
              <p className="text-muted-foreground">
                Components live in your project, so you can customize them
              </p>
            </div>
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-2">Accessible</h3>
              <p className="text-muted-foreground">
                Components follow accessibility best practices
              </p>
            </div>
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-2">Dark Mode</h3>
              <p className="text-muted-foreground">
                Built-in support for light and dark themes
              </p>
            </div>
          </div>
        </section>

        <section className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">Components</h2>
          {Object.entries(groupedComponents).map(
            ([category, categoryComponents]) => (
              <div key={category} className="mb-12">
                <h3 className="text-2xl font-semibold mb-4">{category}</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categoryComponents.map((component) => (
                    // <Link
                    //   key={component.id}
                    //   //href={`/components/${component.id}`}
                    //   href="#"
                    //   className="bg-card border border-border rounded-lg p-6 hover:border-primary transition-colors"
                    // >
                    <div key={component.id}>
                      <h4 className="text-xl font-semibold mb-2">
                        {component.name}
                      </h4>
                      <p className="text-muted-foreground mb-4">
                        {component.description}
                      </p>
                      <ComponentPreview code={component.examples[0].code} />
                    </div>
                    // </Link>
                  ))}
                </div>
              </div>
            )
          )}
        </section>
      </main>

      <footer className="border-t border-border py-8 mt-12">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>Built with Tamagui. Released under the MIT License.</p>
        </div>
      </footer>
    </div>
  );
}
