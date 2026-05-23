import { describe, expect, it, vi } from 'vitest';
import { pageLegalFormEvents } from './legalFormEvents';

describe('legal form events api', () => {
  it('posts page query to backend legal form events endpoint', async () => {
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
              clientEventId: 'evt-001',
              eventType: 'form_submit',
              formType: 'divorce_complaint',
              qualityStatus: 'valid',
              filledFieldCount: 18,
              payloadPreview: '{"caseReason":"离婚纠纷"}',
              createdAt: '2026-05-23T09:20:00'
            }
          ],
          totalCount: 1
        }
      })
    } as Response);

    const result = await pageLegalFormEvents({
      pageNo: 1,
      pageSize: 20,
      orderBy: 'createdAt',
      order: 'desc',
      appCode: 'lawsuit-material-assistant',
      formType: 'divorce_complaint',
      qualityStatus: 'valid',
      keywords: 'evt-001'
    });

    expect(fetchMock).toHaveBeenCalledWith('/api/admin/legal/form-events/page', {
      method: 'POST',
      body: JSON.stringify({
        pageNo: 1,
        pageSize: 20,
        orderBy: 'createdAt',
        order: 'desc',
        appCode: 'lawsuit-material-assistant',
        formType: 'divorce_complaint',
        qualityStatus: 'valid',
        keywords: 'evt-001'
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    expect(result.totalCount).toBe(1);
    expect(result.dataList[0].payloadPreview).toContain('离婚纠纷');
  });
});
