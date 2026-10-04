import type { PortableTextBlock as BasePortableTextBlock } from '@portabletext/react';

/** Matches the `blockContent` schema in studio/schemaTypes/objects/blockContent.ts:
 * standard blocks/marks/lists plus an inline `image` array member. */
export type PortableTextBlock = BasePortableTextBlock;
