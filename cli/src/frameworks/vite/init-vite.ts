import chalk from "chalk";
import { installDependencies } from "../../utils/install-dependencies.js";
import { createTamaguiConfig } from "../../utils/create-tamagui-config.js";
import { addTamaguiToGitignore } from "../../utils/add-tamagui-to-gitignore.js";
import { generateTamakitConfigTemplate } from "../../utils/generate-config-template.js";
import { updateViteConfig } from "./update-vite-config.js";
import { setupViteProvider } from "./setup-vite-provider.js";
import { viteDeps } from "./deps.js";
import fs from "fs-extra";
import path from "path";

export async function initVite() {
  try {
    console.log(chalk.cyan("Setting up Tamagui for Vite..."));

    await installDependencies(viteDeps);
    createTamaguiConfig();
    addTamaguiToGitignore();
    updateViteConfig();
    await setupViteProvider();

    const configPath = path.join(process.cwd(), "tamakit.config.js");
    if (!fs.existsSync(configPath)) {
      fs.writeFileSync(configPath, generateTamakitConfigTemplate("vite"));
    }

    return true;
  } catch (error) {
    console.error(chalk.red("Failed to initialize Vite project with Tamagui"));
    console.error(chalk.red(error));
    return false;
  }
}
