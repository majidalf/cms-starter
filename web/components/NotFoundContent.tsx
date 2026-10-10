'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { defaultLocale, getDictionary, isLocale, localePath } from '@/lib/i18n';
import { routes } from '@/lib/routes';
import { Icon } from '@/components/ui/Icon';

/**
 * 404 (Design.pen → 404 · Desktop 1440 / Mobile 375): "Error 404" and the logo mark in the
 * first third, then the heading, a lead and four ruled links.
 *
 * Used by app/[locale]/not-found.tsx and app/global-not-found.tsx. Neither receives params,
 * so the language comes from the URL's first segment; anything else gets the default
 * language. The mark is a static file, because a 404 must not depend on the CMS.
 */
export function NotFoundContent() {
  const segment = usePathname().split('/')[1] ?? '';
  const locale = isLocale(segment) ? segment : defaultLocale;
  const t = getDictionary(locale);
  const links = [
    { label: t.services, href: localePath(locale, routes.services) },
    { label: t.leadership, href: localePath(locale, routes.leadership) },
    { label: t.insights, href: localePath(locale, routes.insights) },
    { label: t.contact, href: localePath(locale, routes.contact) },
  ];

  return (
    <div lang={locale} className="relative mx-auto w-full max-w-[1440px]">
      <div aria-hidden="true" className="h-[76px] lg:h-[128px]" />
      <div className="flex flex-col gap-6 px-4 pb-[128px] pt-10 lg:flex-row lg:gap-0 lg:px-5 lg:pb-40 lg:pt-24">
        <div className="flex flex-col gap-6 lg:w-1/3 lg:shrink-0">
          <p className="text-[14px] leading-[17px] text-on-navy-2">{t.notFound.label}</p>
          {/* Decorative: the name is in the header logo. `unoptimized` because the image
              loader only understands Sanity CDN URLs and this is a small static file. */}
          <Image
            src="/brand/logo-mark.png"
            alt=""
            width={115}
            height={140}
            unoptimized
            className="h-[140px] w-[115px] object-contain"
          />
        </div>
        <div className="flex flex-1 flex-col gap-6 lg:gap-8">
          <h1 className="font-display text-[44px] leading-[46px] tracking-[-0.6px] text-on-navy lg:text-[min(7.222vw,104px)] lg:leading-[1.048]">
            {t.notFound.heading}
          </h1>
          <p className="text-[17px] leading-[26px] text-on-navy-2 lg:max-w-[640px] lg:text-[22px] lg:leading-[32px]">
            {t.notFound.lead}
          </p>
          <ul className="flex flex-col border-b border-line-navy lg:max-w-[520px]">
            {links.map((link) => (
              <li key={link.href} className="border-t border-line-navy">
                <Link
                  href={link.href}
                  className="flex items-center justify-between py-4 font-serif text-[20px] leading-[24px] text-on-navy -outline-offset-2 transition-colors hover:text-brass-light"
                >
                  {link.label}
                  <Icon name="arrowUpRight" className="h-[18px] w-[18px] shrink-0" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
