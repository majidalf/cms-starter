import {MenuIcon} from '@sanity/icons/Menu'
import {defineArrayMember, defineField, defineType} from 'sanity'

/** Singleton (see structure.ts): one document with the fixed id "navigation". */
export default defineType({
  name: 'navigation',
  title: 'Navigation',
  type: 'document',
  icon: MenuIcon,
  fields: [
    defineField({
      name: 'header',
      title: 'Header menu',
      type: 'array',
      of: [defineArrayMember({type: 'link'})],
    }),
    defineField({
      name: 'footer',
      title: 'Footer menu',
      type: 'array',
      of: [defineArrayMember({type: 'link'})],
    }),
    defineField({
      name: 'legal',
      title: 'Legal links',
      type: 'array',
      description: 'Small links at the bottom of the footer, e.g. Disclaimer, Privacy Policy.',
      of: [defineArrayMember({type: 'link'})],
    }),
  ],
  preview: {prepare: () => ({title: 'Navigation'})},
})
