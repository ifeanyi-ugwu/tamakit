import fs from "fs";
import path from "path";
import chalk from "chalk";
import { parse, print } from "recast";
import * as babelParser from "@babel/parser";
import { visit } from "ast-types";
import { namedTypes as n, builders as b } from "ast-types";
import { ExpressionKind } from "ast-types/lib/gen/kinds";

function isExpressionKind(node: any): node is ExpressionKind {
  return n.Expression.check(node);
}

export function updateNextConfig() {
  const possibleConfigPaths = [
    "next.config.js",
    "next.config.mjs",
    "next.config.ts",
    "next.config.mts",
  ].map((file) => path.join(process.cwd(), file));

  let nextConfigPath = possibleConfigPaths.find(fs.existsSync);
  if (!nextConfigPath) {
    console.log(chalk.yellow("No Next.js config found. Creating a new one..."));
    nextConfigPath = path.join(process.cwd(), "next.config.js");

    fs.writeFileSync(
      nextConfigPath,
      `const { withTamagui } = require('@tamagui/next-plugin');\n\n` +
        `/** @type {import('next').NextConfig} */\n` +
        `const nextConfig = {\n` +
        `  // your Next.js config options here\n` +
        `};\n\n` +
        `module.exports = withTamagui({\n` +
        `  config: './tamagui.config.ts',\n` +
        `  components: ['tamagui'],\n` +
        `  appDir: true,\n` +
        `  outputCSS: process.env.NODE_ENV === "production" ? "./public/tamagui.css" : null,\n` +
        `  disableExtraction: process.env.NODE_ENV === "development"\n` +
        `})(nextConfig);\n`
    );
    console.log(chalk.green(`Created Next.js config at ${nextConfigPath}`));
    return;
  }

  const code = fs.readFileSync(nextConfigPath, "utf8");
  const ast = parse(code, {
    parser: {
      parse: (source: string, parserOptions: any) =>
        babelParser.parse(source, {
          ...parserOptions,
          sourceType: "unambiguous",
          plugins:
            nextConfigPath!.endsWith(".ts") || nextConfigPath!.endsWith(".mts")
              ? ["typescript"]
              : [],
        }),
    },
  });

  let updated = false;
  let isModule = false;
  let hasTamaguiImport = false;
  let isAlreadyWrapped = false;

  visit(ast, {
    visitImportDeclaration(path) {
      isModule = true;
      if (path.node.source.value === "@tamagui/next-plugin") {
        hasTamaguiImport = true;
      }
      return false;
    },
    visitVariableDeclaration(path) {
      path.node.declarations.forEach((decl) => {
        if (
          n.VariableDeclarator.check(decl) &&
          n.ObjectPattern.check(decl.id) &&
          n.CallExpression.check(decl.init) &&
          n.Identifier.check(decl.init.callee) &&
          decl.init.callee.name === "require" &&
          decl.init.arguments.length > 0 &&
          n.StringLiteral.check(decl.init.arguments[0]) &&
          decl.init.arguments[0].value === "@tamagui/next-plugin"
        ) {
          hasTamaguiImport = true;
        }
      });
      return false;
    },
    visitCallExpression(path) {
      if (
        n.Identifier.check(path.node.callee) &&
        path.node.callee.name === "withTamagui"
      ) {
        isAlreadyWrapped = true;
      }
      if (
        n.CallExpression.check(path.node.callee) &&
        n.Identifier.check(path.node.callee.callee) &&
        path.node.callee.callee.name === "withTamagui"
      ) {
        isAlreadyWrapped = true;
      }
      return false;
    },
  });

  const createTamaguiConfigObj = () => {
    return b.objectExpression([
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
      b.property("init", b.identifier("appDir"), b.literal(true)),
      b.property(
        "init",
        b.identifier("outputCSS"),
        b.conditionalExpression(
          b.binaryExpression(
            "===",
            b.memberExpression(
              b.memberExpression(b.identifier("process"), b.identifier("env")),
              b.identifier("NODE_ENV")
            ),
            b.stringLiteral("production")
          ),
          b.stringLiteral("./public/tamagui.css"),
          b.literal(null)
        )
      ),
      b.property(
        "init",
        b.identifier("disableExtraction"),
        b.binaryExpression(
          "===",
          b.memberExpression(
            b.memberExpression(b.identifier("process"), b.identifier("env")),
            b.identifier("NODE_ENV")
          ),
          b.stringLiteral("development")
        )
      ),
    ]);
  };

  if (!isAlreadyWrapped) {
    visit(ast, {
      visitExportDefaultDeclaration(path) {
        isModule = true;
        const decl = path.node.declaration;

        if (
          (n.CallExpression.check(decl) &&
            n.Identifier.check(decl.callee) &&
            decl.callee.name === "withTamagui") ||
          (n.CallExpression.check(decl) &&
            n.CallExpression.check(decl.callee) &&
            n.Identifier.check(decl.callee.callee) &&
            decl.callee.callee.name === "withTamagui")
        ) {
          return false;
        }

        if (isExpressionKind(decl)) {
          const tamaguiCall = b.callExpression(b.identifier("withTamagui"), [
            createTamaguiConfigObj(),
          ]);
          path.node.declaration = b.callExpression(tamaguiCall, [decl]);
          updated = true;
        } else if (n.FunctionDeclaration.check(decl) && decl.id) {
          const funcExpr = b.functionExpression(
            decl.id,
            decl.params,
            decl.body,
            decl.generator,
            decl.async
          );
          const tamaguiCall = b.callExpression(b.identifier("withTamagui"), [
            createTamaguiConfigObj(),
          ]);
          path.node.declaration = b.callExpression(tamaguiCall, [funcExpr]);
          updated = true;
        }
        return false;
      },
      visitAssignmentExpression(path) {
        if (
          n.MemberExpression.check(path.node.left) &&
          n.Identifier.check(path.node.left.object) &&
          path.node.left.object.name === "module" &&
          n.Identifier.check(path.node.left.property) &&
          path.node.left.property.name === "exports"
        ) {
          if (
            (n.CallExpression.check(path.node.right) &&
              n.Identifier.check(path.node.right.callee) &&
              path.node.right.callee.name === "withTamagui") ||
            (n.CallExpression.check(path.node.right) &&
              n.CallExpression.check(path.node.right.callee) &&
              n.Identifier.check(path.node.right.callee.callee) &&
              path.node.right.callee.callee.name === "withTamagui")
          ) {
            return false;
          }

          const tamaguiCall = b.callExpression(b.identifier("withTamagui"), [
            createTamaguiConfigObj(),
          ]);
          path.node.right = b.callExpression(tamaguiCall, [path.node.right]);
          updated = true;
        }
        return false;
      },
    });
  }

  if (updated) {
    let outputCode = print(ast).code;

    if (!hasTamaguiImport) {
      if (isModule) {
        outputCode =
          `import { withTamagui } from '@tamagui/next-plugin';\n` + outputCode;
      } else {
        outputCode =
          `const { withTamagui } = require('@tamagui/next-plugin');\n` +
          outputCode;
      }
    }

    fs.writeFileSync(nextConfigPath, outputCode);
    console.log(chalk.green("Updated Next.js config with Tamagui plugin"));
  } else if (isAlreadyWrapped) {
    console.log(
      chalk.blue("Next.js config is already set up with Tamagui plugin")
    );
  } else {
    const backupPath = `${nextConfigPath}.backup`;
    fs.copyFileSync(nextConfigPath, backupPath);
    console.log(chalk.blue(`Backed up existing config to ${backupPath}`));

    const isModuleFile =
      nextConfigPath.endsWith(".mjs") ||
      nextConfigPath.endsWith(".mts") ||
      isModule;

    if (isModuleFile) {
      fs.writeFileSync(
        nextConfigPath,
        `import { withTamagui } from '@tamagui/next-plugin';\n` +
          `import type { NextConfig } from "next";\n\n` +
          `const nextConfig: NextConfig = {\n` +
          `  // your Next.js config options here\n` +
          `};\n\n` +
          `export default withTamagui({\n` +
          `  config: './tamagui.config.ts',\n` +
          `  components: ['tamagui'],\n` +
          `  appDir: true,\n` +
          `})(nextConfig);\n`
      );
    } else {
      fs.writeFileSync(
        nextConfigPath,
        `const { withTamagui } = require('@tamagui/next-plugin');\n\n` +
          `/** @type {import('next').NextConfig} */\n` +
          `const nextConfig = {\n` +
          `  // your Next.js config options here\n` +
          `};\n\n` +
          `module.exports = withTamagui({\n` +
          `  config: './tamagui.config.ts',\n` +
          `  components: ['tamagui'],\n` +
          `  appDir: true,\n` +
          `})(nextConfig);\n`
      );
    }

    console.log(chalk.green("Created new Next.js config with Tamagui plugin"));
  }
}
