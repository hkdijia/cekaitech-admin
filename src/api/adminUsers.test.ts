import { describe, expect, it, vi } from 'vitest';
import { getAdminUserDetail, pageAdminUsers, seedAdminUsers, updateAdminUserStatus } from './adminUsers';

describe('admin user api', () => {
  it('posts page query to backend admin users endpoint', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        code: '0',
        msg: '',
        data: {
          dataList: [
            {
              id: 1,
              primaryPhone: '13800000001',
              unionId: 'union-001',
              status: 'normal',
              appCode: 'lawsuit-material-assistant',
              providerUserId: 'openid-001',
              phoneBindingStatus: 'bound'
            }
          ],
          totalCount: 1
        }
      })
    } as Response);

    const result = await pageAdminUsers({
      pageNo: 1,
      pageSize: 10,
      orderBy: 'createdAt',
      order: 'desc',
      userId: 1,
      keywords: '13800000001',
      status: 'normal',
      appCode: 'lawsuit-material-assistant'
    });

    expect(fetchMock).toHaveBeenCalledWith('/api/admin/users/page', {
      method: 'POST',
      body: JSON.stringify({
        pageNo: 1,
        pageSize: 10,
        orderBy: 'createdAt',
        order: 'desc',
        userId: 1,
        keywords: '13800000001',
        status: 'normal',
        appCode: 'lawsuit-material-assistant'
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    expect(result.totalCount).toBe(1);
    expect(result.dataList[0].primaryPhone).toBe('13800000001');
  });

  it('gets user detail by id', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        code: '0',
        msg: '',
        data: {
          id: 1,
          primaryPhone: '13800000001',
          unionId: 'union-001',
          status: 'normal',
          identities: [{ id: 11, appCode: 'lawsuit-material-assistant', providerUserId: 'openid-001' }],
          phones: [{ id: 21, phone: '13800000001', status: 'verified' }]
        }
      })
    } as Response);

    const result = await getAdminUserDetail(1);

    expect(globalThis.fetch).toHaveBeenCalledWith('/api/admin/users/1/detail', {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    expect(result.identities).toHaveLength(1);
    expect(result.phones[0].phone).toBe('13800000001');
  });

  it('posts seed request for local verification users', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        code: '0',
        msg: '',
        data: {
          createdCount: 5,
          totalCount: 5,
          seededAt: '2026-05-22T01:00:00'
        }
      })
    } as Response);

    const result = await seedAdminUsers();

    expect(globalThis.fetch).toHaveBeenCalledWith('/api/admin/dev/seed-users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    expect(result.createdCount).toBe(5);
    expect(result.totalCount).toBe(5);
  });

  it('posts user status update request', async () => {
    localStorage.setItem('cekaitech-admin-token', 'admin-token-from-login');
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        code: '0',
        msg: '',
        data: {
          id: 1,
          primaryPhone: '13800000001',
          unionId: 'union-001',
          status: 'blacklisted',
          identities: [],
          phones: []
        }
      })
    } as Response);

    const result = await updateAdminUserStatus({
      userId: 1,
      status: 'blacklisted',
      reason: '多次恶意提交'
    });

    expect(globalThis.fetch).toHaveBeenCalledWith('/api/admin/users/update-status', {
      method: 'POST',
      body: JSON.stringify({
        userId: 1,
        status: 'blacklisted',
        reason: '多次恶意提交'
      }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer admin-token-from-login'
      }
    });
    expect(result.status).toBe('blacklisted');
  });
});
