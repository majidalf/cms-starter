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
  // `npm run typegen`: types for the schema and for every defineQuery() in web/ land in
  // web/sanity.types.ts (committed). Rerun after changing the schema or a query.
  typegen: {
    path: '../web/{app,components,lib}/**/*.{ts,tsx}',
    schema: 'schema.json',
    generates: '../web/sanity.types.ts',
  },
})
