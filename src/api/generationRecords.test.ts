import { describe, expect, it, vi } from 'vitest';
import { pageGenerationRecords } from './generationRecords';

describe('generation records api', () => {
  it('posts page query to backend generation records endpoint', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        code: '0',
        msg: '',
        data: {
          dataList: [
            {
              id: 1001,
              userId: 11,
              identityId: 21,
              appCode: 'lawsuit-material-assistant',
              clientRecordId: 'record-001',
              recordType: 'private_lending',
              title: '民间借贷起诉状',
              status: 'generated',
              resultSummary: '已生成起诉状草稿',
              createdAt: '2026-05-23T10:20:00',
              updatedAt: '2026-05-23T10:21:00'
            }
          ],
          totalCount: 1
        }
      })
    } as Response);

    const result = await pageGenerationRecords({
      pageNo: 1,
      pageSize: 20,
      appCode: 'lawsuit-material-assistant',
      userId: 11,
      status: 'generated',
      recordType: 'private_lending',
      keywords: 'record-001',
      orderBy: 'createdAt',
      order: 'desc'
    });

    expect(fetchMock).toHaveBeenCalledWith('/api/admin/generation-records/page', {
      method: 'POST',
      body: JSON.stringify({
        pageNo: 1,
        pageSize: 20,
        appCode: 'lawsuit-material-assistant',
        userId: 11,
        status: 'generated',
        recordType: 'private_lending',
        keywords: 'record-001',
        orderBy: 'createdAt',
        order: 'desc'
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    expect(result.totalCount).toBe(1);
    expect(result.dataList[0].clientRecordId).toBe('record-001');
    expect(result.dataList[0].resultSummary).toContain('起诉状');
  });
});
