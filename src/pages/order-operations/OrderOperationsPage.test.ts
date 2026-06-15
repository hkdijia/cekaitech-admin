import { mount } from '@vue/test-utils';
import ElementPlus from 'element-plus';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { nextTick } from 'vue';
import {
  getAdminOrderRefundSyncAbnormal,
  pageAdminOrderRefundNotifies,
  pageAdminOrderRefunds,
  pageAdminOrders,
  summarizeAdminOrderRefundNotifies,
  summarizeAdminOrderRefunds,
  summarizeAdminOrders,
  syncAdminOrderPayment
} from '../../api/adminOrders';
import OrderOperationsPage from './OrderOperationsPage.vue';

vi.mock('../../api/adminOrders', () => ({
  getAdminOrderRefundSyncAbnormal: vi.fn(),
  pageAdminOrderRefundNotifies: vi.fn(),
  pageAdminOrderRefunds: vi.fn(),
  pageAdminOrders: vi.fn(),
  summarizeAdminOrderRefundNotifies: vi.fn(),
  summarizeAdminOrderRefunds: vi.fn(),
  summarizeAdminOrders: vi.fn(),
  syncAdminOrderPayment: vi.fn()
}));

const getAdminOrderRefundSyncAbnormalMock = vi.mocked(getAdminOrderRefundSyncAbnormal);
const pageAdminOrderRefundNotifiesMock = vi.mocked(pageAdminOrderRefundNotifies);
const pageAdminOrderRefundsMock = vi.mocked(pageAdminOrderRefunds);
const pageAdminOrdersMock = vi.mocked(pageAdminOrders);
const summarizeAdminOrderRefundNotifiesMock = vi.mocked(summarizeAdminOrderRefundNotifies);
const summarizeAdminOrderRefundsMock = vi.mocked(summarizeAdminOrderRefunds);
const summarizeAdminOrdersMock = vi.mocked(summarizeAdminOrders);
const syncAdminOrderPaymentMock = vi.mocked(syncAdminOrderPayment);

function mountPage() {
  return mount(OrderOperationsPage, {
    global: {
      plugins: [ElementPlus]
    }
  });
}

async function flushAsyncUpdates() {
  for (let index = 0; index < 6; index += 1) {
    await Promise.resolve();
    await nextTick();
  }
}

