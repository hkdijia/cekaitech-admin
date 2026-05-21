import { describe, expect, it, vi } from 'vitest';
import { cancelUserRestriction, createUserRestriction, pageUserRestrictions } from './adminUserRestrictions';

describe('admin user restriction api', () => {
  it('posts page query to backend restriction endpoint', async () => {
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
              userId: 10,
              appCode: 'lawsuit-material-assistant',
              restrictionType: 'audit_disabled',
              reason: '材料异常',
              status: 'active'
            }
          ],
          totalCount: 1
        }
      })
    } as Response);

    const result = await pageUserRestrictions({
      pageNo: 1,
      pageSize: 10,
      orderBy: 'createdAt',
      order: 'desc',
      userId: 10,
      status: 'active'
    });

    expect(fetchMock).toHaveBeenCalledWith('/api/admin/user-restrictions/page', {
      method: 'POST',
      body: JSON.stringify({
        pageNo: 1,
        pageSize: 10,
        orderBy: 'createdAt',
        order: 'desc',
        userId: 10,
        status: 'active'
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    expect(result.totalCount).toBe(1);
    expect(result.dataList[0].restrictionType).toBe('audit_disabled');
  });

  it('creates and cancels a restriction', async () => {
    vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          code: '0',
          msg: '',
          data: { id: 1, userId: 10, restrictionType: 'all_disabled', status: 'active' }
        })
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          code: '0',
          msg: '',
          data: { id: 1, userId: 10, restrictionType: 'all_disabled', status: 'cancelled' }
        })
      } as Response);

    const created = await createUserRestriction({
      userId: 10,
      appCode: '',
      restrictionType: 'all_disabled',
      reason: '测试限制'
    });
    const cancelled = await cancelUserRestriction(1);

    expect(created.status).toBe('active');
    expect(cancelled.status).toBe('cancelled');
  });
});
