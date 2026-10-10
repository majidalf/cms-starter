/*
 * Harianja & Putra content, taken from Design.pen (English) with Indonesian written next to
 * it. Only practice area 01 has scope and legal basis in the design; the other fourteen are
 * drafts pending partner approval.
 */

export const site = {
  organizationName: 'Harianja & Putra',
  legalName: 'Harianja & Putra, Counselors at Law',
  tagline: {en: 'Advocates & Legal Consultants', id: 'Advokat & Konsultan Hukum'},
  footerText: {
    en: 'Strategic Legal Counsel. Commercial Insight. Trusted Partnership.',
    id: 'Strategic Legal Counsel. Commercial Insight. Trusted Partnership.',
  },
  disclaimer: {
    en: 'The information on this site is general and is not legal advice. Using this site or contacting us does not create a lawyer-client relationship.',
    id: 'Informasi di situs ini bersifat umum dan bukan nasihat hukum. Menggunakan situs ini atau menghubungi kami tidak menimbulkan hubungan advokat dan klien.',
  },
  email: 'info@harianja-putra.com',
  phone: '+62 888-9904-592',
  linkedin: 'https://www.linkedin.com/',
  metaDescription: {
    en: 'Harianja & Putra is an independent law firm in Jakarta and Denpasar handling transactions, contracts, disputes, and compliance.',
    id: 'Harianja & Putra adalah firma hukum independen di Jakarta dan Denpasar yang menangani transaksi, kontrak, sengketa, dan kepatuhan.',
  },
}

export const hero = {
  heading: {
    en: 'Corporate and dispute lawyers for business in Indonesia.',
    id: 'Advokat korporasi dan sengketa untuk bisnis di Indonesia.',
  },
  subheading: {
    en: 'We handle transactions, contracts, disputes, and compliance for companies, investors, business owners, and private clients. Every piece of advice we give is weighed against its effect on your business.',
    id: 'Kami menangani transaksi, kontrak, sengketa, dan kepatuhan untuk perusahaan, investor, pemilik usaha, dan klien perorangan. Setiap nasihat kami timbang terhadap dampaknya bagi bisnis Anda.',
  },
  imageAlt: {
    en: 'A lawyer signing a document at a wooden desk',
    id: 'Seorang advokat menandatangani dokumen di meja kayu',
  },
  primaryCta: {en: 'Book a consultation', id: 'Atur konsultasi'},
  secondaryCta: {en: 'See all 15 practice areas', id: 'Lihat 15 bidang praktik'},
}

export const navLabels = {
  about: {en: 'About', id: 'Tentang'},
  partners: {en: 'Partners', id: 'Partner'},
  practiceAreas: {en: 'Practice Areas', id: 'Bidang Praktik'},
  sectors: {en: 'Sectors', id: 'Sektor'},
  insights: {en: 'Insights', id: 'Wawasan'},
  contact: {en: 'Contact', id: 'Kontak'},
  disclaimer: {en: 'Disclaimer', id: 'Penafian'},
  privacy: {en: 'Privacy Policy', id: 'Kebijakan Privasi'},
}

export const offices = [
  {
    id: 'office-jakarta',
    name: {en: 'Jakarta', id: 'Jakarta'},
    kind: {en: 'Main office', id: 'Kantor utama'},
    city: 'Jakarta',
  },
  {
    id: 'office-denpasar',
    name: {en: 'Denpasar', id: 'Denpasar'},
    kind: {en: 'Representative office', id: 'Kantor perwakilan'},
    city: 'Denpasar',
  },
]

export const sectors = [
  [
    'broadcasting-pay-tv',
    'Broadcasting & Pay TV',
    'Penyiaran & TV Berbayar',
    'penyiaran-tv-berbayar',
  ],
  ['automotive-mobility', 'Automotive & Mobility', 'Otomotif & Mobilitas', 'otomotif-mobilitas'],
  ['manufacturing', 'Manufacturing', 'Manufaktur', 'manufaktur'],
  [
    'property-real-estate',
    'Property & Real Estate',
    'Properti & Real Estat',
    'properti-real-estat',
  ],
  [
    'technology-digital-business',
    'Technology & Digital Business',
    'Teknologi & Bisnis Digital',
    'teknologi-bisnis-digital',
  ],
  ['financial-services', 'Financial Services', 'Jasa Keuangan', 'jasa-keuangan'],
  [
    'trading-distribution',
    'Trading & Distribution',
    'Perdagangan & Distribusi',
    'perdagangan-distribusi',
  ],
  ['healthcare', 'Healthcare', 'Kesehatan', 'kesehatan'],
  ['retail-consumer', 'Retail & Consumer', 'Ritel & Konsumen', 'ritel-konsumen'],
  ['family-owned-businesses', 'Family-Owned Businesses', 'Usaha Keluarga', 'usaha-keluarga'],
  [
    'high-net-worth-individuals',
    'High-Net-Worth Individuals',
    'Individu dengan Kekayaan Tinggi',
    'individu-dengan-kekayaan-tinggi',
  ],
].map(([slug, en, id, slugId]) => ({slug, slugId, title: {en, id}}))

