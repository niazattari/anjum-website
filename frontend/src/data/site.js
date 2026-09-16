// ---------------------------------------------------------------------------
// Global site settings.
// Every value here is intended to be admin-editable later. The Laravel
// `website_settings` table maps 1:1 onto this shape, so swapping the mock API
// for the real one requires no component changes.
// ---------------------------------------------------------------------------

export const site = {
  name: 'ANJUM',
  legalName: 'Niaz Ali Anjum',
  tagline: 'Full-stack development, engineered with AI',
  logoText: 'ANJUM',
  owner: {
    name: 'Niaz Ali Anjum',
    role: 'Full-Stack Web Developer',
    location: 'Pakistan · working with clients worldwide',
    email: 'niazattari2641@gmail.com',
    photo: null, // admin-uploadable; falls back to initials avatar
    bio: [
      'I design and build websites, custom web applications and business automation systems. I have been writing code since 2017 and work across the full stack — interface, API, database and deployment.',
      'Most of my work starts with a business problem rather than a design brief: an owner tracking orders in a notebook, a team re-keying the same data into three spreadsheets, a shop with no way to take orders online. I build the system that removes that friction.',
      'I work in React and Laravel for full applications, and in Google Apps Script when a team already lives in Google Sheets and needs a real interface on top of it.',
    ],
  },
  contact: {
    // Digits only, country code first, no + and no spaces.
    // Local 0341 7632795 → international 92 341 7632795.
    whatsapp: '923417632795',
    email: 'niazattari2641@gmail.com',
    phone: '+92 341 7632795',
    responseTime: 'Within 24 hours',
    availability: 'Mon–Sat, 10:00–19:00 PKT',
  },
  // Paste each real profile URL and flip `enabled` to true. Anything left
  // disabled simply does not render — better an absent icon than a dead link.
  social: [
    { id: 'whatsapp', label: 'WhatsApp', url: 'https://wa.me/923417632795', icon: 'MessageCircle', enabled: true },
    { id: 'email', label: 'Email', url: 'mailto:niazattari2641@gmail.com', icon: 'Mail', enabled: true },
    { id: 'facebook', label: 'Facebook', url: '', icon: 'Facebook', enabled: false },   // ← paste your Facebook profile/page URL
    { id: 'linkedin', label: 'LinkedIn', url: '', icon: 'Linkedin', enabled: false },   // ← paste your LinkedIn profile URL
    { id: 'fiverr', label: 'Fiverr', url: '', icon: 'Briefcase', enabled: false },      // ← paste your Fiverr gig/profile URL
    { id: 'github', label: 'GitHub', url: '', icon: 'Github', enabled: false },         // ← paste your GitHub profile URL
  ],
  announcement: {
    enabled: true,
    text: 'Currently accepting new projects for this quarter.',
    linkLabel: 'Start your project',
    linkUrl: '/start-project',
  },
  floatingWhatsApp: {
    enabled: true,
    message: 'Hello! I would like to discuss a website project.',
  },
  seo: {
    titleSuffix: 'ANJUM',
    defaultTitle: 'Full-Stack Development, Engineered with AI',
    defaultDescription:
      'Professional websites, custom web applications and Google Sheets business automation, built around real business outcomes.',
    keywords: [
      'web development',
      'web application development',
      'Laravel developer',
      'React developer',
      'Google Apps Script',
      'Google Sheets web app',
      'business automation',
    ],
    ogImage: '/og-image.png',
    siteUrl: 'https://example.com',
    twitterHandle: '',
  },
  // Admin panel entry point. Linked discreetly in the footer; swap `url` for
  // the real Laravel login route once the backend exists.
  admin: {
    enabled: true,
    label: 'Admin',
    url: '/admin',
  },

  legal: {
    privacyUpdated: 'January 2026',
    termsUpdated: 'January 2026',
  },
};

// Flip to false once real content replaces the seeded records. When true the UI
// shows an honest "sample content" marker so placeholder records are never
// mistaken for real client work.
export const SAMPLE_CONTENT = true;

export default site;
