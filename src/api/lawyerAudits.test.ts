import { describe, expect, it, vi } from 'vitest';
import { approveLawyerAudit, pageLawyerAudits, rejectLawyerAudit } from './lawyerAudits';

describe('lawyer audits api', () => {
  it('posts page query to user audits endpoint', async () => {
    const fetchMock = mockSuccess({
      dataList: [
        {
          auditId: 1,
          userId: 44,
          identityId: 44,
          userCode: 'lma-4a378460',
          appCode: 'lawsuit-material-assistant',
          auditType: 'lawyer_professional',
          status: 'pending',
          payload: { name: '黄凯', phone: '131****8494' },
          createdAt: '2026-06-17T10:00:00',
          updatedAt: '2026-06-17T10:00:00'
        }
      ],
      totalCount: 1
    });

    const result = await pageLawyerAudits({
      pageNo: 1,
      pageSize: 10,
      appCode: 'lawsuit-material-assistant',
      auditType: 'lawyer_professional',
      status: 'pending',
      keywords: '黄凯',
      orderBy: 'createdAt',
      order: 'desc'
    });

    expect(fetchMock).toHaveBeenCalledWith('/api/admin/user-audits/page', {
      method: 'POST',
      body: JSON.stringify({
        pageNo: 1,
        pageSize: 10,
        appCode: 'lawsuit-material-assistant',
        auditType: 'lawyer_professional',
        status: 'pending',
        keywords: '黄凯',
        orderBy: 'createdAt',
        order: 'desc'
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    expect(result.totalCount).toBe(1);
    expect(result.dataList[0].userCode).toBe('lma-4a378460');
  });

  it('posts approve and reject actions to audit endpoints', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(successResponse({ auditId: 1, status: 'approved' }))
      .mockResolvedValueOnce(successResponse({ auditId: 2, status: 'rejected' }));

    await approveLawyerAudit(1, { reviewNote: '材料核验通过' });
    await rejectLawyerAudit(2, { reviewNote: '材料不完整' });

    expect(fetchMock).toHaveBeenNthCalledWith(1, '/api/admin/user-audits/1/approve', {
      method: 'POST',
      body: JSON.stringify({ reviewNote: '材料核验通过' }),
      headers: { 'Content-Type': 'application/json' }
    });
    expect(fetchMock).toHaveBeenNthCalledWith(2, '/api/admin/user-audits/2/reject', {
      method: 'POST',
      body: JSON.stringify({ reviewNote: '材料不完整' }),
      headers: { 'Content-Type': 'application/json' }
    });
  });
});

function mockSuccess(data: unknown) {
  return vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(successResponse(data));
}

function successResponse(data: unknown) {
  return {
    ok: true,
    json: async () => ({
      success: true,
      code: '0',
      msg: '',
      data
    })
  } as Response;
}
