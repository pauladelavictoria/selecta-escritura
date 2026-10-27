import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { esESLocale } from '@sanity/locale-es-es'
import { schemaTypes, singletons } from './schemaTypes/index.js'

const singletonTypes = new Set(singletons.map((s) => s.type))

export default defineConfig({
  name: 'default',
  title: 'Selecta de Escritura',
  projectId: process.env.SANITY_STUDIO_PROJECT_ID,
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Contenido')
          .items([
            S.documentTypeListItem('page').title('Páginas'),
            S.documentTypeListItem('teacher').title('Profesorado'),
            S.divider(),
            ...singletons.map(({ id, type, title }) =>
              S.listItem().title(title).id(id).child(S.document().schemaType(type).documentId(id)),
            ),
          ]),
    }),
    esESLocale(),
  ],

  schema: {
    types: schemaTypes,
    // Los documentos únicos no aparecen en «Crear nuevo».
    templates: (templates) => templates.filter(({ schemaType }) => !singletonTypes.has(schemaType)),
  },

  document: {
    actions: (actions, { schemaType }) =>
      singletonTypes.has(schemaType) ? actions.filter(({ action }) => ['publish', 'discardChanges', 'restore'].includes(action)) : actions,
  },
})
