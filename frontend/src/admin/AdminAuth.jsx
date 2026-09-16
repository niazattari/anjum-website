import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import adminApi, { setUnauthorizedHandler, tokenStore } from './adminApi';
import { LoadingBlock } from '@/components/ui/States';

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  const signOutLocally = useCallback(() => {
    tokenStore.clear();
    setUser(null);
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(signOutLocally);
  }, [signOutLocally]);

  // Restore the session on load: a stored token is only trusted after the API
  // confirms it.
  useEffect(() => {
    let cancelled = false;

    (async () => {
      if (!tokenStore.get()) {
        setChecking(false);
        return;
      }
      try {
        const { user: me } = await adminApi.me();
        if (!cancelled) setUser(me);
      } catch {
        if (!cancelled) signOutLocally();
      } finally {
        if (!cancelled) setChecking(false);
      }
    })();

    return () => { cancelled = true; };
  }, [signOutLocally]);

  const login = useCallback(async (email, password) => {
    const { token, user: me } = await adminApi.login(email, password);
    tokenStore.set(token);
    setUser(me);
    return me;
  }, []);

  const logout = useCallback(async () => {
    try { await adminApi.logout(); } catch { /* token may already be gone */ }
    signOutLocally();
  }, [signOutLocally]);

  const value = useMemo(
    () => ({ user, setUser, checking, login, logout }),
    [user, checking, login, logout]
  );

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) throw new Error('useAdminAuth must be used inside AdminAuthProvider');
  return context;
}

export function RequireAdmin({ children }) {
  const { user, checking } = useAdminAuth();
  const location = useLocation();

  if (checking) return <LoadingBlock label="Checking your session" />;
  if (!user) return <Navigate to="/admin/login" state={{ from: location.pathname }} replace />;

  return children;
}
