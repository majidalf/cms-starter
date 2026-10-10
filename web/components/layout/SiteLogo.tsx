import type { Locale } from '@/lib/i18n';
import { SanityImage } from '@/components/SanityImage';

interface Props {
  logo: Parameters<typeof SanityImage>[0]['image'];
  locale: Locale;
  organizationName: string;
}

/** The logo from Site settings, fitted into whatever slot the parent gives it (232×44 in the
 * top bar, 360×68 in the desktop footer). Falls back to the name while no logo is set. */
export function SiteLogo({ logo, locale, organizationName }: Props) {
  if (!logo?.asset) {
    return <span className="font-serif text-[20px] text-on-navy">{organizationName}</span>;
  }
  return (
    <SanityImage
      image={logo}
      locale={locale}
      sizes="(min-width: 1024px) 360px, 232px"
      className="h-full w-full object-contain object-left"
    />
  );
}
