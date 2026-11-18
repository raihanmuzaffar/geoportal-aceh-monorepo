/**
 * Unit Test: Role-Based Access Control (RBAC) System
 * Geoportal Aceh - Issue #36
 * Native Node.js Test Runner
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

// Logic mirror of rbac.ts for pure unit testing
const ROLE_PERMISSIONS = {
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
  ],
  analis: [
    'view',
    'read',
    'export',
  ],
  user: [
    'view',
    'read',
  ],
};

function normalizeRole(role) {
  if (!role) return 'user';
  const clean = role.trim().toLowerCase();
  if (clean === 'admin' || clean === 'administrator') return 'admin';
  if (clean === 'operator' || clean === 'petugas') return 'operator';
  if (clean === 'analis' || clean === 'analyst') return 'analis';
  return 'user';
}

function hasPermission(role, action, resource) {
  const normRole = normalizeRole(role);
  const permissions = ROLE_PERMISSIONS[normRole] || ROLE_PERMISSIONS.user;

  if ((resource === 'settings' || resource === 'users') && normRole !== 'admin') {
    return false;
  }

  if (action === 'verify' && normRole !== 'admin') {
    return false;
  }

  if (action === 'delete' && normRole !== 'admin') {
    return false;
  }

  return permissions.includes(action);
}

describe('RBAC Role Normalization', () => {
  it('should correctly normalize admin variants to "admin"', () => {
    assert.strictEqual(normalizeRole('admin'), 'admin');
    assert.strictEqual(normalizeRole('ADMIN'), 'admin');
    assert.strictEqual(normalizeRole('administrator'), 'admin');
    assert.strictEqual(normalizeRole(' Administrator '), 'admin');
  });

  it('should correctly normalize operator variants to "operator"', () => {
    assert.strictEqual(normalizeRole('operator'), 'operator');
    assert.strictEqual(normalizeRole('OPERATOR'), 'operator');
    assert.strictEqual(normalizeRole('petugas'), 'operator');
  });

  it('should correctly normalize analyst variants to "analis"', () => {
    assert.strictEqual(normalizeRole('analis'), 'analis');
    assert.strictEqual(normalizeRole('analyst'), 'analis');
  });

  it('should fallback unknown/null/undefined roles to "user"', () => {
    assert.strictEqual(normalizeRole(null), 'user');
    assert.strictEqual(normalizeRole(undefined), 'user');
    assert.strictEqual(normalizeRole(''), 'user');
    assert.strictEqual(normalizeRole('guest'), 'user');
    assert.strictEqual(normalizeRole('hacker'), 'user');
  });
});

describe('RBAC Role Permission Matrix', () => {
  describe('Admin Permissions', () => {
    it('admin should have full access to all actions and resources', () => {
      assert.strictEqual(hasPermission('admin', 'view'), true);
      assert.strictEqual(hasPermission('admin', 'create'), true);
      assert.strictEqual(hasPermission('admin', 'update'), true);
      assert.strictEqual(hasPermission('admin', 'delete'), true);
      assert.strictEqual(hasPermission('admin', 'verify'), true);
      assert.strictEqual(hasPermission('admin', 'manage_users', 'users'), true);
      assert.strictEqual(hasPermission('admin', 'settings', 'settings'), true);
    });
  });

  describe('Operator Permissions', () => {
    it('operator can read, create, and update data', () => {
      assert.strictEqual(hasPermission('operator', 'read'), true);
      assert.strictEqual(hasPermission('operator', 'create'), true);
      assert.strictEqual(hasPermission('operator', 'update'), true);
      assert.strictEqual(hasPermission('operator', 'export'), true);
    });

    it('operator CANNOT delete data permanently', () => {
      assert.strictEqual(hasPermission('operator', 'delete'), false);
      assert.strictEqual(hasPermission('operator', 'delete', 'kebencanaan'), false);
    });

    it('operator CANNOT verify incident status', () => {
      assert.strictEqual(hasPermission('operator', 'verify'), false);
      assert.strictEqual(hasPermission('operator', 'verify', 'kebencanaan'), false);
    });

    it('operator CANNOT access user management or system settings', () => {
      assert.strictEqual(hasPermission('operator', 'manage_users', 'users'), false);
      assert.strictEqual(hasPermission('operator', 'settings', 'settings'), false);
    });
  });

  describe('Analis Permissions', () => {
    it('analis can view, read, and export analytical data', () => {
      assert.strictEqual(hasPermission('analis', 'view'), true);
      assert.strictEqual(hasPermission('analis', 'read'), true);
      assert.strictEqual(hasPermission('analis', 'export'), true);
    });

    it('analis CANNOT create, update, or delete data', () => {
      assert.strictEqual(hasPermission('analis', 'create'), false);
      assert.strictEqual(hasPermission('analis', 'update'), false);
      assert.strictEqual(hasPermission('analis', 'delete'), false);
      assert.strictEqual(hasPermission('analis', 'verify'), false);
    });
  });

  describe('User (Public Authenticated) Permissions', () => {
    it('user can only view and read data', () => {
      assert.strictEqual(hasPermission('user', 'view'), true);
      assert.strictEqual(hasPermission('user', 'read'), true);
    });

    it('user CANNOT perform write or dangerous actions', () => {
      assert.strictEqual(hasPermission('user', 'create'), false);
      assert.strictEqual(hasPermission('user', 'update'), false);
      assert.strictEqual(hasPermission('user', 'delete'), false);
      assert.strictEqual(hasPermission('user', 'verify'), false);
      assert.strictEqual(hasPermission('user', 'manage_users'), false);
    });
  });
});