export const partners = [
  {
    id: 'person-zico-fernando',
    slug: 'zico-fernando',
    name: 'Zico Fernando',
    titles: 'S.H., M.H., C.CD., C.CNP',
    position: {en: 'Managing Partner', id: 'Managing Partner'},
    email: 'zico@harianja-putra.com',
    photo: 'partner-zico-temp.jpg',
    summary: {
      en: 'Handles corporate and commercial law, mergers and acquisitions, investment, corporate governance and company secretarial work, commercial litigation, broadcasting and media rights, and intellectual property.',
      id: 'Menangani hukum korporasi dan komersial, merger dan akuisisi, investasi, tata kelola dan kesekretariatan perusahaan, litigasi komersial, penyiaran dan hak media, serta kekayaan intelektual.',
    },
    statement: {
      en: 'Handles corporate and commercial law, mergers and acquisitions, investment, corporate governance, and broadcasting and media rights.',
      id: 'Menangani hukum korporasi dan komersial, merger dan akuisisi, investasi, tata kelola perusahaan, serta penyiaran dan hak media.',
    },
    focus: [
      ['Corporate', 'Korporasi'],
      ['M&A', 'M&A'],
      ['Broadcasting', 'Penyiaran'],
      ['IP', 'KI'],
    ],
    services: [
      'corporate-commercial-law',
      'corporate-governance',
      'mergers-acquisitions',
      'investment-business-structuring',
      'corporate-secretary-services',
      'civil-criminal-litigation',
      'broadcasting-media-rights',
      'intellectual-property',
      'commercial-contracts',
      'regulatory-compliance',
    ],
  },
  {
    id: 'person-ricky-hadi-putra',
    slug: 'ricky-hadi-putra',
    name: 'Ricky Hadi Putra',
    titles: 'S.H.',
    position: {en: 'Partner', id: 'Partner'},
    email: 'ricky@harianja-putra.com',
    photo: 'partner-ricky-temp.jpg',
    summary: {
      en: 'Handles civil and criminal litigation, commercial and corporate disputes, debt collection, asset recovery, contract enforcement, and alternative dispute resolution.',
      id: 'Menangani litigasi perdata dan pidana, sengketa komersial dan korporasi, penagihan utang, pemulihan aset, pelaksanaan kontrak, dan penyelesaian sengketa di luar pengadilan.',
    },
    focus: [
      ['Litigation', 'Litigasi'],
      ['Asset recovery', 'Pemulihan aset'],
      ['ADR', 'Arbitrase'],
    ],
    services: [
      'civil-criminal-litigation',
      'debt-collection-asset-recovery',
      'arbitration-dispute-resolution',
    ],
  },
  {
    id: 'person-evan-nathaniel-gunawan',
    slug: 'evan-nathaniel-gunawan',
    name: 'Evan Nathaniel Gunawan',
    titles: 'S.H.',
    position: {en: 'Partner', id: 'Partner'},
    email: 'evan@harianja-putra.com',
    photo: 'partner-evan-temp.jpg',
    summary: {
      en: 'Handles commercial contracts, employment and industrial relations, business licensing, investment compliance, regulatory affairs, risk management, and legal audits.',
      id: 'Menangani kontrak komersial, ketenagakerjaan dan hubungan industrial, perizinan usaha, kepatuhan investasi, urusan regulasi, manajemen risiko, dan audit hukum.',
    },
    focus: [
      ['Contracts', 'Kontrak'],
      ['Employment', 'Ketenagakerjaan'],
      ['Compliance', 'Kepatuhan'],
    ],
    services: [
      'commercial-contracts',
      'employment-industrial-relations',
      'technology-digital-business',
      'regulatory-compliance',
      'due-diligence',
    ],
  },
]

