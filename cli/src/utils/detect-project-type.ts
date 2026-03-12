import inquirer from "inquirer";
import path from "path";
import { safeReadJSON } from "./safe-read-json.js";
import fs from "fs-extra";
import { checkDependency } from "./check-dependency.js";
import { ProjectType } from "../types.js";

export async function detectProjectType(): Promise<ProjectType> {
  const hasNextConfig =
    fs.existsSync(path.join(process.cwd(), "next.config.js")) ||
    fs.existsSync(path.join(process.cwd(), "next.config.mjs")) ||
    fs.existsSync(path.join(process.cwd(), "next.config.ts"));
  const hasExpoConfig =
    fs.existsSync(path.join(process.cwd(), "app.json")) &&
    (await safeReadJSON(path.join(process.cwd(), "app.json"))).expo !==
      undefined;
  const hasViteConfig =
    fs.existsSync(path.join(process.cwd(), "vite.config.js")) ||
    fs.existsSync(path.join(process.cwd(), "vite.config.ts"));
  const hasTamaOneConfig =
    fs.existsSync(path.join(process.cwd(), "tamagui.config.ts")) &&
    (await checkDependency("@tamagui/next-theme")) &&
    (await checkDependency("tamagui"));

  const packageJson = await safeReadJSON(
    path.join(process.cwd(), "package.json")
  );
  const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };

  if (hasTamaOneConfig) return "one";
  if (hasNextConfig) return "next";
  if (hasExpoConfig) return "expo";
  if (hasViteConfig) return "vite";
  if (deps.react) return "react";

  const { projectType } = await inquirer.prompt([
    {
      type: "list",
      name: "projectType",
      message: "What type of project are you using?",
      choices: ["next", "expo", "vite", "react", "one"],
    },
  ]);

  return projectType;
}
