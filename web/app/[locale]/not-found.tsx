import { NotFoundContent } from '@/components/NotFoundContent';

// Shown for notFound() thrown by any page under [locale], inside the site layout. Next 16
// sends this through the RSC payload and renders it in the browser (the server HTML is a
// bare error shell) - the 404 status itself is correct. not-found.tsx gets no params, so
// the message is shown in every language.
export default function NotFound() {
  return <NotFoundContent />;
}
