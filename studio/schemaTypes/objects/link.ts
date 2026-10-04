import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'link',
  title: 'Link',
  type: 'object',
  fields: [
    defineField({ name: 'text', title: 'Text', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'href', title: 'Href', type: 'string', validation: (Rule) => Rule.required() }),
  ],
  preview: {
    select: { title: 'text', subtitle: 'href' },
  },
});
