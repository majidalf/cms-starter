import {defineField, defineType} from 'sanity'

/**
 * Navigation and call-to-action link. `page` links follow the page's slug in each language;
 * `path` is for fixed app routes (e.g. /services) and gets the language prefix added by the
 * site; `external` is used as-is.
 */
export default defineType({
  name: 'link',
  title: 'Link',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'requiredLocaleString',
    }),
    defineField({
      name: 'linkType',
      title: 'Link to',
      type: 'string',
      initialValue: 'page',
      options: {
        layout: 'radio',
        direction: 'horizontal',
        list: [
          {title: 'Page', value: 'page'},
          {title: 'Site path', value: 'path'},
          {title: 'External URL', value: 'external'},
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'page',
      title: 'Page',
      type: 'reference',
      to: [{type: 'page'}],
      hidden: ({parent}) => parent?.linkType !== 'page',
      validation: (Rule) =>
        Rule.custom((value, {parent}) =>
          (parent as {linkType?: string})?.linkType === 'page' && !value ? 'Choose a page' : true,
        ),
    }),
    defineField({
      name: 'path',
      title: 'Site path',
      type: 'string',
      description: 'Without language prefix, e.g. /services',
      hidden: ({parent}) => parent?.linkType !== 'path',
      validation: (Rule) =>
        Rule.custom((value, {parent}) => {
          if ((parent as {linkType?: string})?.linkType !== 'path') return true
          return value?.startsWith('/') ? true : 'Must start with /'
        }),
    }),
    defineField({
      name: 'url',
      title: 'External URL',
      type: 'url',
      hidden: ({parent}) => parent?.linkType !== 'external',
      validation: (Rule) =>
        Rule.uri({scheme: ['https', 'http', 'mailto', 'tel']}).custom((value, {parent}) =>
          (parent as {linkType?: string})?.linkType === 'external' && !value ? 'Enter a URL' : true,
        ),
    }),
  ],
  preview: {
    select: {title: 'label.id', subtitle: 'linkType'},
  },
})
