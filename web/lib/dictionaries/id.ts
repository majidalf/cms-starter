import type { Dictionary } from './en';

/* Fixed UI text, Indonesian. Same shape as en.ts, which holds the wording of the design. */
export const id: Dictionary = {
  skipToContent: 'Langsung ke konten',
  mainNav: 'Navigasi utama',
  footerNav: 'Navigasi footer',
  legalNav: 'Hukum',
  languageSwitcher: 'Bahasa',
  openMenu: 'Buka menu',
  closeMenu: 'Tutup menu',
  homeLabel: 'Beranda',
  breadcrumb: 'Jejak halaman',

  bookConsultation: 'Atur konsultasi',
  viewProfile: 'Lihat profil',
  fullProfile: 'Profil lengkap',
  viewPracticeArea: 'Lihat bidang praktik',
  seeAllPracticeAreas: 'Lihat {n} bidang praktik',
  previous: 'Sebelumnya',
  next: 'Berikutnya',

  leadership: 'Partner',
  services: 'Bidang Praktik',
  industries: 'Sektor',
  caseStudies: 'Pengalaman',
  insights: 'Wawasan',
  contact: 'Kontak',

  personGroups: {
    board: 'Direksi dan Komisaris',
    leadership: 'Pimpinan',
    partner: 'Partner',
    team: 'Tim',
  },
  credentialKinds: {
    education: 'Pendidikan',
    certification: 'Sertifikasi',
    license: 'Izin advokat',
  },
  insightCategories: {
    article: 'Artikel',
    update: 'Pembaruan Regulasi',
    news: 'Kabar Firma',
    publication: 'Publikasi',
    pressRelease: 'Siaran Pers',
  },

  header: {
    condensedNav: 'Navigasi situs',
  },

  footer: {
    site: 'Situs',
    contact: 'Kontak',
    offices: 'Kantor',
  },

  facts: {
    practiceAreas: 'Bidang praktik',
    practiceAreasNote: 'Korporasi, litigasi, ketenagakerjaan, KI, dan lainnya',
    partners: 'Partner',
    offices: 'Kantor',
    officesNote: 'Jakarta, ditambah kantor perwakilan di Denpasar',
    sectors: 'Sektor klien',
    sectorsNote: 'Penyiaran, otomotif, properti, dan lainnya',
  },

  partnerCard: {
    email: 'Email',
    office: 'Kantor',
    about: 'Tentang',
    eyebrow:
      'Korporasi dan transaksi, litigasi, atau kontrak dan kepatuhan. Pilih partner yang sesuai dengan perkara Anda.',
    headingLine1: 'PARA',
    headingLine2: 'PROFESIONAL KAMI',
    photoNote: 'Foto sementara · ganti dengan sesi foto seragam',
  },

  home: {
    heroEyebrow: 'Counselors at Law · Jakarta · Denpasar',
    aboutLabel: 'Tentang kami',
    aboutStatement:
      'Harianja & Putra adalah firma hukum independen dengan kantor di Jakarta dan Denpasar. Klien kami adalah perusahaan, lembaga keuangan, investor, pemilik usaha, dan perorangan.',
    aboutP1:
      'Advokat kami menangani transaksi korporasi, kontrak, litigasi, ketenagakerjaan, investasi, penyiaran dan media, kekayaan intelektual, kepatuhan, dan penagihan utang.',
    aboutP2:
      'Sebagian besar persoalan hukum pada akhirnya berdampak pada bisnis. Karena itu, sebelum menyarankan langkah, kami menimbang risikonya, biayanya, dan seberapa mudah Anda menjalankannya. Semua yang Anda sampaikan kepada kami tetap rahasia.',
    practiceLabel: 'Bidang praktik',
    practiceHeading: '{count} bidang praktik.',
    practiceLead: 'Pilih bidang untuk melihat apa yang kami tangani dan siapa yang dihubungi.',
    practiceNote:
      'Hover or select a row to change the panel. The panel stays in view while the list scrolls. On mobile this becomes an accordion.',
    practiceNoteMobile: 'Accordion: one area open at a time.',
    sectorsLabel: 'Sektor',
    sectorsHeading: 'Sektor tempat kami pernah mendampingi klien.',
    insightsLabel: 'Wawasan',
    insightsHeading: 'Artikel dan pembaruan regulasi dari tim kami.',
    insightsNote:
      'Section otomatis tersembunyi sampai admin menerbitkan artikel pertama. Judul di atas hanya contoh.',
  },

  countWords: {
    15: 'Lima belas',
  },

  contactForm: {
    heading: 'Ceritakan persoalan hukum Anda.',
    lead: 'Isi formulir atau hubungi kami langsung. Kami akan membalas untuk mengatur konsultasi. Semua yang Anda sampaikan kami jaga kerahasiaannya.',
    addressToFollow: 'alamat menyusul',
    name: 'Nama lengkap',
    email: 'Email',
    company: 'Perusahaan (opsional)',
    practiceArea: 'Bidang praktik',
    practiceAreaPlaceholder: 'Pilih bidang praktik',
    message: 'Jelaskan persoalan Anda secara singkat',
    consent:
      'Saya menyetujui pemrosesan data pribadi saya sesuai Kebijakan Privasi (UU No. 27 Tahun 2022). Mengirim formulir ini tidak menimbulkan hubungan advokat dan klien.',
    submit: 'Kirim pesan',
    sending: 'Mengirim',
    required: 'wajib diisi',
    successTitle: 'Pesan terkirim',
    successText: 'Kami akan membalas lewat email untuk mengatur konsultasi.',
    errors: {
      name: 'Isi nama lengkap Anda.',
      email: 'Isi alamat email lengkap, misalnya nama@perusahaan.com.',
      message: 'Jelaskan persoalan Anda, minimal 10 karakter.',
      consent: 'Centang kotak persetujuan sebelum mengirim.',
      tooLong: 'Terlalu panjang. Ringkas, lalu coba lagi.',
      spamCheck: 'Selesaikan pemeriksaan spam, lalu kirim lagi.',
      fix: 'Periksa kolom yang ditandai, lalu kirim lagi.',
      notConfigured:
        'Formulir belum dapat dipakai saat ini. Silakan kirim email ke alamat di halaman ini.',
      failed: 'Pesan Anda tidak terkirim. Coba lagi, atau kirim email langsung kepada kami.',
    },
  },

  contactPage: {
    label: 'Kontak',
    heading: 'Hubungi kami di Jakarta atau Denpasar.',
    lead: 'Gunakan formulir di bawah atau hubungi kantor terdekat. Semua yang Anda sampaikan kepada kami tetap rahasia.',
    mapNote: 'Peta menyusul setelah alamat dipastikan',
    address: 'Alamat',
    addressToFollow: 'Alamat menyusul',
    phone: 'Telepon',
    email: 'Email',
    hours: 'Jam kerja',
    toBeProvided: 'Menyusul',
    viewMap: 'Lihat di peta',
  },

  about: {
    title: 'Tentang',
    label: 'Tentang kami',
    heading: 'Firma hukum independen di Jakarta dan Denpasar.',
    whoWeAre: 'Siapa kami',
    statement:
      'Kami mendampingi perusahaan, lembaga keuangan, investor, pemilik usaha, dan klien perorangan di seluruh Indonesia.',
    p1: 'Advokat kami menangani transaksi korporasi, nasihat komersial, penyelesaian sengketa, litigasi, ketenagakerjaan, investasi, penyiaran dan media, kekayaan intelektual, kepatuhan, dan penagihan utang.',
    p2: 'Setiap persoalan hukum punya sisi komersial. Sebelum menyarankan langkah, kami melihat risikonya, biayanya, dan seberapa praktis langkah itu dijalankan.',
    howWeWork: 'Cara kami bekerja',
    principles: [
      {
        title: 'Nasihat yang terkait dengan bisnis',
        text: 'Kami melihat arti sebuah langkah hukum bagi operasional, biaya, dan waktu, bukan hanya dari sisi hukumnya.',
      },
      {
        title: 'Transaksi dan sengketa ditangani bersama',
        text: 'Advokat yang sama menangani transaksi dan litigasi, sehingga nasihat atas suatu transaksi sudah memperhitungkan kemungkinan transaksi itu digugat di kemudian hari.',
      },
      {
        title: 'Penjelasan yang lugas',
        text: 'Kami menjelaskan pilihan dan risikonya dengan bahasa yang bisa langsung Anda pakai untuk memutuskan.',
      },
      {
        title: 'Kerahasiaan',
        text: 'Apa yang Anda sampaikan tetap rahasia, dan kami bekerja sesuai kode etik advokat.',
      },
    ],
    commitmentLabel: 'Komitmen kami',
    commitmentStatement:
      'Kami ingin menjadi advokat yang dihubungi kembali oleh klien, bukan hanya yang menutup satu berkas.',
    commitmentText:
      'Setiap penugasan kami tangani secara profesional dengan memperhatikan hasil praktisnya. Tujuan kami adalah mendukung pertumbuhan klien dalam jangka panjang.',
    ctaHeading: 'Bicarakan persoalan Anda dengan kami.',
    ctaLead: 'Kirim penjelasan singkat. Kami akan membalas untuk mengatur konsultasi.',
  },

  practice: {
    indexHeading: 'Apa yang kami tangani, bidang demi bidang.',
    of: '{n} dari {total}',
    allAreas: 'Semua bidang praktik',
    whatWeHandle: 'Yang kami tangani',
    legalBasis: 'Dasar hukum',
    whoToContact: 'Siapa yang dihubungi',
    sectors: 'Sektor yang kami dampingi',
    draftNote: 'Scope, legal basis and sector links are drafts pending partner approval.',
    ctaHeading: 'Punya persoalan di bidang ini?',
    ctaLead: 'Kirim penjelasan singkat. Kami akan membalas untuk mengatur konsultasi.',
    nextLabel: 'Berikutnya:',
    photoNote: 'Temporary photo',
  },

  partner: {
    indexHeading: 'Partner yang menangani perkara Anda.',
    about: 'Tentang',
    bioNote: 'Full biography to come from the partner.',
    areasOfWork: 'Bidang yang ditangani',
    credentials: 'Kredensial',
    qualifications: 'Gelar',
    languages: 'Bahasa',
    toBeProvided: 'Menunggu data dari partner',
    otherPartners: 'Partner lainnya',
    email: 'Email',
    phone: 'Telepon',
    firmPhone: '{phone} (kantor)',
    office: 'Kantor',
    contactCta: 'Hubungi {name}',
    saveContact: 'Simpan kontak (vCard)',
    ctaHeading: 'Bicara dengan {name}.',
    ctaLead:
      'Kirim penjelasan singkat tentang persoalan Anda. Kami akan membalas untuk mengatur konsultasi.',
  },

  sectorsPage: {
    lead: 'Kami pernah mendampingi klien di sektor-sektor ini. Jika sektor Anda belum tercantum, tanyakan kepada kami.',
  },

  insightsPage: {
    label: 'Wawasan',
    heading: 'Catatan hukum dan pembaruan regulasi.',
    lead: 'Artikel singkat dari advokat kami tentang regulasi dan praktik.',
    filter: 'Filter',
    all: 'Semua',
    loadMore: 'Muat artikel lainnya',
    emptyTitle: 'Belum ada artikel.',
    emptyText:
      'Artikel baru akan tampil di sini setelah firma menerbitkannya. Sementara itu, Anda dapat membaca bidang praktik kami atau menghubungi partner.',
    emptyFiltered: 'Belum ada artikel di kategori ini.',
    seePracticeAreas: 'Lihat bidang praktik',
    contactPartner: 'Hubungi partner',
    draftNote:
      'Sample content for layout only. Articles are written and published by the admin in the CMS. With no articles, the page shows the empty state.',
  },

  article: {
    by: 'Oleh {name}',
    inThisArticle: 'Dalam artikel ini',
    downloadPdf: 'Unduh PDF',
    print: 'Cetak halaman ini',
    printShort: 'Cetak',
    sampleNote: 'Sample text only. The final article is written by the admin in the CMS.',
    disclaimer:
      'Artikel ini berisi informasi umum dan bukan nasihat hukum. Untuk keadaan Anda sendiri, bicarakan dengan advokat.',
    relatedAreas: 'Bidang praktik terkait',
    previous: 'Sebelumnya:',
    next: 'Berikutnya:',
  },

  experience: {
    label: 'Pengalaman',
    heading: 'Perkara pilihan, tanpa menyebut nama klien.',
    lead: 'Setiap entri menyebut lingkup pekerjaan kami, bukan hasilnya. Entri diterbitkan dengan persetujuan klien.',
    filter: 'Filter',
    practiceArea: 'Bidang praktik',
    sector: 'Sektor',
    year: 'Tahun',
    all: 'Semua',
    emptyFiltered: 'Tidak ada perkara yang cocok dengan filter ini.',
    draftNote:
      'Sample content for layout only. The section and this page stay hidden until the CMS has one entry with client consent confirmed.',
    client: 'Klien',
    challenge: 'Perkara',
    approach: 'Pekerjaan kami',
    outcome: 'Lingkup',
    allMatters: 'Semua perkara',
  },

  legal: {
    label: 'Hukum',
    updated: 'Terakhir diperbarui: {date}',
    onThisPage: 'Di halaman ini',
    draftNote:
      'The Privacy Policy page uses this same layout. Its text must cover Law No. 27 of 2022 on personal data protection.',
  },

  notFound: {
    title: 'Halaman tidak ditemukan',
    label: 'Galat 404',
    heading: 'Halaman ini tidak ada.',
    lead: 'Alamatnya mungkin keliru, atau halamannya sudah dipindahkan. Halaman berikut mungkin membantu.',
  },
};
