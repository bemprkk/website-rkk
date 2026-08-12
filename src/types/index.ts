export interface TranslationItem {
  title: string;
  desc: string;
}

export interface TeamMember {
  id: string;
  name: string;
  roleID: string;
  roleEN: string;
  image: string;
  year?: string;
  socials?: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    instagram?: string;
  };
}

export interface GalleryItem {
  id: string;
  url: string;
  cat: string;
  title: string;
  year?: string;
}

export interface ProgramItem {
  title: string;
  desc: string;
}

// ─── Proker (Program Kerja) ───────────────────────────────────────────────────
export interface ProkerItem {
  id: string;
  namaID: string;
  namaEN: string;
  jenisID: string;
  jenisEN: string;
  descID: string;
  descEN: string;
  penanggungJawab: string;
  tanggalMulai: string;
  tanggalSelesai: string;
  durasi: string;
  status: 'upcoming' | 'ongoing' | 'done';
  foto?: string;
}

// ─── Pelatihan K3 ────────────────────────────────────────────────────────────
export interface TrainingItem {
  id: string;
  titleID: string;
  titleEN: string;
  durationID: string;
  durationEN: string;
  feeID: string;
  feeEN: string;
  certID: string;
  certEN: string;
  descID: string;
  descEN: string;
  icon: string;
  syllabus: string[];
  year: string;
  status: 'upcoming' | 'ongoing' | 'done';
}

// ─── Seminar ─────────────────────────────────────────────────────────────────
export interface SeminarItem {
  id: string;
  titleID: string;
  titleEN: string;
  date: string;
  speaker: string;
  speakerRoleID: string;
  speakerRoleEN: string;
  feeID: string;
  feeEN: string;
  platform: string;
  status: 'upcoming' | 'ongoing' | 'done';
}

// ─── Kerjasama ────────────────────────────────────────────────────────────────
export interface PartnershipItem {
  id: string;
  name: string;
  logoUrl: string;
  scopeID: string;
  scopeEN: string;
  descID: string;
  descEN: string;
  year: string;
  status: 'upcoming' | 'ongoing' | 'done';
}

// ─── Artikel ─────────────────────────────────────────────────────────────────
export interface ArticleItem {
  id: string;
  titleID: string;
  titleEN: string;
  author: string;
  date: string;
  readTimeID: string;
  readTimeEN: string;
  categoryID: string;
  categoryEN: string;
  summaryID: string;
  summaryEN: string;
  contentID: string[];
  contentEN: string[];
  scope: 'national' | 'international';
}

// ─── Prestasi ─────────────────────────────────────────────────────────────────
export interface AchievementItem {
  id: string;
  titleID: string;
  titleEN: string;
  awardee: string;
  eventID: string;
  eventEN: string;
  organizer: string;
  date: string;
  rankID: string;
  rankEN: string;
  level: 'regional' | 'national' | 'international';
  medal: 'gold' | 'silver' | 'bronze' | 'special' | 'nomination';
  imageUrl?: string;
  descID?: string;
  descEN?: string;
}

// ─── Penghargaan ──────────────────────────────────────────────────────────────
export interface AwardItem {
  id: string;
  titleID: string;
  titleEN: string;
  descID: string;
  descEN: string;
  year: string;
  category: 'institution' | 'organization' | 'student';
  imageUrl?: string;
}

// ─── Pengumuman ───────────────────────────────────────────────────────────────
export interface AnnouncementItem {
  id: string;
  titleID: string;
  titleEN: string;
  contentID: string;
  contentEN: string;
  date: string;
  urgencyID: string;
  urgencyEN: string;
  category: 'penting' | 'umum' | 'academic' | 'recruitment';
  attachmentUrl?: string;
}

// ─── Alumni ───────────────────────────────────────────────────────────────────
export interface AlumniItem {
  id: string;
  name: string;
  tahun: string;
  kuliah: string;
  kerja: string;
  foto?: string;
}

