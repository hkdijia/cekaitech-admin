import { describe, expect, it, vi } from 'vitest';
import { changeAdminPassword } from './adminAuth';

describe('admin auth api', () => {
  it('posts current operator password change request', async () => {
    localStorage.setItem('cekaitech-admin-token', 'admin-token-from-login');
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        code: '0',
        msg: '',
        data: { changed: true }
      })
    } as Response);

    const result = await changeAdminPassword({
      oldPassword: 'old-pass-123',
      newPassword: 'new-pass-456',
      confirmPassword: 'new-pass-456'
    });

    expect(globalThis.fetch).toHaveBeenCalledWith('/api/admin/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({
        oldPassword: 'old-pass-123',
        newPassword: 'new-pass-456',
        confirmPassword: 'new-pass-456'
      }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer admin-token-from-login'
      }
    });
    expect(result.changed).toBe(true);
  });
});
