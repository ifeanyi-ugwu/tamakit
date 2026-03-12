import chalk from "chalk";
import { installDependencies } from "../../utils/install-dependencies.js";
import { createTamaguiConfig } from "../../utils/create-tamagui-config.js";
import { addTamaguiToGitignore } from "../../utils/add-tamagui-to-gitignore.js";
import { generateTamakitConfigTemplate } from "../../utils/generate-config-template.js";
import fs from "fs-extra";
import path from "path";

export async function initOne() {
  try {
    console.log(chalk.cyan("Setting up Tamagui for Tamagui One..."));

    const packages = ["tamagui", "@tamagui/config"];

    await installDependencies(packages);
    createTamaguiConfig();
    addTamaguiToGitignore();

    const configPath = path.join(process.cwd(), "tamakit.config.js");
    if (!fs.existsSync(configPath)) {
      fs.writeFileSync(configPath, generateTamakitConfigTemplate("one"));
    }

    console.log(
      chalk.cyan(
        "\nTamagui One includes its own provider setup. Refer to the Tamagui One docs for provider configuration."
      )
    );

    return true;
  } catch (error) {
    console.error(chalk.red("Failed to initialize One project with Tamagui"));
    console.error(chalk.red(error));
    return false;
  }
}
