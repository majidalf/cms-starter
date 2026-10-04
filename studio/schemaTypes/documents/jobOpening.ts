import {UsersIcon} from '@sanity/icons/Users'
import {defineField, defineType} from 'sanity'
import {seoField, slugField, titleField} from './shared'

// Labels shown on the site live in web/lib/i18n.ts (`employmentTypes`).
const EMPLOYMENT_TYPES = [
  {title: 'Full-time', value: 'fullTime'},
  {title: 'Part-time', value: 'partTime'},
  {title: 'Contract', value: 'contract'},
  {title: 'Internship', value: 'internship'},
]

/** Listed on /careers while `isOpen` is on. Applications go to `applyUrl` (HR email or a
 * recruitment platform): CVs are personal data, so the site doesn't collect them (UU PDP). */
export default defineType({
  name: 'jobOpening',
  title: 'Job opening',
  type: 'document',
  icon: UsersIcon,
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({
      name: 'isOpen',
      title: 'Open for applications',
      type: 'boolean',
      group: 'content',
      initialValue: true,
      description: 'Turn off to take the opening off the site.',
    }),
    titleField,
    slugField,
    defineField({
      name: 'location',
      title: 'Location',
      type: 'requiredLocaleString',
      group: 'content',
    }),
    defineField({
      name: 'employmentType',
      title: 'Employment type',
      type: 'string',
      group: 'content',
      options: {list: EMPLOYMENT_TYPES, layout: 'radio', direction: 'horizontal'},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'deadline',
      title: 'Application deadline',
      type: 'date',
      group: 'content',
      description:
        'Shown to visitors only. The opening stays listed until "Open for applications" is turned off.',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'requiredLocaleBlockContent',
      group: 'content',
    }),
    defineField({
      name: 'applyUrl',
      title: 'How to apply',
      type: 'url',
      group: 'content',
      description: 'mailto: address of HR, or a link to the recruitment platform.',
      validation: (Rule) => Rule.required().uri({scheme: ['https', 'mailto']}),
    }),
    seoField,
  ],
  preview: {
    select: {title: 'title.id', isOpen: 'isOpen', location: 'location.id'},
    prepare: ({title, isOpen, location}) => ({
      title,
      subtitle: `${location ?? ''}${isOpen ? '' : ' · closed'}`,
    }),
  },
})
