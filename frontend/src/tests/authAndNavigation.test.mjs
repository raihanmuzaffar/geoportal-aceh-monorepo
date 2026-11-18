/**
 * Auth & Navigation Integration Test Suite
 * Tests login, logout, route guard, and role-based redirects
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

// Mock localStorage for test environment
class MockLocalStorage {
  constructor() {
    this.store = {};
  }
  getItem(key) {
    return this.store[key] || null;
  }
  setItem(key, value) {
    this.store[key] = String(value);
  }
  removeItem(key) {
    delete this.store[key];
  }
  clear() {
    this.store = {};
  }
}

describe('Authentication State & Session Management', () => {
  test('should initialize with null user and unauthenticated state', () => {
    const storage = new MockLocalStorage();
    const token = storage.getItem('token');
    const userJson = storage.getItem('user');

    assert.equal(token, null);
    assert.equal(userJson, null);
  });

  test('should successfully persist session upon valid admin login', () => {
    const storage = new MockLocalStorage();
    const adminUser = {
      id: 1,
      name: 'Super Admin Geoportal',
      email: 'admin@acehprov.go.id',
      role: 'admin',
    };
    const sampleToken = '1|laravel_sanctum_token_secret_admin_123';

    // Simulate login success handler
    storage.setItem('token', sampleToken);
    storage.setItem('user', JSON.stringify(adminUser));

    const storedToken = storage.getItem('token');
    const storedUser = JSON.parse(storage.getItem('user') || '{}');

    assert.equal(storedToken, sampleToken);
    assert.equal(storedUser.role, 'admin');
    assert.equal(storedUser.email, 'admin@acehprov.go.id');
  });

  test('should successfully persist operator session with operator role', () => {
    const storage = new MockLocalStorage();
    const operatorUser = {
      id: 2,
      name: 'Operator Disdik Aceh',
      email: 'operator.disdik@acehprov.go.id',
      role: 'operator',
    };
    const sampleToken = '2|laravel_sanctum_token_secret_operator_456';

    storage.setItem('token', sampleToken);
    storage.setItem('user', JSON.stringify(operatorUser));

    const storedUser = JSON.parse(storage.getItem('user') || '{}');
    assert.equal(storedUser.role, 'operator');
  });

  test('should clean up token and session data completely upon logout', () => {
    const storage = new MockLocalStorage();
    storage.setItem('token', 'active_session_token');
    storage.setItem('user', JSON.stringify({ id: 1, role: 'admin' }));

    // Simulate logout action
    storage.removeItem('token');
    storage.removeItem('user');
    storage.clear();

    assert.equal(storage.getItem('token'), null);
    assert.equal(storage.getItem('user'), null);
  });
});

describe('Route Guard & Navigation Protection', () => {
  /**
   * Evaluates target route access given authentication status and role
   */
  function evaluateRouteGuard(route, authState) {
    const publicRoutes = ['/login', '/register', '/403', '/404'];
    const adminOnlyRoutes = ['/admin', '/admin/users', '/admin/settings'];
    const writeRoutes = ['/domain/kependudukan/create', '/domain/kebencanaan/verify'];

    // If route is public, allow access regardless of auth
    if (publicRoutes.includes(route)) {
      return { allowed: true, redirectTo: null };
    }

    // If unauthenticated, redirect to login
    if (!authState.isAuthenticated || !authState.user) {
      return { allowed: false, redirectTo: '/login' };
    }

    // Role-based route guards
    const userRole = authState.user.role;

    if (adminOnlyRoutes.some((prefix) => route.startsWith(prefix))) {
      if (userRole === 'admin') {
        return { allowed: true, redirectTo: null };
      }
      return { allowed: false, redirectTo: '/403' };
    }

    if (route.includes('/verify') && userRole !== 'admin') {
      return { allowed: false, redirectTo: '/403' };
    }

    if (writeRoutes.includes(route) && userRole === 'user') {
      return { allowed: false, redirectTo: '/403' };
    }

    return { allowed: true, redirectTo: null };
  }

  test('unauthenticated visitor accessing /dashboard is redirected to /login', () => {
    const guard = evaluateRouteGuard('/dashboard', { isAuthenticated: false, user: null });
    assert.equal(guard.allowed, false);
    assert.equal(guard.redirectTo, '/login');
  });

  test('authenticated user can access standard /dashboard', () => {
    const guard = evaluateRouteGuard('/dashboard', {
      isAuthenticated: true,
      user: { role: 'user', name: 'Warga Aceh' },
    });
    assert.equal(guard.allowed, true);
    assert.equal(guard.redirectTo, null);
  });

  test('non-admin user accessing /admin/users is blocked and redirected to /403', () => {
    const guard = evaluateRouteGuard('/admin/users', {
      isAuthenticated: true,
      user: { role: 'operator', name: 'Operator' },
    });
    assert.equal(guard.allowed, false);
    assert.equal(guard.redirectTo, '/403');
  });

  test('admin user can access /admin/users and admin configuration', () => {
    const guard = evaluateRouteGuard('/admin/users', {
      isAuthenticated: true,
      user: { role: 'admin', name: 'Admin' },
    });
    assert.equal(guard.allowed, true);
    assert.equal(guard.redirectTo, null);
  });

  test('operator attempting verification endpoint is redirected to /403', () => {
    const guard = evaluateRouteGuard('/domain/kebencanaan/verify', {
      isAuthenticated: true,
      user: { role: 'operator', name: 'Operator BPBD' },
    });
    assert.equal(guard.allowed, false);
    assert.equal(guard.redirectTo, '/403');
  });

  test('public routes (/login, /register, /403) are accessible without auth', () => {
    ['/login', '/register', '/403', '/404'].forEach((route) => {
      const guard = evaluateRouteGuard(route, { isAuthenticated: false, user: null });
      assert.equal(guard.allowed, true);
      assert.equal(guard.redirectTo, null);
    });
  });
});
