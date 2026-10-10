import { CtaButton } from '@/components/ui/CtaButton';

interface Props {
  heading: string;
  lead: string;
  cta: { label: string; href: string };
  /** "+62 … · info@…": shown under the button on desktop. */
  direct?: string;
}

/**
 * CTA Panel (Design.pen → Practice Area / Partner Profile / About → CTA Wrap): a navy-800
 * panel with a large question on the left and the consultation button on the right.
 */
export function CtaPanel({ heading, lead, cta, direct }: Props) {
  return (
    <section className="relative mx-auto w-full max-w-[1440px] px-3 pb-3 lg:px-5 lg:pb-5">
      <div className="flex flex-col gap-5 rounded-panel bg-navy-800 p-6 lg:flex-row lg:items-end lg:justify-between lg:gap-10 lg:p-12">
        <div className="flex flex-1 flex-col gap-5">
          <h2 className="font-display text-[40px] leading-[42px] text-on-navy lg:text-[min(4.444vw,64px)] lg:leading-[1.047] lg:tracking-[-0.6px]">
            {heading}
          </h2>
          <p className="text-[16px] leading-[24px] text-on-navy-2 lg:text-[18px] lg:leading-[22px]">
            {lead}
          </p>
        </div>
        <div className="flex flex-col gap-[14px] lg:items-end">
          <CtaButton href={cta.href} className="justify-center lg:justify-start">
            {cta.label}
          </CtaButton>
          {direct && (
            <p className="hidden text-[14px] leading-[17px] text-on-navy-2 lg:block">{direct}</p>
          )}
        </div>
      </div>
    </section>
  );
}
