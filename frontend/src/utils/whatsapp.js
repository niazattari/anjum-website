// WhatsApp links are always generated from the admin-managed number in settings.
export const whatsappLink = (number, message = '') => {
  const digits = String(number || '').replace(/\D/g, '');
  if (!digits) return '#';
  const text = message ? `?text=${encodeURIComponent(message)}` : '';
  return `https://wa.me/${digits}${text}`;
};

export const whatsappMessages = {
  general: 'Hello! I would like to discuss a website project.',
  service: (title) => `Hello! I am interested in your ${title} service. Could we discuss it?`,
  project: (title) => `Hello! I saw the "${title}" project on your website and would like something similar.`,
  webApp: (name) => `Hello! I would like a ${name} web app built for my business.`,
  request: (ref) => `Hello! I submitted a project request on your website. My reference number is ${ref}.`,
};

export default whatsappLink;
