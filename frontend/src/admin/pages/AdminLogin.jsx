import { useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { applySeo } from '@/utils/seo';
import Icon from '@/components/ui/Icon';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/Field';
import { useAdminAuth } from '../AdminAuth';
import { AdminApiError } from '../adminApi';

export default function AdminLogin() {
  const { user, login, checking } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [values, setValues] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    applySeo({ title: 'Admin sign in', path: '/admin/login' });
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow';
    document.head.appendChild(meta);
    return () => meta.remove();
  }, []);

  if (!checking && user) return <Navigate to={location.state?.from || '/admin'} replace />;

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setErrors({});
    setMessage(null);

    try {
      await login(values.email, values.password);
      navigate(location.state?.from || '/admin', { replace: true });
    } catch (error) {
      if (error instanceof AdminApiError) {
        setErrors(error.fieldErrors);
        setMessage(Object.keys(error.fieldErrors).length ? null : error.message);
      } else {
        setMessage('Could not reach the API. Is the Laravel server running?');
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4 py-12">
      <div className="grid-backdrop pointer-events-none fixed inset-0 opacity-60" aria-hidden="true" />
      <div className="glow-orb fixed left-1/2 top-1/4 h-72 w-72 -translate-x-1/2 bg-brand/20" aria-hidden="true" />

      <div className="relative w-full max-w-sm">
        <div className="mb-7 text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand to-accent text-white shadow-glow">
            <Icon name="Lock" className="h-5 w-5" />
          </span>
          <h1 className="mt-5 text-[1.4rem] font-bold text-ink">Admin sign in</h1>
          <p className="mt-1.5 text-[0.86rem] text-muted">Manage content, enquiries and settings.</p>
        </div>

        <form onSubmit={submit} className="rounded-2xl border bg-surface/70 p-6 shadow-lift" noValidate>
          <div className="space-y-5">
            <Input
              label="Email" name="email" type="email" autoComplete="username" required
              value={values.email}
              onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
              error={errors.email}
            />
            <Input
              label="Password" name="password" type="password" autoComplete="current-password" required
              value={values.password}
              onChange={(e) => setValues((v) => ({ ...v, password: e.target.value }))}
              error={errors.password}
            />
          </div>

          {message && (
            <p className="mt-4 flex items-start gap-2 rounded-xl border border-red-500/30 bg-red-500/[0.07] p-3 text-[0.82rem] text-red-500">
              <Icon name="AlertCircle" className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              {message}
            </p>
          )}

          <Button type="submit" full size="lg" className="mt-6" loading={busy} iconRight="ArrowRight">
            {busy ? 'Signing in' : 'Sign in'}
          </Button>
        </form>

        <p className="mt-5 text-center text-[0.78rem] text-faint">
          <a href="/" className="transition-colors hover:text-ink">← Back to the site</a>
        </p>
      </div>
    </div>
  );
}
