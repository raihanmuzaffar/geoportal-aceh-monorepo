import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import DashboardLayout from './components/layout/DashboardLayout';
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
        
        {/* Gunakan DashboardLayout sebagai bungkus utama */}
        <Route path="/" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          {/* Rute default jika path "/" diakses */}
          <Route index element={<Navigate to="/dashboard" replace />} />
          
          {/* Rute halaman */}
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="kependudukan" element={<KependudukanPage />} />
          <Route path="kesehatan" element={<KesehatanPage />} />
          <Route path="pendidikan" element={<PendidikanPage />} />
          <Route path="pertanian" element={<PertanianPage />} />
          <Route path="kebencanaan" element={<KebencanaanPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}