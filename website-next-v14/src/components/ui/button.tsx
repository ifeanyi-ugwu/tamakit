import { styled, getTokens } from "@tamagui/core";
import { Button as TamaguiButton } from "@tamagui/button";

export const buttonVariants = {
  variant: {
    default: {
      backgroundColor: "$background",
      color: "$color",
      borderWidth: 1,
      borderColor: "$borderColor",
    },
    primary: {
      backgroundColor: "$primary",
      color: "$primaryText",
    },
    destructive: {
      backgroundColor: "$destructive",
      color: "white",
    },
    outline: {
      backgroundColor: "transparent",
      borderWidth: 1,
      borderColor: "$borderColor",
    },
    ghost: {
      backgroundColor: "transparent",
      borderWidth: 0,
    },
  },
  size: {
    sm: {
      paddingHorizontal: 12,
      paddingVertical: 4,
      fontSize: 14,
    },
    md: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      fontSize: 16,
    },
    lg: {
      paddingHorizontal: 24,
      paddingVertical: 10,
      fontSize: 18,
    },
  },
  disabled: {
    true: {
      opacity: 0.5,
    },
  },
};

export const Button = styled(TamaguiButton, {
  name: "Button",
  variants: buttonVariants,
  defaultVariants: {
    variant: "default",
    size: "md",
  },
});
