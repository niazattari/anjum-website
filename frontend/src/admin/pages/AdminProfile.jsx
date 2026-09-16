import { useState } from 'react';
import adminApi, { AdminApiError } from '../adminApi';
import { useAdminAuth } from '../AdminAuth';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/Field';
import { Card, PageHeader, Toast, useToast } from '../components/AdminUi';
import { formatDate } from '@/utils/format';

export default function AdminProfile() {
  const { user, setUser, logout } = useAdminAuth();
  const toast = useToast();

  const [values, setValues] = useState({
    name: user?.name || '',
    email: user?.email || '',
    current_password: '',
    password: '',
    password_confirmation: '',
  });
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);

  const set = (key) => (e) => {
    setValues((v) => ({ ...v, [key]: e.target.value }));
    if (errors[key]) setErrors((x) => ({ ...x, [key]: undefined }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setErrors({});
    try {
      const { user: updated } = await adminApi.updateProfile(values);
      setUser(updated);
      setValues((v) => ({ ...v, current_password: '', password: '', password_confirmation: '' }));
      toast.success('Profile updated.');
    } catch (error) {
      if (error instanceof AdminApiError && error.errors) {
        setErrors(error.fieldErrors);
      } else {
        toast.error(error.message);
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <PageHeader title="Your account" description="Name, email and password." />

      <div className="grid gap-5 lg:grid-cols-[1.2fr_1fr]">
        <Card title="Details">
          <form onSubmit={submit} noValidate>
            <div className="grid gap-5 sm:grid-cols-2">
              <Input label="Name" name="name" required value={values.name} onChange={set('name')} error={errors.name} />
              <Input label="Email" name="email" type="email" required value={values.email} onChange={set('email')} error={errors.email} />
            </div>

            <div className="mt-7 border-t pt-6">
              <h3 className="mb-4 text-[0.9rem] font-bold text-ink">Change password</h3>
              <p className="mb-4 text-[0.82rem] text-muted">
                Leave these blank to keep your current password. Changing it signs out other devices.
              </p>
              <div className="grid gap-5 sm:grid-cols-2">
                <Input label="Current password" name="current_password" type="password" autoComplete="current-password"
                  className="sm:col-span-2" value={values.current_password} onChange={set('current_password')} error={errors.current_password} />
                <Input label="New password" name="password" type="password" autoComplete="new-password"
                  hint="at least 8 characters" value={values.password} onChange={set('password')} error={errors.password} />
                <Input label="Confirm new password" name="password_confirmation" type="password" autoComplete="new-password"
                  value={values.password_confirmation} onChange={set('password_confirmation')} />
              </div>
            </div>

            <Button type="submit" className="mt-6" loading={busy} iconRight="Check">Save</Button>
          </form>
        </Card>

        <Card title="Session">
          <dl className="space-y-3 text-[0.85rem]">
            <div className="flex justify-between gap-4"><dt className="text-muted">Role</dt><dd className="font-semibold capitalize text-ink">{user?.role}</dd></div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Last sign-in</dt>
              <dd className="text-ink">{user?.lastLoginAt ? formatDate(user.lastLoginAt) : '—'}</dd>
            </div>
          </dl>
          <p className="mt-5 border-t pt-5 text-[0.82rem] leading-relaxed text-muted">
            Signing in anywhere revokes every previous token, so only one session is ever active.
          </p>
          <Button as="button" variant="secondary" className="mt-4" onClick={logout} icon="ArrowLeft">Sign out</Button>
        </Card>
      </div>

      <Toast toast={toast.toast} onDismiss={toast.dismiss} />
    </>
  );
}
