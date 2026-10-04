import { serializeJsonLd, type JsonLdObject } from '@/lib/jsonLd';

interface Props {
  data: JsonLdObject | JsonLdObject[];
}

/** Structured data script. Not executed by the browser, so CSP doesn't apply to it. */
export function JsonLd({ data }: Props) {
  return (
    <script
      type="application/ld+json"
      // Safe: serializeJsonLd escapes `<`, so the content can't break out of the tag.
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  );
}
