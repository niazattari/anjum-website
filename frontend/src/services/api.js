// ---------------------------------------------------------------------------
// Data access layer.
//
// Every component reads through this module — never from `src/data` directly.
// Today it resolves from the bundled sample data. When the Laravel API exists,
// set VITE_API_BASE_URL in .env and each method switches to a real request.
// No component changes are required.
//
// Laravel endpoint map (see docs/API.md):
//   GET  /api/settings              getSettings()
//   GET  /api/services              getServices()
//   GET  /api/services/{slug}       getService(slug)
//   GET  /api/portfolio             getProjects()
//   GET  /api/portfolio/{slug}      getProject(slug)
//   GET  /api/web-apps              getWebApps()
//   GET  /api/technologies          getTechnologies()
//   GET  /api/stats                 getStats()
//   GET  /api/testimonials          getTestimonials()
//   GET  /api/faqs                  getFaqs()
//   GET  /api/posts                 getPosts()
//   GET  /api/posts/{slug}          getPost(slug)
//   POST /api/contact               submitContactMessage(payload)
//   POST /api/project-requests      submitProjectRequest(payload)
// ---------------------------------------------------------------------------

import { site } from '@/data/site';
import { services, getServiceBySlug } from '@/data/services';
import { projects, portfolioCategories, getProjectBySlug, getRelatedProjects } from '@/data/portfolio';
import { deliver } from '@/services/formDelivery';
import { webApps, getWebAppBySlug } from '@/data/webApps';
import { technologies } from '@/data/technologies';
import { stats } from '@/data/stats';
import { testimonials } from '@/data/testimonials';
import { faqs } from '@/data/faqs';
import { posts, getPostBySlug, getRelatedPosts } from '@/data/blog';
import { processSteps } from '@/data/process';
import { advantages } from '@/data/whyChooseMe';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
const USE_REMOTE = Boolean(BASE_URL);
const LATENCY = 220; // simulated network delay, so loading states are real

export class ApiError extends Error {
  constructor(message, status = 0) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function local(value, { ms = LATENCY } = {}) {
  await delay(ms);
  if (value === undefined || value === null) throw new ApiError('Not found', 404);
  return value;
}

async function request(path, options = {}) {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    ...options,
  });
  if (!response.ok) {
    let message = `Request failed (${response.status})`;
    try {
      const body = await response.json();
      message = body.message || message;
      const error = new ApiError(message, response.status);
      error.errors = body.errors || null;
      throw error;
    } catch (err) {
      if (err instanceof ApiError) throw err;
      throw new ApiError(message, response.status);
    }
  }
  const body = await response.json();
  return body.data !== undefined ? body.data : body;
}


export const api = {
  getSettings: () => (USE_REMOTE ? request('/settings') : local(site)),
  getServices: () => (USE_REMOTE ? request('/services') : local(services)),
  getService: (slug) => (USE_REMOTE ? request(`/services/${slug}`) : local(getServiceBySlug(slug))),

  getProjects: () => (USE_REMOTE ? request('/portfolio') : local(projects)),
  getProjectCategories: () => (USE_REMOTE ? request('/portfolio-categories') : local(portfolioCategories)),
  getProject: (slug) => (USE_REMOTE ? request(`/portfolio/${slug}`) : local(getProjectBySlug(slug))),
  getRelatedProjects: async (project) =>
    USE_REMOTE ? request(`/portfolio/${project.slug}/related`) : local(getRelatedProjects(project), { ms: 0 }),

  getWebApps: () => (USE_REMOTE ? request('/web-apps') : local(webApps)),
  getWebApp: (slug) => (USE_REMOTE ? request(`/web-apps/${slug}`) : local(getWebAppBySlug(slug))),

  getTechnologies: () => (USE_REMOTE ? request('/technologies') : local(technologies)),
  getStats: () => (USE_REMOTE ? request('/stats') : local(stats)),
  getTestimonials: () => (USE_REMOTE ? request('/testimonials') : local(testimonials)),
  getFaqs: () => (USE_REMOTE ? request('/faqs') : local(faqs)),
  getProcess: () => (USE_REMOTE ? request('/process') : local(processSteps)),
  getAdvantages: () => (USE_REMOTE ? request('/advantages') : local(advantages)),

  getPosts: () => (USE_REMOTE ? request('/posts') : local(posts)),
  getPost: (slug) => (USE_REMOTE ? request(`/posts/${slug}`) : local(getPostBySlug(slug))),
  getRelatedPosts: async (post) =>
    USE_REMOTE ? request(`/posts/${post.slug}/related`) : local(getRelatedPosts(post), { ms: 0 }),

  submitContactMessage: async (payload) => {
    if (USE_REMOTE) {
      return request('/contact', { method: 'POST', body: JSON.stringify(payload) });
    }
    // No backend configured. Rather than pretending to succeed, hand the
    // submission to the delivery layer: it emails when a key is configured and
    // always returns a WhatsApp link the confirmation screen can offer.
    return deliver('New contact message', payload);
  },

  submitProjectRequest: async (payload) => {
    if (USE_REMOTE) {
      // Uploads have to travel as multipart, so the whole request goes as
      // FormData. Arrays use PHP's name[] convention and booleans are sent as
      // 1/0 — FormData stringifies everything, and "false" is truthy in PHP.
      const form = new FormData();

      Object.entries(payload).forEach(([key, value]) => {
        if (value === null || value === undefined) return;
        if (key === 'files') return;

        if (Array.isArray(value)) {
          value.filter((v) => v !== '' && v !== null).forEach((item) => form.append(`${key}[]`, item));
        } else if (typeof value === 'boolean') {
          form.append(key, value ? '1' : '0');
        } else {
          form.append(key, value);
        }
      });

      (payload.files || []).forEach((file) => {
        if (file instanceof File) form.append('files[]', file);
      });

      const response = await fetch(`${BASE_URL}/project-requests`, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: form,
      });

      const body = await response.json().catch(() => ({}));

      if (!response.ok) {
        const error = new ApiError(body.message || `Request failed (${response.status})`, response.status);
        error.errors = body.errors || null;
        throw error;
      }

      return body;
    }
    return deliver('New project request', payload);
  },
};

export const isRemoteApi = USE_REMOTE;
export default api;
