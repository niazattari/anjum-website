// All option sets for the project requirement wizard.
// Admin-editable in the Laravel build (budget bands especially).

export const projectTypes = [
  { id: 'business-website', label: 'Business website', icon: 'Building2', group: 'Websites' },
  { id: 'corporate-website', label: 'Corporate website', icon: 'Landmark', group: 'Websites' },
  { id: 'portfolio-website', label: 'Portfolio website', icon: 'UserSquare', group: 'Websites' },
  { id: 'ecommerce', label: 'E-commerce store', icon: 'ShoppingBag', group: 'Websites' },
  { id: 'blog', label: 'Blog / magazine', icon: 'Newspaper', group: 'Websites' },
  { id: 'landing-page', label: 'Landing page', icon: 'MousePointerClick', group: 'Websites' },
  { id: 'web-application', label: 'Web application', icon: 'AppWindow', group: 'Applications' },
  { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard', group: 'Applications' },
  { id: 'management-system', label: 'Management system', icon: 'Database', group: 'Applications' },
  { id: 'custom-software', label: 'Custom software', icon: 'Puzzle', group: 'Applications' },
  { id: 'sheets-web-app', label: 'Google Sheets web app', icon: 'Table2', group: 'Automation' },
  { id: 'apps-script', label: 'Google Apps Script work', icon: 'Braces', group: 'Automation' },
  { id: 'automation', label: 'Business automation', icon: 'Workflow', group: 'Automation' },
  { id: 'redesign', label: 'Website redesign', icon: 'Paintbrush', group: 'Existing site' },
  { id: 'maintenance', label: 'Maintenance & support', icon: 'Wrench', group: 'Existing site' },
  { id: 'other', label: 'Something else', icon: 'CircleHelp', group: 'Existing site' },
];

export const contactMethods = [
  { id: 'whatsapp', label: 'WhatsApp', icon: 'MessageCircle' },
  { id: 'email', label: 'Email', icon: 'Mail' },
  { id: 'phone', label: 'Phone call', icon: 'Phone' },
  { id: 'video', label: 'Video call', icon: 'Video' },
];

export const industries = [
  'Retail / e-commerce', 'Fashion & accessories', 'Food & restaurant', 'Construction & real estate',
  'Education & training', 'Healthcare & clinics', 'Professional services', 'Manufacturing & distribution',
  'Logistics & transport', 'Travel & hospitality', 'Technology', 'Non-profit', 'Other',
];

export const standardPages = [
  'Home', 'About', 'Services', 'Portfolio', 'Contact', 'Blog',
  'FAQ', 'Team', 'Pricing', 'Testimonials', 'Careers', 'Gallery',
];

export const featureGroups = [
  {
    group: 'Accounts & access',
    items: [
      { id: 'user-auth', label: 'User registration & login' },
      { id: 'admin-dashboard', label: 'Admin dashboard' },
      { id: 'roles', label: 'Roles & permissions' },
      { id: 'customer-accounts', label: 'Customer accounts' },
    ],
  },
  {
    group: 'Selling & payments',
    items: [
      { id: 'ecommerce', label: 'E-commerce / cart & checkout' },
      { id: 'payment-gateway', label: 'Payment gateway' },
      { id: 'product-management', label: 'Product management' },
      { id: 'order-management', label: 'Order management' },
      { id: 'booking', label: 'Online booking / appointments' },
    ],
  },
  {
    group: 'Communication',
    items: [
      { id: 'contact-form', label: 'Contact form' },
      { id: 'whatsapp', label: 'WhatsApp integration' },
      { id: 'email-system', label: 'Email notifications' },
      { id: 'sms', label: 'SMS notifications' },
      { id: 'notifications', label: 'In-app notifications' },
      { id: 'live-chat', label: 'Live chat' },
    ],
  },
  {
    group: 'Data & content',
    items: [
      { id: 'search', label: 'Search' },
      { id: 'filters', label: 'Filters & sorting' },
      { id: 'file-upload', label: 'File uploads' },
      { id: 'customer-management', label: 'Customer / CRM records' },
      { id: 'multi-language', label: 'Multiple languages' },
      { id: 'blog-cms', label: 'Blog / content management' },
    ],
  },
  {
    group: 'Reporting & output',
    items: [
      { id: 'reports', label: 'Reports' },
      { id: 'analytics', label: 'Analytics' },
      { id: 'pdf-generation', label: 'PDF generation' },
      { id: 'excel-export', label: 'Excel export' },
      { id: 'qr-code', label: 'QR codes' },
      { id: 'invoicing', label: 'Invoicing' },
    ],
  },
  {
    group: 'Integrations',
    items: [
      { id: 'api-integration', label: 'Third-party API integration' },
      { id: 'google-sheets', label: 'Google Sheets' },
      { id: 'apps-script', label: 'Google Apps Script' },
      { id: 'google-drive', label: 'Google Drive' },
      { id: 'google-calendar', label: 'Google Calendar' },
      { id: 'maps', label: 'Maps & location' },
    ],
  },
];

export const designStyles = [
  { id: 'modern', label: 'Modern' }, { id: 'minimal', label: 'Minimal' },
  { id: 'corporate', label: 'Corporate' }, { id: 'luxury', label: 'Luxury' },
  { id: 'creative', label: 'Creative' }, { id: 'dark', label: 'Dark' },
  { id: 'light', label: 'Light & airy' }, { id: 'colorful', label: 'Colourful' },
  { id: 'ecommerce', label: 'E-commerce' }, { id: 'tech', label: 'Technical' },
  { id: 'not-sure', label: 'Not sure yet' },
];

export const contentReadiness = [
  { id: 'have-all', label: 'I will provide all content', hint: 'Text, images and logo are ready' },
  { id: 'partial', label: 'Some content is available', hint: 'I have part of it and need help with the rest' },
  { id: 'need-help', label: 'I need help creating content', hint: 'Writing, images and structure' },
];

export const contentAssets = [
  'Logo', 'Written text', 'Photographs', 'Videos', 'Product list', 'Service descriptions',
  'Client testimonials', 'Company documents', 'Brand guidelines',
];

// Budget bands — admin-editable in the Laravel build.
export const budgetRanges = [
  { id: 'under-100', label: 'Under $100' },
  { id: '100-250', label: '$100 – $250' },
  { id: '250-500', label: '$250 – $500' },
  { id: '500-1000', label: '$500 – $1,000' },
  { id: '1000-plus', label: '$1,000 +' },
  { id: 'consult', label: 'Not sure — I need a consultation' },
];

export const timelines = [
  { id: 'asap', label: 'As soon as possible' },
  { id: '1-2-weeks', label: 'Within 1–2 weeks' },
  { id: '2-4-weeks', label: 'Within 2–4 weeks' },
  { id: '1-2-months', label: 'Within 1–2 months' },
  { id: 'flexible', label: 'Flexible / no fixed deadline' },
];

export const pageCountOptions = [
  { id: '1', label: 'Single page' },
  { id: '2-5', label: '2 – 5 pages' },
  { id: '6-10', label: '6 – 10 pages' },
  { id: '11-20', label: '11 – 20 pages' },
  { id: '20-plus', label: 'More than 20' },
  { id: 'not-sure', label: 'Not sure yet' },
];

export const referralSources = [
  'Google search', 'Facebook', 'LinkedIn', 'Fiverr', 'Referral from someone', 'Other',
];
