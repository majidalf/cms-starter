import {defineField, defineType, type CustomValidator, type Rule} from 'sanity'
import {LOCALES, noPartialTranslation, requiredInEveryLanguage} from '../../lib/locales'

/**
 * Field-level translation (decision D-3, plan Section 4.4): one document holds every
 * language side by side, e.g. `title: {id: '...', en: '...'}`.
 *
 * Each localized type comes in two variants - pick by type name where it is used:
 * - `localeString`: optional; if one language is filled, every language must be.
 * - `requiredLocaleString`: every language must be filled before publishing.
 */
function defineLocaleTypePair(
  name: string,
  title: string,
  buildField: (locale: string) => Record<string, unknown>,
) {
  const variant = (typeName: string, typeTitle: string, rule: CustomValidator<unknown>) =>
    defineType({
      name: typeName,
      title: typeTitle,
      type: 'object',
      options: {columns: buildField('id').type === 'string' ? 2 : 1},
      fields: LOCALES.map(({id, title: localeTitle}) =>
        defineField({
          ...buildField(id),
          name: id,
          title: localeTitle,
          validation: (validationRule: Rule) => validationRule.custom(rule),
        } as Parameters<typeof defineField>[0]),
      ),
    })

  const requiredName = `required${name.charAt(0).toUpperCase()}${name.slice(1)}`
  return [
    variant(name, title, noPartialTranslation),
    variant(requiredName, `${title} (required)`, requiredInEveryLanguage),
  ]
}

export const localeTypes = [
  ...defineLocaleTypePair('localeString', 'Localized string', () => ({type: 'string'})),
  ...defineLocaleTypePair('localeText', 'Localized text', () => ({type: 'text', rows: 3})),
  ...defineLocaleTypePair('localeBlockContent', 'Localized content', () => ({
    type: 'blockContent',
  })),
]
