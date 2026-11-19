import { useEffect, type ReactNode } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import DashboardLayout from './components/layout/DashboardLayout';
import PublicLayout from './components/layout/PublicLayout';

import AnalyticsIndexPage from './pages/public/AnalyticsIndexPage';
import AnalyticsKependudukanPage from './pages/public/AnalyticsKependudukanPage';
import DataCatalogPage from './pages/public/DataCatalogPage';
import DatasetDetailPage from './pages/public/DatasetDetailPage';
import DomainStatusPage from './pages/public/DomainStatusPage';
import HomePage from './pages/public/HomePage';
import ServiceCatalogPage from './pages/public/ServiceCatalogPage';
import WebGisPage from './pages/public/WebGisPage';

import { useAuthStore } from './store/authStore';
import { normalizeRole, type UserRole } from './utils/rbac';
import Forbidden403Page from './pages/Forbidden403Page';

import KependudukanPage from './pages/domain/KependudukanPage';
import KesehatanPage from './pages/domain/KesehatanPage';
import PendidikanPage from './pages/domain/PendidikanPage';
import PertanianPage from './pages/domain/PertanianPage';
import KebencanaanPage from './pages/domain/KebencanaanPage';

function AuthLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 text-sm text-slate-600">
      Memeriksa sesi pengguna...
    </div>
  );
}

function ProtectedRoute({
  children,
  allowedRoles,
}: {
  children: ReactNode;
  allowedRoles?: UserRole[];
}) {
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const isInitializing = useAuthStore(
    (state) => state.isInitializing,
  );

  if (isInitializing) return <AuthLoading />;

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Cek apakah pengguna memiliki role yang diizinkan (Route Guard RBAC)
  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = normalizeRole(user?.role);
    if (!allowedRoles.includes(userRole)) {
      return (
        <Forbidden403Page
          requiredRole={allowedRoles.join(' / ')}
          message={`Halaman ini memerlukan hak akses [${allowedRoles.join(', ')}]. Peran akun Anda saat ini adalah [${userRole}].`}
        />
      );
    }
  }

  return <>{children}</>;
}

function GuestRoute() {
  const token = useAuthStore((state) => state.token);
  const isInitializing = useAuthStore(
    (state) => state.isInitializing,
  );

  if (isInitializing) return <AuthLoading />;

  return token
    ? <Navigate to="/dashboard" replace />
    : <Login />;
}

export default function App() {
  const initialize = useAuthStore(
    (state) => state.initialize,
  );

  useEffect(() => {
    void initialize();
  }, [initialize]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<GuestRoute />} />

        <Route element={<PublicLayout />}>
          <Route index element={<HomePage />} />
          <Route path="webgis" element={<WebGisPage />} />
          <Route path="layanan" element={<ServiceCatalogPage />} />
          <Route path="data" element={<DataCatalogPage />} />
          <Route path="data/:slug" element={<DatasetDetailPage />} />

          <Route
            path="analitik"
            element={<AnalyticsIndexPage />}
          />

          <Route
            path="analitik/kependudukan"
            element={<AnalyticsKependudukanPage />}
          />

          <Route
            path="analitik/kesehatan"
            element={<DomainStatusPage slug="kesehatan" />}
          />

          <Route
            path="analitik/pendidikan"
            element={<DomainStatusPage slug="pendidikan" />}
          />

          <Route
            path="analitik/pertanian"
            element={<DomainStatusPage slug="pertanian" />}
          />

          <Route
            path="analitik/kebencanaan"
            element={<DomainStatusPage slug="kebencanaan" />}
          />
        </Route>

        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="kependudukan" element={<KependudukanPage />} />
          <Route path="kesehatan" element={<KesehatanPage />} />
          <Route path="pendidikan" element={<PendidikanPage />} />
          <Route path="pertanian" element={<PertanianPage />} />
          <Route path="kebencanaan" element={<KebencanaanPage />} />
          <Route path="403" element={<Forbidden403Page />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
