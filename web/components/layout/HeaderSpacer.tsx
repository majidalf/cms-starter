/** Space for the fixed header on every page that does not start with a full-bleed hero:
 * 76px on phones (16 + 44 + 16), 128px on desktop (the expanded top bar). */
export function HeaderSpacer() {
  return <div aria-hidden="true" className="h-[76px] lg:h-[128px]" />;
}
