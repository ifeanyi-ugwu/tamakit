import chalk from "chalk";
import { installDependencies } from "../../utils/install-dependencies.js";
import { createTamaguiConfig } from "../../utils/create-tamagui-config.js";
import { addTamaguiToGitignore } from "../../utils/add-tamagui-to-gitignore.js";
import { generateTamakitConfigTemplate } from "../../utils/generate-config-template.js";
import fs from "fs-extra";
import path from "path";

export async function initReact() {
  try {
    console.log(chalk.cyan("Setting up Tamagui for React..."));

    const packages = [
      "tamagui",
      "@tamagui/core",
      "@tamagui/config",
      "@tamagui/animations-react-native",
    ];

    await installDependencies(packages);
    createTamaguiConfig();
    addTamaguiToGitignore();

    const configPath = path.join(process.cwd(), "tamakit.config.js");
    if (!fs.existsSync(configPath)) {
      fs.writeFileSync(configPath, generateTamakitConfigTemplate("react"));
    }

    console.log(chalk.yellow("\nPlease add TamaguiProvider to your app root:"));
    console.log(
      chalk.cyan(`import { TamaguiProvider } from 'tamagui';
import config from './tamagui.config';

export function App() {
  return (
    <TamaguiProvider config={config}>
      {/* your app */}
    </TamaguiProvider>
  );
}`)
    );

    return true;
  } catch (error) {
    console.error(
      chalk.red("Failed to initialize React project with Tamagui")
    );
    console.error(chalk.red(error));
    return false;
  }
}
