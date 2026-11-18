/**
 * Role-Based Access Control (RBAC) System
 * Geoportal Aceh Frontend Architecture
 *
 * Sinkron dengan otorisasi backend Laravel (EnsureUserHasRole Middleware):
 * - admin: Akses penuh (Read, Create, Update, Delete, Verify, Settings)
 * - operator: Pengelolaan data operasional (Read, Create, Update), TIDAK boleh Delete atau Verify
 * - analis: Analisis data dan laporan (Read, View, Export), TIDAK boleh Create, Update, Delete
 * - user / viewer: Akses publik terotentikasi hanya-baca (Read, View)
 */

import { useMemo } from 'react';
import { useAuthStore } from '../store/authStore';

export type UserRole = 'admin' | 'operator' | 'analis' | 'user';

export type AppAction =
  | 'view'
  | 'read'
  | 'create'
  | 'update'
  | 'edit'
  | 'delete'
  | 'verify'
  | 'export'
  | 'manage_users'
  | 'settings';

export type AppResource =
  | 'dashboard'
  | 'kependudukan'
  | 'kesehatan'
  | 'pendidikan'
  | 'pertanian'
  | 'kebencanaan'
  | 'users'
  | 'settings';

/**
 * Matriks otorisasi hak akses frontend berdasarkan kebijakan backend
 */
export const ROLE_PERMISSIONS: Record<UserRole, AppAction[]> = {
  admin: [
    'view',
    'read',
    'create',
    'update',
    'edit',
    'delete',
    'verify',
    'export',
    'manage_users',
    'settings',
  ],
  operator: [
    'view',
    'read',
    'create',
    'update',
    'edit',
    'export',
    // TIDAK diizinkan: 'delete', 'verify', 'manage_users', 'settings'
  ],
  analis: [
    'view',
    'read',
    'export',
    // TIDAK diizinkan write/delete/verify
  ],
  user: [
    'view',
    'read',
    // Hanya baca
  ],
};

/**
 * Normalisasi string role agar aman terhadap variasi casing atau spasi
 */
export function normalizeRole(role?: string | null): UserRole {
  if (!role) return 'user';
  const clean = role.trim().toLowerCase();
  if (clean === 'admin' || clean === 'administrator') return 'admin';
  if (clean === 'operator' || clean === 'petugas') return 'operator';
  if (clean === 'analis' || clean === 'analyst') return 'analis';
  return 'user';
}

/**
 * Evaluasi izin pengguna berdasarkan role dan action yang diminta
 */
export function hasPermission(
  role: string | null | undefined,
  action: AppAction,
  resource?: AppResource
): boolean {
  const normRole = normalizeRole(role);
  const permissions = ROLE_PERMISSIONS[normRole] || ROLE_PERMISSIONS.user;

  // Aturan khusus resource:
  // 1. Pengaturan sistem & manajemen pengguna hanya milik admin
  if ((resource === 'settings' || resource === 'users') && normRole !== 'admin') {
    return false;
  }

  // 2. Aksi verifikasi kebencanaan hanya dapat dilakukan oleh admin
  if (action === 'verify' && normRole !== 'admin') {
    return false;
  }

  // 3. Aksi hapus data secara permanen hanya dapat dilakukan oleh admin
  if (action === 'delete' && normRole !== 'admin') {
    return false;
  }

  return permissions.includes(action);
}

/**
 * Metadata visual badge untuk setiap role
 */
export function getRoleBadgeInfo(role?: string | null): {
  label: string;
  badgeClass: string;
  description: string;
} {
  const norm = normalizeRole(role);
  switch (norm) {
    case 'admin':
      return {
        label: 'Administrator',
        badgeClass: 'bg-rose-100 text-rose-800 border-rose-200',
        description: 'Akses penuh ke semua modul, CRUD, verifikasi, dan konfigurasi',
      };
    case 'operator':
      return {
        label: 'Operator Data',
        badgeClass: 'bg-amber-100 text-amber-800 border-amber-200',
        description: 'Dapat menginput dan memperbarui data spasial, tanpa izin hapus/verifikasi',
      };
    case 'analis':
      return {
        label: 'Analis Spasial',
        badgeClass: 'bg-indigo-100 text-indigo-800 border-indigo-200',
        description: 'Akses visualisasi analitik, eksplorasi data, dan ekspor laporan',
      };
    case 'user':
    default:
      return {
        label: 'Pengguna / Tamu',
        badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
        description: 'Akses baca dan penelusuran katalog data spasial',
      };
  }
}

/**
 * Hook reaktif untuk komponen React agar mudah mengecek hak akses pengguna saat ini
 */
export function useRBAC() {
  const user = useAuthStore((state) => state.user);
  const rawRole = user?.role;
  const role = useMemo(() => normalizeRole(rawRole), [rawRole]);

  const isAdmin = role === 'admin';
  const isOperator = role === 'operator';
  const isAnalis = role === 'analis';
  const isUser = role === 'user';

  const can = useMemo(
    () => (action: AppAction, resource?: AppResource) =>
      hasPermission(role, action, resource),
    [role]
  );

  const cannot = useMemo(
    () => (action: AppAction, resource?: AppResource) =>
      !hasPermission(role, action, resource),
    [role]
  );

  const badge = useMemo(() => getRoleBadgeInfo(role), [role]);

  return {
    user,
    role,
    isAdmin,
    isOperator,
    isAnalis,
    isUser,
    can,
    cannot,
    badge,
  };
}
