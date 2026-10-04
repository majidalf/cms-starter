import {EarthGlobeIcon} from '@sanity/icons/EarthGlobe'
import {defineField, defineType} from 'sanity'
import {
  orderByOrderField,
  orderField,
  seoField,
  slugField,
  summaryField,
  titleAndSlugPreview,
  titleField,
} from './shared'

/** Sectors served. Services link here through `service.industries`, not the other way. */
export default defineType({
  name: 'industry',
  title: 'Industry',
  type: 'document',
  icon: EarthGlobeIcon,
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    titleField,
    slugField,
    summaryField,
    defineField({name: 'body', title: 'Body', type: 'localeBlockContent', group: 'content'}),
    {...orderField, group: 'content'},
    seoField,
  ],
  orderings: [orderByOrderField],
  preview: titleAndSlugPreview,
})
