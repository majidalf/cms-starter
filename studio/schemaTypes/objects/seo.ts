import {defineField, defineType} from 'sanity'
import {LOCALES} from '../../lib/locales'

const META_DESCRIPTION_MAX = 160

/** Shared SEO fields, embedded in every routable document and in siteSettings (defaults).
 * Empty fields fall back to the document's own title and to siteSettings.defaultSeo. */
export default defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  options: {collapsible: true, collapsed: true},
  fields: [
    defineField({name: 'metaTitle', title: 'Meta title', type: 'localeString'}),
    defineField({
      name: 'metaDescription',
      title: 'Meta description',
      type: 'localeText',
      validation: (Rule) =>
        Rule.custom((value: Record<string, string | undefined> | undefined) => {
          const tooLong = Object.entries(value ?? {}).filter(
            ([key, text]) => key !== '_type' && (text?.length ?? 0) > META_DESCRIPTION_MAX,
          )
          return tooLong.length === 0
            ? true
            : `Keep under ${META_DESCRIPTION_MAX} characters (${tooLong.map(([key]) => key).join(', ')})`
        }).warning(),
    }),
    defineField({name: 'ogImage', title: 'Social share image', type: 'image'}),
    defineField({
      name: 'noIndex',
      title: 'Hide from search engines',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'canonicalUrl',
      title: 'Canonical URL',
      type: 'object',
      description:
        'Only if this content is published elsewhere first. Per language, so each language version points to its own original.',
      options: {columns: 2},
      fields: LOCALES.map(({id, title}) => defineField({name: id, title, type: 'url'})),
    }),
  ],
})
