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
