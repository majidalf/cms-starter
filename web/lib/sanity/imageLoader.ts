import { sanityImageLoader } from './image';

/** Default export required by Next.js `images.loaderFile` config (see next.config.ts) -
 * applies to every <Image> in the app, so components never need a `loader` prop. */
export default sanityImageLoader;
