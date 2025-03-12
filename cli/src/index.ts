#!/usr/bin/env node
import { Command } from "commander";
import inquirer from "inquirer";
import chalk from "chalk";
import ora from "ora";
import fs from "fs-extra";
import path from "path";
import { execa } from "execa";

import { fileURLToPath } from "url";
import { dirname } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const program = new Command();

program
  .name("tamakit")
  .description("CLI to add Tamagui components to your project")
  .version("0.1.0");

// registry could be a GitHub repo or a dedicated server
const REGISTRY_URL = "https://api.tamakit.io/components";
// for development, use local registry
const DEV_REGISTRY_PATH = path.join(__dirname, "../../registry/src");

program
  .command("init")
  .description("Initialize TamaKit in your project")
  .action(async () => {
    const spinner = ora("Initializing TamaKit...").start();

    try {
      const hasTamagui = await checkDependency("tamagui");

      if (!hasTamagui) {
        spinner.info("Tamagui not found in dependencies");
        spinner.stop();

        const { installTamagui } = await inquirer.prompt([
          {
            type: "confirm",
            name: "installTamagui",
            message: "Tamagui is required. Would you like to install it now?",
            default: true,
          },
        ]);

        if (installTamagui) {
          await installDependencies(["tamagui"]);
        } else {
          console.log(
            chalk.yellow("TamaKit requires Tamagui to work properly")
          );
          return;
        }
      }

      const configPath = path.join(process.cwd(), "tamakit.config.js");
      if (!fs.existsSync(configPath)) {
        const configTemplate = `
module.exports = {
  // Specify target platforms
  platforms: ['web', 'native'],
  
  // Component output directory
  outDir: './components/ui',
  
  // Theme customization
  theme: {
    // Your theme overrides here
  }
}
`;
        fs.writeFileSync(configPath, configTemplate);
      }

      spinner.succeed("TamaKit initialized successfully");
      console.log(chalk.green("\nCreated tamakit.config.js"));
      console.log("\nNext steps:");
      console.log("  1. Edit tamakit.config.js to customize your setup");
      console.log("  2. Run `tamakit add <component>` to add components");
    } catch (error) {
      spinner.fail("Failed to initialize TamaKit");
      console.error(chalk.red(error));
    }
  });

program
  .command("add <component>")
  .description("Add a component to your project")
  .option(
    "-p, --platforms <platforms>",
    "Target platforms (web, native, or all)",
    "all"
  )
  .action(async (component, options) => {
    try {
      const configPath = path.join(process.cwd(), "tamakit.config.js");
      if (!fs.existsSync(configPath)) {
        console.log(
          chalk.red("TamaKit config not found. Run `tamakit init` first.")
        );
        return;
      }

      //const config = require(configPath);
      const config = (await import(configPath)).default;
      const platforms =
        options.platforms === "all" ? ["web", "native"] : [options.platforms];

      const spinner = ora(`Adding ${component} component...`).start();

      const componentExists = await checkComponentInRegistry(component);

      if (!componentExists) {
        spinner.fail(`Component "${component}" not found in registry`);
        return;
      }

      const outDir = path.join(
        process.cwd(),
        config.outDir || "./components/ui"
      );
      fs.ensureDirSync(outDir);

      await copyComponentFiles(component, outDir);

      const dependencies = await getComponentDependencies(component);
      if (dependencies.length > 0) {
        spinner.text = `Installing dependencies for ${component}...`;
        await installDependencies(dependencies);
      }

      spinner.succeed(`Added ${component} component`);
      console.log(
        chalk.green(
          `\nComponent added to ${config.outDir || "./components/ui"}`
        )
      );
    } catch (error) {
      console.error(chalk.red(error));
    }
  });

program
  .command("ls")
  .description("List all available components")
  .action(async () => {
    const spinner = ora("Fetching components...").start();

    try {
      const components = await getAvailableComponents();

      spinner.succeed("Available components:");

      const groupedComponents = groupByCategory(components);

      for (const [category, comps] of Object.entries(groupedComponents)) {
        console.log(chalk.bold(`\n${category}:`));
        comps.forEach((comp) => {
          console.log(`  ${chalk.cyan(comp.name)} - ${comp.description}`);
        });
      }
    } catch (error) {
      spinner.fail("Failed to fetch components");
      console.error(chalk.red(error));
    }
  });

async function safeReadJSON(filePath: string) {
  if (!fs.existsSync(filePath) || fs.statSync(filePath).size === 0) {
    return {};
  }

  return fs.readJSON(filePath);
}

async function checkDependency(packageName: string) {
  try {
    const packageJsonPath = path.join(process.cwd(), "package.json");
    const packageJson = await safeReadJSON(packageJsonPath);

    return !!(
      (packageJson.dependencies && packageJson.dependencies[packageName]) ||
      (packageJson.devDependencies && packageJson.devDependencies[packageName])
    );
  } catch (error) {
    return false;
  }
}

async function installDependencies(dependencies: string[]) {
  const packageManager = await detectPackageManager();

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

async function detectPackageManager() {
  const hasYarnLock = fs.existsSync(path.join(process.cwd(), "yarn.lock"));
  const hasPnpmLock = fs.existsSync(path.join(process.cwd(), "pnpm-lock.yaml"));

  if (hasPnpmLock) return "pnpm";
  if (hasYarnLock) return "yarn";
  return "npm";
}

async function checkComponentInRegistry(componentName: string) {
  const componentPath = path.join(DEV_REGISTRY_PATH, componentName);
  return fs.existsSync(componentPath);
}

async function copyComponentFiles(component: string, outDir: string) {
  const sourcePath = path.join(DEV_REGISTRY_PATH, component, "index.tsx");
  const targetFile = path.join(outDir, `${component}.tsx`);

  if (fs.existsSync(sourcePath)) {
    await fs.copy(sourcePath, targetFile);
  }
}

async function getComponentDependencies(component: string) {
  try {
    const depsPath = path.join(DEV_REGISTRY_PATH, component, "metadata.json");
    if (fs.existsSync(depsPath)) {
      const deps = (await safeReadJSON(depsPath)).dependencies || [];
      return deps;
    }
    return [];
  } catch (error) {
    return [];
  }
}

async function getAvailableComponents() {
  const components = [];
  const categories = fs.readdirSync(DEV_REGISTRY_PATH);

  for (const category of categories) {
    const categoryPath = path.join(DEV_REGISTRY_PATH, category);
    if (fs.statSync(categoryPath).isDirectory()) {
      const metadataPath = path.join(categoryPath, "metadata.json");
      if (fs.existsSync(metadataPath)) {
        const metadata = await safeReadJSON(metadataPath);
        components.push({
          name: category,
          description: metadata.description || "",
          category: metadata.category || "Other",
        });
      } else {
        components.push({
          name: category,
          description: "",
          category: "Other",
        });
      }
    }
  }

  return components;
}

function groupByCategory(
  components: {
    name: string;
    description: string;
    category: string;
  }[]
) {
  return components.reduce((acc, comp) => {
    acc[comp.category] = acc[comp.category] || [];
    acc[comp.category].push(comp);
    return acc;
  }, {} as Record<string, { name: string; description: string; category: string }[]>);
}

program.parse(process.argv);
