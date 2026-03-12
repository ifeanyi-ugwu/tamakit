import path from "path";
import fs from "fs-extra";

export function createTamaguiConfig() {
  const tamaguiConfigPath = path.join(process.cwd(), "tamagui.config.ts");

  if (!fs.existsSync(tamaguiConfigPath)) {
    const tamaguiConfigTemplate = `import { defaultConfig } from '@tamagui/config/v4'
import { createTamagui } from '@tamagui/core' // or 'tamagui'

const appConfig = createTamagui(defaultConfig)

export type AppConfig = typeof appConfig

declare module '@tamagui/core' {
  // or 'tamagui'
  // overrides TamaguiCustomConfig so your custom types
  // work everywhere you import \`tamagui\`
  interface TamaguiCustomConfig extends AppConfig {}
}

export default appConfig`;

    fs.writeFileSync(tamaguiConfigPath, tamaguiConfigTemplate);
  }
}
