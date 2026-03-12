export type ComponentProp = {
  name: string;
  type: string;
  default?: string;
  description: string;
};

export type ComponentData = {
  name: string;
  displayName: string;
  description: string;
  category: string;
  defaultExample: string;
  props: ComponentProp[];
};

export const components: ComponentData[] = [
  {
    name: "button",
    displayName: "Button",
    description: "A button component with multiple variants and sizes.",
    category: "Inputs",
    defaultExample: `<Stack space="$2">
  <Button>Default</Button>
  <Button variant="primary">Primary</Button>
  <Button variant="outline">Outline</Button>
  <Button variant="ghost">Ghost</Button>
  <Button variant="destructive">Destructive</Button>
</Stack>`,
    props: [
      {
        name: "variant",
        type: '"default" | "primary" | "destructive" | "outline" | "ghost"',
        default: '"default"',
        description: "The visual style of the button.",
      },
      {
        name: "size",
        type: '"sm" | "md" | "lg"',
        default: '"md"',
        description: "The size of the button.",
      },
      {
        name: "disabled",
        type: "boolean",
        default: "false",
        description: "Disables the button and reduces opacity.",
      },
    ],
  },
  {
    name: "card",
    displayName: "Card",
    description:
      "A composable card with header, content, and footer sections.",
    category: "Layout",
    defaultExample: `<Card width={280}>
  <Card.Header>
    <Card.Title>Card Title</Card.Title>
    <Card.Description>A simple description</Card.Description>
  </Card.Header>
  <Card.Content>
    <Text>This is the card body.</Text>
  </Card.Content>
  <Card.Footer>
    <Button variant="primary" size="sm">Action</Button>
  </Card.Footer>
</Card>`,
    props: [
      {
        name: "variant",
        type: '"default" | "outline" | "ghost" | "elevated"',
        default: '"default"',
        description: "The visual style of the card.",
      },
      {
        name: "size",
        type: "SizeTokens",
        default: '"$md"',
        description: "Controls padding and border radius via Tamagui tokens.",
      },
    ],
  },
  {
    name: "input",
    displayName: "Input",
    description:
      "A flexible input with label, helper text, and leading/trailing content slots.",
    category: "Inputs",
    defaultExample: `<Stack space="$3" width={280}>
  <Input label="Email" placeholder="you@example.com" />
  <Input
    label="Password"
    placeholder="••••••••"
    helperText="Must be at least 8 characters"
  />
  <Input
    label="Username"
    placeholder="taken"
    error
    helperText="That username is taken"
  />
</Stack>`,
    props: [
      {
        name: "label",
        type: "string",
        description: "Label displayed above the input.",
      },
      {
        name: "helperText",
        type: "string",
        description: "Helper or error message displayed below the input.",
      },
      {
        name: "variant",
        type: '"default" | "filled" | "outline" | "ghost"',
        default: '"default"',
        description: "The visual style of the input.",
      },
      {
        name: "size",
        type: "SizeTokens",
        default: '"$md"',
        description: "Controls height, padding, and font size.",
      },
      {
        name: "error",
        type: "boolean",
        default: "false",
        description: "Puts the input in an error state.",
      },
      {
        name: "disabled",
        type: "boolean",
        default: "false",
        description: "Disables the input and reduces opacity.",
      },
      {
        name: "leading",
        type: "ReactNode",
        description: "Content rendered at the start of the input (e.g. icon).",
      },
      {
        name: "trailing",
        type: "ReactNode",
        description: "Content rendered at the end of the input (e.g. icon).",
      },
    ],
  },
];

export function getComponent(name: string): ComponentData | undefined {
  return components.find((c) => c.name === name);
}
