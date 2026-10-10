'use client';

import Link from 'next/link';
import { useId, useState } from 'react';
import { detailPath } from '@/lib/collectionRoutes';
import { getDictionary, type Locale } from '@/lib/i18n';
import { routes } from '@/lib/routes';
import { localize } from '@/lib/sanity/localize';
import type { SERVICES_QUERY_RESULT } from '@/sanity.types';

interface Props {
  services: SERVICES_QUERY_RESULT;
  locale: Locale;
}

/** Split a summary into up to three scope bullets for the detail panel. */
function scopeItems(summary: string | undefined): string[] {
  if (!summary) return [];
  return summary
    .split(/(?<=[.!?])\s+/)
    .map((part) => part.trim())
    .filter(Boolean)
    .slice(0, 3);
}

/**
 * Home Practice Areas (design/Design.pen → Home · Desktop 1440 → Practice Areas).
 * Navy-900, padding 144/40, gap 72. Head: serif-italic label 17px + display
 * H2 72px/1.02 (-1) + lead 20px/1.5 (360px). Index 640px: rows with 40px
 * number + serif name 26px, top rules, active row in brass-light bold.
 * Detail panel (navy-800, r2, p48, sticky): index label 14px, display title
 * 52px, scope items 18px/1.4 with dots, view link. Mobile: accordion.
 */
