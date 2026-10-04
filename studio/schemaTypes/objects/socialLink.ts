import {defineField, defineType} from 'sanity'

/** The platform list is suggestions only, not a closed enum — editors can type any platform. */
export default defineType({
  name: 'socialLink',
  title: 'Social link',
  type: 'object',
  fields: [
    defineField({
      name: 'platform',
      title: 'Platform',
      type: 'string',
      options: {
        list: ['LinkedIn', 'X', 'Instagram', 'Facebook', 'YouTube', 'WhatsApp'],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'url',
      title: 'URL',
      type: 'url',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {title: 'platform', subtitle: 'url'},
  },
})
