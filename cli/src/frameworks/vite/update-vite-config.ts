import fs from "fs";
import path from "path";
import chalk from "chalk";
import { parse, print } from "recast";
import * as babelParser from "@babel/parser";
import { visit } from "ast-types";
import { namedTypes as n, builders as b } from "ast-types";

export function updateViteConfig() {
  const possibleConfigPaths = [
    "vite.config.ts",
    "vite.config.js",
    "vite.config.mts",
    "vite.config.mjs",
  ].map((file) => path.join(process.cwd(), file));

  const viteConfigPath = possibleConfigPaths.find(fs.existsSync);
  if (!viteConfigPath) {
    console.log(
      chalk.yellow("No Vite config found. Creating a new one...")
    );
    fs.writeFileSync(
      path.join(process.cwd(), "vite.config.ts"),
      `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { tamaguiPlugin } from '@tamagui/vite-plugin';

export default defineConfig({
  plugins: [
    react(),
    tamaguiPlugin({
      config: './tamagui.config.ts',
      components: ['tamagui'],
    }),
  ],
});
`
    );
    console.log(chalk.green("Created vite.config.ts with Tamagui plugin"));
    return;
  }

  const code = fs.readFileSync(viteConfigPath, "utf8");
  const isTS =
    viteConfigPath.endsWith(".ts") || viteConfigPath.endsWith(".mts");

  const ast = parse(code, {
    parser: {
      parse: (source: string, parserOptions: any) =>
        babelParser.parse(source, {
          ...parserOptions,
          sourceType: "module",
          plugins: isTS ? ["typescript"] : [],
        }),
    },
  });

  let hasTamaguiImport = false;
  let updated = false;

  visit(ast, {
    visitImportDeclaration(path) {
      if (path.node.source.value === "@tamagui/vite-plugin") {
        hasTamaguiImport = true;
      }
      return false;
    },
    visitCallExpression(path) {
      if (
        n.Identifier.check(path.node.callee) &&
        path.node.callee.name === "tamaguiPlugin"
      ) {
        hasTamaguiImport = true;
      }
      return false;
    },
  });

  if (hasTamaguiImport) {
    console.log(
      chalk.blue("Vite config already has Tamagui plugin configured")
    );
    return;
  }

  visit(ast, {
    visitObjectExpression(path) {
      const pluginsProp = path.node.properties.find(
        (prop) =>
          n.Property.check(prop) &&
          n.Identifier.check(prop.key) &&
          prop.key.name === "plugins"
      );

      if (
        pluginsProp &&
        n.Property.check(pluginsProp) &&
        n.ArrayExpression.check(pluginsProp.value)
      ) {
        const tamaguiCall = b.callExpression(
          b.identifier("tamaguiPlugin"),
          [
            b.objectExpression([
              b.property(
                "init",
                b.identifier("config"),
                b.stringLiteral("./tamagui.config.ts")
              ),
              b.property(
                "init",
                b.identifier("components"),
                b.arrayExpression([b.stringLiteral("tamagui")])
              ),
            ]),
          ]
        );

        pluginsProp.value.elements.push(tamaguiCall);
        updated = true;
        return false;
      }

      this.traverse(path);
    },
  });

  if (updated) {
    let outputCode = print(ast).code;

    outputCode =
      `import { tamaguiPlugin } from '@tamagui/vite-plugin';\n` + outputCode;

    fs.writeFileSync(viteConfigPath, outputCode);
    console.log(chalk.green("Updated Vite config with Tamagui plugin"));
  } else {
    console.log(
      chalk.yellow(
        "Could not automatically update vite.config. Please add tamaguiPlugin manually:"
      )
    );
    console.log(
      chalk.cyan(`import { tamaguiPlugin } from '@tamagui/vite-plugin';

// In your plugins array:
tamaguiPlugin({
  config: './tamagui.config.ts',
  components: ['tamagui'],
})`)
    );
  }
}
