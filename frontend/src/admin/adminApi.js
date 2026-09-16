// ---------------------------------------------------------------------------
// Admin API client.
//
// Talks to the Laravel admin endpoints with a Sanctum bearer token.
//
// The token is kept in localStorage. That is the pragmatic choice for a
// single-operator panel, and it is worth knowing the trade: any script that
// achieves XSS on this origin can read it. The mitigations in place are that
// logging in revokes all previous tokens, the API enforces the admin role on
// every request, and nothing here is rendered as raw HTML. If this ever grows
// past one operator, move to Sanctum's cookie-based SPA auth instead.
// ---------------------------------------------------------------------------

const BASE = import.meta.env.VITE_API_BASE_URL || '';
const TOKEN_KEY = 'admin-token';

export const tokenStore = {
  get() {
    try { return localStorage.getItem(TOKEN_KEY); } catch { return null; }
  },
  set(token) {
    try { localStorage.setItem(TOKEN_KEY, token); } catch { /* storage unavailable */ }
  },
  clear() {
    try { localStorage.removeItem(TOKEN_KEY); } catch { /* storage unavailable */ }
  },
};

export class AdminApiError extends Error {
  constructor(message, status, errors = null) {
    super(message);
    this.name = 'AdminApiError';
    this.status = status;
    this.errors = errors;
  }

  /** First validation message per field, ready to drop into form state. */
  get fieldErrors() {
    if (!this.errors) return {};
    return Object.fromEntries(
      Object.entries(this.errors).map(([field, messages]) => [field, messages[0]])
    );
  }
}

let onUnauthorized = () => {};
export const setUnauthorizedHandler = (fn) => { onUnauthorized = fn; };

async function call(path, { method = 'GET', body, isForm = false, signal } = {}) {
  if (!BASE) {
    throw new AdminApiError(
      'No API is configured. Set VITE_API_BASE_URL in .env and restart the dev server.',
      0
    );
  }

  const token = tokenStore.get();
  const headers = { Accept: 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  if (!isForm && body !== undefined) headers['Content-Type'] = 'application/json';

  const response = await fetch(`${BASE}${path}`, {
    method,
    headers,
    signal,
    body: body === undefined ? undefined : isForm ? body : JSON.stringify(body),
  });

  if (response.status === 401) {
    tokenStore.clear();
    onUnauthorized();
    throw new AdminApiError('Your session has expired. Please sign in again.', 401);
  }

  if (response.status === 204) return null;

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new AdminApiError(
      payload.message || `Request failed (${response.status})`,
      response.status,
      payload.errors || null
    );
  }

  return payload;
}

export const adminApi = {
  login: (email, password) => call('/admin/login', { method: 'POST', body: { email, password } }),
  me: () => call('/admin/me'),
  logout: () => call('/admin/logout', { method: 'POST' }),
  updateProfile: (data) => call('/admin/profile', { method: 'PUT', body: data }),

  dashboard: () => call('/admin/dashboard'),

  // Project requests
  requests: (params = {}) => call(`/admin/project-requests?${new URLSearchParams(params)}`),
  request: (reference) => call(`/admin/project-requests/${reference}`),
  updateRequestStatus: (reference, data) =>
    call(`/admin/project-requests/${reference}/status`, { method: 'PATCH', body: data }),
  addRequestNote: (reference, body) =>
    call(`/admin/project-requests/${reference}/notes`, { method: 'POST', body: { body } }),
  deleteRequest: (reference) => call(`/admin/project-requests/${reference}`, { method: 'DELETE' }),

  // Contact messages
  messages: (params = {}) => call(`/admin/messages?${new URLSearchParams(params)}`),
  message: (id) => call(`/admin/messages/${id}`),
  updateMessage: (id, data) => call(`/admin/messages/${id}`, { method: 'PATCH', body: data }),
  deleteMessage: (id) => call(`/admin/messages/${id}`, { method: 'DELETE' }),

  // Generic content CRUD
  list: (resource, params = {}) => call(`/admin/${resource}?${new URLSearchParams(params)}`),
  create: (resource, data) => call(`/admin/${resource}`, { method: 'POST', body: data }),
  update: (resource, id, data) => call(`/admin/${resource}/${id}`, { method: 'PUT', body: data }),
  remove: (resource, id) => call(`/admin/${resource}/${id}`, { method: 'DELETE' }),
  reorder: (resource, items) => call(`/admin/${resource}/reorder`, { method: 'POST', body: { items } }),

  // Media
  media: (params = {}) => call(`/admin/media?${new URLSearchParams(params)}`),
  uploadMedia: (file, alt = '') => {
    const form = new FormData();
    form.append('file', file);
    if (alt) form.append('alt', alt);
    return call('/admin/media', { method: 'POST', body: form, isForm: true });
  },
  deleteMedia: (id) => call(`/admin/media/${id}`, { method: 'DELETE' }),

  // Settings
  settings: () => call('/admin/settings'),
  saveSettings: (settings) => call('/admin/settings', { method: 'PUT', body: { settings } }),
  saveSocial: (links) => call('/admin/settings/social', { method: 'PUT', body: { links } }),
};

export default adminApi;
