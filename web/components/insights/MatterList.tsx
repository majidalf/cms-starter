'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import { TagPill } from '@/components/ui/Pill';

export interface MatterRow {
  id: string;
  href: string;
  title: string;
  year?: number;
  practiceArea?: string;
  sector?: string;
}

interface Props {
  rows: MatterRow[];
  labels: {
    filter: string;
    practiceArea: string;
    sector: string;
    year: string;
    all: string;
    emptyFiltered: string;
  };
}

type FilterKey = 'practiceArea' | 'sector' | 'year';

const EMPTY: Record<FilterKey, string> = { practiceArea: '', sector: '', year: '' };

function optionsOf(rows: MatterRow[], key: FilterKey): string[] {
  const values = rows.flatMap((row) => (row[key] === undefined ? [] : [String(row[key])]));
  const unique = [...new Set(values)];
  return key === 'year'
    ? unique.toSorted((a, b) => Number(b) - Number(a))
    : unique.toSorted((a, b) => a.localeCompare(b));
}

/**
 * Matter list (Design.pen → Experience · Desktop 1440 / Mobile 375): three filter chips -
 * practice area, sector, year - then ruled rows with the year, the practice area and sector,
 * and the matter's title.
 */
export function MatterList({ rows, labels }: Props) {
  const [filters, setFilters] = useState(EMPTY);
  const filterKeys: FilterKey[] = ['practiceArea', 'sector', 'year'];

  const visible = rows.filter((row) =>
    filterKeys.every((key) => !filters[key] || String(row[key] ?? '') === filters[key]),
  );

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
          {filterKeys.map((key) => (
            <span key={key} className="relative shrink-0">
              <select
                aria-label={labels[key]}
                value={filters[key]}
                onChange={(event) => setFilters({ ...filters, [key]: event.target.value })}
                className={`cursor-pointer appearance-none rounded-full py-3 pl-[18px] pr-10 text-[14px] leading-[17px] outline-1 -outline-offset-1 transition-colors duration-200 hover:bg-chip focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-focus-ring lg:py-2 lg:pl-4 ${
                  filters[key]
                    ? 'bg-paper font-medium text-ink outline-paper hover:bg-paper'
                    : 'bg-transparent text-on-navy outline-field-border lg:outline-navy-700'
                }`}
              >
                <option value="" className="bg-navy-900 text-on-navy">
                  {labels[key]}
                </option>
                {optionsOf(rows, key).map((option) => (
                  <option key={option} value={option} className="bg-navy-900 text-on-navy">
                    {option}
                  </option>
                ))}
              </select>
              <Icon
                name="caretDown"
                className={`pointer-events-none absolute right-[14px] top-1/2 h-4 w-4 -translate-y-1/2 ${
                  filters[key] ? 'text-ink' : 'text-on-navy'
                }`}
              />
            </span>
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
                  <span className="flex flex-wrap items-center gap-3 lg:contents">
                    <span className="text-[14px] leading-[17px] text-on-navy-2 lg:w-20 lg:shrink-0">
                      {row.year}
                    </span>
                    <span className="flex flex-wrap items-center gap-3 lg:w-[387px] lg:shrink-0 lg:flex-col lg:items-start lg:gap-2">
                      {row.practiceArea && (
                        <TagPill className="max-lg:text-[14px] max-lg:leading-[17px]">
                          {row.practiceArea}
                        </TagPill>
                      )}
                      {row.sector && (
                        <span className="text-[14px] leading-[17px] text-on-navy-2 lg:text-[13px] lg:leading-[15px]">
                          {row.sector}
                        </span>
                      )}
                    </span>
                  </span>
                  <span className="flex-1 font-serif text-[22px] leading-[26px] text-on-navy transition-colors duration-200 group-hover:text-brass-light lg:text-[28px] lg:leading-[34px]">
                    {row.title}
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
    </>
  );
}
