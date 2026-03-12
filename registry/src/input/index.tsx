import {
  GetProps,
  SizeTokens,
  Input as TamaguiInput,
  View,
  Text,
  createStyledContext,
  styled,
  withStaticProperties,
  ThemeableStack,
} from "@tamagui/web";
import React from "react";
import { ReactNode } from "react";

// Create context for Input to share props with sub-components
export const InputContext = createStyledContext({
  size: "$md" as SizeTokens,
  disabled: false,
  error: false,
});

// Main Input Element
export const InputFrame = styled(TamaguiInput, {
  name: "Input",
  context: InputContext,
  backgroundColor: "transparent",
  borderWidth: 1,
  borderColor: "$borderColor",
  outlineWidth: 0,
  color: "$color",
  fontFamily: "$body",
  outlineStyle: "none", // Remove default browser outline

  // Interactive states
  focusStyle: {
    borderColor: "$primary",
    outlineWidth: 1,
    outlineStyle: "solid",
    outlineColor: "$primary",
  },

  hoverStyle: {
    borderColor: "$borderColorHover",
  },

  variants: {
    size: {
      "...size": (name, { tokens }) => {
        return {
          height: tokens.size[name],
          borderRadius: tokens.radius[name],
          paddingHorizontal: tokens.space[name],
          fontSize: tokens.font?.size[name],
        };
      },
    },
    variant: {
      default: {
        backgroundColor: "$background",
      },
      filled: {
        backgroundColor: "$backgroundHover",
      },
      outline: {
        backgroundColor: "transparent",
      },
      ghost: {
        backgroundColor: "transparent",
        borderWidth: 0,
      },
    },
    disabled: {
      true: {
        opacity: 0.5,
        pointerEvents: "none",
      },
    },
    error: {
      true: {
        borderColor: "$error",
        color: "$error",
      },
    },
  } as const,

  defaultVariants: {
    size: "$md",
    variant: "default",
  },
});

// Input Container for composition with other elements
export const InputContainer = styled(ThemeableStack, {
  name: "InputContainer",
  context: InputContext,
  flexDirection: "column",
  gap: "$xs",

  variants: {
    disabled: {
      true: {
        opacity: 0.5,
      },
    },
  },
});

// Label for the input
export const InputLabel = styled(Text, {
  name: "InputLabel",
  context: InputContext,
  color: "$color",
  fontWeight: "500",
  marginBottom: "$xs",

  variants: {
    size: {
      "...fontSize": (name, { font }) => ({
        fontSize: font?.size[name] ? font?.size[name].val * 0.9 : undefined,
      }),
    },
    error: {
      true: {
        color: "$error",
      },
    },
    disabled: {
      true: {
        opacity: 0.7,
      },
    },
  } as const,
});

// Helper text or error message
export const InputHelperText = styled(Text, {
  name: "InputHelperText",
  context: InputContext,
  color: "$colorSubtle",
  marginTop: "$xs",

  variants: {
    size: {
      "...fontSize": (name, { font }) => ({
        fontSize: font?.size[name] ? font?.size[name].val * 0.8 : undefined,
      }),
    },
    error: {
      true: {
        color: "$error",
      },
    },
  } as const,
});

// Slot for adding icons or other content before the input
export const InputLeadingContent = styled(View, {
  name: "InputLeadingContent",
  context: InputContext,
  position: "absolute",
  left: 0,
  top: 0,
  bottom: 0,
  justifyContent: "center",
  alignItems: "center",
  paddingLeft: "$sm",
  zIndex: 2,

  variants: {
    size: {
      "...size": (name, { tokens }) => {
        return {
          paddingLeft: tokens.space[name],
        };
      },
    },
  } as const,
});

// Slot for adding icons or other content after the input
export const InputTrailingContent = styled(View, {
  name: "InputTrailingContent",
  context: InputContext,
  position: "absolute",
  right: 0,
  top: 0,
  bottom: 0,
  justifyContent: "center",
  alignItems: "center",
  paddingRight: "$sm",
  zIndex: 2,

  variants: {
    size: {
      "...size": (name, { tokens }) => {
        return {
          paddingRight: tokens.space[name],
        };
      },
    },
  } as const,
});

// Group wrapper for combining inputs with buttons
export const InputGroup = styled(ThemeableStack, {
  name: "InputGroup",
  context: InputContext,
  flexDirection: "row",
  position: "relative",

  variants: {
    size: {
      "...size": (name, { tokens }) => ({
        borderRadius: tokens.radius[name],
      }),
    },
  },
});

// Root component that provides a nicely composed interface
interface RootProps {
  label?: string;
  helperText?: string;
  error?: boolean;
  disabled?: boolean;
  size?: SizeTokens;
  variant?: "default" | "filled" | "outline" | "ghost";
  leading?: ReactNode;
  trailing?: ReactNode;
  children?: ReactNode;
}

export type InputProps = GetProps<typeof InputFrame>;

// Create the root component to provide a nice interface
const InputRoot = ({
  label,
  helperText,
  error = false,
  disabled = false,
  size = "$md",
  variant = "default",
  leading,
  trailing,
  children,
  ...props
}: RootProps & InputProps) => {
  // Add padding if there are leading/trailing elements
  const inputProps: any = { ...props };
  if (leading) {
    inputProps.paddingLeft = "$3xl";
  }
  if (trailing) {
    inputProps.paddingRight = "$3xl";
  }

  return (
    <InputContext.Provider size={size} disabled={disabled} error={error}>
      <InputContainer disabled={disabled}>
        {label && <InputLabel>{label}</InputLabel>}
        <InputGroup size={size}>
          {leading && <InputLeadingContent>{leading}</InputLeadingContent>}
          <InputFrame
            size={size}
            variant={variant}
            disabled={disabled}
            error={error}
            {...inputProps}
          >
            {children}
          </InputFrame>
          {trailing && <InputTrailingContent>{trailing}</InputTrailingContent>}
        </InputGroup>
        {helperText && (
          <InputHelperText error={error}>{helperText}</InputHelperText>
        )}
      </InputContainer>
    </InputContext.Provider>
  );
};

// Export the composed Input component
export const Input = withStaticProperties(InputRoot, {
  Frame: InputFrame,
  Container: InputContainer,
  Label: InputLabel,
  HelperText: InputHelperText,
  LeadingContent: InputLeadingContent,
  TrailingContent: InputTrailingContent,
  Group: InputGroup,
});
