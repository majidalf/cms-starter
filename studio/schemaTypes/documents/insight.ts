import {BulbOutlineIcon} from '@sanity/icons/BulbOutline'
import {defineArrayMember, defineField, defineType} from 'sanity'
import {DOCUMENT_GROUPS, seoField, slugField, titleField} from './shared'

// Labels shown on the site live in web/lib/i18n.ts (`insightCategories`).
const INSIGHT_CATEGORIES = [
  {title: 'Article', value: 'article'},
  {title: 'News', value: 'news'},
  {title: 'Press release', value: 'pressRelease'},
  {title: 'Publication', value: 'publication'},
  {title: 'Update', value: 'update'},
]

export default defineType({
  name: 'insight',
  title: 'Insight',
  type: 'document',
  icon: BulbOutlineIcon,
  groups: DOCUMENT_GROUPS,
  fields: [
    titleField,
    slugField,
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      group: 'content',
      options: {list: INSIGHT_CATEGORIES},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Publication date',
      type: 'date',
      group: 'content',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'requiredLocaleText',
      group: 'content',
      description: 'One or two sentences, shown in lists.',
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'requiredLocaleBlockContent',
      group: 'content',
    }),
    defineField({
      name: 'attachment',
      title: 'Attachment (PDF)',
      type: 'file',
      group: 'content',
      description: 'Optional report or publication, downloaded straight from Sanity’s CDN.',
      options: {accept: 'application/pdf'},
    }),
    defineField({
      name: 'authors',
      title: 'Authors',
      type: 'array',
      group: 'relations',
      of: [defineArrayMember({type: 'reference', to: [{type: 'person'}]})],
    }),
    defineField({
      name: 'services',
      title: 'Services',
      type: 'array',
      group: 'relations',
      of: [defineArrayMember({type: 'reference', to: [{type: 'service'}]})],
    }),
    seoField,
  ],
  orderings: [
    {
      title: 'Publication date, newest first',
      name: 'publishedAtDesc',
      by: [{field: 'publishedAt', direction: 'desc'}],
    },
  ],
  preview: {
    select: {title: 'title.id', date: 'publishedAt', category: 'category'},
    prepare: ({title, date, category}) => ({
      title,
      subtitle: [date, category].filter(Boolean).join(' · '),
    }),
  },
})
