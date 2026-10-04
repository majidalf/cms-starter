// Keep `locales` in sync with studio/lib/locales.ts - web/ and studio/ are separate npm
// projects, so the list is duplicated on purpose instead of shared through a package.
export const locales = ['id', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'id';

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/** Open Graph wants language_TERRITORY. */
export const ogLocale: Record<Locale, string> = { id: 'id_ID', en: 'en_US' };

/** `/id`, `/id/about`, ... - `path` is the part after the language prefix. */
export function localePath(locale: Locale, path = ''): string {
  return `/${locale}${path}`;
}

/** The same content's path in every language, e.g. for hreflang. `build` returns undefined
 * for a language the content has no URL in. */
export function pathsForAllLocales(
  build: (locale: Locale) => string | undefined,
): Partial<Record<Locale, string>> {
  return Object.fromEntries(locales.map((locale) => [locale, build(locale)]));
}

/** Locale for Intl date/number formatting. */
const intlLocale: Record<Locale, string> = { id: 'id-ID', en: 'en-GB' };

/** Formats a Sanity `date` value ("2026-03-12"). Read as UTC so the day never shifts with
 * the server's time zone. */
export function formatDate(date: string | null | undefined, locale: Locale): string | undefined {
  if (!date) return undefined;
  const parsed = new Date(`${date.slice(0, 10)}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime())) return undefined;
  return new Intl.DateTimeFormat(intlLocale[locale], { dateStyle: 'long', timeZone: 'UTC' }).format(
    parsed,
  );
}

/** "en" -> "Inggris" / "English", in the visitor's language. */
export function languageName(code: string, locale: Locale): string {
  return new Intl.DisplayNames([intlLocale[locale]], { type: 'language' }).of(code) ?? code;
}

/*
 * Fixed UI text. Anything an editor should be able to change belongs in Sanity instead.
 * Collection titles (services, insights, ...) are here too: relabel them per client together
 * with the Studio labels and lib/routes.ts.
 */
const id = {
  skipToContent: 'Langsung ke konten',
  mainNav: 'Navigasi utama',
  footerNav: 'Navigasi footer',
  languageSwitcher: 'Pilih bahasa',
  switchTo: 'Baca dalam Bahasa Inggris',
  allRightsReserved: 'Hak cipta dilindungi.',
  notFoundTitle: 'Halaman tidak ditemukan',
  notFoundBody: 'Halaman yang Anda cari tidak ada atau sudah dipindahkan.',
  backHome: 'Kembali ke beranda',
  emptyList: 'Belum ada konten untuk ditampilkan.',
  home: 'Beranda',

  leadership: 'Kepemimpinan',
  services: 'Layanan',
  industries: 'Industri',
  caseStudies: 'Studi Kasus',
  insights: 'Wawasan',
  careers: 'Karier',
  contact: 'Kontak',

  personGroups: {
    board: 'Direksi dan Komisaris',
    leadership: 'Pimpinan',
    partner: 'Partner',
    team: 'Tim',
  } as Record<string, string>,
  credentialKinds: {
    education: 'Pendidikan',
    certification: 'Sertifikasi',
    license: 'Lisensi dan izin praktik',
  } as Record<string, string>,
  insightCategories: {
    article: 'Artikel',
    news: 'Berita',
    pressRelease: 'Siaran Pers',
    publication: 'Publikasi',
    update: 'Pembaruan',
  } as Record<string, string>,
  employmentTypes: {
    fullTime: 'Penuh waktu',
    partTime: 'Paruh waktu',
    contract: 'Kontrak',
    internship: 'Magang',
  } as Record<string, string>,

  keyContacts: 'Kontak utama',
  relatedServices: 'Layanan terkait',
  relatedIndustries: 'Industri terkait',
  relatedCaseStudies: 'Studi kasus terkait',
  latestInsights: 'Wawasan terbaru',
  client: 'Klien',
  year: 'Tahun',
  challenge: 'Tantangan',
  approach: 'Pendekatan',
  outcome: 'Hasil',
  authors: 'Penulis',
  downloadPdf: 'Unduh PDF',
  saveContact: 'Simpan kontak (vCard)',
  languagesSpoken: 'Bahasa',
  office: 'Kantor',
  offices: 'Kantor kami',
  email: 'Email',
  phone: 'Telepon',
  viewMap: 'Lihat di peta',
  location: 'Lokasi',
  employmentType: 'Jenis pekerjaan',
  deadline: 'Batas lamaran',
  apply: 'Cara melamar',
  noOpenings: 'Saat ini belum ada lowongan yang dibuka.',
};

export type Dictionary = typeof id;

const en: Dictionary = {
  skipToContent: 'Skip to content',
  mainNav: 'Main navigation',
  footerNav: 'Footer navigation',
  languageSwitcher: 'Choose language',
  switchTo: 'Read in Indonesian',
  allRightsReserved: 'All rights reserved.',
  notFoundTitle: 'Page not found',
  notFoundBody: 'The page you are looking for does not exist or has moved.',
  backHome: 'Back to home',
  emptyList: 'Nothing to show yet.',
  home: 'Home',

  leadership: 'Leadership',
  services: 'Services',
  industries: 'Industries',
  caseStudies: 'Case Studies',
  insights: 'Insights',
  careers: 'Careers',
  contact: 'Contact',

  personGroups: {
    board: 'Board of Directors and Commissioners',
    leadership: 'Leadership',
    partner: 'Partners',
    team: 'Team',
  },
  credentialKinds: {
    education: 'Education',
    certification: 'Certifications',
    license: 'Licenses and admissions',
  },
  insightCategories: {
    article: 'Article',
    news: 'News',
    pressRelease: 'Press Release',
    publication: 'Publication',
    update: 'Update',
  },
  employmentTypes: {
    fullTime: 'Full-time',
    partTime: 'Part-time',
    contract: 'Contract',
    internship: 'Internship',
  },

  keyContacts: 'Key contacts',
  relatedServices: 'Related services',
  relatedIndustries: 'Related industries',
  relatedCaseStudies: 'Related case studies',
  latestInsights: 'Latest insights',
  client: 'Client',
  year: 'Year',
  challenge: 'Challenge',
  approach: 'Approach',
  outcome: 'Outcome',
  authors: 'Authors',
  downloadPdf: 'Download PDF',
  saveContact: 'Save contact (vCard)',
  languagesSpoken: 'Languages',
  office: 'Office',
  offices: 'Our offices',
  email: 'Email',
  phone: 'Phone',
  viewMap: 'View on map',
  location: 'Location',
  employmentType: 'Employment type',
  deadline: 'Application deadline',
  apply: 'How to apply',
  noOpenings: 'There are no open positions at the moment.',
};

const dictionaries: Record<Locale, Dictionary> = { id, en };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
