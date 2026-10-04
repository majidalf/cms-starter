import {DocumentTextIcon} from '@sanity/icons/DocumentText'
import {defineArrayMember, defineField, defineType} from 'sanity'
import {DOCUMENT_GROUPS, seoField, slugField, summaryField, titleField} from './shared'

/** Only shown on the site with `clientConsent` on (CORPORATE_CLIENT_PLAN Section 5.1) -
 * every web query for case studies filters on it. */
export default defineType({
  name: 'caseStudy',
  title: 'Case study',
  type: 'document',
  icon: DocumentTextIcon,
  groups: DOCUMENT_GROUPS,
  fields: [
    defineField({
      name: 'clientConsent',
      title: 'Client has approved publication in writing',
      type: 'boolean',
      group: 'content',
      initialValue: false,
      description: 'The case study stays hidden on the site until this is on.',
    }),
    defineField({
      name: 'consentReference',
      title: 'Approval reference',
      type: 'string',
      group: 'content',
      description: 'Internal only, never shown on the site: who approved, and where it is filed.',
      hidden: ({parent}) => !parent?.clientConsent,
    }),
    titleField,
    slugField,
    defineField({
      name: 'client',
      title: 'Client',
      type: 'requiredLocaleString',
      group: 'content',
      description: 'May be anonymous, e.g. "Bank BUMN" / "A state-owned bank".',
    }),
    defineField({
      name: 'year',
      title: 'Year',
      type: 'number',
      group: 'content',
      validation: (Rule) => Rule.required().integer().min(1900).max(2100),
    }),
    summaryField,
    defineField({
      name: 'challenge',
      title: 'Challenge',
      type: 'requiredLocaleBlockContent',
      group: 'content',
    }),
    defineField({
      name: 'approach',
      title: 'Approach',
      type: 'requiredLocaleBlockContent',
      group: 'content',
    }),
    defineField({
      name: 'outcome',
      title: 'Outcome',
      type: 'requiredLocaleBlockContent',
      group: 'content',
    }),
    defineField({
      name: 'services',
      title: 'Services',
      type: 'array',
      group: 'relations',
      of: [defineArrayMember({type: 'reference', to: [{type: 'service'}]})],
    }),
    defineField({
      name: 'industries',
      title: 'Industries',
      type: 'array',
      group: 'relations',
      of: [defineArrayMember({type: 'reference', to: [{type: 'industry'}]})],
    }),
    seoField,
  ],
  orderings: [
    {title: 'Year, newest first', name: 'yearDesc', by: [{field: 'year', direction: 'desc'}]},
  ],
  preview: {
    select: {title: 'title.id', year: 'year', consent: 'clientConsent'},
    prepare: ({title, year, consent}) => ({
      title,
      subtitle: `${year ?? ''}${consent ? '' : ' · hidden: no client consent'}`,
    }),
  },
})