const ZICO = 'person-zico-fernando'
const RICKY = 'person-ricky-hadi-putra'
const EVAN = 'person-evan-nathaniel-gunawan'

/** scope: [en, id, featured?] */
export const practiceAreas = [
  {
    slug: 'corporate-commercial-law',
    slugId: 'hukum-korporasi-komersial',
    title: {en: 'Corporate & Commercial Law', id: 'Hukum Korporasi & Komersial'},
    summary: {
      en: 'We advise on setting up companies, shareholder decisions, and the commercial questions that need a legal opinion before the board acts.',
      id: 'Kami mendampingi pendirian perusahaan, keputusan pemegang saham, dan persoalan komersial yang memerlukan pendapat hukum sebelum direksi bertindak.',
    },
    scope: [
      [
        'Setting up companies and amending articles of association',
        'Pendirian perusahaan dan perubahan anggaran dasar',
        true,
      ],
      [
        'General meeting (RUPS) resolutions and shareholder decisions',
        'Keputusan RUPS dan keputusan pemegang saham',
        true,
      ],
      [
        'The duties of directors and commissioners',
        'Tugas dan tanggung jawab direksi dan dewan komisaris',
      ],
      [
        'Day-to-day commercial advice for operating businesses',
        'Nasihat komersial sehari-hari untuk perusahaan yang beroperasi',
      ],
      ['Legal opinions for board decisions', 'Pendapat hukum untuk keputusan direksi', true],
    ],
    legalBasis: [['Law 40/2007 · Limited Liability Companies', 'UU 40/2007 · Perseroan Terbatas']],
    contact: ZICO,
    sectors: [
      'broadcasting-pay-tv',
      'property-real-estate',
      'financial-services',
      'family-owned-businesses',
    ],
  },
  {
    slug: 'mergers-acquisitions',
    slugId: 'merger-akuisisi',
    title: {en: 'Mergers & Acquisitions', id: 'Merger & Akuisisi'},
    summary: {
      en: 'We act for buyers and sellers in share and asset acquisitions, from the first review of the target to closing.',
      id: 'Kami mewakili pembeli maupun penjual dalam akuisisi saham dan aset, sejak pemeriksaan awal atas perusahaan target sampai penutupan transaksi.',
    },
    scope: [
      ['Share and asset purchase agreements', 'Perjanjian jual beli saham dan aset'],
      ['Legal due diligence on the target company', 'Uji tuntas hukum atas perusahaan target'],
      ['Mergers, consolidations, and spin-offs', 'Penggabungan, peleburan, dan pemisahan usaha'],
    ],
    contact: ZICO,
  },
  {
    slug: 'investment-business-structuring',
    slugId: 'investasi-penataan-struktur-usaha',
    title: {
      en: 'Investment & Business Structuring',
      id: 'Investasi & Penataan Struktur Usaha',
    },
    summary: {
      en: 'We help investors choose a structure for entering or expanding in Indonesia and obtain the licences it requires.',
      id: 'Kami membantu investor memilih struktur untuk masuk atau berekspansi di Indonesia dan mengurus perizinan yang diperlukan.',
    },
    scope: [
      [
        'Setting up foreign and domestic investment companies',
        'Pendirian perusahaan penanaman modal asing dan dalam negeri',
      ],
      [
        "Joint venture and shareholders' agreements",
        'Perjanjian usaha patungan dan perjanjian pemegang saham',
      ],
      ['Risk-based business licensing', 'Perizinan berusaha berbasis risiko'],
    ],
    contact: ZICO,
  },
  {
    slug: 'commercial-contracts',
    slugId: 'kontrak-komersial',
    title: {en: 'Commercial Contracts', id: 'Kontrak Komersial'},
    summary: {
      en: 'We draft, review, and negotiate the contracts a business runs on.',
      id: 'Kami menyusun, menelaah, dan menegosiasikan kontrak yang dipakai perusahaan dalam kegiatan usahanya.',
    },
    scope: [
      [
        'Supply, distribution, and agency agreements',
        'Perjanjian pasokan, distribusi, dan keagenan',
      ],
      ['Service, lease, and cooperation agreements', 'Perjanjian jasa, sewa, dan kerja sama'],
      ['Contract review before signing', 'Penelaahan kontrak sebelum ditandatangani'],
    ],
    contact: EVAN,
  },
  {
    slug: 'corporate-governance',
    slugId: 'tata-kelola-perusahaan',
    title: {en: 'Corporate Governance', id: 'Tata Kelola Perusahaan'},
    summary: {
      en: 'We advise boards and shareholders on how decisions are made, recorded, and carried out.',
      id: 'Kami memberi nasihat kepada direksi, dewan komisaris, dan pemegang saham tentang cara keputusan diambil, dicatat, dan dijalankan.',
    },
    scope: [
      [
        'Board charters and internal policies',
        'Pedoman direksi dan dewan komisaris serta kebijakan internal',
      ],
      [
        'Conflicts of interest and related-party transactions',
        'Benturan kepentingan dan transaksi dengan pihak terkait',
      ],
      ['Shareholder disputes and deadlocks', 'Sengketa dan kebuntuan antarpemegang saham'],
    ],
    contact: ZICO,
  },
  {
    slug: 'corporate-secretary-services',
    slugId: 'jasa-sekretaris-perusahaan',
    title: {en: 'Corporate Secretary Services', id: 'Jasa Sekretaris Perusahaan'},
    summary: {
      en: "We keep a company's corporate records and filings in order through the year.",
      id: 'Kami menjaga agar dokumen dan pelaporan perusahaan tetap tertib sepanjang tahun.',
    },
    scope: [
      ['Annual and extraordinary general meetings', 'RUPS tahunan dan RUPS luar biasa'],
      [
        'Minutes, resolutions, and company registers',
        'Risalah rapat, keputusan, dan daftar perusahaan',
      ],
      [
        'Filings and notifications to the Ministry of Law',
        'Pelaporan dan pemberitahuan kepada Kementerian Hukum',
      ],
    ],
    contact: ZICO,
  },
  {
    slug: 'employment-industrial-relations',
    slugId: 'ketenagakerjaan-hubungan-industrial',
    title: {
      en: 'Employment & Industrial Relations',
      id: 'Ketenagakerjaan & Hubungan Industrial',
    },
    summary: {
      en: 'We advise employers on hiring, workplace rules, and ending employment, and represent them when a dispute arises.',
      id: 'Kami memberi nasihat kepada pemberi kerja tentang perekrutan, peraturan perusahaan, dan pengakhiran hubungan kerja, serta mewakili mereka saat timbul perselisihan.',
    },
    scope: [
      ['Employment contracts and company regulations', 'Perjanjian kerja dan peraturan perusahaan'],
      ['Termination and severance', 'Pemutusan hubungan kerja dan pesangon'],
      ['Industrial relations disputes', 'Perselisihan hubungan industrial'],
    ],
    contact: EVAN,
  },
  {
    slug: 'civil-criminal-litigation',
    slugId: 'litigasi-perdata-pidana',
    title: {en: 'Civil & Criminal Litigation', id: 'Litigasi Perdata & Pidana'},
    summary: {
      en: 'We represent clients in civil claims and criminal proceedings before the Indonesian courts.',
      id: 'Kami mewakili klien dalam gugatan perdata dan perkara pidana di pengadilan Indonesia.',
    },
    scope: [
      [
        'Civil claims for breach of contract and tort',
        'Gugatan wanprestasi dan perbuatan melawan hukum',
      ],
      [
        'Criminal reports and defence in business-related cases',
        'Laporan pidana dan pembelaan dalam perkara yang berkaitan dengan usaha',
      ],
      [
        'Appeals, cassation, and enforcement of judgments',
        'Banding, kasasi, dan pelaksanaan putusan',
      ],
    ],
    contact: RICKY,
  },
  {
    slug: 'debt-collection-asset-recovery',
    slugId: 'penagihan-utang-pemulihan-aset',
    title: {en: 'Debt Collection & Asset Recovery', id: 'Penagihan Utang & Pemulihan Aset'},
    summary: {
      en: 'We recover unpaid debts for creditors, starting with a demand letter and going to court when needed.',
      id: 'Kami menagih piutang untuk kreditur, mulai dari somasi sampai gugatan di pengadilan bila diperlukan.',
    },
    scope: [
      ['Demand letters and negotiated settlements', 'Somasi dan penyelesaian melalui perundingan'],
      ['Debt claims, PKPU, and bankruptcy petitions', 'Gugatan utang, PKPU, dan permohonan pailit'],
      ['Enforcement of security and asset tracing', 'Eksekusi jaminan dan penelusuran aset'],
    ],
    contact: RICKY,
  },
  {
    slug: 'intellectual-property',
    slugId: 'kekayaan-intelektual',
    title: {en: 'Intellectual Property', id: 'Kekayaan Intelektual'},
    summary: {
      en: 'We register and enforce trademarks, copyright, and other intellectual property.',
      id: 'Kami mendaftarkan dan menegakkan merek, hak cipta, dan kekayaan intelektual lainnya.',
    },
    scope: [
      ['Trademark and copyright registration', 'Pendaftaran merek dan pencatatan hak cipta'],
      ['Licensing and assignment agreements', 'Perjanjian lisensi dan pengalihan hak'],
      ['Infringement claims and enforcement', 'Tuntutan dan penindakan atas pelanggaran'],
    ],
    contact: ZICO,
  },
  {
    slug: 'broadcasting-media-rights',
    slugId: 'penyiaran-hak-media',
    title: {en: 'Broadcasting & Media Rights', id: 'Penyiaran & Hak Media'},
    summary: {
      en: 'We advise broadcasters, pay-TV operators, and content owners on licensing and distribution.',
      id: 'Kami memberi nasihat kepada lembaga penyiaran, operator TV berbayar, dan pemilik konten tentang perizinan dan distribusi.',
    },
    scope: [
      ['Content licensing and distribution agreements', 'Perjanjian lisensi dan distribusi konten'],
      [
        'Broadcasting licences and regulatory matters',
        'Izin penyelenggaraan penyiaran dan urusan regulasi',
      ],
      ['Action against unauthorised redistribution', 'Penindakan atas penyiaran ulang tanpa izin'],
    ],
    contact: ZICO,
  },
  {
    slug: 'technology-digital-business',
    slugId: 'teknologi-bisnis-digital',
    title: {en: 'Technology & Digital Business', id: 'Teknologi & Bisnis Digital'},
    summary: {
      en: 'We advise technology and online businesses on their contracts, licences, and data obligations.',
      id: 'Kami memberi nasihat kepada perusahaan teknologi dan usaha daring tentang kontrak, perizinan, dan kewajiban terkait data.',
    },
    scope: [
      ['Terms of service and platform agreements', 'Syarat layanan dan perjanjian platform'],
      ['Electronic system operator registration', 'Pendaftaran penyelenggara sistem elektronik'],
      ['Personal data protection', 'Pelindungan data pribadi'],
    ],
    contact: EVAN,
  },
  {
    slug: 'regulatory-compliance',
    slugId: 'kepatuhan-regulasi',
    title: {en: 'Regulatory Compliance', id: 'Kepatuhan Regulasi'},
    summary: {
      en: 'We help companies understand which rules apply to them and put compliance into practice.',
      id: 'Kami membantu perusahaan memahami aturan yang berlaku bagi mereka dan menjalankannya dalam praktik.',
    },
    scope: [
      ['Business licences and reporting obligations', 'Perizinan usaha dan kewajiban pelaporan'],
      ['Compliance reviews and internal policies', 'Tinjauan kepatuhan dan kebijakan internal'],
      ['Dealings with regulators', 'Korespondensi dan pertemuan dengan regulator'],
    ],
    contact: EVAN,
  },
  {
    slug: 'due-diligence',
    slugId: 'uji-tuntas-hukum',
    title: {en: 'Due Diligence', id: 'Uji Tuntas Hukum'},
    summary: {
      en: "We examine a company's legal position before a transaction, a financing, or a dispute.",
      id: 'Kami memeriksa posisi hukum suatu perusahaan sebelum transaksi, pembiayaan, atau sengketa.',
    },
    scope: [
      [
        'Corporate records, licences, and material contracts',
        'Dokumen perseroan, perizinan, dan kontrak material',
      ],
      ['Assets, land, and security interests', 'Aset, tanah, dan jaminan'],
      ['Litigation and employment exposure', 'Risiko perkara dan ketenagakerjaan'],
    ],
    contact: EVAN,
  },
  {
    slug: 'arbitration-dispute-resolution',
    slugId: 'arbitrase-penyelesaian-sengketa',
    title: {
      en: 'Arbitration & Dispute Resolution',
      id: 'Arbitrase & Penyelesaian Sengketa',
    },
    summary: {
      en: 'We represent clients in arbitration and other ways of resolving disputes outside court.',
      id: 'Kami mewakili klien dalam arbitrase dan cara penyelesaian sengketa lain di luar pengadilan.',
    },
    scope: [
      ['Arbitration before BANI and other institutions', 'Arbitrase di BANI dan lembaga lainnya'],
      ['Mediation and negotiated settlements', 'Mediasi dan penyelesaian melalui perundingan'],
      ['Enforcement of arbitral awards', 'Pelaksanaan putusan arbitrase'],
    ],
    contact: RICKY,
  },
]

