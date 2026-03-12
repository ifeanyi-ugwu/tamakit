import chalk from "chalk";
import path from "path";
import fs from "fs-extra";
import { createTamaguiConfig } from "../../utils/create-tamagui-config.js";

export async function updateExpoConfig() {
  const babelConfigPath = path.join(process.cwd(), "babel.config.js");

  if (fs.existsSync(babelConfigPath)) {
    let babelConfig = fs.readFileSync(babelConfigPath, "utf8");

    if (!babelConfig.includes("@tamagui/babel-plugin")) {
      const presets = babelConfig.match(/presets\s*:\s*\[([\s\S]*?)\]/);
      const plugins = babelConfig.match(/plugins\s*:\s*\[([\s\S]*?)\]/);

      if (plugins) {
        const updatedPlugins = plugins[0].replace(
          "]",
          `
    ['@tamagui/babel-plugin', {
      components: ['tamagui'],
      config: './tamagui.config.ts',
    }],
  ]`
        );

        babelConfig = babelConfig.replace(plugins[0], updatedPlugins);
        fs.writeFileSync(babelConfigPath, babelConfig);
      } else if (presets) {
        const updatedConfig = babelConfig.replace(
          presets[0],
          `${presets[0]},
  plugins: [
    ['@tamagui/babel-plugin', {
      components: ['tamagui'],
      config: './tamagui.config.ts',
    }],
  ]`
        );

        fs.writeFileSync(babelConfigPath, updatedConfig);
      } else {
        console.log(
          chalk.yellow("\nCouldn't automatically update babel.config.js.")
        );
        console.log(
          "Please add the following to your babel.config.js manually:"
        );
        console.log(
          chalk.cyan(`plugins: [
  ['@tamagui/babel-plugin', {
    components: ['tamagui'],
    config: './tamagui.config.ts',
  }],
]`)
        );
      }
    }
  } else {
    const babelConfigTemplate = `module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      ['@tamagui/babel-plugin', {
        components: ['tamagui'],
        config: './tamagui.config.ts',
      }],
      'react-native-reanimated/plugin',
    ],
  };
};
`;
    fs.writeFileSync(babelConfigPath, babelConfigTemplate);
  }

  const metroConfigPath = path.join(process.cwd(), "metro.config.js");

  if (!fs.existsSync(metroConfigPath)) {
    const metroConfigTemplate = `const { getDefaultConfig } = require('expo/metro-config');
const { withTamaguiPlugin } = require('@tamagui/metro-plugin');

const config = getDefaultConfig(__dirname);

module.exports = withTamaguiPlugin(config, {
  components: ['tamagui'],
  config: './tamagui.config.ts',
});
`;
    fs.writeFileSync(metroConfigPath, metroConfigTemplate);
  } else {
    const metroConfig = fs.readFileSync(metroConfigPath, "utf8");

    if (!metroConfig.includes("@tamagui/metro-plugin")) {
      console.log(
        chalk.yellow("\nCouldn't automatically update metro.config.js.")
      );
      console.log("Please modify your metro.config.js to include Tamagui:");
      console.log(
        chalk.cyan(`const { withTamaguiPlugin } = require('@tamagui/metro-plugin');

// Your existing config
const config = {...};

module.exports = withTamaguiPlugin(config, {
  components: ['tamagui'],
  config: './tamagui.config.ts',
});`)
      );
    }
  }

  createTamaguiConfig();
}
