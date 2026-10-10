const COLUMNS = 5;

/**
 * Grid Lines (Design.pen → 01 Components): five hairline columns behind the whole page, 20px
 * in from each side. The frame has six; the owner asked for five. Sections with their own
 * fill cover them. Desktop only.
 */
export function GridLines() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 mx-auto hidden w-full max-w-[1440px] px-5 lg:block"
    >
      <div className="flex h-full border-r border-gridline">
        {Array.from({ length: COLUMNS }, (_, index) => (
          <div key={index} className="h-full flex-1 border-l border-gridline" />
        ))}
      </div>
    </div>
  );
}
