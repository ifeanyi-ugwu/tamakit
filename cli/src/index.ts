#!/usr/bin/env node
import { Command } from "commander";
import inquirer from "inquirer";
import chalk from "chalk";
import ora from "ora";
import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { detectProjectType } from "./utils/detect-project-type.js";
import { generateTamakitConfigTemplate } from "./utils/generate-config-template.js";
import { safeReadJSON } from "./utils/safe-read-json.js";
import { installDependencies } from "./utils/install-dependencies.js";
import { initExpo } from "./frameworks/expo/init-expo.js";
import { initReact } from "./frameworks/react/init-generic.js";
import { initNext } from "./frameworks/next/init-next.js";
import { initVite } from "./frameworks/vite/init-vite.js";
import { initOne } from "./frameworks/one/init-one.js";

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
      const projectType = await detectProjectType();
      spinner.info(`Detected project type: ${chalk.cyan(projectType)}`);
      spinner.stop();

      let success = false;

      switch (projectType) {
        case "next":
          success = await initNext();
          break;
        case "expo":
          success = await initExpo();
          break;
        case "vite":
          success = await initVite();
          break;
        case "one":
          success = await initOne();
          break;
        default:
          success = await initReact();
      }

      if (success) {
        const configPath = path.join(process.cwd(), "tamakit.config.js");
        if (!fs.existsSync(configPath)) {
          const configTemplate = generateTamakitConfigTemplate(projectType);
          fs.writeFileSync(configPath, configTemplate);
          console.log(chalk.green("Created tamakit.config.js"));
        }

        console.log(chalk.green("\nTamaKit initialized successfully! 🎉"));
        console.log("\nNext steps:");
        console.log("  1. Edit tamakit.config.js to customize your setup");
        console.log("  2. Run `tamakit add <component>` to add components");
      }
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

      const targetFile = path.join(outDir, `${component}.tsx`);
      if (fs.existsSync(targetFile)) {
        spinner.stop();
        const { overwrite } = await inquirer.prompt([
          {
            type: "confirm",
            name: "overwrite",
            message: `Component "${component}" already exists. Do you want to overwrite it?`,
            default: false,
          },
        ]);

        if (!overwrite) {
          console.log(
            chalk.yellow(
              `Operation aborted. Component "${component}" was not modified.`
            )
          );
          return;
        }
        spinner.start(`Overwriting ${component} component...`);
      }

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
