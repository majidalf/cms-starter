import { Container } from '@/components/ui/Container';
import { PortableTextRenderer } from '@/components/PortableTextRenderer';
import type { BlockContent } from '@/sanity.types';

interface Props {
  value: BlockContent | null | undefined;
  /** Optional h2 above the text, e.g. "Challenge" on a case study. */
  heading?: string;
}

/** Long-form body text of a detail page. */
export function RichText({ value, heading }: Props) {
  if (!value || value.length === 0) return null;
  return (
    <Container className="prose prose-lg max-w-3xl py-6">
      {heading && <h2 className="font-serif text-brand">{heading}</h2>}
      <PortableTextRenderer value={value} />
    </Container>
  );
}
