import chalk from "chalk";
import path from "path";
import fs from "fs-extra";

export async function setupExpoProvider() {
  const appJsPath = path.join(process.cwd(), "App.js");
  const appTsxPath = path.join(process.cwd(), "App.tsx");

  const appPath = fs.existsSync(appTsxPath) ? appTsxPath : appJsPath;

  if (fs.existsSync(appPath)) {
    const appContent = fs.readFileSync(appPath, "utf8");

    if (!appContent.includes("TamaguiProvider")) {
      console.log(
        chalk.yellow("\nPlease add Tamagui Provider to your App.tsx/App.js:")
      );
      console.log(
        chalk.cyan(`import { TamaguiProvider } from 'tamagui';
import config from './tamagui.config';

// In your app component:
return (
  <TamaguiProvider config={config}>
    {/* Your app components */}
  </TamaguiProvider>
);`)
      );
    }
  } else {
    console.log(
      chalk.yellow(
        "\nCouldn't find App.js or App.tsx. Please add Tamagui Provider manually to your main component."
      )
    );
  }
}
