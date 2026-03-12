import chalk from "chalk";
import path from "path";
import fs from "fs-extra";

export function addTamaguiToGitignore() {
  const gitignorePath = path.join(process.cwd(), ".gitignore");
  let gitignoreContent = "";

  if (fs.existsSync(gitignorePath)) {
    gitignoreContent = fs.readFileSync(gitignorePath, "utf8");

    if (gitignoreContent.includes(".tamagui")) {
      console.log(chalk.yellow(".tamagui already in .gitignore. Skipping..."));
      return;
    }

    gitignoreContent += "\n# Tamagui\n.tamagui\n";
  } else {
    console.log(chalk.yellow("No .gitignore found. Creating a new one..."));
    gitignoreContent = "# Tamagui\n.tamagui\n";
  }

  fs.writeFileSync(gitignorePath, gitignoreContent);
  console.log(chalk.green("Added .tamagui to .gitignore"));
}
