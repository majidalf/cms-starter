import {StarIcon} from '@sanity/icons/Star'
import {defineField, defineType} from 'sanity'
import {orderByOrderField, orderField} from './shared'

/** Certifications, awards and memberships. Shown by the "Credential list" page section,
 * and only with `approvedForDisplay` on (CORPORATE_CLIENT_PLAN Section 5.1). */
export default defineType({
  name: 'credential',
  title: 'Credential',
  type: 'document',
  icon: StarIcon,
  fields: [
    defineField({
      name: 'approvedForDisplay',
      title: 'Approved for display',
      type: 'boolean',
      initialValue: false,
      description:
        'Turn on only once the credential is confirmed valid and its use is approved in writing.',
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'requiredLocaleString',
      description: 'e.g. ISO 9001:2015, an award, or an association membership.',
    }),
    defineField({
      name: 'issuer',
      title: 'Issuer',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'year',
      title: 'Year',
      type: 'number',
      validation: (Rule) => Rule.required().integer().min(1900).max(2100),
    }),
    defineField({name: 'logo', title: 'Logo', type: 'imageWithAlt'}),
    orderField,
  ],
  orderings: [orderByOrderField],
  preview: {
    select: {title: 'title.id', issuer: 'issuer', approved: 'approvedForDisplay', media: 'logo'},
    prepare: ({title, issuer, approved, media}) => ({
      title,
      subtitle: `${issuer ?? ''}${approved ? '' : ' · hidden: not approved'}`,
      media,
    }),
  },
})