const SAMPLE = {
  en: 'Sample text only. The final article is written by the admin in the CMS.',
  id: 'Teks contoh saja. Artikel final ditulis oleh admin di CMS.',
}

/** Sample articles from the Insights frames. Titles keep the "Sample title:" prefix. */
export const insights = [
  {
    slug: 'changes-to-risk-based-business-licensing-rules',
    slugId: 'perubahan-aturan-perizinan-berusaha-berbasis-risiko',
    title: {
      en: 'Sample title: Changes to risk-based business licensing rules',
      id: 'Contoh judul: Perubahan aturan perizinan berusaha berbasis risiko',
    },
    category: 'update',
    date: '2026-09-12',
    author: EVAN,
    services: ['regulatory-compliance'],
  },
  {
    slug: 'five-things-to-check-before-signing-a-shareholders-agreement',
    slugId: 'lima-hal-yang-perlu-diperiksa-sebelum-menandatangani-perjanjian-pemegang-saham',
    title: {
      en: "Sample title: Five things to check before signing a shareholders' agreement",
      id: 'Contoh judul: Lima hal yang perlu diperiksa sebelum menandatangani perjanjian pemegang saham',
    },
    category: 'article',
    date: '2026-08-28',
    author: ZICO,
    services: ['corporate-commercial-law', 'corporate-governance'],
    styleSample: true,
  },
  {
    slug: 'preparing-a-debt-claim-before-sending-a-demand-letter',
    slugId: 'menyiapkan-tagihan-utang-sebelum-mengirim-somasi',
    title: {
      en: 'Sample title: Preparing a debt claim before sending a demand letter',
      id: 'Contoh judul: Menyiapkan tagihan utang sebelum mengirim somasi',
    },
    category: 'article',
    date: '2026-08-14',
    author: RICKY,
    services: ['debt-collection-asset-recovery'],
  },
  {
    slug: 'harianja-putra-opens-a-representative-office-in-denpasar',
    slugId: 'harianja-putra-membuka-kantor-perwakilan-di-denpasar',
    title: {
      en: 'Sample title: Harianja & Putra opens a representative office in Denpasar',
      id: 'Contoh judul: Harianja & Putra membuka kantor perwakilan di Denpasar',
    },
    category: 'news',
    date: '2026-08-05',
    author: null,
    services: [],
  },
  {
    slug: 'employment-contracts-and-the-end-of-a-fixed-term',
    slugId: 'perjanjian-kerja-dan-berakhirnya-jangka-waktu-tertentu',
    title: {
      en: 'Sample title: Employment contracts and the end of a fixed term',
      id: 'Contoh judul: Perjanjian kerja dan berakhirnya jangka waktu tertentu',
    },
    category: 'article',
    date: '2026-07-22',
    author: EVAN,
    services: ['employment-industrial-relations'],
  },
].map((item) => ({...item, excerpt: SAMPLE}))

