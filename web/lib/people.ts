/** "Zico Fernando, S.H., M.H." - the name with academic and professional titles after it. */
export function nameWithTitles(
  name: string | null | undefined,
  titles: string | null | undefined,
): string {
  return [name, titles].filter(Boolean).join(', ');
}

/** "Zico" - how the profile's contact button addresses a partner. */
export function firstName(name: string | null | undefined): string {
  return (name ?? '').trim().split(/\s+/)[0] ?? '';
}
