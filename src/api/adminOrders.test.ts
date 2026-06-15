import { describe, expect, it, vi } from 'vitest';
import {
  createAdminOrderRefund,
  getAdminOrderRefundSyncAbnormal,
  pageAdminOrderRefundNotifies,
  pageAdminOrderRefunds,
  pageAdminOrders,
  summarizeAdminOrderRefundNotifies,
  summarizeAdminOrderRefunds,
  summarizeAdminOrders,
  syncAdminOrderPayment,
  syncAdminOrderRefund,
  updateAdminOrderRefundStatus
} from './adminOrders';

describe('admin orders api', () => {
  it('pages and summarizes admin orders', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          code: '0',
          msg: '',
          data: {
            dataList: [{ orderId: 4, orderNo: 'MPO202606151707327D9E562F87EA', status: 'refunded' }],
            totalCount: 1
          }
        })
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          code: '0',
          msg: '',
          data: { totalCount: 1, paidCount: 1, refundedAmount: 990 }
        })
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          code: '0',
          msg: '',
          data: { orderId: 4, status: 'refunded' }
        })
      } as Response);

    const page = await pageAdminOrders({
      pageNo: 1,
      pageSize: 10,
      orderBy: 'createdAt',
      order: 'desc',
      appCode: 'lawsuit-material-assistant',
      businessType: 'legal_service_request',
      keywords: 'MPO202606151707327D9E562F87EA'
    });
    const summary = await summarizeAdminOrders({ appCode: 'lawsuit-material-assistant' });
    const synced = await syncAdminOrderPayment(4);

    expect(fetchMock).toHaveBeenNthCalledWith(1, '/api/admin/orders/page', {
      method: 'POST',
      body: JSON.stringify({
        pageNo: 1,
        pageSize: 10,
        orderBy: 'createdAt',
        order: 'desc',
        appCode: 'lawsuit-material-assistant',
        businessType: 'legal_service_request',
        keywords: 'MPO202606151707327D9E562F87EA'
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    expect(fetchMock).toHaveBeenNthCalledWith(2, '/api/admin/orders/summary', {
      method: 'POST',
      body: JSON.stringify({ appCode: 'lawsuit-material-assistant' }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    expect(fetchMock).toHaveBeenNthCalledWith(3, '/api/admin/orders/4/sync-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    expect(page.totalCount).toBe(1);
    expect(summary.refundedAmount).toBe(990);
    expect(synced.status).toBe('refunded');
  });

  it('pages order refunds by order keywords', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        code: '0',
        msg: '',
        data: {
          dataList: [{ refundId: 1, refundNo: 'MPR202606150001', status: 'pending_review' }],
          totalCount: 1
        }
      })
    } as Response);

    const result = await pageAdminOrderRefunds({
      pageNo: 1,
      pageSize: 10,
      orderBy: 'createdAt',
      order: 'desc',
      keywords: 'MPO202606150001'
    });

    expect(fetchMock).toHaveBeenCalledWith('/api/admin/order-refunds/page', {
      method: 'POST',
      body: JSON.stringify({
        pageNo: 1,
        pageSize: 10,
        orderBy: 'createdAt',
        order: 'desc',
        keywords: 'MPO202606150001'
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    expect(result.totalCount).toBe(1);
  });

  it('creates, updates and syncs order refund', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, code: '0', msg: '', data: { refundId: 1, status: 'pending_review' } })
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, code: '0', msg: '', data: { refundId: 1, status: 'approved' } })
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, code: '0', msg: '', data: { refundId: 1, status: 'success' } })
      } as Response);

    await createAdminOrderRefund({ orderId: 3001, refundAmount: 990, reason: '用户申请退款' });
    await updateAdminOrderRefundStatus(1, { status: 'approved', reason: '同意退款' });
    const synced = await syncAdminOrderRefund(1);

    expect(fetchMock).toHaveBeenNthCalledWith(1, '/api/admin/order-refunds/create', {
      method: 'POST',
      body: JSON.stringify({ orderId: 3001, refundAmount: 990, reason: '用户申请退款' }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    expect(fetchMock).toHaveBeenNthCalledWith(2, '/api/admin/order-refunds/1/status', {
      method: 'POST',
      body: JSON.stringify({ status: 'approved', reason: '同意退款' }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    expect(fetchMock).toHaveBeenNthCalledWith(3, '/api/admin/order-refunds/1/sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    expect(synced.status).toBe('success');
  });

  it('summarizes refunds, pages refund notifies and returns sync abnormal dashboard', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          code: '0',
          msg: '',
          data: { totalCount: 1, successCount: 1, successRefundAmount: 990, syncAbnormalCount: 0 }
        })
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          code: '0',
          msg: '',
          data: {
            dataList: [{ notifyId: 1, refundNo: 'MPR20260615171033EA057597AE22', processStatus: 'success' }],
            totalCount: 1
          }
        })
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          code: '0',
          msg: '',
          data: { totalCount: 1, successCount: 1, failedCount: 0, retryableFailedCount: 0 }
        })
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          code: '0',
          msg: '',
          data: { abnormalCount: 0, readyToRetryCount: 0, latestRefunds: [] }
        })
      } as Response);

    const refundSummary = await summarizeAdminOrderRefunds({ appCode: 'lawsuit-material-assistant' });
    const notifies = await pageAdminOrderRefundNotifies({
      pageNo: 1,
      pageSize: 10,
      orderBy: 'createdAt',
      order: 'desc',
      processStatus: 'success'
    });
    const notifySummary = await summarizeAdminOrderRefundNotifies();
    const abnormal = await getAdminOrderRefundSyncAbnormal({ appCode: 'lawsuit-material-assistant' });

    expect(fetchMock).toHaveBeenNthCalledWith(1, '/api/admin/order-refunds/summary', {
      method: 'POST',
      body: JSON.stringify({ appCode: 'lawsuit-material-assistant' }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    expect(fetchMock).toHaveBeenNthCalledWith(2, '/api/admin/order-refund-notifies/page', {
      method: 'POST',
      body: JSON.stringify({
        pageNo: 1,
        pageSize: 10,
        orderBy: 'createdAt',
        order: 'desc',
        processStatus: 'success'
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    expect(fetchMock).toHaveBeenNthCalledWith(3, '/api/admin/order-refund-notifies/summary', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    expect(fetchMock).toHaveBeenNthCalledWith(4, '/api/admin/order-refunds/sync-abnormal', {
      method: 'POST',
      body: JSON.stringify({ appCode: 'lawsuit-material-assistant' }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    expect(refundSummary.successRefundAmount).toBe(990);
    expect(notifies.totalCount).toBe(1);
    expect(notifySummary.successCount).toBe(1);
    expect(abnormal.abnormalCount).toBe(0);
  });
});