/** The article frame is a type specimen: lead, headings, list, pull quote. */
export const styleSampleBody = {
  en: [
    [
      'lead',
      'This sample shows how an article reads on the site: lead paragraph, headings, body text, a list, and a pull quote.',
    ],
    ['h2', 'Body text'],
    [
      'normal',
      'Body text is set at 18px with a 1.7 line height. Lines stay near 70 characters, which keeps long legal text easy to read.',
    ],
    ['h2', 'Lists and clauses'],
    ['number', 'Lists use a thin rule between items.'],
    ['number', 'Clause numbers use tabular figures so they line up.'],
    ['number', 'Links are underlined and turn brass on hover.'],
    ['h2', 'Pull quote'],
    [
      'blockquote',
      'A pull quote appears once per article, for the sentence a reader should remember.',
    ],
  ],
  id: [
    [
      'lead',
      'Contoh ini menunjukkan tampilan artikel di situs: paragraf pembuka, judul bagian, teks isi, daftar, dan kutipan.',
    ],
    ['h2', 'Teks isi'],
    [
      'normal',
      'Teks isi berukuran 18px dengan tinggi baris 1,7. Panjang baris dijaga sekitar 70 karakter supaya teks hukum yang panjang tetap nyaman dibaca.',
    ],
    ['h2', 'Daftar dan klausul'],
    ['number', 'Daftar memakai garis tipis di antara butir.'],
    ['number', 'Nomor klausul memakai angka tabular supaya sejajar.'],
    ['number', 'Tautan diberi garis bawah dan berubah warna saat disorot.'],
    ['h2', 'Kutipan'],
    [
      'blockquote',
      'Kutipan muncul satu kali per artikel, untuk kalimat yang perlu diingat pembaca.',
    ],
  ],
}

