import type {SchemaTypeDefinition} from 'sanity'

import seo from './objects/seo'
import socialLink from './objects/socialLink'
import link from './objects/link'
import blockContent from './objects/blockContent'

// Documents (siteSettings, navigation, page, corporate preset) are added in phases
// T2a/T2b - see docs/plan/STARTER_TEMPLATE_PLAN.md Section 10.
export const schemaTypes: SchemaTypeDefinition[] = [
  // objects
  seo,
  socialLink,
  link,
  blockContent,
]
