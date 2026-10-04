import {defineField, type FieldGroupDefinition} from 'sanity'

/** Field groups shared by the corporate preset documents (plan Section 4.3). */
export const DOCUMENT_GROUPS: FieldGroupDefinition[] = [
  {name: 'content', title: 'Content', default: true},
  {name: 'relations', title: 'Relations'},
  {name: 'seo', title: 'SEO'},
]

export const titleField = defineField({
  name: 'title',
  title: 'Title',
  type: 'requiredLocaleString',
  group: 'content',
})

export const slugField = defineField({
  name: 'slug',
  title: 'URL slug',
  type: 'localeSlug',
  group: 'content',
})

export const seoField = defineField({name: 'seo', title: 'SEO', type: 'seo', group: 'seo'})

export const summaryField = defineField({
  name: 'summary',
  title: 'Summary',
  type: 'requiredLocaleText',
  group: 'content',
  description: 'One or two sentences, shown in lists.',
})

/** No group, so documents without field groups can use it too - spread in
 * `group: 'content'` where the document has groups. */
export const orderField = defineField({
  name: 'order',
  title: 'Order',
  type: 'number',
  description: 'Lower numbers are listed first.',
  validation: (Rule) => Rule.integer().min(0),
})

export const orderByOrderField = {
  title: 'Order',
  name: 'orderAsc',
  by: [{field: 'order', direction: 'asc' as const}],
}

/** List preview: the Indonesian title, with the Indonesian slug as subtitle. */
export const titleAndSlugPreview = {
  select: {title: 'title.id', subtitle: 'slug.id'},
  prepare: ({title, subtitle}: {title?: string; subtitle?: string}) => ({
    title,
    subtitle: subtitle ? `/${subtitle}` : undefined,
  }),
}
