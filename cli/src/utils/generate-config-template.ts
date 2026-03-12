import { ProjectType } from "../types.js";

export function generateTamakitConfigTemplate(projectType: ProjectType) {
  const baseConfig = `
module.exports = {
  // Specify target platforms
  platforms: ['web', 'native'],

  // Component output directory
  outDir: './components/ui',

  // Theme customization
  theme: {
    // Your theme overrides here
  },

  // Project type
  projectType: '${projectType}',
`;

  let additionalConfig = "";

  switch (projectType) {
    case "next":
      additionalConfig = `
  // Next.js specific configuration
  next: {
    appDir: true,
    pagesDir: './pages',
  },`;
      break;
    case "expo":
      additionalConfig = `
  // Expo specific configuration
  expo: {
    projectRoot: '.',
  },`;
      break;
    case "vite":
      additionalConfig = `
  // Vite specific configuration
  vite: {
    plugins: true,
  },`;
      break;
    case "one":
      additionalConfig = `
  // Tamagui One specific configuration
  tamaguiOne: {
    configPath: './tamagui.config.ts',
  },`;
      break;
  }

  return `${baseConfig}${additionalConfig}
}
`;
}
