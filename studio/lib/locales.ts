import type {CustomValidator, Path} from 'sanity'

// Keep in sync with web/lib/i18n.ts - web/ and studio/ are separate npm projects, so the
// list is duplicated on purpose instead of shared through a package.
export const LOCALES = [
  {id: 'id', title: 'Indonesian'},
  {id: 'en', title: 'English'},
] as const

export type LocaleId = (typeof LOCALES)[number]['id']

interface PortableTextItem {
  _type?: string
  children?: {text?: string}[]
}

export function isFilled(value: unknown): boolean {
  if (typeof value === 'string') return value.trim().length > 0
  // Portable Text: blocks whose text is all whitespace don't count; images etc. do.
  if (Array.isArray(value)) {
    return value.some((item: PortableTextItem) =>
      item?._type === 'block'
        ? (item.children ?? []).some((child) => (child.text ?? '').trim().length > 0)
        : true,
    )
  }
  return value !== undefined && value !== null
}

/*
 * These rules sit on each language's own field (`title.id`, `title.en`), not on the
 * localized object: rules on object-typed fields came back as warnings in validation, and
 * warnings don't block publishing. Rules on these inner fields are real errors.
 */

/** Every language must be filled. */
export const requiredInEveryLanguage: CustomValidator<unknown> = (value) =>
  isFilled(value) ? true : 'Required'

/** Optional field: may stay empty, but not filled in one language and empty in another. */
export const noPartialTranslation: CustomValidator<unknown> = (value, context) => {
  if (isFilled(value)) return true
  const parent = context.parent as Record<string, unknown> | undefined
  const otherLanguageFilled = LOCALES.some(({id}) => isFilled(parent?.[id]))
  return otherLanguageFilled ? 'Fill in every language, or leave all languages empty' : true
}

/** Reads the value at `path` inside `root` (supports `{_key}` array segments). */
export function valueAtPath(root: unknown, path: Path): unknown {
  let current: unknown = root
  for (const segment of path) {
    if (current === null || current === undefined) return undefined
    if (typeof segment === 'object' && segment !== null && '_key' in segment) {
      current = Array.isArray(current)
        ? current.find((item) => (item as {_key?: string})?._key === segment._key)
        : undefined
    } else {
      current = (current as Record<string | number, unknown>)[segment as string | number]
    }
  }
  return current
}
