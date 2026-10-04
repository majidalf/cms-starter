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
// Corporate preset (plan Section 4.3). Unused collections are removed per client - see
// docs/NEW_PROJECT_CHECKLIST.md "Removing a collection".
import person from './documents/person'
import service from './documents/service'
import industry from './documents/industry'
import caseStudy from './documents/caseStudy'
import insight from './documents/insight'
import office from './documents/office'
import jobOpening from './documents/jobOpening'
import credential from './documents/credential'

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
  service,
  industry,
  caseStudy,
  insight,
  person,
  office,
  jobOpening,
  credential,
]
