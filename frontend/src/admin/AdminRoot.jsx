import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { AdminAuthProvider, RequireAdmin } from './AdminAuth';
import AdminLayout from './AdminLayout';
import { LoadingBlock } from '@/components/ui/States';

const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AdminRequests = lazy(() => import('./pages/AdminRequests'));
const AdminRequestDetail = lazy(() => import('./pages/AdminRequestDetail'));
const AdminMessages = lazy(() => import('./pages/AdminMessages'));
const AdminMedia = lazy(() => import('./pages/AdminMedia'));
const AdminSettings = lazy(() => import('./pages/AdminSettings'));
const AdminProfile = lazy(() => import('./pages/AdminProfile'));
const ResourcePage = lazy(() => import('./pages/ResourcePage'));

/**
 * The whole admin panel is code-split behind this one route, so a visitor to
 * the public site never downloads any of it.
 */
export default function AdminRoot() {
  return (
    <AdminAuthProvider>
      <Suspense fallback={<LoadingBlock label="Loading admin" />}>
        <Routes>
          <Route path="login" element={<AdminLogin />} />

          <Route element={<RequireAdmin><AdminLayout /></RequireAdmin>}>
            <Route index element={<AdminDashboard />} />
            <Route path="requests" element={<AdminRequests />} />
            <Route path="requests/:reference" element={<AdminRequestDetail />} />
            <Route path="messages" element={<AdminMessages />} />
            <Route path="media" element={<AdminMedia />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="profile" element={<AdminProfile />} />
            {/* Every content type shares one schema-driven CRUD screen */}
            <Route path=":resource" element={<ResourcePage />} />
          </Route>
        </Routes>
      </Suspense>
    </AdminAuthProvider>
  );
}
