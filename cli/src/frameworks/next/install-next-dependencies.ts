import chalk from "chalk";
import { installDependencies } from "../../utils/install-dependencies.js";

export async function installNextDependencies() {
  const dependencies: string[] = [
    "tamagui",
    "@tamagui/core",
    "@tamagui/config",
    "@tamagui/next-plugin",
    "@tamagui/animations-react-native",
    "react-native-web",
  ];

  console.log(
    chalk.cyan("Installing Next.js specific Tamagui dependencies...")
  );
  await installDependencies(dependencies);
  console.log(chalk.green("Dependencies installed successfully"));
}
