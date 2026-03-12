import fs from "fs";
import path from "path";
import chalk from "chalk";
import { parse, print, visit } from "recast";
import babelParser from "@babel/parser";
import { namedTypes as n, builders as b } from "ast-types";
import { type detectRouterType } from "./detect-router-type.js";

export async function setupNextProvider(
  router: Exclude<ReturnType<typeof detectRouterType>, null>
) {
  const { type, dir } = router;
  if (type === "app") {
    modifyLayoutFile(path.join(dir, "layout.tsx"));
  } else {
    modifyAppFile(path.join(dir, "_app.tsx"));
  }
}

function modifyLayoutFile(layoutPath: string) {
  let layoutContent = fs.readFileSync(layoutPath, "utf8");

  if (layoutContent.includes("TamaguiProvider")) return;

  console.log(
    chalk.yellow(
      "\nDetected Next.js App Router. Adding Tamagui Provider to layout.tsx..."
    )
  );

  let updatedContent = addImportsIfMissing(layoutContent);

  try {
    const ast = parse(updatedContent, {
      parser: {
        parse(source: string, parserOptions: any) {
          return babelParser.parse(source, {
            ...parserOptions,
            sourceType: "module",
            plugins: ["jsx", "typescript"],
            tokens: true,
          });
        },
      },
    });

    let modified = false;

    visit(ast, {
      visitJSXElement(path) {
        const elementName = path.node.openingElement.name;
        if (n.JSXIdentifier.check(elementName) && elementName.name === "body") {
          const tamaguiProvider = createTamaguiProvider(path.node.children);
          path.node.children = [tamaguiProvider];
          modified = true;
        }
        this.traverse(path);
      },
    });

    if (modified) {
      fs.writeFileSync(layoutPath, print(ast).code, "utf8");
      console.log(
        chalk.green("Tamagui Provider added successfully to layout.tsx!")
      );
    } else {
      console.log(
        chalk.yellow("Could not locate the body element in layout.tsx")
      );
    }
  } catch (error) {
    console.error("Error while parsing or modifying layout.tsx:", error);
  }
}

function modifyAppFile(appPath: string) {
  let appContent = fs.readFileSync(appPath, "utf8");

  if (appContent.includes("TamaguiProvider")) return;

  console.log(
    chalk.yellow(
      "\nDetected Next.js Pages Router. Adding Tamagui Provider to _app.tsx..."
    )
  );

  let updatedContent = addImportsIfMissing(appContent);

  try {
    const ast = parse(updatedContent, {
      parser: {
        parse(source: string, parserOptions: any) {
          return babelParser.parse(source, {
            ...parserOptions,
            sourceType: "module",
            plugins: ["jsx", "typescript"],
            tokens: true,
          });
        },
      },
    });

    visit(ast, {
      visitExportDefaultDeclaration(path) {
        const declaration = path.node.declaration;

        if (
          n.FunctionDeclaration.check(declaration) ||
          n.ArrowFunctionExpression.check(declaration)
        ) {
          visit(declaration, {
            visitReturnStatement(innerPath) {
              if (!innerPath.node.argument) return false;

              innerPath.node.argument = createTamaguiProvider([
                b.jsxExpressionContainer(innerPath.node.argument),
              ]);
              return false;
            },
          });
        }
        return false;
      },
    });

    fs.writeFileSync(appPath, print(ast).code, "utf8");
    console.log(
      chalk.green("Tamagui Provider added successfully to _app.tsx!")
    );
  } catch (error) {
    console.error("Error while parsing or modifying _app.tsx:", error);
  }
}

function createTamaguiProvider(children: any) {
  return b.jsxElement(
    b.jsxOpeningElement(
      b.jsxIdentifier("TamaguiProvider"),
      [
        b.jsxAttribute(
          b.jsxIdentifier("config"),
          b.jsxExpressionContainer(b.identifier("config"))
        ),
      ],
      false
    ),
    b.jsxClosingElement(b.jsxIdentifier("TamaguiProvider")),
    children
  );
}

function addImportsIfMissing(content: string) {
  if (!content.includes("import { TamaguiProvider }")) {
    return `import { TamaguiProvider } from 'tamagui'\nimport config from '@/tamagui.config'\n${content}`;
  }
  return content;
}
