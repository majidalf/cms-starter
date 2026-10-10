/*
 * Builds harianja.ndjson from content.mjs. Run from studio/:
 *   node seed/harianja/build.mjs
 *   npx sanity dataset import seed/harianja/harianja.ndjson <dataset> --replace
 * Images are uploaded by the import from seed/harianja/assets/.
 */
import {writeFileSync} from 'node:fs'
import {dirname, join} from 'node:path'
import {fileURLToPath} from 'node:url'
import {
  hero,
  insights,
  legalPages,
  matters,
  navLabels,
  offices,
  partners,
  practiceAreas,
  sampleBody,
  sectors,
  site,
  styleSampleBody,
} from './content.mjs'

const here = dirname(fileURLToPath(import.meta.url))

let keyCounter = 0
const key = () => `k${String(++keyCounter).padStart(5, '0')}`

const loc = (type, value) => ({_type: type, id: value.id, en: value.en})
const str = (value) => loc('localeString', value)
const reqStr = (value) => loc('requiredLocaleString', value)
const text = (value) => loc('localeText', value)
const reqText = (value) => loc('requiredLocaleText', value)
const ref = (id) => ({_type: 'reference', _ref: id})
const keyedRef = (id) => ({...ref(id), _key: key()})
const image = (file, alt) => ({
  _type: 'imageWithAlt',
  _sanityAsset: `image@file://./assets/${file}`,
  alt: {id: alt.id, en: alt.en},
})

function block(style, content, listItem) {
  return {
    _type: 'block',
    _key: key(),
    style: listItem ? 'normal' : style,
    ...(listItem ? {listItem, level: 1} : {}),
    markDefs: [],
    children: [{_type: 'span', _key: key(), text: content, marks: []}],
  }
}

/** [[style, text], ...] per language -> a localized Portable Text value. */
function blocks(type, value) {
  const build = (rows) =>
    rows.map(([style, content]) =>
      style === 'number' || style === 'bullet'
        ? block('normal', content, style)
        : block(style === 'lead' ? 'normal' : style, content),
    )
  return {_type: type, id: build(value.id), en: build(value.en)}
}

const paragraph = (type, value) =>
  blocks(type, {id: [['normal', value.id]], en: [['normal', value.en]]})

const pathLink = (label, path) => ({
  _type: 'link',
  _key: key(),
  label: reqStr(label),
  linkType: 'path',
  path,
})
const pageLink = (label, pageId) => ({
  _type: 'link',
  _key: key(),
  label: reqStr(label),
  linkType: 'page',
  page: ref(pageId),
})

const serviceId = (slug) => `service-${slug}`
const sectorId = (slug) => `industry-${slug}`

const docs = []

docs.push({
  _id: 'siteSettings',
  _type: 'siteSettings',
  organizationName: site.organizationName,
  legalName: site.legalName,
  tagline: str(site.tagline),
  logo: image('logo-full.png', {id: site.legalName, en: site.legalName}),
  homePage: ref('page-home'),
  footerText: text(site.footerText),
  disclaimer: text(site.disclaimer),
  email: site.email,
  phone: site.phone,
  socialLinks: [{_type: 'socialLink', _key: key(), platform: 'LinkedIn', url: site.linkedin}],
  defaultSeo: {_type: 'seo', metaDescription: text(site.metaDescription)},
})

docs.push({
  _id: 'navigation',
  _type: 'navigation',
  header: [
    pathLink(navLabels.about, '/about'),
    pathLink(navLabels.partners, '/partners'),
    pathLink(navLabels.practiceAreas, '/practice-areas'),
    pathLink(navLabels.insights, '/insights'),
    pathLink(navLabels.contact, '/contact'),
  ],
  footer: [
    pathLink(navLabels.about, '/about'),
    pathLink(navLabels.partners, '/partners'),
    pathLink(navLabels.practiceAreas, '/practice-areas'),
    pathLink(navLabels.sectors, '/sectors'),
    pathLink(navLabels.insights, '/insights'),
    pathLink(navLabels.contact, '/contact'),
  ],
  legal: [
    pageLink(navLabels.disclaimer, 'page-disclaimer'),
    pageLink(navLabels.privacy, 'page-privacy-policy'),
  ],
})

docs.push({
  _id: 'page-home',
  _type: 'page',
  title: reqStr({id: 'Beranda', en: 'Home'}),
  slug: {_type: 'localeSlug', id: 'beranda', en: 'home'},
  sections: [
    {
      _type: 'heroSection',
      _key: key(),
      heading: reqStr(hero.heading),
      subheading: text(hero.subheading),
      image: image('hero.png', hero.imageAlt),
      ctas: [pathLink(hero.primaryCta, '/contact'), pathLink(hero.secondaryCta, '/practice-areas')],
    },
  ],
})

