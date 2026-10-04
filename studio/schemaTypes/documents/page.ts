import {DocumentIcon} from '@sanity/icons/Document'
import {defineArrayMember, defineField, defineType} from 'sanity'
import {sectionTypes} from '../sections'

export default defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  icon: DocumentIcon,
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'requiredLocaleString',
      group: 'content',
    }),
    defineField({
      name: 'slug',
      title: 'URL slug',
      type: 'localeSlug',
      group: 'content',
      description: 'The home page ignores its slug - it is set in Site settings.',
    }),
    defineField({
      name: 'sections',
      title: 'Sections',
      type: 'array',
      group: 'content',
      of: sectionTypes.map(({name}) => defineArrayMember({type: name})),
    }),
    defineField({name: 'seo', title: 'SEO', type: 'seo', group: 'seo'}),
  ],
  preview: {
    select: {title: 'title.id', subtitle: 'slug.id'},
    prepare: ({title, subtitle}) => ({title, subtitle: subtitle ? `/${subtitle}` : undefined}),
  },
})
