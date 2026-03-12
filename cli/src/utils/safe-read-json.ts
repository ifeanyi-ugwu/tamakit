import fs from "fs-extra";

export async function safeReadJSON(filePath: string) {
  if (!fs.existsSync(filePath) || fs.statSync(filePath).size === 0) {
    return {};
  }

  return fs.readJSON(filePath);
}
