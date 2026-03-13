import { defaultConfig } from "@tamagui/config/v4";
import { createTamagui } from "@tamagui/core";

const customVars = {
  light: {
    primary: "#0f172a",
    primaryText: "#f8fafc",
    destructive: "#ef4444",
    colorSubtle: "#64748b",
    error: "#ef4444",
    shadowColor: "rgba(0,0,0,0.1)",
  },
  dark: {
    primary: "#f8fafc",
    primaryText: "#0f172a",
    destructive: "#7f1d1d",
    colorSubtle: "#94a3b8",
    error: "#f87171",
    shadowColor: "rgba(0,0,0,0.4)",
  },
};

const themes = Object.fromEntries(
  Object.entries(defaultConfig.themes).map(([key, theme]) => {
    const isDark = key === "dark" || key.startsWith("dark_");
    return [key, { ...theme, ...(isDark ? customVars.dark : customVars.light) }];
  })
);

const appConfig = createTamagui({ ...defaultConfig, themes });

export type AppConfig = typeof appConfig;

declare module "@tamagui/core" {
  interface TamaguiCustomConfig extends AppConfig {}
}

export default appConfig;
