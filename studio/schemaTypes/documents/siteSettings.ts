import {CogIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

/** Singleton (see structure.ts): one document with the fixed id "siteSettings". */
export default defineType({
  name: 'siteSettings',
  title: 'Site settings',
  type: 'document',
  icon: CogIcon,
  groups: [
    {name: 'identity', title: 'Identity', default: true},
    {name: 'contact', title: 'Contact'},
    {name: 'seo', title: 'SEO & analytics'},
  ],
  fields: [
    defineField({
      name: 'organizationName',
      title: 'Organization name',
      type: 'string',
      group: 'identity',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'legalName',
      title: 'Legal name',
      type: 'string',
      group: 'identity',
      description: 'e.g. PT Contoh Sejahtera Tbk - used in the footer and structured data.',
    }),
    defineField({name: 'tagline', title: 'Tagline', type: 'localeString', group: 'identity'}),
    defineField({name: 'logo', title: 'Logo', type: 'imageWithAlt', group: 'identity'}),
    defineField({
      name: 'homePage',
      title: 'Home page',
      type: 'reference',
      to: [{type: 'page'}],
      group: 'identity',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'footerText',
      title: 'Footer text',
      type: 'localeText',
      group: 'identity',
    }),
    defineField({
      name: 'disclaimer',
      title: 'Footer disclaimer',
      type: 'localeText',
      group: 'identity',
      description: 'Short legal notice shown in the footer, if the industry requires one.',
    }),
    defineField({name: 'email', title: 'Email', type: 'email', group: 'contact'}),
    defineField({name: 'phone', title: 'Phone', type: 'string', group: 'contact'}),
    defineField({name: 'address', title: 'Main address', type: 'address', group: 'contact'}),
    defineField({
      name: 'socialLinks',
      title: 'Social links',
      type: 'array',
      group: 'contact',
      of: [defineArrayMember({type: 'socialLink'})],
    }),
    defineField({
      name: 'defaultSeo',
      title: 'Default SEO',
      type: 'seo',
      group: 'seo',
      description: 'Used when a page leaves its own SEO fields empty.',
    }),
    defineField({
      name: 'analytics',
      title: 'Analytics',
      type: 'object',
      group: 'seo',
      fields: [
        defineField({
          name: 'cloudflareWebAnalyticsToken',
          title: 'Cloudflare Web Analytics token',
          type: 'string',
          description: 'Cookieless - no consent banner needed.',
        }),
        defineField({
          name: 'ga4MeasurementId',
          title: 'GA4 Measurement ID',
          type: 'string',
          description: 'Requires a consent banner under UU PDP. Leave empty unless needed.',
        }),
      ],
    }),
  ],
  preview: {prepare: () => ({title: 'Site settings'})},
})
