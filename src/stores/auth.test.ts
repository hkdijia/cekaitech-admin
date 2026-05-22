import { setActivePinia, createPinia } from 'pinia';
import { beforeEach, describe, expect, it } from 'vitest';
import { useAuthStore } from './auth';

describe('useAuthStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('logs in through admin auth api and logs out', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        code: '0',
        msg: '',
        data: {
          token: 'dev-admin-token',
          expiresIn: 7200,
          operator: {
            id: 'dev-admin',
            name: '策凯管理员',
            roleCode: 'super_admin',
            roleName: '超级管理员',
            permissions: ['admin:workspace:view']
          }
        }
      })
    } as Response);

    const auth = useAuthStore();

    expect(auth.isAuthenticated).toBe(false);
    await auth.login('admin', '123456');

    expect(auth.isAuthenticated).toBe(true);
    expect(auth.operator?.name).toBe('策凯管理员');
    expect(auth.token).toBe('dev-admin-token');
    expect(localStorage.getItem('cekaitech-admin-token')).toBe('dev-admin-token');

    auth.logout();
    expect(auth.isAuthenticated).toBe(false);
    expect(auth.operator).toBeNull();
    expect(localStorage.getItem('cekaitech-admin-token')).toBeNull();
  });

  it('throws backend message when login api rejects credentials', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: false,
      json: async () => ({
        success: false,
        code: '401',
        msg: '账号或密码错误'
      })
    } as Response);

    const auth = useAuthStore();

    await expect(auth.login('admin', 'wrong')).rejects.toThrow('账号或密码错误');
    expect(auth.isAuthenticated).toBe(false);
  });
  it('checks current operator permissions by permission code', () => {
    const auth = useAuthStore();
    auth.operator = {
      id: 'limited-admin',
      name: 'limited-admin',
      roleCode: 'operator',
      roleName: '',
      permissions: ['admin:user:view']
    };
    auth.token = 'limited-token';

    expect(auth.hasPermission('admin:user:view')).toBe(true);
    expect(auth.hasPermission('admin:user:status:update')).toBe(false);
    expect(auth.hasPermission('')).toBe(true);
  });
});
