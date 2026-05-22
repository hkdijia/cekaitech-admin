import { describe, expect, it, vi } from 'vitest';
import { pageUserOperationLogs } from './adminUserOperationLogs';

describe('admin user operation log api', () => {
  it('posts page query to backend operation log endpoint', async () => {
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
              operationType: 'user_status_update',
              beforeValue: 'normal',
              afterValue: 'blacklisted',
              reason: '多次恶意提交',
              operatorId: 'dev-admin',
              operatorName: '策凯管理员',
              createdAt: '2026-05-22T08:00:00'
            }
          ],
          totalCount: 1
        }
      })
    } as Response);

    const result = await pageUserOperationLogs({
      pageNo: 1,
      pageSize: 5,
      orderBy: 'createdAt',
      order: 'desc',
      userId: 10,
      operationType: 'user_status_update'
    });

    expect(fetchMock).toHaveBeenCalledWith('/api/admin/user-operation-logs/page', {
      method: 'POST',
      body: JSON.stringify({
        pageNo: 1,
        pageSize: 5,
        orderBy: 'createdAt',
        order: 'desc',
        userId: 10,
        operationType: 'user_status_update'
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    expect(result.totalCount).toBe(1);
    expect(result.dataList[0].afterValue).toBe('blacklisted');
  });
});
