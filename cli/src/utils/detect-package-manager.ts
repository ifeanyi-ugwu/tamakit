import path from "path";
import fs from "fs-extra";

export function detectPackageManager() {
  const hasYarnLock = fs.existsSync(path.join(process.cwd(), "yarn.lock"));
  const hasPnpmLock = fs.existsSync(
    path.join(process.cwd(), "pnpm-lock.yaml")
  );

  if (hasPnpmLock) return "pnpm";
  if (hasYarnLock) return "yarn";
  return "npm";
}