export function PracticeAreasSection({ services, locale }: Props) {
  const t = getDictionary(locale).home;
  const baseId = useId();
  const items = services
    .map((service, index) => ({
      id: service._id,
      no: String(index + 1).padStart(2, '0'),
      title: localize(service.title, locale),
      scope: scopeItems(localize(service.summary, locale)),
      href: detailPath(locale, routes.services, service.slug),
    }))
    .filter((item) => item.title && item.href);
  const [selected, setSelected] = useState(0);
  if (items.length === 0) return null;
  const activeIndex = Math.min(selected, items.length - 1);
  const active = items[activeIndex];
  const heading =
    items.length === 15
      ? t.practiceHeadingFifteen
      : t.practiceHeadingOther.replace('{n}', String(items.length));

  const onKeyDown = (event: React.KeyboardEvent, index: number) => {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    event.preventDefault();
    const next =
      event.key === 'ArrowDown'
        ? (index + 1) % items.length
        : (index - 1 + items.length) % items.length;
    setSelected(next);
    document.getElementById(`${baseId}-tab-${next}`)?.focus();
  };

  return (
    <section aria-labelledby="practice-heading" className="bg-navy-900 text-on-navy">
      <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-8 px-4 py-[72px] md:gap-[72px] md:px-10 md:py-[144px]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:gap-10">
          <div className="flex flex-1 flex-col gap-5">
            <p className="font-serif text-[15px] text-on-navy-2 italic md:text-[17px]">
              {t.practiceEyebrow}
            </p>
            <h2
              id="practice-heading"
              className="font-display text-[44px] leading-[1.02] tracking-[-1px] text-balance text-on-navy md:text-[72px]"
            >
              {heading}
            </h2>
          </div>
          <div className="w-full shrink-0 md:max-w-[360px]">
            <p className="text-base leading-[1.5] text-on-navy-2 md:text-[20px]">
              {t.practiceLead}
            </p>
          </div>
        </div>
        {/* Desktop: index + sticky detail panel */}
        <div className="hidden gap-6 lg:flex">
          <div
            role="tablist"
            aria-label={t.practiceEyebrow}
            aria-orientation="vertical"
            className="flex w-[640px] shrink-0 flex-col"
          >
            {items.map((item, index) => {
              const isActive = index === activeIndex;
              return (
                <button
                  key={item.id}
                  id={`${baseId}-tab-${index}`}
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`${baseId}-panel`}
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => setSelected(index)}
                  onMouseEnter={() => setSelected(index)}
                  onFocus={() => setSelected(index)}
                  onKeyDown={(event) => onKeyDown(event, index)}
                  className={`flex items-center gap-4 border-t border-line-navy py-[18px] text-left last:border-b focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring ${
                    isActive ? 'text-brass-light' : 'text-on-navy hover:text-brass-light'
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`w-10 shrink-0 ${isActive ? 'text-[13px] text-brass-light' : 'text-sm text-on-navy-2'}`}
                  >
                    {item.no}
                  </span>
                  <span
                    className={`flex-1 font-serif text-[26px] leading-snug ${isActive ? 'font-bold' : ''}`}
                  >
                    {item.title}
                  </span>
                </button>
              );
            })}
          </div>
          <div className="flex flex-1 self-start lg:sticky lg:top-24">
            <div
              id={`${baseId}-panel`}
              role="tabpanel"
              aria-labelledby={`${baseId}-tab-${activeIndex}`}
              className="flex min-h-[480px] w-full flex-col justify-between gap-10 rounded-[2px] bg-navy-800 p-8 md:p-12"
            >
              <div className="flex flex-col gap-7">
                <p className="text-sm text-on-navy-2">
                  {active.no} · {active.title}
                </p>
                <h3 className="font-display text-[40px] leading-[1.05] tracking-[-0.6px] text-on-navy md:text-[52px]">
                  {active.title}
                </h3>
                {active.scope.length > 0 && (
                  <ul className="flex flex-col gap-[18px]">
                    {active.scope.map((point) => (
                      <li key={point} className="flex gap-[14px]">
                        <span aria-hidden="true" className="pt-[10px]">
                          <span className="block h-1.5 w-1.5 rounded-full bg-on-navy-2" />
                        </span>
                        <span className="flex-1 text-[18px] leading-[1.4] text-on-navy">
                          {point}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              {active.href && (
                <div className="flex items-end justify-between gap-6">
                  <Link
                    href={active.href}
                    className="inline-flex items-center gap-2 border-b border-on-navy pb-[6px] text-[15px] text-on-navy transition-colors hover:border-brass-light hover:text-brass-light focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus-ring"
                  >
                    {t.practiceView}
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Mobile: accordion, one area open at a time */}
        <div className="flex flex-col lg:hidden">
          {items.map((item, index) => {
            const isOpen = index === activeIndex;
            return (
              <div key={item.id} className="flex flex-col border-t border-line-navy last:border-b">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`${baseId}-acc-${index}`}
                  onClick={() => setSelected(index)}
                  className="flex items-center gap-3 py-[18px] text-left"
                >
                  <span
                    aria-hidden="true"
                    className={`w-7 shrink-0 text-xs ${isOpen ? 'text-brass-light' : 'text-on-navy-2'}`}
                  >
                    {item.no}
                  </span>
                  <span
                    className={`flex-1 font-serif text-[22px] leading-[1.2] ${isOpen ? 'text-brass-light' : 'text-on-navy'}`}
                  >
                    {item.title}
                  </span>
                  <span
                    aria-hidden="true"
                    className={`text-lg ${isOpen ? 'text-brass-light' : 'text-on-navy-2'}`}
                  >
                    {isOpen ? '−' : '+'}
                  </span>
                </button>
                {isOpen && (
                  <div
                    id={`${baseId}-acc-${index}`}
                    className="flex flex-col gap-4 pr-2 pb-6 pl-10"
                  >
                    {item.scope.length > 0 && (
                      <ul className="flex flex-col gap-3">
                        {item.scope.map((point) => (
                          <li key={point} className="flex gap-3">
                            <span aria-hidden="true" className="pt-2">
                              <span className="block h-1.5 w-1.5 rounded-full bg-on-navy-2" />
                            </span>
                            <span className="flex-1 text-[15px] leading-[1.45] text-on-navy">
                              {point}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                    {item.href && (
                      <Link
                        href={item.href}
                        className="inline-flex w-fit items-center gap-2 border-b border-on-navy pb-[6px] text-[15px] text-on-navy"
                      >
                        {t.practiceView}
                        <span aria-hidden="true">→</span>
                      </Link>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <p className="text-[13px] leading-relaxed text-brass-light">{t.practiceNote}</p>
      </div>
    </section>
  );
}
