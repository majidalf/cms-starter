import type { Locale } from '@/lib/i18n';
import type { PAGE_BY_SLUG_QUERY_RESULT } from '@/sanity.types';

export type Section = NonNullable<NonNullable<PAGE_BY_SLUG_QUERY_RESULT>['sections']>[number];

export type SectionOf<T extends Section['_type']> = Extract<Section, { _type: T }>;

export interface SectionProps<T extends Section['_type']> {
  section: SectionOf<T>;
  locale: Locale;
}
