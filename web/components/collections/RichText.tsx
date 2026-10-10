import { Container } from '@/components/ui/Container';
import { PortableTextRenderer } from '@/components/PortableTextRenderer';
import type { BlockContent } from '@/sanity.types';

interface Props {
  value: BlockContent | null | undefined;
  /** Optional h2 above the text, e.g. "Challenge" on a case study. */
  heading?: string;
}

/**
 * Long-form body text of a detail page. Editorial article body
 * (design/Design.pen -> Insights Article): serif headings and brass links on
 * navy, comfortable measure for long legal text.
 */
export function RichText({ value, heading }: Props) {
  if (!value || value.length === 0) return null;
  return (
    <Container className="prose prose-lg max-w-3xl py-6 prose-invert prose-headings:font-serif prose-headings:font-normal prose-headings:text-on-navy prose-a:text-brass-light prose-a:underline-offset-4 hover:prose-a:text-brass prose-strong:text-on-navy">
      {heading && <h2>{heading}</h2>}
      <PortableTextRenderer value={value} />
    </Container>
  );
}
