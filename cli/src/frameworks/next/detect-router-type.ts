import path from "path";
import fs from "fs-extra";

export type NextRouterType = "app" | "pages";

export function detectRouterType(): {
  type: NextRouterType;
  dir: string;
} | null {
  const rootDir = process.cwd();
  const appDir = fs.existsSync(path.join(rootDir, "src", "app"))
    ? path.join(rootDir, "src", "app")
    : path.join(rootDir, "app");
  const pagesDir = fs.existsSync(path.join(rootDir, "src", "pages"))
    ? path.join(rootDir, "src", "pages")
    : path.join(rootDir, "pages");

  const hasAppDir = fs.existsSync(appDir);
  const hasPagesDir = fs.existsSync(pagesDir);

  if (hasAppDir && fs.existsSync(path.join(appDir, "layout.tsx"))) {
    return { type: "app", dir: appDir };
  } else if (hasPagesDir && fs.existsSync(path.join(pagesDir, "_app.tsx"))) {
    return { type: "pages", dir: pagesDir };
  }

  return null;
}
