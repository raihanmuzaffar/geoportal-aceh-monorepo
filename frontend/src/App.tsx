import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import DashboardLayout from './components/layout/DashboardLayout';
import PublicLayout from './components/layout/PublicLayout';
import AnalyticsIndexPage from './pages/public/AnalyticsIndexPage';
import DomainStatusPage from './pages/public/DomainStatusPage';
import HomePage from './pages/public/HomePage';
import PublicPlaceholderPage from './pages/public/PublicPlaceholderPage';
import { useAuthStore } from './store/authStore';

// Import halaman domain
import KependudukanPage from './pages/domain/KependudukanPage';
import KesehatanPage from './pages/domain/KesehatanPage';
import PendidikanPage from './pages/domain/PendidikanPage';
import PertanianPage from './pages/domain/PertanianPage';
import KebencanaanPage from './pages/domain/KebencanaanPage';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = useAuthStore((state) => state.token);
  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export default function App() {
  const token = useAuthStore((state) => state.token);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={token ? <Navigate to="/dashboard" replace /> : <Login />} />

        <Route element={<PublicLayout />}>
          <Route index element={<HomePage />} />
          <Route
            path="webgis"
            element={
              <PublicPlaceholderPage
                title="WebGIS"
                description="Halaman WebGIS akan menampilkan peta dasar dan lapisan data yang tersedia."
              />
            }
          />
          <Route path="analitik" element={<AnalyticsIndexPage />} />
          <Route
            path="analitik/kependudukan"
            element={<DomainStatusPage slug="kependudukan" />}
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

        <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="kependudukan" element={<KependudukanPage />} />
          <Route path="kesehatan" element={<KesehatanPage />} />
          <Route path="pendidikan" element={<PendidikanPage />} />
          <Route path="pertanian" element={<PertanianPage />} />
          <Route path="kebencanaan" element={<KebencanaanPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
