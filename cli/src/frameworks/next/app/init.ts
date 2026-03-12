import { type detectRouterType } from "../detect-router-type.js";
import { installNextDependencies } from "../install-next-dependencies.js";
import { updateNextConfig } from "../update-next-config.js";
import { createTamaguiConfig } from "../../../utils/create-tamagui-config.js";
import { setupNextProvider } from "../setup-next-provider.js";

export async function initAppRouter(
  router: Exclude<ReturnType<typeof detectRouterType>, null>
) {
  await installNextDependencies();
  await updateNextConfig();
  createTamaguiConfig();
  await setupNextProvider(router);
}
