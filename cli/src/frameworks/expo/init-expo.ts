import chalk from "chalk";
import { installDependencies } from "../../utils/install-dependencies.js";
import { createTamaguiConfig } from "../../utils/create-tamagui-config.js";
import { addTamaguiToGitignore } from "../../utils/add-tamagui-to-gitignore.js";
import { generateTamakitConfigTemplate } from "../../utils/generate-config-template.js";
import { updateExpoConfig } from "./update-expo-config.js";
import { setupExpoProvider } from "./setup-expo-provider.js";
import { expoDeps } from "./deps.js";
import fs from "fs-extra";
import path from "path";

export async function initExpo() {
  try {
    console.log(chalk.cyan("Setting up Tamagui for Expo..."));

    await installDependencies(expoDeps);
    createTamaguiConfig();
    addTamaguiToGitignore();
    await updateExpoConfig();
    await setupExpoProvider();

    const configPath = path.join(process.cwd(), "tamakit.config.js");
    if (!fs.existsSync(configPath)) {
      fs.writeFileSync(configPath, generateTamakitConfigTemplate("expo"));
    }

    return true;
  } catch (error) {
    console.error(chalk.red("Failed to initialize Expo project with Tamagui"));
    console.error(chalk.red(error));
    return false;
  }
}
