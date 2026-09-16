// ---------------------------------------------------------------------------
// Portfolio projects and case studies.
//
// REAL WORK. Every entry below is a project Niaz has actually built, described
// from its own source code, README and screenshots. Nothing here is invented:
// where something could not be verified it is either left out or explicitly
// marked as in development.
//
// Screenshots live in public/projects/<slug>/. Projects without photography
// fall back to the generated ProjectVisual, which is why each record still
// carries a `visual` descriptor.
// ---------------------------------------------------------------------------

export const portfolioCategories = [
  { id: 'all', name: 'All work' },
  { id: 'management-systems', name: 'Management systems' },
  { id: 'business-websites', name: 'Business websites' },
  { id: 'ecommerce', name: 'E-commerce' },
  { id: 'web-applications', name: 'Web applications' },
  { id: 'sheets-web-apps', name: 'Google Sheets web apps' },
  { id: 'dashboards', name: 'Dashboards' },
];

export const projects = [
  // -------------------------------------------------------------------------
  {
    id: 1,
    slug: 'librarypro-library-management',
    title: 'LibraryPro — library management system',
    category: 'management-systems',
    categoryName: 'Management systems',
    clientType: 'Schools, colleges and public libraries',
    year: 2026,
    status: 'Live',
    featured: true,
    isSample: false,
    cover: '/projects/librarypro/cover.webp',
    visual: { kind: 'app', from: '#2F6FED', to: '#14B8A6' },
    short:
      'A full library system — catalogue, members, issuing, returns, fines and reports — running on a Google Sheet instead of a rented database server.',
    problem:
      'Small libraries run on paper registers and a spreadsheet. Nobody can answer simple questions quickly: who has this book, which books are overdue, what is owed in fines, what should be reordered. Commercial library software is priced for institutions with an IT budget, and most of it assumes a server somebody has to maintain.',
    solution:
      'A React application with twenty-three screens sitting on a Google Apps Script API, with the library’s own Google Sheet as the database. Issuing and returning are two-field operations, fines calculate themselves from the due date, and every report is generated from live data. Because the data lives in the library’s own Google account there is no hosting bill and no vendor holding the records.',
    features: [
      'Book catalogue with authors, publishers, categories and copy tracking',
      'Member records with borrowing history and a self-service member portal',
      'Issue and return in two fields, with automatic due-date calculation',
      'Fines calculated from overdue days, with payment recording',
      'Reservations and hold queues',
      'Reports: borrowing trends, inventory, overdue books, fines collected',
      'Bulk import and export via CSV and Excel',
      'QR codes for spine labels and member cards',
      'User accounts with roles, plus an activity log of every change',
    ],
    technologies: ['React', 'Vite', 'Tailwind CSS', 'Google Apps Script', 'Google Sheets', 'Recharts', 'Playwright'],
    challenges:
      'Apps Script allows only a limited number of calls and each one is slow, so a screen that innocently asks for books, members and loans separately feels broken. Reads are batched into single round trips and cached in a context layer, so navigating between screens costs nothing and only a genuine change triggers a write.',
    results: [
      'Catalogue, members, loans and fines held in one system rather than three registers',
      'Overdue and inventory reports produced on demand instead of counted by hand',
      'No server and no database subscription — the library keeps its own data',
    ],
    duration: 'Built and documented, with a 20-case test plan',
    liveUrl: null,
    githubUrl: null,
    gallery: [
      { src: '/projects/librarypro/dashboard.webp', caption: 'Dashboard — loans out, overdue items and today’s activity' },
      { src: '/projects/librarypro/catalogue.webp', caption: 'Book catalogue with search, filters and copy availability' },
      { src: '/projects/librarypro/issue.webp', caption: 'Issuing a book — member and copy, due date calculated' },
      { src: '/projects/librarypro/reports.webp', caption: 'Reports and analytics — borrowing trends and inventory' },
    ],
  },

  // -------------------------------------------------------------------------
  {
    id: 2,
    slug: 'aurora-hotel-management',
    title: 'Aurora HMS — hotel management system',
    category: 'sheets-web-apps',
    categoryName: 'Google Sheets web apps',
    clientType: 'Independent hotels and guest houses',
    year: 2026,
    status: 'Live',
    featured: true,
    isSample: false,
    visual: { kind: 'app', from: '#7C5CFC', to: '#2F6FED' },
    short:
      'Four connected applications — public booking, front desk, housekeeping and admin — all reading and writing one Google Sheet.',
    problem:
      'An independent hotel juggles a booking diary, a whiteboard for room status, a separate spreadsheet for rates, and whatever the front desk remembers. The same room gets sold twice, housekeeping finishes a room nobody marks clean, and nobody can say what last month actually earned.',
    solution:
      'One system split into the four jobs that actually exist. Guests book on the public site; the front desk sees arrivals, departures and in-house guests; housekeeping works a board that updates room status live; the admin panel controls rates, seasons, content and reports. Rates, seasonal pricing and the analytics benchmarks were derived from a real hotel bookings dataset of 119,390 rows rather than guessed.',
    features: [
      'Public booking site with availability search and rate display',
      'Front-desk application: arrivals, departures, in-house, walk-ins',
      'Housekeeping board with live room status',
      'Admin panel for rooms, rates, seasons, content and users',
      'Seasonal and occupancy-based pricing rules',
      'Billing and folio management',
      'Reports and occupancy analytics benchmarked against real hotel data',
      'Bulk import and export of bookings',
    ],
    technologies: ['Google Apps Script', 'Google Sheets', 'JavaScript', 'HTML', 'CSS', 'clasp'],
    challenges:
      'Four applications writing to one spreadsheet will overwrite each other the moment two people work at once. Writes go through a single scripted entry point that locks the sheet for the duration of a change, so a booking made at the front desk and one made on the public site cannot claim the same room.',
    results: [
      'Booking, front desk, housekeeping and reporting in one connected system',
      'Room status visible to everyone at once instead of on a whiteboard',
      'Pricing and occupancy targets grounded in a real 119,390-row dataset',
    ],
    duration: 'Deployable in about 15 minutes from the included guide',
    liveUrl: null,
    githubUrl: null,
    gallery: [],
  },

  // -------------------------------------------------------------------------
  {
    id: 3,
    slug: 'isk-technologies-website',
    title: 'ISK Technologies — corporate website and store',
    category: 'business-websites',
    categoryName: 'Business websites',
    clientType: 'Engineering and procurement company',
    year: 2026,
    status: 'Live',
    featured: true,
    isSample: false,
    cover: '/projects/isk/cover.webp',
    visual: { kind: 'landing', from: '#2F6FED', to: '#22C55E' },
    short:
      'A twenty-four page corporate site with a shop, a quote system and a password-protected admin dashboard — delivered client work.',
    problem:
      'The company had no web presence that matched what it actually sold. Enquiries arrived by phone, product information lived in PDFs emailed on request, and there was no way for a buyer to see the range or ask for a quote without a conversation.',
    solution:
      'A full corporate site: services and service detail pages, industries served, resources, projects, and the legal pages a business buyer expects to find. Alongside it, a shop with cart and checkout, a structured quote request flow, and an admin dashboard behind a password where the client manages products, orders and enquiries themselves. Everything is stored in Google Sheets, so the client can read their own data without learning a database.',
    features: [
      'Twenty-four pages: services, four service detail pages, industries, projects, resources',
      'Shop with product catalogue, cart and checkout',
      'Quote request system feeding straight into the admin dashboard',
      'Password-protected admin area for products, orders and submissions',
      'Full legal set: privacy, terms, cookies, returns, shipping, disclaimer',
      'Responsive down to 760px, rebuilt after client review',
      'Signed-in confirmation on every form submission',
    ],
    technologies: ['HTML5', 'CSS', 'JavaScript', 'Google Apps Script', 'Google Sheets', 'Hostinger'],
    challenges:
      'The first delivery worked but felt stiff on phones, and the login modal and cart drawer broke under 760px. The second round rebuilt those breakpoints, replaced placeholder imagery with real product photography of the connectors and cable assemblies, and added a confirmation state to every form so a buyer never wonders whether a submission went through.',
    results: [
      'A public catalogue buyers can browse without contacting anyone first',
      'Quotes and orders captured in one place rather than across phone and email',
      'The client updates products and reads orders without developer involvement',
    ],
    duration: 'Delivered, then a revision round after client review',
    liveUrl: null,
    githubUrl: null,
    gallery: [
      { src: '/projects/isk/pages.webp', caption: 'Home, services and shop' },
      { src: '/projects/isk/responsive.webp', caption: 'The same pages across desktop, tablet and phone' },
      { src: '/projects/isk/contact.webp', caption: 'Contact and quote request' },
    ],
  },

  // -------------------------------------------------------------------------
  {
    id: 4,
    slug: 'scholaris-school-management',
    title: 'Scholaris — school management and ERP platform',
    category: 'management-systems',
    categoryName: 'Management systems',
    clientType: 'School groups running several campuses',
    year: 2026,
    status: 'Live',
    featured: true,
    isSample: false,
    cover: '/projects/scholaris/cover.webp',
    visual: { kind: 'dashboard', from: '#2F6FED', to: '#7C5CFC' },
    short:
      'A multi-campus school platform: students, attendance, examinations and report cards, and fees — with each campus’s data isolated from the others.',
    problem:
      'A school group running several campuses ends up running several systems. Each campus keeps its own registers and its own fee book, the head office cannot see across them, and a student who transfers between campuses is entered twice.',
    solution:
      'One deployment serving every campus, with data isolation so a campus only ever sees its own records while the group sees all of them. Five role types — administrator, principal, teacher and others — each land on the screens their job needs rather than a single dashboard everyone has to navigate around.',
    features: [
      'Multi-campus in one deployment, with data isolated per campus',
      'Five role types with their own permissions and landing screens',
      'Student records and enrolment management',
      'Attendance recording and history',
      'Examinations, marks and generated report cards',
      'Fees and finance tracking',
    ],
    technologies: ['Web application'],
    challenges:
      'Multi-tenancy is the whole difficulty: every query has to be scoped to a campus, and a single missed scope leaks one school’s records into another’s screen. Isolation is enforced at the data layer rather than in each screen, so a new feature inherits it instead of having to remember it.',
    results: [
      'One system across campuses instead of one per campus',
      'Head office able to see across the group',
      'Attendance, exams and fees recorded in the same place as the student record',
    ],
    duration: '1–3 months',
    liveUrl: null,
    githubUrl: null,
    gallery: [
      { src: '/projects/scholaris/students.webp', caption: 'Student management' },
      { src: '/projects/scholaris/attendance.webp', caption: 'Attendance recording' },
      { src: '/projects/scholaris/exams.webp', caption: 'Examinations and report cards' },
      { src: '/projects/scholaris/fees.webp', caption: 'Fees and finance' },
    ],
  },

  // -------------------------------------------------------------------------
  {
    id: 5,
    slug: 'al-qamar-pos-inventory',
    title: 'Al Qamar Shop — POS and inventory system',
    category: 'sheets-web-apps',
    categoryName: 'Google Sheets web apps',
    clientType: 'Retail shops',
    year: 2026,
    status: 'Live',
    featured: true,
    isSample: false,
    visual: { kind: 'table', from: '#F59E0B', to: '#EC4899' },
    short:
      'Checkout, stock control and supplier deliveries for a retail shop — barcode scanning, printed invoices, and a Google Sheet as the till roll.',
    problem:
      'A shop selling hundreds of lines has no idea what it holds. Stock is counted when something runs out, prices live in the owner’s head, and the day’s takings are whatever is in the drawer at closing. Retail POS software wants a monthly fee and a terminal.',
    solution:
      'A point-of-sale application that runs in a browser on whatever device is at the counter, with the shop’s Google Sheet as the database. Items are scanned or searched, the invoice prints or goes out over WhatsApp, and stock decrements as it sells. Incoming deliveries are recorded against suppliers, and the dashboard shows what sold and what is about to run out.',
    features: [
      'Checkout with barcode scanning and quick item search',
      'Invoice and receipt printing, plus PDF and WhatsApp sharing',
      'Stock levels updated on every sale',
      'Supplier and incoming-delivery recording',
      'Low-stock alerts',
      'Sales dashboard with daily and period reporting',
      'Roles: owner, cashier and viewer',
      'Audit log of every change, with daily backups',
    ],
    technologies: ['Google Apps Script', 'Google Sheets', 'JavaScript', 'HTML', 'CSS', 'Chart.js'],
    challenges:
      'A till cannot wait for the network. Sales are held locally and written to the sheet in batches, so scanning stays instant even on a slow connection, and the audit log records the order things actually happened in rather than the order they synced.',
    results: [
      'Stock levels that reflect what is actually on the shelf',
      'Printed invoices instead of a handwritten slip',
      'No monthly POS subscription and no dedicated terminal',
    ],
    duration: 'Shipped with a user manual and sample data',
    liveUrl: null,
    githubUrl: null,
    gallery: [],
  },

  // -------------------------------------------------------------------------
  {
    id: 6,
    slug: 'edutrack-pro',
    title: 'EduTrack Pro — student grade management',
    category: 'dashboards',
    categoryName: 'Dashboards',
    clientType: 'Schools and academies',
    year: 2026,
    status: 'In development',
    featured: true,
    isSample: false,
    cover: '/projects/edutrack/cover.webp',
    visual: { kind: 'dashboard', from: '#7C5CFC', to: '#22C55E' },
    short:
      'A grading dashboard for teachers: marks entry, automatic grading, live merit rankings and analytics — with Google Sheets as the database.',
    problem:
      'Schools keep marks in spreadsheets, then rebuild the same work by hand every term: totals, percentages, grades, merit lists and report cards. The numbers already exist; what is missing is anything that turns them into an answer. Ranking a year group means sorting a sheet and hoping nobody typed over a formula.',
    solution:
      'A dashboard that sits on top of the school’s existing Google Sheet. Marks are entered through a validated form and the grade, percentage and rank recalculate instantly, writing straight back to the sheet. Rankings, subject analytics and the merit list are generated from live data rather than rebuilt each term.',
    features: [
      'Quick marks entry with grade and percentage calculated as you type',
      'Auto-graded student records, sortable and searchable across the full roster',
      'Dashboard overview: total students, class average, pass rate, top achievers',
      'Subject-wise class averages and grade distribution',
      'Performance trend across the academic year',
      'Subject × class heatmap identifying weak areas per section',
      'Automated insights flagging weak subjects and students needing attention',
      'Merit list with podium view and tie-breaking by total score',
      'Report cards and CSV / PDF export',
      'Live two-way sync with Google Sheets',
    ],
    technologies: ['TypeScript', 'Chart.js', 'Google Apps Script', 'Google Sheets', 'Vercel'],
    challenges:
      'Keeping the interface responsive while every keystroke triggers a recalculation and a write back to Sheets. Marks are held in local state and reconciled with the sheet in batches, so entry never blocks on the network, and rank recalculation runs over the cached roster rather than re-reading the spreadsheet.',
    results: [
      'Grade, percentage and rank calculated on entry instead of at term end',
      'Merit list and subject analytics generated from live data',
      'The school keeps its data in its own Google account',
    ],
    duration: 'In active development',
    liveUrl: null,
    githubUrl: null,
    gallery: [
      { src: '/projects/edutrack/dashboard.webp', caption: 'Dashboard overview — KPIs, subject averages and grade distribution' },
      { src: '/projects/edutrack/students.webp', caption: 'Student records and quick marks entry, auto-saved to Sheets' },
      { src: '/projects/edutrack/analytics.webp', caption: 'Performance analytics — year trend, heatmap and automated insights' },
      { src: '/projects/edutrack/rankings.webp', caption: 'Rankings — term toppers podium and the full merit list' },
    ],
  },

  // -------------------------------------------------------------------------
  {
    id: 7,
    slug: 'noor-accessories-store',
    title: 'Noor Accessories — bilingual online store',
    category: 'ecommerce',
    categoryName: 'E-commerce',
    clientType: 'Online fashion retailer',
    year: 2026,
    status: 'Live',
    featured: true,
    isSample: false,
    visual: { kind: 'storefront', from: '#EC4899', to: '#7C5CFC' },
    short:
      'A jewellery and accessories storefront in English and Urdu, with right-to-left layout and an admin dashboard behind it.',
    problem:
      'Orders arrived through Instagram and WhatsApp messages and were copied into a notebook. There was no catalogue customers could browse, no reliable record of what had shipped, and nothing at all for the half of the customer base that reads Urdu more comfortably than English.',
    solution:
      'A storefront with the full catalogue, cart, wishlist and customer profiles, built bilingual from the start — over two hundred interface strings in both English and Urdu, and a right-to-left stylesheet rather than a mirrored hack. A separate password-protected dashboard handles products, orders and reviews, with everything stored in a Google Sheet the owner can read directly.',
    features: [
      'Full product catalogue with categories and product detail',
      'Cart, wishlist and customer profiles',
      'English and Urdu throughout, with a proper right-to-left layout',
      'Password-protected admin dashboard for products, orders and reviews',
      'Customer reviews',
      'Orders stored in Google Sheets, readable without any developer',
    ],
    technologies: ['HTML5', 'CSS', 'JavaScript', 'Google Apps Script', 'Google Sheets', 'Vercel'],
    challenges:
      'Right-to-left is not a mirror image. Prices, phone numbers and product codes stay left-to-right inside Urdu sentences, and the cart drawer has to open from the other side without the layout jumping when the language is switched mid-session. Direction is handled in its own stylesheet so the two languages never fight each other.',
    results: [
      'A browsable catalogue instead of a chat thread',
      'Orders captured once, at the point of sale',
      'Urdu-speaking customers served in their own language and reading direction',
    ],
    duration: 'Built and deployed',
    liveUrl: null,
    githubUrl: null,
    gallery: [],
  },

  // -------------------------------------------------------------------------
  {
    id: 8,
    slug: 'hostel-management-system',
    title: 'Hostel management system',
    category: 'web-applications',
    categoryName: 'Web applications',
    clientType: 'Student hostels',
    year: 2026,
    status: 'Live',
    featured: true,
    isSample: false,
    visual: { kind: 'app', from: '#14B8A6', to: '#2F6FED' },
    short:
      'Room booking and hostel administration: students register and book, staff manage rooms, bookings, residents and messages.',
    problem:
      'Hostel allocation runs on a waiting list and a phone. Students cannot see what is free, staff cannot see who applied first, and the room chart and the payment record are two different pieces of paper that disagree.',
    solution:
      'A booking application with two sides. Students register, browse rooms, book, and see their own booking history and profile. Staff work an admin area covering rooms, bookings, users and enquiry messages. Sessions are stored server-side, passwords are hashed, and the whole thing is rate-limited and security-headed rather than left open.',
    features: [
      'Student registration and login with hashed passwords',
      'Room browsing and booking',
      'Student profile and booking history',
      'Admin area: rooms, bookings, users and messages',
      'Email notifications',
      'PDF generation for booking documents',
      'Server-side sessions, rate limiting and security headers',
    ],
    technologies: ['Node.js', 'Express', 'MongoDB', 'Mongoose', 'EJS', 'Bootstrap 5', 'Vercel'],
    challenges:
      'A booking system is mostly the unhappy paths: two students booking the last room in the same second, a session expiring mid-booking, someone refreshing the confirmation page. Validation runs server-side on every route rather than in the form, so none of those produce a half-made booking.',
    results: [
      'Room availability visible to students instead of asked for',
      'Applications recorded in order, with a booking history per student',
      'Rooms, residents and enquiries managed in one admin area',
    ],
    duration: 'Built; some admin screens still being finished',
    liveUrl: null,
    githubUrl: null,
    gallery: [],
  },

  // -------------------------------------------------------------------------
  {
    id: 9,
    slug: 'registrar-console',
    title: 'Registrar Console — student analytics',
    category: 'dashboards',
    categoryName: 'Dashboards',
    clientType: 'College registrar offices',
    year: 2026,
    status: 'Live',
    featured: false,
    isSample: false,
    visual: { kind: 'charts', from: '#F59E0B', to: '#2F6FED' },
    short:
      'A registrar-facing analytics console covering identity, academic record and digital engagement — the whole application in one HTML file.',
    problem:
      'A registrar’s office holds everything it needs to spot a student in trouble and can see none of it. Grades sit in one export, attendance in another, and online activity in a third. By the time a pattern is obvious, the term is over.',
    solution:
      'One console with three views over the same student population: who they are, how they are performing, and how they are engaging. GPA, attendance rate, course grades, submission rates and an engagement index sit together, and the high-risk list falls out of the combination rather than any single number. It is built as a single self-contained HTML file with the dataset embedded, so it opens from a USB stick with nothing installed.',
    features: [
      'Identity view — student records and demographics',
      'Academic view — GPA, course grades and attendance rate',
      'Engagement view — submission rates and an engagement index',
      'High-risk student list derived from combined signals',
      'Light and dark themes',
      'Runs from a single file with no server and no install',
    ],
    technologies: ['HTML5', 'CSS', 'JavaScript', 'Excel'],
    challenges:
      'Embedding a full dataset in the page makes it portable but makes it heavy. Rendering is done from a prepared index built once at load rather than re-filtering the raw rows on every view change, so switching between the three views stays instant despite everything living in memory.',
    results: [
      'Academic and engagement signals read side by side rather than in three exports',
      'A high-risk list produced during the term, not after it',
      'Runs anywhere, with nothing to install and nothing to connect',
    ],
    duration: 'Complete',
    liveUrl: null,
    githubUrl: null,
    gallery: [],
  },

  // -------------------------------------------------------------------------
  {
    id: 10,
    slug: 'payflow-payroll-platform',
    title: 'PayFlow — multi-tenant payroll platform',
    category: 'web-applications',
    categoryName: 'Web applications',
    clientType: 'Payroll bureaus and multi-company groups',
    year: 2026,
    status: 'In development',
    featured: false,
    isSample: false,
    visual: { kind: 'document', from: '#22C55E', to: '#2F6FED' },
    short:
      'A payroll platform where salary rules are configuration rather than code, and every payslip freezes the inputs that produced it.',
    problem:
      'Payroll software hard-codes the rules of the country and the year it was written in. When a tax band moves, last year’s payslips quietly start reproducing different numbers — which is exactly the thing an audit asks you to prove cannot happen.',
    solution:
      'Salary components, tax tables and deduction rules are data, not code, so a new rule is a configuration change rather than a release. Each payslip stores the inputs that produced it, so reprinting one from two years ago gives the figures that were actually paid. Tenants are isolated at the schema level, with roles and permissions enforced beneath every query.',
    features: [
      'Multi-tenant with isolation enforced at the data layer',
      'Roles and permissions across the platform',
      'Salary components and deduction rules held as configuration',
      'Payslips that freeze their own inputs for reproducibility',
      'Seeded demo data and an automated test suite',
    ],
    technologies: ['TypeScript', 'Node.js', 'Express', 'MySQL', 'Drizzle ORM', 'React', 'Vite', 'Tailwind CSS'],
    challenges:
      'Making rules configurable without making them unreadable. The rule engine is deliberately narrow — a fixed set of component types that compose — because a general expression language would make payroll impossible to audit.',
    results: [
      'Schema, authentication, roles and tenant isolation complete',
      'Automated test suite running against seeded data',
      'The calculation engine is the next milestone — not yet built',
    ],
    duration: 'In active development',
    liveUrl: null,
    githubUrl: null,
    gallery: [],
  },
];

// Helpers the data layer expects. Kept here so every lookup goes through the
// same definition of "related" rather than each page inventing its own.
export const getProjectBySlug = (slug) => projects.find((p) => p.slug === slug);

export const getFeaturedProjects = (limit = 6) => projects.filter((p) => p.featured).slice(0, limit);

export const getRelatedProjects = (project, limit = 3) =>
  projects
    .filter((p) => p.slug !== project.slug && p.category === project.category)
    .slice(0, limit);

export default projects;
