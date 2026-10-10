import type { CSSProperties, ReactNode } from 'react';

interface Props {
  label: string;
  statement: string;
  paragraphs: string[];
  /** The fact cards. */
  children: ReactNode;
}

/**
 * Home → About (Design.pen). Desktop: a label in the first third, then the large statement,
 * two paragraphs side by side, and the fact cards across the full width. Mobile: one column.
 * The statement fills in word by word as it scrolls into view (Motion Notes → Tentang).
 */
export function HomeAbout({ label, statement, paragraphs, children }: Props) {
  // The statement is fixed text, so a word's position is a stable key.
  const words = statement
    .split(/\s+/)
    .filter(Boolean)
    .map((text, position) => ({ text, position, key: `${position}-${text}` }));

  return (
    <section
      id="about"
      className="relative mx-auto flex w-full max-w-[1440px] scroll-mt-24 flex-col gap-6 px-4 py-[72px] lg:gap-14 lg:px-10 lg:py-[120px]"
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:gap-0">
        <h2 className="text-[13px] leading-[15px] text-on-navy-2 lg:w-[calc((100%+40px)/3)] lg:shrink-0 lg:text-[14px] lg:leading-[17px]">
          {label}
        </h2>
        <div className="flex flex-1 flex-col gap-6 lg:gap-10">
          <p className="scroll-fill font-display text-[32px] leading-[34px] text-on-navy lg:text-[min(3.611vw,52px)] lg:leading-[1.058] lg:tracking-[-0.6px]">
            {/* Read as one sentence; the per-word spans below are for the scroll effect. */}
            <span className="sr-only">{statement}</span>
            {words.map((word) => (
              <span
                key={word.key}
                aria-hidden="true"
                style={{ '--p': word.position / words.length } as CSSProperties}
              >
                {word.text}{' '}
              </span>
            ))}
          </p>
          <div className="flex flex-col gap-4 lg:flex-row lg:gap-10">
            {paragraphs.map((paragraph) => (
              <p
                key={paragraph}
                className="flex-1 text-[16px] leading-[26px] text-on-navy-2 lg:text-[17px] lg:leading-[27px]"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
      {children}
    </section>
  );
}
