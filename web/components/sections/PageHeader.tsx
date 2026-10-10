import type { ReactNode } from 'react';
import { HeaderSpacer } from '@/components/layout/HeaderSpacer';
import { Breadcrumb, type Crumb } from '@/components/ui/Breadcrumb';

/** Display sizes of the page title: desktop px (scaled down below 1440) / mobile px. */
const TITLE = {
  /** 104 / 52: Contact, Legal. */
  xl: 'text-[52px] leading-[55px] lg:text-[min(7.222vw,104px)] lg:leading-[1.048]',
  /** 96 / 52: Practice Area. */
  lg: 'text-[52px] leading-[55px] lg:text-[min(6.667vw,96px)] lg:leading-[1.052]',
  /** 96 / 44: About, Insights, Experience and the index pages. */
  md: 'text-[44px] leading-[46px] lg:text-[min(6.667vw,96px)] lg:leading-[1.052]',
  /** 80 / 36: Article. */
  sm: 'text-[36px] leading-[39px] tracking-[-0.4px] lg:text-[min(5.556vw,80px)] lg:leading-[1.05]',
} as const;

interface Props {
  breadcrumb: Crumb[];
  breadcrumbLabel: string;
  /** Small text in the first third: a section label, "01 of 15", or article meta. */
  label?: ReactNode;
  title: string;
  titleSize?: keyof typeof TITLE;
  lead?: string;
  /** Extra content under the title (e.g. "Last updated"). */
  children?: ReactNode;
  /** Bottom padding classes; the frames differ per page. */
  spacing?: string;
}

/**
 * Inner page header (Design.pen → Practice Area / Contact / About / Insights / Legal →
 * Header): breadcrumb, then a label in the first third and the page <h1> with an optional
 * lead in the other two. On phones everything stacks.
 */
export function PageHeader({
  breadcrumb,
  breadcrumbLabel,
  label,
  title,
  titleSize = 'md',
  lead,
  children,
  spacing = 'pb-10 lg:pb-[88px]',
}: Props) {
  return (
    <>
      <HeaderSpacer />
      <header
        className={`relative mx-auto flex w-full max-w-[1440px] flex-col gap-5 px-4 pt-4 lg:gap-12 lg:px-5 lg:pt-14 ${spacing}`}
      >
        <Breadcrumb items={breadcrumb} label={breadcrumbLabel} />
        <div className="flex flex-col gap-5 lg:flex-row lg:gap-0">
          <div className="text-[14px] leading-[17px] text-on-navy-2 empty:hidden lg:block lg:w-1/3 lg:shrink-0 lg:empty:block">
            {label}
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-5 lg:gap-8">
            <h1 className={`font-display tracking-[-0.6px] text-on-navy ${TITLE[titleSize]}`}>
              {title}
            </h1>
            {lead && (
              <p className="text-[18px] leading-[26px] text-on-navy-2 lg:max-w-[720px] lg:text-[22px] lg:leading-[32px]">
                {lead}
              </p>
            )}
            {children}
          </div>
        </div>
      </header>
    </>
  );
}
