import { describe, expect, it, vi } from 'vitest';
import {
  createAdminOrderRefund,
  pageAdminOrderRefunds,
  syncAdminOrderRefund,
  updateAdminOrderRefundStatus
} from './adminOrders';

describe('admin orders api', () => {
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
});