export const sampleBody = SAMPLE

/** Sample matters from the Experience frame. Layout samples, not real engagements. */
export const matters = [
  {
    slug: 'foreign-investor-property-holding-company',
    slugId: 'investor-asing-perusahaan-pemilik-properti',
    title: {
      en: 'Sample: Advised a foreign investor on acquiring a property-holding company',
      id: 'Contoh: Mendampingi investor asing dalam akuisisi perusahaan pemilik properti',
    },
    client: {en: 'A foreign investor', id: 'Investor asing'},
    year: 2025,
    service: 'mergers-acquisitions',
    sector: 'property-real-estate',
  },
  {
    slug: 'supplier-unpaid-trade-receivable',
    slugId: 'pemasok-piutang-dagang-belum-dibayar',
    title: {
      en: 'Sample: Acted for a supplier in a claim for an unpaid trade receivable',
      id: 'Contoh: Mewakili pemasok dalam tagihan atas piutang dagang yang belum dibayar',
    },
    client: {en: 'A supplier', id: 'Perusahaan pemasok'},
    year: 2025,
    service: 'debt-collection-asset-recovery',
    sector: 'financial-services',
  },
  {
    slug: 'broadcaster-media-distribution-agreement',
    slugId: 'lembaga-penyiaran-perjanjian-distribusi-media',
    title: {
      en: 'Sample: Advised a broadcaster on a media distribution agreement',
      id: 'Contoh: Mendampingi lembaga penyiaran dalam perjanjian distribusi media',
    },
    client: {en: 'A broadcaster', id: 'Lembaga penyiaran'},
    year: 2024,
    service: 'broadcasting-media-rights',
    sector: 'broadcasting-pay-tv',
  },
  {
    slug: 'manufacturer-shareholder-arrangements',
    slugId: 'produsen-pengaturan-pemegang-saham',
    title: {
      en: 'Sample: Advised a manufacturer on its shareholder arrangements',
      id: 'Contoh: Mendampingi perusahaan manufaktur dalam pengaturan antarpemegang saham',
    },
    client: {en: 'A manufacturer', id: 'Perusahaan manufaktur'},
    year: 2024,
    service: 'corporate-commercial-law',
    sector: 'manufacturing',
  },
]

