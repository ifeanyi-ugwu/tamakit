import chalk from "chalk";
import path from "path";
import fs from "fs-extra";
import { createTamaguiConfig } from "../../utils/createTamaguiConfig.js";

export async function updateViteConfig() {
  const viteConfigPath = fs.existsSync(
    path.join(process.cwd(), "vite.config.js")
  )
    ? path.join(process.cwd(), "vite.config.js")
    : path.join(process.cwd(), "vite.config.ts");

  if (!fs.existsSync(viteConfigPath)) {
    // Create a new Vite config
    const viteConfigTemplate = `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { tamaguiExtractPlugin } from '@tamagui/vite-plugin';

export default defineConfig({
  plugins: [
    tamaguiExtractPlugin({
      components: ['tamagui'],
      config: './tamagui.config.ts',
    }),
    react(),
  ],
});
`;
    fs.writeFileSync(viteConfigPath, viteConfigTemplate);
  } else {
    // Read existing Vite config
    let viteConfig = fs.readFileSync(viteConfigPath, "utf8");

    if (!viteConfig.includes("@tamagui/vite-plugin")) {
      console.log(chalk.yellow("\nCouldn't automatically update Vite config."));
      console.log("Please add the Tamagui plugin to your Vite config:");
      console.log(
        chalk.cyan(`import { tamaguiExtractPlugin } from '@tamagui/vite-plugin';

// In your plugins array:
plugins: [
  tamaguiExtractPlugin({
    components: ['tamagui'],
    config: './tamagui.config.ts',
  }),
  // your other plugins
]`)
      );
    }
  }

  // Create tamagui.config.ts
  await createTamaguiConfig();
}
