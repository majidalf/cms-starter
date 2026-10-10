'use client';

import Link from 'next/link';
import { useId, useRef, useState, type KeyboardEvent } from 'react';
import { CitationPill } from '@/components/ui/Pill';
import { Icon } from '@/components/ui/Icon';
import { underlineLinkClass } from '@/components/ui/UnderlineLink';

export interface PracticePanel {
  id: string;
  /** "01" */
  number: string;
  title: string;
  href?: string;
  scope: string[];
  citation?: string;
}

interface Props {
  areas: PracticePanel[];
  labels: {
    list: string;
    view: string;
  };
}

function ScopeList({ items, size }: { items: string[]; size: 'panel' | 'accordion' }) {
  if (items.length === 0) return null;
  const isPanel = size === 'panel';
  return (
    <ul className={`flex flex-col ${isPanel ? 'gap-[18px]' : 'gap-4'}`}>
      {items.map((item) => (
        <li key={item} className={`flex ${isPanel ? 'gap-[14px]' : 'gap-3'}`}>
          <span aria-hidden="true" className={isPanel ? 'pt-[10px]' : 'pt-2'}>
            <span className="block h-[6px] w-[6px] rounded-full bg-on-navy-2" />
          </span>
          <span
            className={`flex-1 text-on-navy ${
              isPanel ? 'text-[18px] leading-[25px]' : 'text-[15px] leading-[22px]'
            }`}
          >
            {item}
          </span>
        </li>
      ))}
    </ul>
  );
}

/**
 * Practice index + detail panel (Design.pen → Home → Practice Areas → Index + Detail;
 * States → Practice index row and build notes).
 *
 * Desktop is a vertical tab list: hover or select a row and the panel on the right shows
 * that area; arrow keys move between rows. The panel is as tall as the list, and its text
 * stays in view while the list scrolls. The panel names no contact person: who to contact
 * is on each area's own page. Mobile is an accordion with one area open at a time.
 */
export function PracticeIndex({ areas, labels }: Props) {
  const baseId = useId();
  const [activeId, setActiveId] = useState(areas[0]?.id);
  const [openId, setOpenId] = useState<string | undefined>(areas[0]?.id);
  const tabRefs = useRef(new Map<string, HTMLButtonElement>());

  const active = areas.find((area) => area.id === activeId) ?? areas[0];
  if (!active) return null;

  const tabId = (id: string) => `${baseId}-tab-${id}`;
  const panelId = `${baseId}-panel`;

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const moves: Record<string, number> = {
      ArrowDown: index + 1,
      ArrowUp: index - 1,
      Home: 0,
      End: areas.length - 1,
    };
    const target = moves[event.key];
    if (target === undefined) return;
    event.preventDefault();
    const next = areas[(target + areas.length) % areas.length];
    if (!next) return;
    setActiveId(next.id);
    tabRefs.current.get(next.id)?.focus();
  };

  return (
    <>
      {/* Desktop: tab list + panel */}
      <div className="hidden gap-6 lg:flex">
        <div
          role="tablist"
          aria-label={labels.list}
          aria-orientation="vertical"
          className="flex w-[47.06%] shrink-0 flex-col border-b border-line-navy"
        >
          {areas.map((area, index) => {
            const isSelected = area.id === active.id;
            return (
              <button
                key={area.id}
                ref={(node) => {
                  if (node) tabRefs.current.set(area.id, node);
                  else tabRefs.current.delete(area.id);
                }}
                type="button"
                role="tab"
                id={tabId(area.id)}
                aria-selected={isSelected}
                aria-controls={panelId}
                tabIndex={isSelected ? 0 : -1}
                onClick={() => setActiveId(area.id)}
                onMouseEnter={() => setActiveId(area.id)}
                onFocus={() => setActiveId(area.id)}
                onKeyDown={(event) => handleKeyDown(event, index)}
                className="group flex min-h-[68px] items-center gap-4 border-t border-line-navy py-[18px] text-left -outline-offset-2 transition-colors duration-150 hover:bg-chip"
              >
                <span
                  className={`w-10 shrink-0 ${
                    isSelected
                      ? 'text-[13px] leading-[15px] text-brass-light'
                      : 'text-[14px] leading-[17px] text-on-navy-2'
                  }`}
                >
                  {area.number}
                </span>
                <span
                  className={`flex-1 font-serif text-[26px] leading-[31px] ${
                    isSelected ? 'font-bold text-brass-light' : 'text-on-navy'
                  }`}
                >
                  {area.title}
                </span>
                <Icon
                  name="arrowRightLight"
                  className="mr-3 h-[18px] w-[18px] shrink-0 text-on-navy opacity-0 transition-opacity duration-150 group-hover:opacity-100"
                />
              </button>
            );
          })}
        </div>
        <div
          role="tabpanel"
          id={panelId}
          aria-labelledby={tabId(active.id)}
          tabIndex={0}
          className="flex flex-1 flex-col justify-between gap-12 rounded-control bg-navy-800 p-12 -outline-offset-2"
        >
          {/* The text sticks inside its own box, so it stops above the link below. */}
          <div className="flex-1">
            <div key={active.id} className="panel-fade sticky top-36 flex flex-col gap-7">
              <p className="text-[14px] leading-[17px] text-on-navy-2">
                {active.number} · {active.title}
              </p>
              <h3 className="font-display text-[min(3.611vw,52px)] leading-[1.058] tracking-[-0.6px] text-on-navy">
                {active.title}
              </h3>
              <ScopeList items={active.scope} size="panel" />
              {active.citation && <CitationPill size="md">{active.citation}</CitationPill>}
            </div>
          </div>
          {active.href && (
            <div className="flex justify-end">
              <Link href={active.href} className={underlineLinkClass('lg')}>
                {labels.view}
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile: accordion */}
      <ul className="flex flex-col border-b border-line-navy lg:hidden">
        {areas.map((area) => {
          const isOpen = area.id === openId;
          const contentId = `${baseId}-content-${area.id}`;
          return (
            <li key={area.id} className="border-t border-line-navy">
              <h3>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={contentId}
                  onClick={() => setOpenId(isOpen ? undefined : area.id)}
                  className="flex w-full items-center gap-3 py-[18px] text-left -outline-offset-2"
                >
                  <span
                    className={`w-7 shrink-0 ${
                      isOpen
                        ? 'text-[12px] leading-[14px] text-brass-light'
                        : 'text-[14px] leading-[17px] text-on-navy-2'
                    }`}
                  >
                    {area.number}
                  </span>
                  <span
                    className={`flex-1 font-serif ${
                      isOpen
                        ? 'text-[22px] leading-[26px] text-brass-light'
                        : 'text-[20px] leading-[24px] text-on-navy'
                    }`}
                  >
                    {area.title}
                  </span>
                  <Icon
                    name={isOpen ? 'minus' : 'plus'}
                    className={`h-[18px] w-[18px] shrink-0 ${
                      isOpen ? 'text-brass-light' : 'text-on-navy-2'
                    }`}
                  />
                </button>
              </h3>
              <div
                id={contentId}
                hidden={!isOpen}
                className="flex-col gap-4 pb-6 pl-10 [&:not([hidden])]:flex"
              >
                <ScopeList items={area.scope} size="accordion" />
                {area.citation && <CitationPill size="md">{area.citation}</CitationPill>}
                {area.href && (
                  <Link href={area.href} className={underlineLinkClass('touch')}>
                    {labels.view}
                  </Link>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
}
