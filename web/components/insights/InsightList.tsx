'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import { TagPill } from '@/components/ui/Pill';
import { underlineLinkClass } from '@/components/ui/UnderlineLink';

export interface InsightRow {
  id: string;
  href: string;
  title: string;
  /** "12 Sep 2026" */
  date?: string;
  category: string;
  categoryLabel: string;
  author?: string;
}

interface Props {
  rows: InsightRow[];
  /** Categories to offer, in display order. */
  categories: { value: string; label: string }[];
  labels: {
    filter: string;
    all: string;
    loadMore: string;
    emptyFiltered: string;
  };
}

const PAGE_SIZE = 5;
const ALL = 'all';

const CHIP =
  'shrink-0 cursor-pointer rounded-full px-[18px] py-3 text-[14px] leading-[17px] outline-1 -outline-offset-1 transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-focus-ring lg:px-4 lg:py-2';
export const chipClass = (isActive: boolean) =>
  `${CHIP} ${
    isActive
      ? 'bg-paper font-medium text-ink outline-paper'
      : 'text-on-navy outline-field-border hover:bg-chip lg:outline-navy-700'
  }`;

/**
 * Insights list (Design.pen → Insights · Desktop 1440 / Mobile 375): category chips, then
 * ruled article rows - date, category, title, author - and "Load more articles".
 */
export function InsightList({ rows, categories, labels }: Props) {
  const [category, setCategory] = useState(ALL);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const filtered = category === ALL ? rows : rows.filter((row) => row.category === category);
  const visible = filtered.slice(0, visibleCount);
  const select = (value: string) => {
    setCategory(value);
    setVisibleCount(PAGE_SIZE);
  };

  return (
    <>
      <div className="relative mx-auto flex w-full max-w-[1440px] flex-col pb-8 pl-4 lg:flex-row lg:px-5 lg:pb-10">
        <p
          aria-hidden="true"
          className="hidden w-1/3 shrink-0 text-[14px] leading-[33px] text-on-navy-2 lg:block"
        >
          {labels.filter}
        </p>
        <fieldset className="min-w-0 flex gap-2 overflow-x-auto py-1 pr-4 [scrollbar-width:none] lg:flex-wrap lg:overflow-visible lg:py-0 lg:pr-0">
          <legend className="sr-only">{labels.filter}</legend>
          {[{ value: ALL, label: labels.all }, ...categories].map((option) => (
            <button
              key={option.value}
              type="button"
              aria-pressed={category === option.value}
              onClick={() => select(option.value)}
              className={chipClass(category === option.value)}
            >
              {option.label}
            </button>
          ))}
        </fieldset>
      </div>
      <div className="relative mx-auto w-full max-w-[1440px] px-4 pb-6 lg:px-5 lg:pb-10">
        {visible.length === 0 ? (
          <p className="border-y border-line-navy py-7 text-[18px] leading-[27px] text-on-navy-2">
            {labels.emptyFiltered}
          </p>
        ) : (
          <ul className="flex flex-col border-b border-line-navy">
            {visible.map((row) => (
              <li key={row.id} className="border-t border-line-navy">
                <Link
                  href={row.href}
                  className="group flex flex-col gap-3 py-[22px] -outline-offset-2 lg:flex-row lg:items-center lg:gap-6 lg:py-7"
                >
                  <span className="flex items-center gap-3 lg:contents">
                    <span className="text-[14px] leading-[17px] text-on-navy-2 lg:w-[120px] lg:shrink-0">
                      {row.date}
                    </span>
                    <span className="flex lg:w-[200px] lg:shrink-0">
                      <TagPill className="max-lg:text-[14px] max-lg:leading-[17px]">
                        {row.categoryLabel}
                      </TagPill>
                    </span>
                  </span>
                  <span className="flex-1 font-serif text-[22px] leading-[26px] text-on-navy transition-colors duration-200 group-hover:text-brass-light lg:text-[28px] lg:leading-[34px]">
                    {row.title}
                  </span>
                  <span className="text-[14px] leading-[17px] text-on-navy-2 lg:w-[200px] lg:shrink-0">
                    {row.author}
                  </span>
                  <Icon
                    name="arrowUpRight"
                    className="hidden h-5 w-5 shrink-0 text-on-navy transition-colors duration-200 group-hover:text-brass-light lg:block"
                  />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
      {filtered.length > visibleCount && (
        <div className="relative mx-auto w-full max-w-[1440px] px-4 pb-6 lg:pb-10 lg:pl-[calc((100%-40px)/3+20px)] lg:pr-5 lg:pt-4">
          <button
            type="button"
            onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
            className={underlineLinkClass('touch', 'cursor-pointer')}
          >
            {labels.loadMore}
            <Icon name="arrowUpRight" className="h-4 w-4 shrink-0" />
          </button>
        </div>
      )}
    </>
  );
}
