import { describe, expect, it, vi } from 'vitest';
import { pageAdminUsers } from './adminUsers';

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
});
