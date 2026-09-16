// Shape of the project requirement submission. Mirrors the Laravel
// `project_requests` table plus its related tables (features, pages,
// references, files) so the POST payload maps straight onto the backend.

export const emptyRequest = {
  // Step 1 — who you are
  fullName: '',
  email: '',
  whatsapp: '',
  country: '',
  city: '',
  preferredContact: 'whatsapp',

  // Step 2 — what you need
  projectTypes: [],

  // Step 3 — your business
  businessName: '',
  industry: '',
  businessDescription: '',
  targetAudience: '',
  businessLocation: '',
  existingWebsite: '',
  socialLinks: '',

  // Step 4 — requirements
  pageCount: '',
  pages: [],
  customPages: '',
  features: [],

  // Step 5 — design
  hasLogo: '',
  hasBrandColors: '',
  brandColors: '',
  designStyles: [],
  referenceSites: ['', '', ''],
  referenceNotes: '',
  files: [],

  // Step 6 — practicalities
  contentReadiness: '',
  contentAssets: [],
  hasDomain: '',
  domainName: '',
  hasHosting: '',
  hostingProvider: '',
  budget: '',
  timeline: '',
  projectDescription: '',
  referralSource: '',

  // Meta
  consent: false,
};

export const steps = [
  { id: 1, key: 'contact', title: 'Your details', short: 'Details', icon: 'UserSquare' },
  { id: 2, key: 'type', title: 'Project type', short: 'Type', icon: 'Boxes' },
  { id: 3, key: 'business', title: 'Your business', short: 'Business', icon: 'Building2' },
  { id: 4, key: 'requirements', title: 'Requirements', short: 'Features', icon: 'ListChecks' },
  { id: 5, key: 'design', title: 'Design & references', short: 'Design', icon: 'Paintbrush' },
  { id: 6, key: 'practical', title: 'Budget & timeline', short: 'Budget', icon: 'Wallet' },
  { id: 7, key: 'review', title: 'Review & submit', short: 'Review', icon: 'CheckCircle2' },
];

const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);

/** Per-step validation. Returns a field → message map (empty means valid). */
export function validateStep(step, v) {
  const e = {};

  if (step === 1) {
    if (!v.fullName.trim()) e.fullName = 'Please enter your name';
    if (!v.email.trim()) e.email = 'Please enter your email';
    else if (!isEmail(v.email)) e.email = 'That email address does not look right';
    if (!v.whatsapp.trim()) e.whatsapp = 'A WhatsApp number is how you will get the fastest reply';
    else if (v.whatsapp.replace(/\D/g, '').length < 8) e.whatsapp = 'That number looks too short';
    if (!v.country.trim()) e.country = 'Please enter your country';
  }

  if (step === 2 && v.projectTypes.length === 0) {
    e.projectTypes = 'Choose at least one — you can select more than one';
  }

  if (step === 3) {
    if (!v.businessName.trim()) e.businessName = 'Please enter your business or project name';
    if (!v.industry) e.industry = 'Please choose an industry';
    if (!v.businessDescription.trim()) e.businessDescription = 'A sentence or two about what you do';
    else if (v.businessDescription.trim().length < 20) e.businessDescription = 'A little more detail helps';
  }

  if (step === 6) {
    if (!v.budget) e.budget = 'Choose a range — an honest estimate is fine';
    if (!v.timeline) e.timeline = 'When do you need this by?';
    if (!v.projectDescription.trim()) e.projectDescription = 'Describe what you want built';
    else if (v.projectDescription.trim().length < 30) e.projectDescription = 'Please add a bit more detail (at least 30 characters)';
  }

  if (step === 7 && !v.consent) {
    e.consent = 'Please confirm before submitting';
  }

  return e;
}

/**
 * Builds the API payload from wizard state.
 *
 * `files` stays as real File objects — the API layer turns the payload into
 * FormData when a backend is connected, and falls back to recording names only
 * when running on the bundled sample data.
 */
export function toPayload(v) {
  return {
    ...v,
    referenceSites: v.referenceSites.filter((url) => url.trim()),
    submittedAt: new Date().toISOString(),
  };
}