const PENDING = {
  en: 'Text to be provided and approved by the firm.',
  id: 'Teks akan disediakan dan disetujui oleh firma.',
}

export const legalPages = [
  {
    id: 'page-disclaimer',
    title: {en: 'Disclaimer', id: 'Penafian'},
    slug: {en: 'disclaimer', id: 'penafian'},
    sections: [
      [{en: 'General information', id: 'Informasi umum'}, site.disclaimer],
      [{en: 'No lawyer-client relationship', id: 'Tidak ada hubungan advokat dan klien'}, PENDING],
      [{en: 'Messages and confidentiality', id: 'Pesan dan kerahasiaan'}, PENDING],
      [{en: 'External links', id: 'Tautan eksternal'}, PENDING],
      [{en: 'Changes to this page', id: 'Perubahan halaman ini'}, PENDING],
    ],
  },
  {
    id: 'page-privacy-policy',
    title: {en: 'Privacy Policy', id: 'Kebijakan Privasi'},
    slug: {en: 'privacy-policy', id: 'kebijakan-privasi'},
    sections: [
      [{en: 'Personal data we collect', id: 'Data pribadi yang kami kumpulkan'}, PENDING],
      [{en: 'How we use your data', id: 'Cara kami menggunakan data Anda'}, PENDING],
      [
        {en: 'Your rights under Law No. 27 of 2022', id: 'Hak Anda menurut UU No. 27 Tahun 2022'},
        PENDING,
      ],
      [{en: 'How to contact us', id: 'Cara menghubungi kami'}, PENDING],
    ],
  },
]
