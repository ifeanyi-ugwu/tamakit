"use client";

import "@tamagui/core/reset.css";
import "@tamagui/polyfill-dev";

import { ReactNode } from "react";
import { StyleSheet } from "react-native";
import { useServerInsertedHTML } from "next/navigation";
import {
  NextThemeProvider,
  useRootTheme,
  type ColorScheme,
} from "@tamagui/next-theme";
import { TamaguiProvider } from "@tamagui/core";
import tamaguiConfig from "../../tamagui.config";

export const NextTamaguiProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useRootTheme();

  useServerInsertedHTML(() => {
    // @ts-expect-error: StyleSheet.getSheet() is not part of the official React Native type definitions, but it exists at runtime.
    const rnwStyle = StyleSheet.getSheet();
    return (
      <>
        <style
          dangerouslySetInnerHTML={{ __html: rnwStyle.textContent }}
          id={rnwStyle.id}
        />
        <style
          dangerouslySetInnerHTML={{
            __html: tamaguiConfig.getCSS({
              // if you are using "outputCSS" option, you should use this "exclude"
              // if not, then you can leave the option out
              exclude:
                process.env.NODE_ENV === "production" ? "design-system" : null,
            }),
          }}
        />
        <style jsx global>{`
          html {
            font-family: "Inter", sans-serif;
          }
        `}</style>
      </>
    );
  });

  return (
    <NextThemeProvider
      skipNextHead
      onChangeTheme={(next) => {
        setTheme(next as ColorScheme);
      }}
    >
      <TamaguiProvider
        config={tamaguiConfig}
        disableRootThemeClass
        defaultTheme={theme}
      >
        {children}
      </TamaguiProvider>
    </NextThemeProvider>
  );
};
