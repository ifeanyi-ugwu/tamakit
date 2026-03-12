import { execa } from "execa";
import { detectPackageManager } from "./detect-package-manager.js";

export async function installDependencies(dependencies: string[]) {
  const packageManager = detectPackageManager();

  const installCommand =
    packageManager === "npm"
      ? "install"
      : packageManager === "yarn"
        ? "add"
        : "add";

  await execa(packageManager, [installCommand, ...dependencies], {
    stdio: "inherit",
  });
}