export interface TranslationSet {
  nav: {
    home: string;
    profile: string;
    history: string;
    mission: string;
    programs: string;
    gallery: string;
    alumni: string;
    team: string;
    contact: string;
    accreditation: string;
    event: string;
    news: string;
    training: string;
    seminar: string;
    collaboration: string;
    articles: string;
    achievements: string;
    awards: string;
    announcements: string;
  };
  hero: {
    badge: string;
    title1: string;
    titleGradient: string;
    desc: string;
    btnPrimary: string;
    btnGhost: string;
    stats: {
      architects: string;
      architectsVal: string;
      deployments: string;
      deploymentsVal: string;
      alliances: string;
      alliancesVal: string;
    };
  };
  about: {
    subtitle: string;
    title: string;
    titleGradient: string;
    desc: string;
    reliability: string;
    reliabilityVal: string;
    features: TranslationItem[];
  };
  programs: {
    subtitle: string;
    title: string;
    titleGradient: string;
    desc: string;
    items: ProgramItem[];
    action: string;
    footerCta: string;
  };
  gallery: {
    subtitle: string;
    title: string;
    titleGradient: string;
    desc: string;
    footerCta: string;
  };
  team: {
    subtitle: string;
    title: string;
    titleGradient: string;
    subtitleTeam: string;
    desc: string;
    footerCta: string;
  };
  footer: {
    ctaTitle: string;
    ctaGradient: string;
    ctaDesc: string;
    ctaBtn: string;
    brandDesc: string;
    col1: string;
    col2: string;
    col3: string;
    status: string;
    res1: string;
    res2: string;
    res3: string;
    res4: string;
    copyright: string;
    privacy: string;
    terms: string;
    github?: string;
    instagram?: string;
    tiktok?: string;
  };
  home: {
    mengenalSubtitle: string;
    mengenalTitle: string;
    mengenalTitleGradient: string;
    mengenalDesc: string;
    mengenalDesc2: string;
    mengenalBadge: string;
    values: TranslationItem[];
    programSubtitle: string;
    programTitle: string;
    programTitleGradient: string;
    highlights: TranslationItem[];
    faqSubtitle: string;
    faqTitle: string;
    faqTitleGradient: string;
    faqDesc: string;
    faqItems: { q: string; a: string }[];
    ctaTitle: string;
    ctaTitleGradient: string;
    ctaDesc: string;
    ctaBtn: string;
  };
  alumni: {
    subtitle: string;
    title: string;
    titleGradient: string;
    desc: string;
    footerCta: string;
  };
  contact: {
    subtitle: string;
    title: string;
    titleGradient: string;
    desc: string;
    form: {
      title: string;
      subtitle: string;
      nameLabel: string;
      emailLabel: string;
      phoneLabel: string;
      subjectLabel: string;
      messageLabel: string;
      submitBtn: string;
      success: string;
      successDesc: string;
    };
  };
  history: {
    subtitle: string;
    title: string;
    titleGradient: string;
    p1: string;
    p2: string;
    timeline: { year: string; title: string; desc: string }[];
  };
  accreditation: {
    subtitle: string;
    title: string;
    titleGradient: string;
    desc: string;
    statusLabel: string;
    statusVal: string;
    skLabel: string;
    skVal: string;
    expLabel: string;
    expVal: string;
  };
}

export interface WebsiteContent {
  translations: {
    ID: TranslationSet;
    EN: TranslationSet;
  };
  images: {
    hero: string;
    heroVideo?: string;
    about: string;
    team: TeamMember[];
    gallery: GalleryItem[];
    accreditationImage?: string;
  };
  stats: {
    cash: string;
    members: string;
    projects: string;
    board: string;
    alumni: string;
    training: string;
  };
  contact?: {
    lokasi?: string;
    jamAktif?: string;
    email?: string;
    instagram?: string;
    instagramUrl?: string;
    mapEmbedUrl?: string;
    mapsUrl?: string;
  };
  // Dynamic data previously hardcoded in pages
  proker: ProkerItem[];
  trainings: TrainingItem[];
  seminars: SeminarItem[];
  partnerships: PartnershipItem[];
  articles: ArticleItem[];
  achievements: AchievementItem[];
  awards: AwardItem[];
  announcements: AnnouncementItem[];
  alumni: AlumniItem[];
}
