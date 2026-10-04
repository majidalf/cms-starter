import {UserIcon} from '@sanity/icons/User'
import {defineArrayMember, defineField, defineType} from 'sanity'
import {DOCUMENT_GROUPS, orderByOrderField, orderField, seoField, slugField} from './shared'

// Order here is the order of the sections on the leadership page. Labels shown on the site
// live in web/lib/i18n.ts (`personGroups`).
export const PERSON_GROUPS = [
  {title: 'Board', value: 'board'},
  {title: 'Leadership', value: 'leadership'},
  {title: 'Partner', value: 'partner'},
  {title: 'Team', value: 'team'},
]

/** A person on /about/leadership with their own profile page. Relabel per client
 * (e.g. "Lawyer") through `title` only - keep `name: 'person'`. */
export default defineType({
  name: 'person',
  title: 'Person',
  type: 'document',
  icon: UserIcon,
  groups: DOCUMENT_GROUPS,
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      group: 'content',
      validation: (Rule) => Rule.required(),
    }),
    {...slugField, description: 'Usually the same name-based slug in every language.'},
    defineField({
      name: 'position',
      title: 'Position',
      type: 'requiredLocaleString',
      group: 'content',
    }),
    defineField({
      name: 'group',
      title: 'Group',
      type: 'string',
      group: 'content',
      description: 'Section on the leadership page.',
      options: {list: PERSON_GROUPS, layout: 'radio', direction: 'horizontal'},
      validation: (Rule) => Rule.required(),
    }),
    defineField({name: 'photo', title: 'Photo', type: 'imageWithAlt', group: 'content'}),
    defineField({name: 'bio', title: 'Biography', type: 'localeBlockContent', group: 'content'}),
    defineField({
      name: 'credentials',
      title: 'Education, certifications & licenses',
      type: 'array',
      group: 'content',
      of: [
        defineArrayMember({
          name: 'personCredential',
          title: 'Credential',
          type: 'object',
          fields: [
            defineField({
              name: 'kind',
              title: 'Kind',
              type: 'string',
              options: {
                list: [
                  {title: 'Education', value: 'education'},
                  {title: 'Certification', value: 'certification'},
                  {title: 'License / admission', value: 'license'},
                ],
              },
              validation: (Rule) => Rule.required(),
            }),
            defineField({name: 'title', title: 'Title', type: 'requiredLocaleString'}),
            defineField({
              name: 'year',
              title: 'Year',
              type: 'number',
              validation: (Rule) => Rule.integer().min(1900).max(2100),
            }),
          ],
          preview: {select: {title: 'title.id', subtitle: 'kind'}},
        }),
      ],
    }),
    defineField({
      name: 'languages',
      title: 'Languages spoken',
      type: 'array',
      group: 'content',
      description: 'Stored as language codes; the site shows them in the visitor’s language.',
      of: [defineArrayMember({type: 'string'})],
      options: {
        layout: 'grid',
        list: [
          {title: 'Indonesian', value: 'id'},
          {title: 'English', value: 'en'},
          {title: 'Mandarin', value: 'zh'},
          {title: 'Japanese', value: 'ja'},
          {title: 'Dutch', value: 'nl'},
          {title: 'Arabic', value: 'ar'},
          {title: 'German', value: 'de'},
          {title: 'French', value: 'fr'},
        ],
      },
    }),
    defineField({name: 'email', title: 'Email', type: 'email', group: 'content'}),
    defineField({
      name: 'linkedin',
      title: 'LinkedIn URL',
      type: 'url',
      group: 'content',
      validation: (Rule) => Rule.uri({scheme: ['https']}),
    }),
    {...orderField, group: 'content'},
    defineField({
      name: 'services',
      title: 'Services',
      type: 'array',
      group: 'relations',
      description: 'Areas this person works in.',
      of: [defineArrayMember({type: 'reference', to: [{type: 'service'}]})],
    }),
    defineField({
      name: 'office',
      title: 'Office',
      type: 'reference',
      group: 'relations',
      to: [{type: 'office'}],
    }),
    seoField,
  ],
  orderings: [orderByOrderField],
  preview: {
    select: {title: 'name', subtitle: 'position.id', media: 'photo'},
  },
})
