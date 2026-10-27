import { defineCliConfig } from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID,
    dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  },
  // Dirección del panel publicado: https://selecta-escritura.sanity.studio
  studioHost: 'selecta-escritura',
  deployment: { appId: 't9b18i7plnvpyi72yik628mv' },
})