for (const page of legalPages) {
  docs.push({
    _id: page.id,
    _type: 'page',
    title: reqStr(page.title),
    slug: {_type: 'localeSlug', ...page.slug},
    sections: page.sections.map(([heading, body]) => ({
      _type: 'richTextSection',
      _key: key(),
      heading: str(heading),
      body: paragraph('requiredLocaleBlockContent', body),
    })),
  })
}

offices.forEach((office, index) => {
  docs.push({
    _id: office.id,
    _type: 'office',
    name: reqStr(office.name),
    kind: str(office.kind),
    address: {_type: 'address', city: office.city, country: 'Indonesia'},
    phone: site.phone,
    email: site.email,
    order: index + 1,
  })
})

sectors.forEach((sector, index) => {
  docs.push({
    _id: sectorId(sector.slug),
    _type: 'industry',
    title: reqStr(sector.title),
    slug: {_type: 'localeSlug', id: sector.slugId, en: sector.slug},
    order: index + 1,
  })
})

partners.forEach((partner, index) => {
  const fullName = `${partner.name}, ${partner.titles}`
  docs.push({
    _id: partner.id,
    _type: 'person',
    name: partner.name,
    titles: partner.titles,
    slug: {_type: 'localeSlug', id: partner.slug, en: partner.slug},
    position: reqStr(partner.position),
    group: 'partner',
    photo: image(partner.photo, {id: fullName, en: fullName}),
    summary: text(partner.summary),
    ...(partner.statement ? {statement: text(partner.statement)} : {}),
    focusAreas: partner.focus.map(([en, id]) => ({...reqStr({en, id}), _key: key()})),
    email: partner.email,
    order: index + 1,
    services: partner.services.map((slug) => keyedRef(serviceId(slug))),
    office: ref('office-jakarta'),
  })
})

practiceAreas.forEach((area, index) => {
  docs.push({
    _id: serviceId(area.slug),
    _type: 'service',
    title: reqStr(area.title),
    slug: {_type: 'localeSlug', id: area.slugId, en: area.slug},
    summary: reqText(area.summary),
    scope: area.scope.map(([en, id, featured]) => ({
      _type: 'scopeItem',
      _key: key(),
      text: reqStr({en, id}),
      // Only area 01 marks its own three; the drafts feature every item.
      featured: area.scope.some((item) => item[2]) ? Boolean(featured) : true,
    })),
    legalBasis: (area.legalBasis ?? []).map(([en, id]) => ({...reqStr({en, id}), _key: key()})),
    order: index + 1,
    keyContacts: [keyedRef(area.contact)],
    industries: (area.sectors ?? []).map((slug) => keyedRef(sectorId(slug))),
  })
})

for (const item of insights) {
  docs.push({
    _id: `insight-${item.slug}`.slice(0, 60),
    _type: 'insight',
    title: reqStr(item.title),
    slug: {_type: 'localeSlug', id: item.slugId, en: item.slug},
    category: item.category,
    publishedAt: item.date,
    excerpt: reqText(item.excerpt),
    body: item.styleSample
      ? blocks('requiredLocaleBlockContent', styleSampleBody)
      : paragraph('requiredLocaleBlockContent', sampleBody),
    authors: item.author ? [keyedRef(item.author)] : [],
    services: item.services.map((slug) => keyedRef(serviceId(slug))),
  })
}

for (const matter of matters) {
  docs.push({
    _id: `case-${matter.slug}`,
    _type: 'caseStudy',
    clientConsent: true,
    consentReference:
      'Layout sample from Design.pen. Not a real engagement - delete before launch.',
    title: reqStr(matter.title),
    slug: {_type: 'localeSlug', id: matter.slugId, en: matter.slug},
    client: reqStr(matter.client),
    year: matter.year,
    summary: reqText(sampleBody),
    challenge: paragraph('requiredLocaleBlockContent', sampleBody),
    approach: paragraph('requiredLocaleBlockContent', sampleBody),
    outcome: paragraph('requiredLocaleBlockContent', sampleBody),
    services: [keyedRef(serviceId(matter.service))],
    industries: [keyedRef(sectorId(matter.sector))],
  })
}

const out = join(here, 'harianja.ndjson')
writeFileSync(out, docs.map((doc) => JSON.stringify(doc)).join('\n') + '\n')
console.log(`${docs.length} documents -> ${out}`)
