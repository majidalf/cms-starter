import {defineField, defineType, type CustomValidator} from 'sanity'
import {LOCALES, type LocaleId} from '../../lib/locales'

const SLUG_MAX_LENGTH = 96
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const API_VERSION = '2025-01-01'

/** "Tentang Kami & Visi" -> "tentang-kami-visi" */
export function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, SLUG_MAX_LENGTH)
}

function slugRule(locale: LocaleId): CustomValidator<string | undefined> {
  return async (value, context) => {
    if (!value) {
      const title = (context.document?.title as Record<string, string | undefined> | undefined)?.[
        locale
      ]
      return title ? `Required. Suggested: ${slugify(title)}` : 'Required'
    }
    if (value.length > SLUG_MAX_LENGTH) return `Keep under ${SLUG_MAX_LENGTH} characters`
    if (!SLUG_PATTERN.test(value)) {
      return `Use lowercase letters, numbers and single hyphens only. Suggested: ${slugify(value)}`
    }

    const id = context.document?._id.replace(/^drafts\./, '')
    const duplicates = await context
      .getClient({apiVersion: API_VERSION})
      .fetch<number>(
        `count(*[_type == $type && slug[$locale] == $value && !(_id in [$id, "drafts." + $id])])`,
        {type: context.document?._type, locale, value, id},
      )
    return duplicates === 0 ? true : 'Already used by another document in this language'
  }
}

/**
 * URL slug per language. Plain strings rather than Sanity's `slug` type: `slug` is an
 * object, and rules on object values only ever came back as warnings, which don't block
 * publishing. The validation message suggests a slug generated from the same language's
 * title, standing in for the `slug` type's "Generate" button.
 */
export default defineType({
  name: 'localeSlug',
  title: 'URL slug',
  type: 'object',
  options: {columns: 2},
  fields: LOCALES.map(({id, title}) =>
    defineField({
      name: id,
      title,
      type: 'string',
      validation: (Rule) => Rule.custom(slugRule(id)),
    }),
  ),
})
