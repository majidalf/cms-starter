import {defineArrayMember, defineField, defineType} from 'sanity'

/**
 * Page builder sections (plan Section 4.2). Deliberately few and neutral: structured
 * collections (people, services, insights) are document types, not sections. Each type
 * needs a matching renderer in web/components/sections/.
 */

const requiredHeading = defineField({
  name: 'heading',
  title: 'Heading',
  type: 'requiredLocaleString',
})

const optionalHeading = defineField({name: 'heading', title: 'Heading', type: 'localeString'})

function sectionPreview(subtitle: string) {
  return {
    select: {title: 'heading.id'},
    prepare: ({title}: {title?: string}) => ({title: title || '(no heading)', subtitle}),
  }
}

export const heroSection = defineType({
  name: 'heroSection',
  title: 'Hero',
  type: 'object',
  fields: [
    requiredHeading,
    defineField({name: 'subheading', title: 'Subheading', type: 'localeText'}),
    defineField({name: 'image', title: 'Image', type: 'imageWithAlt'}),
    defineField({
      name: 'ctas',
      title: 'Buttons',
      type: 'array',
      of: [defineArrayMember({type: 'link'})],
      validation: (Rule) => Rule.max(2),
    }),
  ],
  preview: sectionPreview('Hero'),
})

export const richTextSection = defineType({
  name: 'richTextSection',
  title: 'Rich text',
  type: 'object',
  fields: [
    optionalHeading,
    defineField({
      name: 'body',
      title: 'Body',
      type: 'requiredLocaleBlockContent',
    }),
  ],
  preview: sectionPreview('Rich text'),
})

export const ctaSection = defineType({
  name: 'ctaSection',
  title: 'Call to action',
  type: 'object',
  fields: [
    requiredHeading,
    defineField({name: 'text', title: 'Text', type: 'localeText'}),
    defineField({
      name: 'cta',
      title: 'Button',
      type: 'link',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: sectionPreview('Call to action'),
})

export const featureListSection = defineType({
  name: 'featureListSection',
  title: 'Feature list',
  type: 'object',
  fields: [
    requiredHeading,
    defineField({name: 'intro', title: 'Intro', type: 'localeText'}),
    defineField({
      name: 'items',
      title: 'Items',
      type: 'array',
      validation: (Rule) => Rule.min(1),
      of: [
        defineArrayMember({
          name: 'featureItem',
          title: 'Item',
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Title',
              type: 'requiredLocaleString',
            }),
            defineField({name: 'description', title: 'Description', type: 'localeText'}),
          ],
          preview: {select: {title: 'title.id'}},
        }),
      ],
    }),
  ],
  preview: sectionPreview('Feature list'),
})

export const imageTextSection = defineType({
  name: 'imageTextSection',
  title: 'Image + text',
  type: 'object',
  fields: [
    optionalHeading,
    defineField({name: 'body', title: 'Body', type: 'localeBlockContent'}),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'imageWithAlt',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'imagePosition',
      title: 'Image position',
      type: 'string',
      initialValue: 'left',
      options: {layout: 'radio', direction: 'horizontal', list: ['left', 'right']},
    }),
  ],
  preview: sectionPreview('Image + text'),
})

/** Lists every `credential` with `approvedForDisplay` on - the section only holds the
 * heading. Delete together with the `credential` document type. */
export const credentialListSection = defineType({
  name: 'credentialListSection',
  title: 'Credential list',
  type: 'object',
  fields: [
    requiredHeading,
    defineField({
      name: 'intro',
      title: 'Intro',
      type: 'localeText',
      description: 'The list itself shows every credential approved for display.',
    }),
  ],
  preview: sectionPreview('Credential list'),
})

export const sectionTypes = [
  heroSection,
  richTextSection,
  ctaSection,
  featureListSection,
  imageTextSection,
  credentialListSection,
]
