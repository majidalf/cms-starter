/*
 * Fixed UI text, English: the wording of Design.pen. Anything an editor should be able to
 * change belongs in Sanity instead. id.ts must have the same shape (type Dictionary).
 */
export const en = {
  skipToContent: 'Skip to content',
  mainNav: 'Main navigation',
  footerNav: 'Footer navigation',
  legalNav: 'Legal',
  languageSwitcher: 'Language',
  openMenu: 'Open menu',
  closeMenu: 'Close menu',
  homeLabel: 'Home',
  breadcrumb: 'Breadcrumb',

  bookConsultation: 'Book a consultation',
  viewProfile: 'View profile',
  fullProfile: 'Full profile',
  viewPracticeArea: 'View practice area',
  seeAllPracticeAreas: 'See all {n} practice areas',
  previous: 'Previous',
  next: 'Next',

  leadership: 'Partners',
  services: 'Practice Areas',
  industries: 'Sectors',
  caseStudies: 'Experience',
  insights: 'Insights',
  contact: 'Contact',

  personGroups: {
    board: 'Board',
    leadership: 'Leadership',
    partner: 'Partners',
    team: 'Team',
  } as Record<string, string>,
  credentialKinds: {
    education: 'Education',
    certification: 'Certifications',
    license: 'Bar admission',
  } as Record<string, string>,
  insightCategories: {
    article: 'Article',
    update: 'Regulatory Update',
    news: 'Firm News',
    publication: 'Publication',
    pressRelease: 'Press Release',
  } as Record<string, string>,

  header: {
    condensedNav: 'Site navigation',
  },

  footer: {
    site: 'Site',
    contact: 'Contact',
    offices: 'Offices',
  },

  facts: {
    practiceAreas: 'Practice areas',
    practiceAreasNote: 'Corporate, litigation, employment, IP, and more',
    partners: 'Partners',
    offices: 'Offices',
    officesNote: 'Jakarta, plus a representative office in Denpasar',
    sectors: 'Client sectors',
    sectorsNote: 'Broadcasting, automotive, property, and more',
  },

  partnerCard: {
    email: 'Email',
    office: 'Office',
    about: 'About',
    eyebrow:
      'Corporate and transactions, litigation, or contracts and compliance. Choose the partner who fits your matter.',
    headingLine1: 'OUR',
    headingLine2: 'PROFESSIONALS',
    photoNote: 'Foto sementara · ganti dengan sesi foto seragam',
  },

  home: {
    heroEyebrow: 'Counselors at Law · Jakarta · Denpasar',
    aboutLabel: 'About us',
    aboutStatement:
      'Harianja & Putra is an independent law firm with offices in Jakarta and Denpasar. Our clients are companies, financial institutions, investors, business owners, and private individuals.',
    aboutP1:
      'Our lawyers work on corporate transactions, contracts, litigation, employment, investment, broadcasting and media, intellectual property, compliance, and debt recovery.',
    aboutP2:
      'Most legal problems end up affecting the business. So before we recommend a course of action, we weigh its risk, its cost, and how easily you can carry it out. Everything you tell us stays confidential.',
    practiceLabel: 'Practice areas',
    practiceHeading: '{count} areas of practice.',
    practiceLead: 'Select an area to see what we handle and who to contact.',
    practiceNote:
      'Hover or select a row to change the panel. The panel stays in view while the list scrolls. On mobile this becomes an accordion.',
    practiceNoteMobile: 'Accordion: one area open at a time.',
    sectorsLabel: 'Sectors',
    sectorsHeading: 'Sectors where we have advised clients.',
    insightsLabel: 'Insights',
    insightsHeading: 'Articles and regulatory updates from our team.',
    insightsNote:
      'Section otomatis tersembunyi sampai admin menerbitkan artikel pertama. Judul di atas hanya contoh.',
  },

  /** Spelled-out counts for the practice heading; other counts fall back to digits. */
  countWords: {
    15: 'Fifteen',
  } as Record<number, string>,

  contactForm: {
    heading: 'Tell us about your legal matter.',
    lead: 'Fill in the form or contact us directly. We will reply to arrange a consultation. Everything you share with us is kept confidential.',
    addressToFollow: 'address to follow',
    name: 'Full name',
    email: 'Email',
    company: 'Company (optional)',
    practiceArea: 'Practice area',
    practiceAreaPlaceholder: 'Select a practice area',
    message: 'Briefly describe your matter',
    consent:
      'I agree to the processing of my personal data under the Privacy Policy (Law No. 27 of 2022). Submitting this form does not create a lawyer-client relationship.',
    submit: 'Send message',
    sending: 'Sending',
    required: 'required',
    successTitle: 'Message sent',
    successText: 'We will reply by email to arrange a consultation.',
    errors: {
      name: 'Enter your full name.',
      email: 'Enter a full email address, such as name@company.com.',
      message: 'Describe your matter in at least 10 characters.',
      consent: 'Tick the box to agree before sending.',
      tooLong: 'This is too long. Shorten it and try again.',
      spamCheck: 'Complete the spam check, then send again.',
      fix: 'Check the marked fields, then send again.',
      notConfigured:
        'The form is not available right now. Email us at the address on this page instead.',
      failed: 'We could not send your message. Try again, or email us directly.',
    },
  },

  contactPage: {
    label: 'Contact',
    heading: 'Reach us in Jakarta or Denpasar.',
    lead: 'Use the form below or contact the office nearest you. Everything you share with us stays confidential.',
    mapNote: 'Map to follow once the address is confirmed',
    address: 'Address',
    addressToFollow: 'Address to follow',
    phone: 'Phone',
    email: 'Email',
    hours: 'Hours',
    toBeProvided: 'To be provided',
    viewMap: 'View on map',
  },

  about: {
    title: 'About',
    label: 'About us',
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
    commitmentLabel: 'Our commitment',
    commitmentStatement:
      'We want to be the lawyers a client keeps coming back to, not only the ones who close a single file.',
    commitmentText:
      "Each engagement is handled professionally and with the practical outcome in mind. Our aim is to support our clients' growth over the long term.",
    ctaHeading: 'Talk to us about your matter.',
    ctaLead: 'Send us a short description. We reply to arrange a consultation.',
  },

  practice: {
    indexHeading: 'What we handle, area by area.',
    of: '{n} of {total}',
    allAreas: 'All practice areas',
    whatWeHandle: 'What we handle',
    legalBasis: 'Legal basis',
    whoToContact: 'Who to contact',
    sectors: 'Sectors we advise',
    draftNote: 'Scope, legal basis and sector links are drafts pending partner approval.',
    ctaHeading: 'Have a matter in this area?',
    ctaLead: 'Send us a short description. We reply to arrange a consultation.',
    nextLabel: 'Next:',
    photoNote: 'Temporary photo',
  },

  partner: {
    indexHeading: 'The partners who handle your matter.',
    about: 'About',
    bioNote: 'Full biography to come from the partner.',
    areasOfWork: 'Areas of work',
    credentials: 'Credentials',
    qualifications: 'Qualifications',
    languages: 'Languages',
    toBeProvided: 'To be provided by the partner',
    otherPartners: 'Other partners',
    email: 'Email',
    phone: 'Phone',
    firmPhone: '{phone} (firm)',
    office: 'Office',
    contactCta: 'Contact {name}',
    saveContact: 'Save contact (vCard)',
    ctaHeading: 'Speak with {name}.',
    ctaLead: 'Send a short description of your matter. We reply to arrange a consultation.',
  },

  sectorsPage: {
    lead: 'We have advised clients in these sectors. If yours is not listed, ask us.',
  },

  insightsPage: {
    label: 'Insights',
    heading: 'Legal notes and regulatory updates.',
    lead: 'Short articles from our lawyers on regulation and practice.',
    filter: 'Filter',
    all: 'All',
    loadMore: 'Load more articles',
    emptyTitle: 'No articles yet.',
    emptyText:
      'New articles will appear here when the firm publishes them. Meanwhile, you can read about our practice areas or contact a partner.',
    emptyFiltered: 'No articles in this category yet.',
    seePracticeAreas: 'See practice areas',
    contactPartner: 'Contact a partner',
    draftNote:
      'Sample content for layout only. Articles are written and published by the admin in the CMS. With no articles, the page shows the empty state.',
  },

  article: {
    by: 'By {name}',
    inThisArticle: 'In this article',
    downloadPdf: 'Download PDF',
    print: 'Print this page',
    printShort: 'Print',
    sampleNote: 'Sample text only. The final article is written by the admin in the CMS.',
    disclaimer:
      'This article is general information and is not legal advice. For your own situation, speak with a lawyer.',
    relatedAreas: 'Related practice areas',
    previous: 'Previous:',
    next: 'Next:',
  },

  experience: {
    label: 'Experience',
    heading: 'Selected matters, described without client names.',
    lead: "Each entry states the scope of our work, not the outcome. Entries are published with the client's consent.",
    filter: 'Filter',
    practiceArea: 'Practice area',
    sector: 'Sector',
    year: 'Year',
    all: 'All',
    emptyFiltered: 'No matters match these filters.',
    draftNote:
      'Sample content for layout only. The section and this page stay hidden until the CMS has one entry with client consent confirmed.',
    client: 'Client',
    challenge: 'The matter',
    approach: 'Our work',
    outcome: 'Scope',
    allMatters: 'All matters',
  },

  legal: {
    label: 'Legal',
    updated: 'Last updated: {date}',
    onThisPage: 'On this page',
    draftNote:
      'The Privacy Policy page uses this same layout. Its text must cover Law No. 27 of 2022 on personal data protection.',
  },

  notFound: {
    title: 'Page not found',
    label: 'Error 404',
    heading: 'This page does not exist.',
    lead: 'The address may be wrong, or the page may have moved. These pages may help.',
  },
};

export type Dictionary = typeof en;
