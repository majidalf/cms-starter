import {defineField, defineType} from 'sanity'
import {LOCALES, isFilled, valueAtPath} from '../../lib/locales'

/** Image whose alt text is required in every language once an image is set
 * (accessibility). An empty image needs no alt text. */
export default defineType({
  name: 'imageWithAlt',
  title: 'Image',
  type: 'image',
  options: {hotspot: true},
  fields: [
    defineField({
      name: 'alt',
      title: 'Alt text',
      type: 'object',
      description: 'Describe the image for screen readers.',
      options: {columns: 2},
      fields: LOCALES.map(({id, title}) =>
        defineField({
          name: id,
          title,
          type: 'string',
          validation: (Rule) =>
            Rule.custom((value, context) => {
              // path: [..., <image field>, 'alt', <locale>] - the image is two levels up.
              const image = valueAtPath(context.document, context.path?.slice(0, -2) ?? []) as
                {asset?: unknown} | undefined
              return image?.asset && !isFilled(value) ? 'Required when an image is set' : true
            }),
        }),
      ),
    }),
  ],
})
