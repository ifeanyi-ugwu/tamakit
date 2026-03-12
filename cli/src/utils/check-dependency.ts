import path from "path";
import { safeReadJSON } from "./safe-read-json.js";

export async function checkDependency(packageName: string) {
  try {
    const packageJsonPath = path.join(process.cwd(), "package.json");
    const packageJson = await safeReadJSON(packageJsonPath);

    return !!(
      (packageJson.dependencies && packageJson.dependencies[packageName]) ||
      (packageJson.devDependencies && packageJson.devDependencies[packageName])
    );
  } catch (error) {
    return false;
  }
}
