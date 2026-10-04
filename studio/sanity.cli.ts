import {defineCliConfig} from 'sanity/cli'
import {dataset, projectId} from './env'

export default defineCliConfig({
  api: {projectId, dataset},
  // 3333 (Sanity's default) often stays occupied by a leftover dev process on Windows;
  // 3334 avoids needing --port every time.
  server: {
    port: 3334,
  },
  deployment: {
    autoUpdates: true,
    // `sanity deploy` prints an appId on first deploy - add it here as
    // `appId: '<id>'` so later deploys don't ask again.
  },
})
