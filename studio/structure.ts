import type {StructureResolver} from 'sanity/structure'

/** Singleton document types and their fixed document ids. */
export const SINGLETONS = {
  siteSettings: 'Site settings',
  navigation: 'Navigation',
} as const

export const singletonTypes = new Set<string>(Object.keys(SINGLETONS))

/** Singletons are pinned at the top and open their one fixed document directly; every
 * other document type is listed below as usual. */
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      ...Object.entries(SINGLETONS).map(([type, title]) =>
        S.listItem()
          .title(title)
          .id(type)
          .child(S.document().schemaType(type).documentId(type).title(title)),
      ),
      S.divider(),
      ...S.documentTypeListItems().filter((item) => !singletonTypes.has(item.getId() ?? '')),
    ])
