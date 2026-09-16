// ---------------------------------------------------------------------------
// Schema for the generic CRUD screens.
//
// Each entry describes one content type: what the list shows, what the form
// asks for, and what an empty record starts as. Adding a new manageable type
// is a config entry here, not a new page component.
//
// Field types: text | textarea | number | boolean | select | color | list |
//              slug | blocks | relation
// ---------------------------------------------------------------------------

const ICONS = [
  'Globe', 'AppWindow', 'Table2', 'Workflow', 'ShoppingBag', 'LayoutDashboard',
  'Puzzle', 'Wrench', 'Boxes', 'Users', 'Wallet', 'CalendarCheck', 'TrendingUp',
  'FileText', 'Contact', 'GraduationCap', 'Receipt', 'PackageCheck', 'BarChart3',
  'ClipboardList', 'Map', 'PenTool', 'Code2', 'ShieldCheck', 'Rocket', 'LifeBuoy',
  'Smartphone', 'Cpu', 'Target', 'Lock', 'MessagesSquare', 'Layers', 'Clock', 'Sparkles',
];

export const resources = {
  portfolio: {
    title: 'Portfolio',
    description: 'Case studies shown on the portfolio page.',
    endpoint: 'portfolio',
    icon: 'Layers',
    labelKey: 'title',
    columns: [
      { key: 'title', label: 'Project' },
      { key: 'status', label: 'Status' },
      { key: 'year', label: 'Year', hideBelow: 'sm' },
      { key: 'featured', label: 'Featured', type: 'boolean' },
      { key: 'is_published', label: 'Live', type: 'boolean' },
    ],
    fields: [
      { key: 'title', label: 'Title', type: 'text', required: true },
      { key: 'slug', label: 'URL slug', type: 'slug', from: 'title', required: true, hint: '/portfolio/your-slug' },
      { key: 'portfolio_category_id', label: 'Category', type: 'relation', resource: 'portfolio-categories', required: true },
      { key: 'short', label: 'One-line summary', type: 'textarea', rows: 2, required: true },
      { key: 'client_type', label: 'Client type', type: 'text' },
      { key: 'year', label: 'Year', type: 'number' },
      { key: 'duration', label: 'Duration', type: 'text', hint: 'e.g. 5 weeks' },
      { key: 'status', label: 'Status', type: 'select', options: ['Live', 'In development', 'Archived'], required: true },
      { key: 'problem', label: 'The problem', type: 'textarea', rows: 4, required: true },
      { key: 'solution', label: 'The solution', type: 'textarea', rows: 4, required: true },
      { key: 'challenges', label: 'The hard part', type: 'textarea', rows: 3 },
      { key: 'features', label: 'What was built', type: 'list' },
      { key: 'results', label: 'Results', type: 'list' },
      { key: 'technologies', label: 'Technologies', type: 'list', hint: 'Unknown ones are created automatically' },
      { key: 'cover', label: 'Cover image', type: 'media' },
      { key: 'live_url', label: 'Live URL', type: 'text' },
      { key: 'github_url', label: 'GitHub URL', type: 'text' },
      { key: 'featured', label: 'Featured on the homepage', type: 'boolean' },
      { key: 'is_sample', label: 'Mark as sample content', type: 'boolean', hint: 'Shows a “sample” badge on the site' },
      { key: 'is_published', label: 'Published', type: 'boolean' },
    ],
    blank: {
      title: '', slug: '', portfolio_category_id: null, short: '', client_type: '',
      year: new Date().getFullYear(), duration: '', status: 'Live', problem: '', solution: '',
      challenges: '', features: [], results: [], technologies: [], cover: '', live_url: '',
      github_url: '', featured: false, is_sample: false, is_published: true,
    },
  },

  services: {
    title: 'Services',
    description: 'What you offer, and the detail pages behind each one.',
    endpoint: 'services',
    icon: 'Globe',
    labelKey: 'title',
    columns: [
      { key: 'title', label: 'Service' },
      { key: 'timeline', label: 'Timeline', hideBelow: 'sm' },
      { key: 'featured', label: 'Featured', type: 'boolean' },
      { key: 'is_published', label: 'Live', type: 'boolean' },
    ],
    fields: [
      { key: 'title', label: 'Title', type: 'text', required: true },
      { key: 'slug', label: 'URL slug', type: 'slug', from: 'title', required: true },
      { key: 'icon', label: 'Icon', type: 'select', options: ICONS, required: true },
      { key: 'tagline', label: 'Tagline', type: 'text' },
      { key: 'short', label: 'Card summary', type: 'textarea', rows: 2, required: true },
      { key: 'description', label: 'Full description', type: 'textarea', rows: 5, required: true },
      { key: 'timeline', label: 'Typical timeline', type: 'text' },
      { key: 'features', label: 'What is included', type: 'list' },
      { key: 'deliverables', label: 'You receive', type: 'list' },
      { key: 'ideal_for', label: 'Ideal for', type: 'list' },
      { key: 'featured', label: 'Featured on the homepage', type: 'boolean' },
      { key: 'is_published', label: 'Published', type: 'boolean' },
    ],
    blank: {
      title: '', slug: '', icon: 'Globe', tagline: '', short: '', description: '',
      timeline: '', features: [], deliverables: [], ideal_for: [], featured: false, is_published: true,
    },
  },

  'web-apps': {
    title: 'Web apps',
    description: 'The Google Sheets / Apps Script catalogue.',
    endpoint: 'web-apps',
    icon: 'Table2',
    labelKey: 'name',
    columns: [
      { key: 'name', label: 'System' },
      { key: 'build_time', label: 'Build time', hideBelow: 'sm' },
      { key: 'is_published', label: 'Live', type: 'boolean' },
    ],
    fields: [
      { key: 'name', label: 'Name', type: 'text', required: true },
      { key: 'slug', label: 'URL slug', type: 'slug', from: 'name', required: true },
      { key: 'icon', label: 'Icon', type: 'select', options: ICONS, required: true },
      { key: 'accent', label: 'Accent colour', type: 'color', required: true },
      { key: 'problem', label: 'The problem', type: 'textarea', rows: 3, required: true },
      { key: 'solution', label: 'The system', type: 'textarea', rows: 3, required: true },
      { key: 'features', label: 'Features', type: 'list' },
      { key: 'sheets_role', label: 'What Sheets does', type: 'textarea', rows: 2 },
      { key: 'script_role', label: 'What Apps Script does', type: 'textarea', rows: 2 },
      { key: 'build_time', label: 'Build time', type: 'text' },
      { key: 'is_published', label: 'Published', type: 'boolean' },
    ],
    blank: {
      name: '', slug: '', icon: 'Table2', accent: '#34D399', problem: '', solution: '',
      features: [], sheets_role: '', script_role: '', build_time: '', is_published: true,
    },
  },

  posts: {
    title: 'Blog',
    description: 'Articles, with SEO metadata.',
    endpoint: 'posts',
    icon: 'Newspaper',
    labelKey: 'title',
    columns: [
      { key: 'title', label: 'Post' },
      { key: 'reading_time', label: 'Minutes', hideBelow: 'sm' },
      { key: 'published_at', label: 'Published', type: 'date', hideBelow: 'md' },
      { key: 'featured', label: 'Featured', type: 'boolean' },
    ],
    fields: [
      { key: 'title', label: 'Title', type: 'text', required: true },
      { key: 'slug', label: 'URL slug', type: 'slug', from: 'title', required: true },
      { key: 'blog_category_id', label: 'Category', type: 'relation', resource: 'blog-categories', required: true },
      { key: 'excerpt', label: 'Excerpt', type: 'textarea', rows: 3, required: true },
      { key: 'content', label: 'Article', type: 'blocks', required: true },
      { key: 'tags', label: 'Tags', type: 'list' },
      { key: 'accent', label: 'Accent colour', type: 'color' },
      { key: 'reading_time', label: 'Reading time (minutes)', type: 'number' },
      { key: 'published_at', label: 'Publish date', type: 'date', hint: 'Leave empty to keep it a draft' },
      { key: 'featured', label: 'Featured', type: 'boolean' },
      { key: 'meta_description', label: 'Meta description', type: 'textarea', rows: 2 },
    ],
    blank: {
      title: '', slug: '', blog_category_id: null, excerpt: '', content: [{ type: 'p', text: '' }],
      tags: [], accent: '#3B82F6', reading_time: 5, published_at: '', featured: false, meta_description: '',
    },
  },

  testimonials: {
    title: 'Testimonials',
    description: 'Client quotes. Attributed quotes carry far more weight than anonymous ones.',
    endpoint: 'testimonials',
    icon: 'Quote',
    labelKey: 'name',
    columns: [
      { key: 'name', label: 'Client' },
      { key: 'company', label: 'Company', hideBelow: 'sm' },
      { key: 'rating', label: 'Rating' },
      { key: 'is_sample', label: 'Sample', type: 'boolean' },
      { key: 'enabled', label: 'Shown', type: 'boolean' },
    ],
    fields: [
      { key: 'name', label: 'Name', type: 'text', required: true },
      { key: 'position', label: 'Position', type: 'text' },
      { key: 'company', label: 'Company', type: 'text' },
      { key: 'quote', label: 'Quote', type: 'textarea', rows: 4, required: true },
      { key: 'project', label: 'Project', type: 'text' },
      { key: 'rating', label: 'Rating (1–5)', type: 'number', required: true },
      { key: 'is_sample', label: 'Placeholder content', type: 'boolean', hint: 'Shows a “sample” badge until replaced' },
      { key: 'enabled', label: 'Shown on the site', type: 'boolean' },
    ],
    blank: { name: '', position: '', company: '', quote: '', project: '', rating: 5, is_sample: false, enabled: true },
  },

  faqs: {
    title: 'FAQs',
    description: 'Questions people ask before starting.',
    endpoint: 'faqs',
    icon: 'CircleHelp',
    labelKey: 'question',
    columns: [
      { key: 'question', label: 'Question' },
      { key: 'category', label: 'Category', hideBelow: 'sm' },
      { key: 'enabled', label: 'Shown', type: 'boolean' },
    ],
    fields: [
      { key: 'question', label: 'Question', type: 'text', required: true },
      { key: 'answer', label: 'Answer', type: 'textarea', rows: 5, required: true },
      { key: 'category', label: 'Category', type: 'text', required: true, hint: 'Groups the FAQ page filters' },
      { key: 'enabled', label: 'Shown on the site', type: 'boolean' },
    ],
    blank: { question: '', answer: '', category: 'Process', enabled: true },
  },

  technologies: {
    title: 'Technologies',
    description: 'The marquee under the header and the skill bars on the About page.',
    endpoint: 'technologies',
    icon: 'Cpu',
    labelKey: 'name',
    columns: [
      { key: 'name', label: 'Technology' },
      { key: 'group', label: 'Group', hideBelow: 'sm' },
      { key: 'level', label: 'Level' },
      { key: 'featured', label: 'In marquee', type: 'boolean' },
    ],
    fields: [
      { key: 'name', label: 'Name', type: 'text', required: true },
      { key: 'slug', label: 'Slug', type: 'slug', from: 'name', required: true },
      { key: 'group', label: 'Group', type: 'text', required: true, hint: 'Frontend, Backend, Database…' },
      { key: 'level', label: 'Skill level (0–100)', type: 'number', required: true },
      { key: 'color', label: 'Brand colour', type: 'color', required: true },
      { key: 'logo', label: 'Logo filename', type: 'text', hint: 'File inside public/logos, e.g. react.svg' },
      { key: 'featured', label: 'Show in the marquee', type: 'boolean' },
    ],
    blank: { name: '', slug: '', group: 'Frontend', level: 70, color: '#3B82F6', logo: '', featured: true },
  },

  stats: {
    title: 'Statistics',
    description: 'The animated counters.',
    endpoint: 'stats',
    icon: 'BarChart3',
    labelKey: 'label',
    columns: [
      { key: 'label', label: 'Label' },
      { key: 'value', label: 'Value' },
      { key: 'enabled', label: 'Shown', type: 'boolean' },
    ],
    fields: [
      { key: 'label', label: 'Label', type: 'text', required: true },
      { key: 'value', label: 'Value', type: 'number', required: true },
      { key: 'suffix', label: 'Suffix', type: 'text', hint: 'e.g. + or %' },
      { key: 'icon', label: 'Icon', type: 'select', options: ICONS, required: true },
      { key: 'enabled', label: 'Shown on the site', type: 'boolean' },
    ],
    blank: { label: '', value: 0, suffix: '+', icon: 'Layers', enabled: true },
  },

  process: {
    title: 'Process',
    description: 'The seven stages on the process page.',
    endpoint: 'process',
    icon: 'Map',
    labelKey: 'title',
    columns: [
      { key: 'number', label: 'No.' },
      { key: 'title', label: 'Stage' },
      { key: 'summary', label: 'Summary', hideBelow: 'md' },
    ],
    fields: [
      { key: 'number', label: 'Number', type: 'text', required: true, hint: 'e.g. 01' },
      { key: 'title', label: 'Title', type: 'text', required: true },
      { key: 'summary', label: 'Short summary', type: 'textarea', rows: 2, required: true },
      { key: 'detail', label: 'Full detail', type: 'textarea', rows: 4, required: true },
      { key: 'icon', label: 'Icon', type: 'select', options: ICONS, required: true },
      { key: 'deliverables', label: 'Deliverables', type: 'list' },
    ],
    blank: { number: '', title: '', summary: '', detail: '', icon: 'ClipboardList', deliverables: [] },
  },

  advantages: {
    title: 'Why choose me',
    description: 'The trust cards on the homepage and About page.',
    endpoint: 'advantages',
    icon: 'Target',
    labelKey: 'title',
    columns: [
      { key: 'title', label: 'Title' },
      { key: 'enabled', label: 'Shown', type: 'boolean' },
    ],
    fields: [
      { key: 'title', label: 'Title', type: 'text', required: true },
      { key: 'description', label: 'Description', type: 'textarea', rows: 3, required: true },
      { key: 'icon', label: 'Icon', type: 'select', options: ICONS, required: true },
      { key: 'enabled', label: 'Shown on the site', type: 'boolean' },
    ],
    blank: { title: '', description: '', icon: 'Sparkles', enabled: true },
  },
};

export default resources;
