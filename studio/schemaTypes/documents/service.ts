import {CaseIcon} from '@sanity/icons/Case'
import {defineArrayMember, defineField, defineType} from 'sanity'
import {
  DOCUMENT_GROUPS,
  orderByOrderField,
  orderField,
  seoField,
  slugField,
  summaryField,
  titleAndSlugPreview,
  titleField,
} from './shared'

/** Relabel per client (e.g. "Practice Area", "Solution") through `title` only. */
export default defineType({
  name: 'service',
  title: 'Service',
  type: 'document',
  icon: CaseIcon,
  groups: DOCUMENT_GROUPS,
  fields: [
    titleField,
    slugField,
    summaryField,
    defineField({
      name: 'scope',
      title: 'What we handle',
      type: 'array',
      group: 'content',
      description: 'One line per kind of work.',
      of: [
        defineArrayMember({
          name: 'scopeItem',
          title: 'Item',
          type: 'object',
          fields: [
            defineField({name: 'text', title: 'Text', type: 'requiredLocaleString'}),
            defineField({
              name: 'featured',
              title: 'Show on the home page',
              type: 'boolean',
              initialValue: false,
              description: 'The home page panel lists up to three featured items.',
            }),
          ],
          preview: {
            select: {title: 'text.id', featured: 'featured'},
            prepare: ({title, featured}) => ({title, subtitle: featured ? 'Home page' : undefined}),
          },
        }),
      ],
    }),
    defineField({
      name: 'legalBasis',
      title: 'Legal basis',
      type: 'array',
      group: 'content',
      description: 'Short citations, e.g. "Law 40/2007 · Limited Liability Companies".',
      of: [defineArrayMember({type: 'requiredLocaleString'})],
    }),
    defineField({name: 'body', title: 'Body', type: 'localeBlockContent', group: 'content'}),
    {...orderField, group: 'content'},
    defineField({
      name: 'keyContacts',
      title: 'Key contacts',
      type: 'array',
      group: 'relations',
      of: [defineArrayMember({type: 'reference', to: [{type: 'person'}]})],
    }),
    // The only link between services and industries: industry pages find their services
    // through references(), so the relation is entered once.
    defineField({
      name: 'industries',
      title: 'Industries',
      type: 'array',
      group: 'relations',
      of: [defineArrayMember({type: 'reference', to: [{type: 'industry'}]})],
    }),
    seoField,
  ],
  orderings: [orderByOrderField],
  preview: titleAndSlugPreview,
})
