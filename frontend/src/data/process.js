export const processSteps = [
  {
    id: 1, number: '01', title: 'Requirement',
    summary: 'Understand the business before the build.',
    detail: 'We go through what the business does, who it serves and what the site or system actually has to achieve. Most projects change shape at this stage — that is the point of it.',
    deliverables: ['Requirement document', 'Scope and feature list', 'Fixed quotation'],
    icon: 'ClipboardList',
  },
  {
    id: 2, number: '02', title: 'Planning',
    summary: 'Structure, functionality and technology decided up front.',
    detail: 'Sitemap, page structure, data model and the technology each part will use. Deciding this before design avoids rebuilding things later.',
    deliverables: ['Sitemap', 'Data model', 'Technical plan', 'Timeline'],
    icon: 'Map',
  },
  {
    id: 3, number: '03', title: 'UI/UX design',
    summary: 'The visual experience, agreed before code.',
    detail: 'Layouts for every key screen on desktop and mobile, using your brand colours and content. You approve the look before development starts.',
    deliverables: ['Desktop and mobile layouts', 'Design system', 'Revision rounds'],
    icon: 'PenTool',
  },
  {
    id: 4, number: '04', title: 'Development',
    summary: 'Frontend, backend and database built together.',
    detail: 'Interface, API and database built as one system with clean, maintainable code. You get progress updates and a staging link to follow along.',
    deliverables: ['Working staging site', 'Admin panel', 'Source code'],
    icon: 'Code2',
  },
  {
    id: 5, number: '05', title: 'Testing',
    summary: 'Responsiveness, functionality, security and performance.',
    detail: 'Every form, every screen size, every permission path. Broken states and slow pages get fixed here, not after launch.',
    deliverables: ['Cross-device testing', 'Performance pass', 'Security checks'],
    icon: 'ShieldCheck',
  },
  {
    id: 6, number: '06', title: 'Deployment',
    summary: 'Live on your domain and hosting.',
    detail: 'Domain, hosting, SSL, email and analytics configured, with the database migrated and backups in place.',
    deliverables: ['Live website', 'SSL and backups', 'Admin handover and training'],
    icon: 'Rocket',
  },
  {
    id: 7, number: '07', title: 'Support',
    summary: 'Maintenance and improvements after launch.',
    detail: 'Post-launch support period included, with ongoing maintenance available: updates, fixes, backups and new features as the business grows.',
    deliverables: ['Support period', 'Maintenance plans', 'Feature additions'],
    icon: 'LifeBuoy',
  },
];

export default processSteps;
