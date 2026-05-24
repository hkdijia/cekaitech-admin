import { describe, expect, it, vi } from 'vitest';
import { getLegalServiceRequestDetail, pageLegalServiceRequests, updateLegalServiceRequestStatus } from './legalServiceRequests';

describe('legal service requests api', () => {
  it('posts page query to backend legal service requests endpoint', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        code: '0',
        msg: '',
        data: {
          dataList: [
            {
              requestId: 1001,
              appCode: 'lawsuit-material-assistant',
              userId: 11,
              identityId: 21,
              serviceType: 'contract_review',
              sourceRecordId: 31,
              clientRecordId: 'client-001',
              contactName: '张三',
              contactPhoneMasked: '138****0001',
              memo: '请帮忙看合同',
              status: 'submitted',
              handler: '',
              handlerId: null,
              adminRemark: '',
              createdAt: '2026-05-24T09:20:00',
              updatedAt: '2026-05-24T09:30:00',
              handledAt: ''
            }
          ],
          totalCount: 1
        }
      })
    } as Response);

    const result = await pageLegalServiceRequests({
      pageNo: 1,
      pageSize: 20,
      appCode: 'lawsuit-material-assistant',
      userId: 11,
      serviceType: 'contract_review',
      status: 'submitted',
      contactPhone: '13800000001',
      keywords: '合同',
      orderBy: 'createdAt',
      order: 'desc'
    });

    expect(fetchMock).toHaveBeenCalledWith('/api/admin/legal/service-requests/page', {
      method: 'POST',
      body: JSON.stringify({
        pageNo: 1,
        pageSize: 20,
        appCode: 'lawsuit-material-assistant',
        userId: 11,
        serviceType: 'contract_review',
        status: 'submitted',
        contactPhone: '13800000001',
        keywords: '合同',
        orderBy: 'createdAt',
        order: 'desc'
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    expect(result.totalCount).toBe(1);
    expect(result.dataList[0].requestId).toBe(1001);
    expect(result.dataList[0].contactPhoneMasked).toBe('138****0001');
  });

  it('gets service request detail by request id', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        code: '0',
        msg: '',
        data: {
          requestId: 1001,
          appCode: 'lawsuit-material-assistant',
          userId: 11,
          identityId: 21,
          serviceType: 'contract_review',
          sourceRecordId: 31,
          clientRecordId: 'client-001',
          contactName: '张三',
          contactPhoneMasked: '138****0001',
          contactPhone: '13800000001',
          memo: '请帮忙看合同',
          status: 'submitted',
          handler: '',
          handlerId: null,
          adminRemark: '',
          createdAt: '2026-05-24T09:20:00',
          updatedAt: '2026-05-24T09:30:00',
          handledAt: ''
        }
      })
    } as Response);

    const result = await getLegalServiceRequestDetail(1001);

    expect(fetchMock).toHaveBeenCalledWith('/api/admin/legal/service-requests/1001', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    expect(result.contactPhone).toBe('13800000001');
  });

  it('posts service request status update to backend endpoint', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        code: '0',
        msg: '',
        data: {
          requestId: 1001,
          appCode: 'lawsuit-material-assistant',
          userId: 11,
          identityId: 21,
          serviceType: 'contract_review',
          sourceRecordId: 31,
          clientRecordId: 'client-001',
          contactName: '张三',
          contactPhoneMasked: '138****0001',
          contactPhone: '13800000001',
          memo: '请帮忙看合同',
          status: 'handled',
          handler: '管理员',
          handlerId: 'admin-1',
          adminRemark: '已电话回访',
          createdAt: '2026-05-24T09:20:00',
          updatedAt: '2026-05-24T10:30:00',
          handledAt: '2026-05-24T10:30:00'
        }
      })
    } as Response);

    const result = await updateLegalServiceRequestStatus(1001, {
      status: 'handled',
      adminRemark: '已电话回访'
    });

    expect(fetchMock).toHaveBeenCalledWith('/api/admin/legal/service-requests/1001/status', {
      method: 'POST',
      body: JSON.stringify({
        status: 'handled',
        adminRemark: '已电话回访'
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    expect(result.status).toBe('handled');
    expect(result.adminRemark).toBe('已电话回访');
  });
});
