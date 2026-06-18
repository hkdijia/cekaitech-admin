import { describe, expect, it, vi } from 'vitest';
import {
  createMiniappAccessListEntry,
  disableMiniappAccessListEntry,
  importApprovedLawyersToAccessList,
  pageApprovedLawyerAccessListCandidates,
  pageMiniappAccessListEntries
} from './miniappAccessList';

describe('miniapp access list api', () => {
  it('posts page query to miniapp access list endpoint', async () => {
    const fetchMock = mockSuccess({
      dataList: [
        {
          entryId: 1,
          appCode: 'lawsuit-material-assistant',
          capabilityCode: 'legal_credit_query',
          listType: 'allow',
          userId: 14,
          identityId: 15,
          userCode: 'lma-abcd1234',
          sourceType: 'manual',
          reason: '可信律师',
          status: 'active',
          createdAt: '2026-06-18T10:00:00',
          updatedAt: '2026-06-18T10:00:00'
        }
      ],
      totalCount: 1
    });

    const result = await pageMiniappAccessListEntries({
      pageNo: 1,
      pageSize: 20,
      appCode: 'lawsuit-material-assistant',
      capabilityCode: 'legal_credit_query',
      listType: 'allow',
      status: 'active',
      keywords: 'lma',
      orderBy: 'createdAt',
      order: 'desc'
    });

    expect(fetchMock).toHaveBeenCalledWith('/api/admin/miniapp-access-list/page', {
      method: 'POST',
      body: JSON.stringify({
        pageNo: 1,
        pageSize: 20,
        appCode: 'lawsuit-material-assistant',
        capabilityCode: 'legal_credit_query',
        listType: 'allow',
        status: 'active',
        keywords: 'lma',
        orderBy: 'createdAt',
        order: 'desc'
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    expect(result.totalCount).toBe(1);
    expect(result.dataList[0].userCode).toBe('lma-abcd1234');
  });

  it('posts create, disable and selected import actions to exact endpoints', async () => {
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(successResponse({ entryId: 2, status: 'active' }))
      .mockResolvedValueOnce(successResponse({ entryId: 2, status: 'disabled' }))
      .mockResolvedValueOnce(successResponse({ importedCount: 3, skippedCount: 1 }));

    await createMiniappAccessListEntry({
      appCode: 'lawsuit-material-assistant',
      capabilityCode: 'legal_credit_query',
      listType: 'allow',
      userId: 14,
      identityId: 15,
      reason: '后台加入可信名单'
    });
    await disableMiniappAccessListEntry(2, { reason: '不再可信' });
    await importApprovedLawyersToAccessList({
      appCode: 'lawsuit-material-assistant',
      capabilityCode: 'legal_credit_query',
      reason: '导入已通过律师',
      auditIds: [22, 23]
    });

    expect(fetchMock).toHaveBeenNthCalledWith(1, '/api/admin/miniapp-access-list/entries', {
      method: 'POST',
      body: JSON.stringify({
        appCode: 'lawsuit-material-assistant',
        capabilityCode: 'legal_credit_query',
        listType: 'allow',
        userId: 14,
        identityId: 15,
        reason: '后台加入可信名单'
      }),
      headers: { 'Content-Type': 'application/json' }
    });
    expect(fetchMock).toHaveBeenNthCalledWith(2, '/api/admin/miniapp-access-list/entries/2/disable', {
      method: 'POST',
      body: JSON.stringify({ reason: '不再可信' }),
      headers: { 'Content-Type': 'application/json' }
    });
    expect(fetchMock).toHaveBeenNthCalledWith(3, '/api/admin/miniapp-access-list/import-approved-lawyers', {
      method: 'POST',
      body: JSON.stringify({
        appCode: 'lawsuit-material-assistant',
        capabilityCode: 'legal_credit_query',
        reason: '导入已通过律师',
        auditIds: [22, 23]
      }),
      headers: { 'Content-Type': 'application/json' }
    });
  });

  it('posts approved lawyer candidate query to exact endpoint', async () => {
    const fetchMock = mockSuccess({
      dataList: [
        {
          auditId: 22,
          userId: 16,
          identityId: 17,
          userCode: 'lma-candidate',
          name: '候选律师',
          phone: '13142020002',
          licenseNo: 'LAW-001',
          reviewedAt: '2026-06-18T09:00:00'
        }
      ],
      totalCount: 1
    });

    const result = await pageApprovedLawyerAccessListCandidates({
      pageNo: 1,
      pageSize: 10,
      appCode: 'lawsuit-material-assistant',
      capabilityCode: 'legal_credit_query',
      keywords: '候选'
    });

    expect(fetchMock).toHaveBeenCalledWith('/api/admin/miniapp-access-list/approved-lawyer-candidates', {
      method: 'POST',
      body: JSON.stringify({
        pageNo: 1,
        pageSize: 10,
        appCode: 'lawsuit-material-assistant',
        capabilityCode: 'legal_credit_query',
        keywords: '候选'
      }),
      headers: { 'Content-Type': 'application/json' }
    });
    expect(result.totalCount).toBe(1);
    expect(result.dataList[0].auditId).toBe(22);
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
