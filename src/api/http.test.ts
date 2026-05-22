import { describe, expect, it, vi } from 'vitest';
import { request, unauthorizedEventName } from './http';

describe('request', () => {
  it('clears admin token and dispatches unauthorized event when protected api returns 401', async () => {
    localStorage.setItem('cekaitech-admin-token', 'expired-token');
    const unauthorizedListener = vi.fn();
    window.addEventListener(unauthorizedEventName, unauthorizedListener);
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => ({
        success: false,
        code: '401',
        msg: '后台登录已失效'
      })
    } as Response);

    await expect(request('/api/admin/users/page', { method: 'POST' })).rejects.toThrow('后台登录已失效');

    expect(localStorage.getItem('cekaitech-admin-token')).toBeNull();
    expect(unauthorizedListener).toHaveBeenCalledTimes(1);
    window.removeEventListener(unauthorizedEventName, unauthorizedListener);
  });

  it('does not clear admin token when login api returns 401', async () => {
    localStorage.setItem('cekaitech-admin-token', 'old-token');
    const unauthorizedListener = vi.fn();
    window.addEventListener(unauthorizedEventName, unauthorizedListener);
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => ({
        success: false,
        code: '401',
        msg: '账号或密码错误'
      })
    } as Response);

    await expect(request('/api/admin/auth/login', { method: 'POST' })).rejects.toThrow('账号或密码错误');

    expect(localStorage.getItem('cekaitech-admin-token')).toBe('old-token');
    expect(unauthorizedListener).not.toHaveBeenCalled();
    window.removeEventListener(unauthorizedEventName, unauthorizedListener);
  });
});
