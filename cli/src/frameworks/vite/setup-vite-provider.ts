import chalk from "chalk";
import path from "path";
import fs from "fs-extra";

export async function setupViteProvider() {
  const mainPath = path.join(process.cwd(), "src", "main.tsx");
  const indexPath = path.join(process.cwd(), "src", "index.tsx");
  const appPath = path.join(process.cwd(), "src", "App.tsx");

  let targetPath: string | null = null;
  if (fs.existsSync(mainPath)) targetPath = mainPath;
  else if (fs.existsSync(indexPath)) targetPath = indexPath;
  else if (fs.existsSync(appPath)) targetPath = appPath;

  if (targetPath) {
    const content = fs.readFileSync(targetPath, "utf8");

    if (!content.includes("TamaguiProvider")) {
      console.log(
        chalk.yellow(
          `\nPlease add Tamagui Provider to your ${path.basename(targetPath)}:`
        )
      );
      console.log(
        chalk.cyan(`import { TamaguiProvider } from 'tamagui';
import config from '../tamagui.config';

// In your app:
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <TamaguiProvider config={config}>
      <App />
    </TamaguiProvider>
  </React.StrictMode>,
);`)
      );
    }
  } else {
    console.log(
      chalk.yellow(
        "\nCouldn't find main entry point. Please add Tamagui Provider manually to your main component."
      )
    );
  }
}
