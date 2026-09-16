// ---------------------------------------------------------------------------
// Source-code products.
//
// Complete, working applications sold as a download: the buyer gets the whole
// repository, not a demo or a theme. Everything listed here is a system Niaz
// has already built and runs — the portfolio entry and the product are the same
// piece of software.
//
// There is no payment gateway wired up. A purchase starts as a message; the
// package and the invoice follow. That is deliberate — taking card details
// needs a real merchant account, and pretending otherwise would be worse than
// an honest handover.
// ---------------------------------------------------------------------------

export const licences = [
  {
    id: 'single',
    name: 'Single business',
    blurb: 'Use it in one business, on one live deployment. Modify it freely.',
  },
  {
    id: 'extended',
    name: 'Extended',
    blurb: 'Deploy for clients, or resell it as part of work you deliver.',
  },
];

export const sourceProducts = [
  {
    id: 1,
    slug: 'librarypro-source',
    name: 'LibraryPro — library management system',
    // Matches a real portfolio entry, so buyers can read the case study first.
    projectSlug: 'librarypro-library-management',
    tagline: 'A complete library system with no server to rent.',
    summary:
      'Twenty-three screens covering catalogue, members, issuing, returns, fines, reservations and reports. React front end, Google Apps Script API, Google Sheets as the database — so the running cost after purchase is zero.',
    stack: ['React', 'Vite', 'Tailwind CSS', 'Google Apps Script', 'Google Sheets'],
    includes: [
      'Full front-end source (React + Vite + Tailwind)',
      'Apps Script backend — 12 modules, with its own test suite',
      'Setup guide, deployment guide and troubleshooting notes',
      'A 20-case test plan',
      'Sample data: a 70-book seeded inventory',
    ],
    setup: 'About 45 minutes, following the included setup guide.',
    cover: '/projects/librarypro/cover.webp',
    accent: '#2F6FED',
    featured: true,
    // Prices are set by you in the admin panel. Left null so nothing incorrect
    // is published before you decide.
    price: null,
    currency: 'USD',
  },
  {
    id: 2,
    slug: 'aurora-hms-source',
    name: 'Aurora HMS — hotel management system',
    projectSlug: 'aurora-hotel-management',
    tagline: 'Booking site, front desk, housekeeping and admin in one package.',
    summary:
      'Four connected applications sharing one Google Sheet. Includes the seasonal pricing rules and analytics benchmarks derived from a real 119,390-row hotel bookings dataset.',
    stack: ['Google Apps Script', 'Google Sheets', 'JavaScript', 'HTML', 'CSS'],
    includes: [
      '21 Apps Script modules and 10 interface files',
      'Public booking site, front-desk app, housekeeping board, admin panel',
      'A 15-minute deployment guide',
      'clasp configuration for local development',
      'Import and export tooling for existing bookings',
    ],
    setup: 'About 15 minutes, following the included deployment guide.',
    cover: null,
    accent: '#7C5CFC',
    featured: true,
    price: null,
    currency: 'USD',
  },
  {
    id: 3,
    slug: 'al-qamar-pos-source',
    name: 'Al Qamar — POS and inventory system',
    projectSlug: 'al-qamar-pos-inventory',
    tagline: 'A shop till that runs in a browser and costs nothing to run.',
    summary:
      'Checkout with barcode scanning, printed and WhatsApp invoices, live stock levels, supplier deliveries, low-stock alerts and a sales dashboard. Roles for owner, cashier and viewer, with an audit log and daily backups.',
    stack: ['Google Apps Script', 'Google Sheets', 'JavaScript', 'Chart.js'],
    includes: [
      'Complete Apps Script source — checkout, inventory, reports',
      'Interface files and stylesheets',
      'User manual written for shop staff, not developers',
      'Four seed CSVs of sample data',
    ],
    setup: 'About 30 minutes, following the included user manual.',
    cover: null,
    accent: '#F59E0B',
    featured: true,
    price: null,
    currency: 'USD',
  },
  {
    id: 4,
    slug: 'hostel-management-source',
    name: 'Hostel management system',
    projectSlug: 'hostel-management-system',
    tagline: 'Room booking with a real login system behind it.',
    summary:
      'Student registration and login, room browsing and booking, booking history, and an admin area for rooms, bookings, users and messages. Node and MongoDB, with sessions, hashed passwords, rate limiting and security headers already in place.',
    stack: ['Node.js', 'Express', 'MongoDB', 'EJS', 'Bootstrap 5'],
    includes: [
      'Full Express application in an MVC layout',
      'Admin seeding script',
      'Vercel deployment configuration',
      'Email and PDF generation already wired up',
    ],
    setup: 'About 30 minutes, plus a MongoDB connection string.',
    cover: null,
    accent: '#14B8A6',
    featured: false,
    price: null,
    currency: 'USD',
  },
];

export default sourceProducts;
