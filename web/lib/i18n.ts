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
  homeLabel: 'Beranda',

  leadership: 'Kepemimpinan',
  services: 'Bidang Praktik',
  industries: 'Industri',
  caseStudies: 'Studi Kasus',
  insights: 'Wawasan',
  careers: 'Karier',
  contact: 'Kontak',
  previous: 'Sebelumnya',
  next: 'Berikutnya',

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
  by: 'Oleh',
  downloadPdf: 'Unduh PDF',
  saveContact: 'Simpan kontak (vCard)',
  languagesSpoken: 'Bahasa',
  office: 'Kantor',
  offices: 'Kantor kami',
  footerSite: 'Situs',
  footerContact: 'Kontak',
  footerOffices: 'Kantor',
  footerMainOffice: 'Kantor utama',
  footerRepOffice: 'Kantor perwakilan',
  footerTagline: 'Strategic Legal Counsel. Commercial Insight. Trusted Partnership.',
  email: 'Email',
  phone: 'Telepon',
  viewMap: 'Lihat di peta',
  location: 'Lokasi',
  employmentType: 'Jenis pekerjaan',
  deadline: 'Batas lamaran',
  apply: 'Cara melamar',
  noOpenings: 'Saat ini belum ada lowongan yang dibuka.',

  about: {
    title: 'Tentang',
    eyebrow: 'Tentang kami',
    heading: 'Firma hukum independen di Jakarta dan Denpasar.',
    whoWeAre: 'Siapa kami',
    statement:
      'Kami mendampingi perusahaan, institusi keuangan, investor, pemilik usaha, dan klien privat di seluruh Indonesia.',
    p1: 'Pengacara kami menangani transaksi korporasi, nasihat komersial, penyelesaian sengketa, litigasi, ketenagakerjaan, investasi, penyiaran dan media, kekayaan intelektual, kepatuhan, dan penagihan utang.',
    p2: 'Setiap persoalan hukum memiliki sisi komersial. Sebelum merekomendasikan langkah, kami melihat risikonya, biayanya, dan seberapa praktis pelaksanaannya.',
    howWeWork: 'Cara kami bekerja',
    principles: [
      {
        title: 'Nasihat yang terikat pada bisnis',
        text: 'Kami melihat arti sebuah langkah hukum bagi operasi, biaya, dan waktu — bukan hanya bagi hukumnya.',
      },
      {
        title: 'Transaksi dan sengketa dalam satu tim',
        text: 'Pengacara yang sama menangani kesepakatan dan litigasi, sehingga nasihat atas suatu transaksi memperhitungkan bagaimana ia dapat dipersoalkan di kemudian hari.',
      },
      {
        title: 'Komunikasi yang lugas',
        text: 'Kami menjelaskan opsi dan risikonya dengan bahasa yang dapat Anda tindak lanjuti.',
      },
      {
        title: 'Kerahasiaan',
        text: 'Apa yang Anda sampaikan tetap rahasia, dan kami bekerja dalam koridor kode etik advokat.',
      },
    ],
    partnersEyebrow:
      'Korporasi dan transaksi, litigasi, atau kontrak dan kepatuhan. Pilih partner yang sesuai dengan persoalan Anda.',
    partnersHeading: 'Tim profesional kami',
    commitmentLabel: 'Komitmen kami',
    commitmentStatement:
      'Kami ingin menjadi pengacara yang selalu dihubungi kembali oleh klien, bukan hanya yang menutup satu berkas.',
    commitmentText:
      'Setiap penugasan ditangani secara profesional dengan mengutamakan hasil yang praktis. Tujuan kami adalah mendukung pertumbuhan klien dalam jangka panjang.',
    ctaHeading: 'Ceritakan persoalan Anda kepada kami.',
    ctaLead: 'Kirimkan deskripsi singkat. Kami akan membalas untuk mengatur konsultasi.',
  },

  contactPage: {
    heading: 'Hubungi kami di Jakarta atau Denpasar.',
    lead: 'Gunakan formulir di bawah atau hubungi kantor terdekat. Semua yang Anda sampaikan kepada kami bersifat rahasia.',
    formHeading: 'Ceritakan persoalan hukum Anda.',
    formLead:
      'Isi formulir atau hubungi kami langsung. Kami akan membalas untuk mengatur konsultasi. Semua yang Anda sampaikan bersifat rahasia.',
    mapNote: 'Peta menyusul setelah alamat dikonfirmasi',
  },

  insightsPage: {
    heading: 'Catatan hukum dan pembaruan regulasi.',
    lead: 'Artikel singkat dari pengacara kami tentang regulasi dan praktik.',
    filter: 'Filter',
    all: 'Semua',
    emptyTitle: 'Belum ada artikel.',
    emptyText:
      'Artikel baru akan tampil di sini setelah firma menerbitkannya. Sementara itu, Anda dapat membaca tentang bidang praktik kami atau menghubungi partner.',
  },

  practice: {
    allAreas: 'Semua bidang praktik',
    of: 'dari',
    ctaHeading: 'Ada persoalan di bidang ini?',
    ctaLead: 'Kirimkan deskripsi singkat. Kami akan membalas untuk mengatur konsultasi.',
    contactCta: 'Hubungi kami',
  },

  partner: {
    about: 'Tentang',
    areasOfWork: 'Bidang yang ditangani',
    credentials: 'Kredensial',
    otherPartners: 'Partner lainnya',
    speakWith: 'Bicara dengan',
    firmPhoneNote: '(kantor)',
  },

  article: {
    relatedAreas: 'Bidang praktik terkait',
    disclaimer:
      'Artikel ini adalah informasi umum dan bukan nasihat hukum. Untuk persoalan Anda, bicarakan dengan pengacara.',
  },

  home: {
    heroEyebrow: 'Konselor Hukum · Jakarta · Denpasar',
    aboutEyebrow: 'Tentang kami',
    aboutHeading: 'Firma hukum untuk persoalan bisnis yang kompleks',
    aboutStatement:
      'Harianja & Putra adalah firma hukum independen dengan kantor di Jakarta dan Denpasar. Klien kami adalah perusahaan, institusi keuangan, investor, pemilik bisnis, dan individu.',
    aboutP1:
      'Pengacara kami menangani transaksi korporasi, kontrak, litigasi, ketenagakerjaan, investasi, penyiaran dan media, kekayaan intelektual, kepatuhan, dan penagihan utang.',
    aboutP2:
      'Sebagian besar persoalan hukum pada akhirnya memengaruhi bisnis. Maka sebelum merekomendasikan langkah, kami menimbang risikonya, biayanya, dan kemudahan pelaksanaannya. Semua yang Anda sampaikan tetap rahasia.',
    factsPractices: 'Bidang praktik',
    factsPartners: 'Partner',
    factsSectors: 'Sektor dilayani',
    factsOffices: 'Kantor',
    factsLanguages: 'Bahasa layanan',
    factsLanguagesValue: 'Indonesia · Inggris',
    factPracticeNote: 'Korporasi, litigasi, ketenagakerjaan, KI, dan lainnya',
    factOfficeNote: 'Jakarta, ditambah kantor perwakilan di Denpasar',
    factSectorNote: 'Penyiaran, otomotif, properti, dan lainnya',
    partnersEyebrow: 'Partner',
    partnersIntro:
      'Korporasi dan transaksi, litigasi, atau kontrak dan kepatuhan. Pilih partner yang sesuai dengan perkara Anda.',
    partnersHeading: 'Para profesional kami',
    viewAll: 'Lihat selengkapnya',
    practiceEyebrow: 'Bidang praktik',
    practiceHeadingFifteen: 'Lima belas bidang praktik.',
    practiceHeadingOther: '{n} bidang praktik.',
    practiceLead: 'Pilih bidang untuk melihat ruang lingkupnya dan siapa yang dihubungi.',
    practiceHint: 'Pilih salah satu bidang di bawah ini.',
    practiceNote:
      'Arahkan atau pilih baris untuk mengganti panel. Panel tetap terlihat saat daftar digulir. Di ponsel tampil sebagai akordeon.',
    practiceView: 'Lihat bidang praktik',
    sectorsEyebrow: 'Sektor',
    sectorsHeading: 'Sektor-sektor di mana kami telah mendampingi klien.',
    insightsEyebrow: 'Wawasan',
    insightsHeading: 'Artikel dan pembaruan regulasi dari tim kami.',
    contactEyebrow: 'Kontak',
    contactHeading: 'Ceritakan persoalan hukum Anda.',
    contactIntro:
      'Isi formulir atau hubungi kami langsung. Kami akan membalas untuk mengatur konsultasi. Semua yang Anda sampaikan kami jaga kerahasiaannya.',
    contactCta: 'Kirim pertanyaan',
  },
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
  homeLabel: 'Home',

  leadership: 'Leadership',
  services: 'Practice Areas',
  industries: 'Industries',
  caseStudies: 'Case Studies',
  insights: 'Insights',
  careers: 'Careers',
  contact: 'Contact',
  previous: 'Previous',
  next: 'Next',

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
  by: 'By',
  downloadPdf: 'Download PDF',
  saveContact: 'Save contact (vCard)',
  languagesSpoken: 'Languages',
  office: 'Office',
  offices: 'Our offices',
  footerSite: 'Site',
  footerContact: 'Contact',
  footerOffices: 'Offices',
  footerMainOffice: 'Main office',
  footerRepOffice: 'Representative office',
  footerTagline: 'Strategic Legal Counsel. Commercial Insight. Trusted Partnership.',
  email: 'Email',
  phone: 'Phone',
  viewMap: 'View on map',
  location: 'Location',
  employmentType: 'Employment type',
  deadline: 'Application deadline',
  apply: 'How to apply',
  noOpenings: 'There are no open positions at the moment.',

  about: {
    title: 'About',
    eyebrow: 'About us',
    heading: 'An independent law firm in Jakarta and Denpasar.',
    whoWeAre: 'Who we are',
    statement:
      'We advise companies, financial institutions, investors, business owners, and private clients across Indonesia.',
    p1: 'Our lawyers work on corporate transactions, commercial advice, dispute resolution, litigation, employment, investment, broadcasting and media, intellectual property, compliance, and debt recovery.',
    p2: 'Every legal problem has a commercial side. Before we recommend a step, we look at its risk, its cost, and how practical it is to carry out.',
    howWeWork: 'How we work',
    principles: [
      {
        title: 'Advice tied to the business',
        text: 'We look at what a legal step means for operations, cost, and timing, not only for the law.',
      },
      {
        title: 'Transactions and disputes together',
        text: 'The same lawyers handle deals and litigation, so advice on a deal accounts for how it could later be challenged.',
      },
      {
        title: 'Plain communication',
        text: 'We explain the options and the risks in terms you can act on.',
      },
      {
        title: 'Confidentiality',
        text: "What you tell us stays confidential, and we work within the advocates' code of ethics.",
      },
    ],
    partnersEyebrow:
      'Corporate and transactions, litigation, or contracts and compliance. Choose the partner who fits your matter.',
    partnersHeading: 'Our professionals',
    commitmentLabel: 'Our commitment',
    commitmentStatement:
      'We want to be the lawyers a client keeps coming back to, not only the ones who close a single file.',
    commitmentText:
      'Each engagement is handled professionally and with the practical outcome in mind. Our aim is to support our clients’ growth over the long term.',
    ctaHeading: 'Talk to us about your matter.',
    ctaLead: 'Send us a short description. We reply to arrange a consultation.',
  },

  contactPage: {
    heading: 'Reach us in Jakarta or Denpasar.',
    lead: 'Use the form below or contact the office nearest you. Everything you share with us stays confidential.',
    formHeading: 'Tell us about your legal matter.',
    formLead:
      'Fill in the form or contact us directly. We will reply to arrange a consultation. Everything you share with us is kept confidential.',
    mapNote: 'Map to follow once the address is confirmed',
  },

  insightsPage: {
    heading: 'Legal notes and regulatory updates.',
    lead: 'Short articles from our lawyers on regulation and practice.',
    filter: 'Filter',
    all: 'All',
    emptyTitle: 'No articles yet.',
    emptyText:
      'New articles will appear here when the firm publishes them. Meanwhile, you can read about our practice areas or contact a partner.',
  },

  practice: {
    allAreas: 'All practice areas',
    of: 'of',
    ctaHeading: 'Have a matter in this area?',
    ctaLead: 'Send us a short description. We reply to arrange a consultation.',
    contactCta: 'Contact us',
  },

  partner: {
    about: 'About',
    areasOfWork: 'Areas of work',
    credentials: 'Credentials',
    otherPartners: 'Other partners',
    speakWith: 'Speak with',
    firmPhoneNote: '(firm)',
  },

  article: {
    relatedAreas: 'Related practice areas',
    disclaimer:
      'This article is general information and is not legal advice. For your own situation, speak with a lawyer.',
  },

  home: {
    heroEyebrow: 'Counselors at Law · Jakarta · Denpasar',
    aboutEyebrow: 'About us',
    aboutHeading: 'A law firm for complex business matters',
    aboutStatement:
      'Harianja & Putra is an independent law firm with offices in Jakarta and Denpasar. Our clients are companies, financial institutions, investors, business owners, and private individuals.',
    aboutP1:
      'Our lawyers work on corporate transactions, contracts, litigation, employment, investment, broadcasting and media, intellectual property, compliance, and debt recovery.',
    aboutP2:
      'Most legal problems end up affecting the business. So before we recommend a course of action, we weigh its risk, its cost, and how easily you can carry it out. Everything you tell us stays confidential.',
    factsPractices: 'Practice areas',
    factsPartners: 'Partners',
    factsSectors: 'Sectors served',
    factsOffices: 'Offices',
    factsLanguages: 'Working languages',
    factsLanguagesValue: 'Indonesian · English',
    factPracticeNote: 'Corporate, litigation, employment, IP, and more',
    factOfficeNote: 'Jakarta, plus a representative office in Denpasar',
    factSectorNote: 'Broadcasting, automotive, property, and more',
    partnersEyebrow: 'Partners',
    partnersIntro:
      'Corporate and transactions, litigation, or contracts and compliance. Choose the partner who fits your matter.',
    partnersHeading: 'Our professionals',
    viewAll: 'View all',
    practiceEyebrow: 'Practice areas',
    practiceHeadingFifteen: 'Fifteen areas of practice.',
    practiceHeadingOther: '{n} areas of practice.',
    practiceLead: 'Select an area to see what we handle and who to contact.',
    practiceHint: 'Select one of the areas below.',
    practiceNote:
      'Hover or select a row to change the panel. The panel stays in view while the list scrolls. On mobile this becomes an accordion.',
    practiceView: 'View practice area',
    sectorsEyebrow: 'Sectors',
    sectorsHeading: 'Sectors where we have advised clients.',
    insightsEyebrow: 'Insights',
    insightsHeading: 'Articles and regulatory updates from our team.',
    contactEyebrow: 'Contact',
    contactHeading: 'Tell us about your legal matter.',
    contactIntro:
      'Fill in the form or contact us directly. We will reply to arrange a consultation. Everything you share with us is kept confidential.',
    contactCta: 'Send an inquiry',
  },
};

const dictionaries: Record<Locale, Dictionary> = { id, en };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
