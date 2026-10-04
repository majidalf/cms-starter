import { notFound } from 'next/navigation';
import { getDictionary, isLocale, localePath } from '@/lib/i18n';
import { listPageMetadata } from '@/lib/pageMetadata';
import { routes } from '@/lib/routes';
import { getPeople } from '@/lib/sanity/collections/person';
import { PageHeader } from '@/components/collections/PageHeader';
import { PersonList } from '@/components/collections/PersonList';
import { Container } from '@/components/ui/Container';

// Section order on the page. Keep in sync with PERSON_GROUPS in
// studio/schemaTypes/documents/person.ts.
const GROUP_ORDER = ['board', 'leadership', 'partner', 'team'] as const;

export function generateMetadata({ params }: PageProps<'/[locale]/about/leadership'>) {
  return listPageMetadata(params, routes.leadership, (t) => t.leadership);
}

export default async function LeadershipPage({ params }: PageProps<'/[locale]/about/leadership'>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);
  const people = await getPeople();
  const groups = GROUP_ORDER.map((group) => ({
    group,
    people: people.filter((person) => person.group === group),
  })).filter(({ people: members }) => members.length > 0);

  return (
    <>
      <PageHeader
        locale={locale}
        path={localePath(locale, routes.leadership)}
        title={t.leadership}
      />
      <Container className="flex flex-col gap-16 pb-20">
        {groups.length === 0 && <p className="text-muted">{t.emptyList}</p>}
        {groups.map(({ group, people: members }) => (
          <section key={group} aria-labelledby={`group-${group}`} className="flex flex-col gap-8">
            <h2 id={`group-${group}`} className="font-serif text-2xl text-brand">
              {t.personGroups[group]}
            </h2>
            <PersonList people={members} locale={locale} />
          </section>
        ))}
      </Container>
    </>
  );
}
