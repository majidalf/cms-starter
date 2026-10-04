import type {SchemaTypeDefinition} from 'sanity'

import seo from './objects/seo'
import socialLink from './objects/socialLink'
import link from './objects/link'
import blockContent from './objects/blockContent'
import imageWithAlt from './objects/imageWithAlt'
import address from './objects/address'
import {localeTypes} from './objects/locale'
import localeSlug from './objects/localeSlug'
import {sectionTypes} from './sections'

import siteSettings from './documents/siteSettings'
import navigation from './documents/navigation'
import page from './documents/page'

// The corporate preset (person, service, insight, ...) is added in phase T2b -
// see docs/plan/STARTER_TEMPLATE_PLAN.md Section 4.3.
export const schemaTypes: SchemaTypeDefinition[] = [
  // objects
  ...localeTypes,
  localeSlug,
  seo,
  socialLink,
  link,
  blockContent,
  imageWithAlt,
  address,
  // page builder sections
  ...sectionTypes,
  // documents
  siteSettings,
  navigation,
  page,
]
