// Skeleton Home (phase T1). Replaced in T2a by the `page` document with slug "home".
export default function HomePage() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center gap-4 px-6 py-24">
      <p className="text-sm uppercase tracking-widest text-muted">cms-starter</p>
      <h1 className="font-serif text-4xl text-brand">{'{{SITE_NAME}}'}</h1>
      <p className="text-muted">Next.js + Sanity + Cloudflare Workers skeleton.</p>
    </main>
  );
}
