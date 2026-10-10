import { detailPath } from '@/lib/collectionRoutes';
import { isLocale } from '@/lib/i18n';
import { routes } from '@/lib/routes';
import { getPersonBySlug } from '@/lib/sanity/collections/person';
import { localize } from '@/lib/sanity/localize';
import { getSiteSettings } from '@/lib/sanity/queries';
import { absoluteUrl } from '@/lib/site';
import { buildVCard } from '@/lib/vcard';

/** "Save contact" download for a person profile: /<locale>/partners/<slug>/vcard. */
export async function GET(_request: Request, ctx: RouteContext<'/[locale]/partners/[slug]/vcard'>) {
  const { locale, slug } = await ctx.params;
  if (!isLocale(locale)) return new Response('Not found', { status: 404 });

  const [person, settings] = await Promise.all([getPersonBySlug(locale, slug), getSiteSettings()]);
  if (!person?.name) return new Response('Not found', { status: 404 });

  const profilePath = detailPath(locale, routes.leadership, person.slug);
  const vcard = buildVCard({
    name: person.name,
    title: localize(person.position, locale),
    organization: settings?.legalName ?? settings?.organizationName ?? undefined,
    email: person.email ?? person.office?.email ?? undefined,
    phone: person.office?.phone ?? undefined,
    address: person.office?.address,
    url: profilePath ? absoluteUrl(profilePath) : undefined,
  });
  // Slugs are validated as [a-z0-9-] in Studio; strip anything else anyway so the header
  // can't be broken by imported content.
  const filename = `${slug.replace(/[^a-z0-9-]/g, '') || 'contact'}.vcf`;

  return new Response(vcard, {
    headers: {
      'Content-Type': 'text/vcard; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  });
}