describe('OrderOperationsPage', () => {
  beforeEach(() => {
    getAdminOrderRefundSyncAbnormalMock.mockReset();
    pageAdminOrderRefundNotifiesMock.mockReset();
    pageAdminOrderRefundsMock.mockReset();
    pageAdminOrdersMock.mockReset();
    summarizeAdminOrderRefundNotifiesMock.mockReset();
    summarizeAdminOrderRefundsMock.mockReset();
    summarizeAdminOrdersMock.mockReset();
    syncAdminOrderPaymentMock.mockReset();

    pageAdminOrdersMock.mockResolvedValue({
      dataList: [
        {
          id: 4,
          orderId: 4,
          orderNo: 'MPO202606151707327D9E562F87EA',
          appCode: 'lawsuit-material-assistant',
          payerUserId: 44,
          payerUserCode: 'lma-4a378460',
          payerIdentityId: 12,
          businessType: 'legal_service_request',
          businessId: 8,
          productCode: 'contract_template',
          subject: '法律增值服务',
          amountTotal: 990,
          refundedAmount: 990,
          refundableAmount: 0,
          currency: 'CNY',
          status: 'refunded',
          payChannel: 'wechat_jsapi',
          wechatAppId: 'wx-test',
          merchantId: '1746936970',
          wechatPrepayId: '',
          wechatTransactionId: '4200003158202606151956113240',
          wechatTradeState: 'SUCCESS',
          paymentNotifyCount: 1,
          refundCount: 1,
          refundNotifyCount: 1,
          latestRefundStatus: 'success',
          paidAt: '2026-06-15T17:08:28',
          createdAt: '2026-06-15T17:07:32',
          updatedAt: '2026-06-15T17:10:46'
        }
      ],
      totalCount: 1
    });
    summarizeAdminOrdersMock.mockResolvedValue({
      paidCount: 1,
      paidAmountTotal: 990,
      pendingCount: 0,
      pendingAmountTotal: 0,
      groups: []
    });
    pageAdminOrderRefundsMock.mockResolvedValue({ dataList: [], totalCount: 0 });
    summarizeAdminOrderRefundsMock.mockResolvedValue({
      totalCount: 0,
      totalRefundAmount: 0,
      pendingReviewCount: 0,
      pendingReviewAmount: 0,
      successCount: 0,
      successAmount: 0,
      syncAbnormalCount: 0,
      groups: []
    });
    pageAdminOrderRefundNotifiesMock.mockResolvedValue({ dataList: [], totalCount: 0 });
    summarizeAdminOrderRefundNotifiesMock.mockResolvedValue({
      totalCount: 0,
      successCount: 0,
      failedCount: 0,
      ignoredCount: 0,
      latestFailedAt: '',
      retryableFailedCount: 0,
      latestFailed: null
    });
    getAdminOrderRefundSyncAbnormalMock.mockResolvedValue({
      abnormalCount: 0,
      readyToRetryCount: 0,
      earliestNextSyncAt: '',
      latestRefunds: [],
      groups: []
    });
  });

  it('loads cross-miniapp order summary and order list', async () => {
    const wrapper = mountPage();

    await flushAsyncUpdates();

    expect(pageAdminOrdersMock).toHaveBeenCalledWith({
      pageNo: 1,
      pageSize: 10,
      orderBy: 'createdAt',
      order: 'desc',
      appCode: undefined,
      businessType: undefined,
      productCode: undefined,
      status: undefined,
      keywords: undefined
    });
    expect(summarizeAdminOrdersMock).toHaveBeenCalledWith({
      appCode: undefined,
      businessType: undefined,
      productCode: undefined
    });
    expect(wrapper.text()).toContain('订单与退款');
    expect(wrapper.text()).toContain('MPO202606151707327D9E562F87EA');
    expect(wrapper.text()).toContain('lma-4a378460');
    expect(wrapper.text()).toContain('已退款');
    expect(wrapper.text()).toContain('9.90');
  });

  it('loads refund, refund notify and sync abnormal operations tabs', async () => {
    pageAdminOrderRefundsMock.mockResolvedValueOnce({
      dataList: [
        {
          id: 3,
          refundId: 3,
          refundNo: 'MPR20260615171033EA057597AE22',
          orderId: 4,
          orderNo: 'MPO202606151707327D9E562F87EA',
          appCode: 'lawsuit-material-assistant',
          payerUserId: 44,
          payerIdentityId: 12,
          businessType: 'legal_service_request',
          businessId: 8,
          productCode: 'contract_template',
          orderAmountTotal: 990,
          refundAmount: 990,
          currency: 'CNY',
          status: 'success',
          reason: '真实退款自然回调验收',
          wechatRefundId: '50300007642026061524296814001',
          wechatRefundStatus: 'SUCCESS',
          syncFailureCount: 0,
          nextSyncAt: '',
          lastSyncError: '',
          createdAt: '2026-06-15T17:10:33',
          updatedAt: '2026-06-15T17:10:46'
        }
      ],
      totalCount: 1
    });
    summarizeAdminOrderRefundsMock.mockResolvedValueOnce({
      totalCount: 1,
      totalRefundAmount: 990,
      pendingReviewCount: 0,
      pendingReviewAmount: 0,
      successCount: 1,
      successAmount: 990,
      syncAbnormalCount: 0,
      groups: []
    });
    pageAdminOrderRefundNotifiesMock.mockResolvedValueOnce({
      dataList: [
        {
          id: 1,
          notifyId: 1,
          eventId: 'c69e21b9-bd8c-5dea-ab16-f024b6a2bce9',
          refundNo: 'MPR20260615171033EA057597AE22',
          orderNo: 'MPO202606151707327D9E562F87EA',
          wechatRefundId: '50300007642026061524296814001',
          refundStatus: 'SUCCESS',
          amountTotal: 990,
          refundAmount: 990,
          processStatus: 'success',
          errorMessage: '',
          retryCount: 0,
          lastRetryAt: '',
          retryStatus: '',
          lastRetryError: '',
          createdAt: '2026-06-15T17:10:46',
          updatedAt: '2026-06-15T17:10:46'
        }
      ],
      totalCount: 1
    });
    summarizeAdminOrderRefundNotifiesMock.mockResolvedValueOnce({
      totalCount: 1,
      successCount: 1,
      failedCount: 0,
      ignoredCount: 0,
      latestFailedAt: '',
      retryableFailedCount: 0,
      latestFailed: null
    });
    getAdminOrderRefundSyncAbnormalMock.mockResolvedValueOnce({
      abnormalCount: 0,
      readyToRetryCount: 0,
      earliestNextSyncAt: '',
      latestRefunds: [],
      groups: []
    });
    const wrapper = mountPage();
    await flushAsyncUpdates();

    await wrapper.find('[data-test="refund-tab"]').trigger('click');
    await flushAsyncUpdates();

    expect(pageAdminOrderRefundsMock).toHaveBeenCalled();
    expect(summarizeAdminOrderRefundsMock).toHaveBeenCalled();
    expect(wrapper.text()).toContain('MPR20260615171033EA057597AE22');
    expect(wrapper.text()).toContain('退款成功');
    expect(wrapper.text()).toContain('成功退款金额');

    await wrapper.find('[data-test="notify-tab"]').trigger('click');
    await flushAsyncUpdates();

    expect(pageAdminOrderRefundNotifiesMock).toHaveBeenCalled();
    expect(summarizeAdminOrderRefundNotifiesMock).toHaveBeenCalled();
    expect(wrapper.text()).toContain('c69e21b9-bd8c-5dea-ab16-f024b6a2bce9');
    expect(wrapper.text()).toContain('成功通知');

    await wrapper.find('[data-test="abnormal-tab"]').trigger('click');
    await flushAsyncUpdates();

    expect(getAdminOrderRefundSyncAbnormalMock).toHaveBeenCalled();
    expect(wrapper.text()).toContain('同步异常');
    expect(wrapper.text()).toContain('可重试');
  });
});
