import {
  GetProps,
  SizeTokens,
  View,
  Text,
  createStyledContext,
  styled,
  withStaticProperties,
} from "@tamagui/web";

export const CardContext = createStyledContext({
  size: "$md" as SizeTokens,
});

// Main Card container
export const CardFrame = styled(View, {
  name: "Card",
  context: CardContext,
  backgroundColor: "$background",
  borderRadius: "$md",
  borderWidth: 1,
  borderColor: "$borderColor",
  overflow: "hidden",

  // Interactive states
  hoverStyle: {
    borderColor: "$borderColorHover",
  },

  variants: {
    size: {
      "...size": (name, { tokens }) => {
        return {
          borderRadius: tokens.radius[name],
          padding: tokens.space[name],
        };
      },
    },
    variant: {
      default: {
        backgroundColor: "$background",
      },
      outline: {
        backgroundColor: "transparent",
      },
      ghost: {
        backgroundColor: "transparent",
        borderWidth: 0,
      },
      elevated: {
        backgroundColor: "$background",
        shadowColor: "$shadowColor",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
      },
    },
  } as const,

  defaultVariants: {
    size: "$md",
    variant: "default",
  },
});

// Card Header component
export const CardHeader = styled(View, {
  name: "CardHeader",
  context: CardContext,
  paddingBottom: "$md",
  borderBottomWidth: 1,
  borderBottomColor: "$borderColor",

  variants: {
    size: {
      "...size": (name, { tokens }) => {
        return {
          paddingBottom: tokens.space[name],
        };
      },
    },
    compact: {
      true: {
        paddingBottom: "$sm",
      },
    },
  } as const,
});

// Card Title component
export const CardTitle = styled(Text, {
  name: "CardTitle",
  context: CardContext,
  color: "$color",
  fontWeight: "bold",

  variants: {
    size: {
      "...fontSize": (name, { font }) => ({
        fontSize: font?.size[name],
      }),
    },
  } as const,
});

// Card Description component
export const CardDescription = styled(Text, {
  name: "CardDescription",
  context: CardContext,
  color: "$colorSubtle",
  marginTop: "$xs",

  variants: {
    size: {
      "...fontSize": (name, { font }) => ({
        fontSize: font?.size[name] ? font?.size[name].val * 0.85 : undefined,
      }),
    },
  } as const,
});

// Card Content component
export const CardContent = styled(View, {
  name: "CardContent",
  context: CardContext,
  paddingVertical: "$md",

  variants: {
    size: {
      "...size": (name, { tokens }) => {
        return {
          paddingVertical: tokens.space[name],
        };
      },
    },
  } as const,
});

// Card Footer component
export const CardFooter = styled(View, {
  name: "CardFooter",
  context: CardContext,
  flexDirection: "row",
  justifyContent: "flex-end",
  alignItems: "center",
  borderTopWidth: 1,
  borderTopColor: "$borderColor",
  paddingTop: "$md",

  variants: {
    size: {
      "...size": (name, { tokens }) => {
        return {
          paddingTop: tokens.space[name],
        };
      },
    },
  } as const,
});

// Export the composed Card component
export const Card = withStaticProperties(CardFrame, {
  Props: CardContext.Provider,
  Header: CardHeader,
  Title: CardTitle,
  Description: CardDescription,
  Content: CardContent,
  Footer: CardFooter,
});

// Export types
export type CardProps = GetProps<typeof CardFrame>;
export type CardHeaderProps = GetProps<typeof CardHeader>;
export type CardTitleProps = GetProps<typeof CardTitle>;
export type CardDescriptionProps = GetProps<typeof CardDescription>;
export type CardContentProps = GetProps<typeof CardContent>;
export type CardFooterProps = GetProps<typeof CardFooter>;
