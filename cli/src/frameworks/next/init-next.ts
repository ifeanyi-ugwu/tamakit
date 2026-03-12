import chalk from "chalk";
import { detectRouterType } from "./detect-router-type.js";
import { initAppRouter } from "./app/init.js";
import { initPagesRouter } from "./pages/init.js";

export async function initNext() {
  try {
    const router = detectRouterType();

    if (!router) {
      console.log(
        chalk.red(
          "Could not determine if your Next.js project uses App Router or Pages Router. Please check your directory structure."
        )
      );
      return false;
    }

    console.log(chalk.green(`Detected Next.js router type: ${router.type}`));

    if (router.type === "app") {
      await initAppRouter(router);
    } else {
      await initPagesRouter(router);
    }

    return true;
  } catch (error) {
    console.error(
      chalk.red("Failed to initialize Next.js project with Tamagui")
    );
    console.error(chalk.red(error));
    return false;
  }
}
