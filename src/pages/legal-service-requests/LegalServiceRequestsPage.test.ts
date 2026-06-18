import { mount } from '@vue/test-utils';
import ElementPlus from 'element-plus';
import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { nextTick } from 'vue';
import {
  createAdminOrderRefund,
  pageAdminOrderRefunds,
  syncAdminOrderRefund,
  updateAdminOrderRefundStatus
} from '../../api/adminOrders';
import {
  getLegalServiceRequestDetail,
  pageLegalServiceRequests,
  updateLegalServiceRequestStatus,
  createLegalServicePaymentOrder,
  viewLegalServiceRequestContact
} from '../../api/legalServiceRequests';
import { useAuthStore } from '../../stores/auth';
import LegalServiceRequestsPage from './LegalServiceRequestsPage.vue';
import type { AdminOrderRefund } from '../../api/adminOrders';

const routerPushMock = vi.hoisted(() => vi.fn());

vi.mock('../../api/legalServiceRequests', () => ({
  pageLegalServiceRequests: vi.fn(),
  getLegalServiceRequestDetail: vi.fn(),
  updateLegalServiceRequestStatus: vi.fn(),
  createLegalServicePaymentOrder: vi.fn(),
  viewLegalServiceRequestContact: vi.fn()
}));

vi.mock('../../api/adminOrders', () => ({
  pageAdminOrderRefunds: vi.fn(),
  createAdminOrderRefund: vi.fn(),
  updateAdminOrderRefundStatus: vi.fn(),
  syncAdminOrderRefund: vi.fn()
}));

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: routerPushMock
  })
}));

const pageLegalServiceRequestsMock = vi.mocked(pageLegalServiceRequests);
const getLegalServiceRequestDetailMock = vi.mocked(getLegalServiceRequestDetail);
const updateLegalServiceRequestStatusMock = vi.mocked(updateLegalServiceRequestStatus);
const createLegalServicePaymentOrderMock = vi.mocked(createLegalServicePaymentOrder);
const viewLegalServiceRequestContactMock = vi.mocked(viewLegalServiceRequestContact);
const pageAdminOrderRefundsMock = vi.mocked(pageAdminOrderRefunds);
const createAdminOrderRefundMock = vi.mocked(createAdminOrderRefund);
const updateAdminOrderRefundStatusMock = vi.mocked(updateAdminOrderRefundStatus);
const syncAdminOrderRefundMock = vi.mocked(syncAdminOrderRefund);

const serviceRequest = {
  requestId: 1001,
  appCode: 'lawsuit-material-assistant',
  userId: 11,
  identityId: 21,
  userCode: 'lma-4a378460',
  serviceType: 'contract_review',
  sourceRecordId: 31,
  clientRecordId: 'client-001',
  contactName: '张三',
  contactPhoneMasked: '138****0001',
  memo: '请帮忙看合同',
  status: 'submitted',
  paymentStatus: '',
  orderId: null,
  orderNo: '',
  amountTotal: null,
  orderStatus: '',
  handler: '',
  handlerId: null,
  adminRemark: '',
  createdAt: '2026-05-24T09:20:00',
  updatedAt: '2026-05-24T09:30:00',
  handledAt: ''
};

const serviceRequestDetail = {
  ...serviceRequest
};

const serviceRequestContactDetail = {
  ...serviceRequest,
  contactPhone: '13800000001'
};

function refundRecord(overrides: Partial<AdminOrderRefund> = {}): AdminOrderRefund {
  return {
    id: 1,
    refundId: 1,
    refundNo: 'MPR202606150001',
    orderId: 3002,
    orderNo: 'MPO202606150002',
    appCode: 'lawsuit-material-assistant',
    payerUserId: 11,
    payerIdentityId: 21,
    businessType: 'legal_service_request',
    businessId: 1001,
    productCode: 'contract_review',
    orderAmountTotal: 990,
    refundAmount: 990,
    currency: 'CNY',
    status: 'pending_review',
    reason: '用户申请退款',
    wechatRefundId: '',
    wechatRefundStatus: '',
    syncFailureCount: 0,
    nextSyncAt: '',
    lastSyncError: '',
    createdAt: '2026-06-15T10:00:00',
    updatedAt: '2026-06-15T10:00:00',
    ...overrides
  };
}

function mountPage(permissions: string[] = ['admin:legal-service-request:view']) {
  const pinia = createPinia();
  setActivePinia(pinia);
  const auth = useAuthStore();
  auth.token = 'token';
  auth.operator = {
    id: 'admin-1',
    name: '管理员',
    roleCode: 'operator',
    roleName: '运营',
    permissions
  };
  return mount(LegalServiceRequestsPage, {
    global: {
      plugins: [pinia, ElementPlus]
    }
  });
}

function setPageQuery(wrapper: ReturnType<typeof mountPage>, values: Partial<Record<string, string | number>>) {
  Object.assign((wrapper.vm as unknown as { query: Record<string, string | number> }).query, values);
}

async function flushAsyncUpdates() {
  for (let index = 0; index < 8; index += 1) {
    await Promise.resolve();
    await nextTick();
  }
}

describe('LegalServiceRequestsPage', () => {
  beforeEach(() => {
    localStorage.clear();
    pageLegalServiceRequestsMock.mockReset();
    getLegalServiceRequestDetailMock.mockReset();
    updateLegalServiceRequestStatusMock.mockReset();
    createLegalServicePaymentOrderMock.mockReset();
    viewLegalServiceRequestContactMock.mockReset();
    pageAdminOrderRefundsMock.mockReset();
    createAdminOrderRefundMock.mockReset();
    updateAdminOrderRefundStatusMock.mockReset();
    syncAdminOrderRefundMock.mockReset();
    routerPushMock.mockReset();
    pageLegalServiceRequestsMock.mockResolvedValue({
      dataList: [serviceRequest],
      totalCount: 1
    });
    getLegalServiceRequestDetailMock.mockResolvedValue(serviceRequestDetail);
    viewLegalServiceRequestContactMock.mockResolvedValue(serviceRequestContactDetail);
    updateLegalServiceRequestStatusMock.mockResolvedValue({
      ...serviceRequestContactDetail,
      status: 'handled',
      handler: '管理员',
      handlerId: 'admin-1',
      adminRemark: '已电话回访',
      handledAt: '2026-05-24T10:30:00'
    });
    createLegalServicePaymentOrderMock.mockResolvedValue({
      ...serviceRequest,
      status: 'waiting_pay',
      paymentStatus: 'pending_pay',
      orderId: 3001,
      orderNo: 'MPO202606150001',
      amountTotal: 990,
      orderStatus: 'pending_pay',
      adminRemark: '9.9 元测试订单'
    });
    pageAdminOrderRefundsMock.mockResolvedValue({
      dataList: [],
      totalCount: 0
    });
    createAdminOrderRefundMock.mockResolvedValue({
      ...refundRecord()
    });
    updateAdminOrderRefundStatusMock.mockResolvedValue({
      ...refundRecord({ status: 'approved', reason: '同意退款' })
    });
    syncAdminOrderRefundMock.mockResolvedValue({
      ...refundRecord({ status: 'success', reason: '同意退款' })
    });
  });

  it('loads service requests on mount with normalized empty filters', async () => {
    mountPage();

    await flushAsyncUpdates();

    expect(pageLegalServiceRequestsMock).toHaveBeenCalledWith({
      pageNo: 1,
      pageSize: 10,
      appCode: undefined,
      userId: undefined,
      serviceType: undefined,
      status: undefined,
      contactPhone: undefined,
      keywords: undefined,
      orderBy: 'createdAt',
      order: 'desc'
    });
  });

  it('sends expected query after keyword, user id, phone, service type, status and app filters change', async () => {
    const wrapper = mountPage();

    await flushAsyncUpdates();
    pageLegalServiceRequestsMock.mockClear();

    await wrapper.find('.keyword-input input').setValue(' 合同 ');
    await wrapper.find('.user-id-input input').setValue('11');
    await wrapper.find('.phone-input input').setValue(' 13800000001 ');
    setPageQuery(wrapper, {
      serviceType: 'contract_review',
      status: 'submitted',
      appCode: 'lawsuit-material-assistant'
    });
    await wrapper.find('button.el-button--primary').trigger('click');
    await flushAsyncUpdates();

    expect(pageLegalServiceRequestsMock).toHaveBeenCalledWith({
      pageNo: 1,
      pageSize: 10,
      appCode: 'lawsuit-material-assistant',
      userId: 11,
      serviceType: 'contract_review',
      status: 'submitted',
      contactPhone: '13800000001',
      keywords: '合同',
      orderBy: 'createdAt',
      order: 'desc'
    });
  });

  it('sends contract template service type after the contract template filter is selected', async () => {
    const wrapper = mountPage();

    await flushAsyncUpdates();
    pageLegalServiceRequestsMock.mockClear();

    const serviceTypeOptions = (wrapper.vm as unknown as { serviceTypeOptions: Array<{ label: string; value: string }> })
      .serviceTypeOptions;
    expect(serviceTypeOptions).toContainEqual({
      label: '合同模板',
      value: 'contract_template'
    });

    setPageQuery(wrapper, {
      serviceType: 'contract_template'
    });
    await wrapper.find('button.el-button--primary').trigger('click');
    await flushAsyncUpdates();

    expect(pageLegalServiceRequestsMock).toHaveBeenCalledWith(
      expect.objectContaining({
        serviceType: 'contract_template'
      })
    );
  });

  it.each(['0', '-1', '12.3', 'abc', '9007199254740993'])('does not send invalid user id %s to backend', async (userId) => {
    const wrapper = mountPage();

    await flushAsyncUpdates();
    pageLegalServiceRequestsMock.mockClear();

    await wrapper.find('.user-id-input input').setValue(userId);
    await wrapper.find('button.el-button--primary').trigger('click');
    await flushAsyncUpdates();

    expect(pageLegalServiceRequestsMock).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: undefined
      })
    );
  });

  it('opens detail drawer and jumps to users page from detail user id', async () => {
    const wrapper = mountPage();

    await flushAsyncUpdates();
    const detailButton = wrapper.findAll('button').find((button) => button.text().includes('查看详情'));
    await detailButton?.trigger('click');
    await flushAsyncUpdates();

    expect(getLegalServiceRequestDetailMock).toHaveBeenCalledWith(1001);
    expect(wrapper.text()).toContain('lma-4a378460');
    expect(wrapper.text()).toContain('138****0001');
    expect(wrapper.text()).not.toContain('13800000001');

    const userButton = wrapper.findAll('button').find((button) => button.text().includes('查看用户'));
    await userButton?.trigger('click');

    expect(routerPushMock).toHaveBeenCalledWith({
      path: '/users',
      query: { userId: '11' }
    });
  });

  it('uses a wider service request detail drawer for operational details', async () => {
    const wrapper = mountPage();

    await flushAsyncUpdates();

    const drawer = wrapper.findComponent({ name: 'ElDrawer' });
    expect(drawer.props('size')).toBe('760px');
  });

  it('shows user code in the table instead of only raw user id', async () => {
    const wrapper = mountPage();

    await flushAsyncUpdates();

    expect(wrapper.text()).toContain('lma-4a378460');
    expect(wrapper.text()).toContain('用户编号');
  });

  it('shows payment and refund aware business status in the request table', async () => {
    pageLegalServiceRequestsMock.mockResolvedValueOnce({
      dataList: [
        {
          ...serviceRequest,
          requestId: 1002,
          status: 'submitted',
          paymentStatus: 'paid',
          orderId: 3002,
          orderNo: 'MPO202606150002',
          amountTotal: 990,
          orderStatus: 'paid'
        },
        {
          ...serviceRequest,
          requestId: 1003,
          status: 'submitted',
          paymentStatus: 'paid',
          orderId: 3003,
          orderNo: 'MPO202606150003',
          amountTotal: 990,
          orderStatus: 'refunded'
        },
        {
          ...serviceRequest,
          requestId: 1004,
          status: 'waiting_pay',
          paymentStatus: 'pending_pay',
          orderId: 3004,
          orderNo: 'MPO202606150004',
          amountTotal: 990,
          orderStatus: 'pending_pay'
        }
      ],
      totalCount: 3
    });
    const wrapper = mountPage();

    await flushAsyncUpdates();

    expect(wrapper.text()).toContain('已支付待服务');
    expect(wrapper.text()).toContain('已退款');
    expect(wrapper.text()).toContain('待支付');
    expect(wrapper.findAll('.el-tag').map((tag) => tag.text())).not.toContain('待处理');
  });

  it('prioritizes handled request status over paid order status', async () => {
    pageLegalServiceRequestsMock.mockResolvedValueOnce({
      dataList: [
        {
          ...serviceRequest,
          requestId: 1005,
          status: 'handled',
          paymentStatus: 'paid',
          orderId: 3005,
          orderNo: 'MPO202606180005',
          amountTotal: 990,
          orderStatus: 'paid',
          handler: '策凯管理员',
          handlerId: 'admin',
          adminRemark: '已完成',
          handledAt: '2026-06-18T13:52:39'
        }
      ],
      totalCount: 1
    });
    const wrapper = mountPage();

    await flushAsyncUpdates();

    expect(wrapper.text()).toContain('已处理');
    expect(wrapper.findAll('.el-tag').map((tag) => tag.text())).not.toContain('已支付待服务');
  });

  it('shows masked phone first and reveals full phone after explicit contact view request', async () => {
    const wrapper = mountPage(['admin:legal-service-request:view']);

    await flushAsyncUpdates();
    const detailButton = wrapper.findAll('button').find((button) => button.text().includes('查看详情'));
    await detailButton?.trigger('click');
    await flushAsyncUpdates();

    expect(wrapper.text()).toContain('138****0001');
    expect(wrapper.text()).not.toContain('13800000001');
    expect(viewLegalServiceRequestContactMock).not.toHaveBeenCalled();

    const viewContactButton = wrapper.findAll('button').find((button) => button.text().includes('查看完整手机号'));
    expect(viewContactButton?.exists()).toBe(true);
    await viewContactButton?.trigger('click');
    await flushAsyncUpdates();

    expect(viewLegalServiceRequestContactMock).toHaveBeenCalledWith(1001);
    expect(wrapper.text()).toContain('13800000001');
  });

  it('shows contact view error when full phone request fails', async () => {
    viewLegalServiceRequestContactMock.mockRejectedValueOnce(new Error('无权查看联系方式'));
    const wrapper = mountPage(['admin:legal-service-request:view']);

    await flushAsyncUpdates();
    const detailButton = wrapper.findAll('button').find((button) => button.text().includes('查看详情'));
    await detailButton?.trigger('click');
    await flushAsyncUpdates();

    const viewContactButton = wrapper.findAll('button').find((button) => button.text().includes('查看完整手机号'));
    await viewContactButton?.trigger('click');
    await flushAsyncUpdates();

    expect(viewLegalServiceRequestContactMock).toHaveBeenCalledWith(1001);
    expect(wrapper.text()).toContain('无权查看联系方式');
    expect(wrapper.text()).not.toContain('13800000001');
  });

  it('shows contact view button for users with view permission only', async () => {
    const wrapper = mountPage(['admin:legal-service-request:view']);

    await flushAsyncUpdates();
    const detailButton = wrapper.findAll('button').find((button) => button.text().includes('查看详情'));
    await detailButton?.trigger('click');
    await flushAsyncUpdates();

    expect(wrapper.text()).toContain('查看完整手机号');
    expect(wrapper.text()).not.toContain('保存状态');
  });

  it('shows status update entry and calls update api when manage permission exists', async () => {
    const wrapper = mountPage(['admin:legal-service-request:view', 'admin:legal-service-request:manage']);

    await flushAsyncUpdates();
    const detailButton = wrapper.findAll('button').find((button) => button.text().includes('查看详情'));
    await detailButton?.trigger('click');
    await flushAsyncUpdates();

    expect(wrapper.text()).toContain('保存状态');

    setPageQuery(wrapper, {});
    (wrapper.vm as unknown as { statusForm: { status: string; adminRemark: string } }).statusForm.status = 'handled';
    (wrapper.vm as unknown as { statusForm: { status: string; adminRemark: string } }).statusForm.adminRemark = '已电话回访';
    const saveButton = wrapper.findAll('button').find((button) => button.text().includes('保存状态'));
    await saveButton?.trigger('click');
    await flushAsyncUpdates();

    expect(updateLegalServiceRequestStatusMock).toHaveBeenCalledWith(1001, {
      status: 'handled',
      adminRemark: '已电话回访'
    });
  });

  it('creates a payment order from service request detail when no order exists', async () => {
    const wrapper = mountPage(['admin:legal-service-request:view', 'admin:legal-service-request:manage']);

    await flushAsyncUpdates();
    const detailButton = wrapper.findAll('button').find((button) => button.text().includes('查看详情'));
    await detailButton?.trigger('click');
    await flushAsyncUpdates();

    expect(wrapper.text()).toContain('创建待支付订单');

    (wrapper.vm as unknown as { paymentOrderForm: { amountYuan: string; subject: string; adminRemark: string } }).paymentOrderForm.amountYuan = '9.9';
    (wrapper.vm as unknown as { paymentOrderForm: { amountYuan: string; subject: string; adminRemark: string } }).paymentOrderForm.subject = '合同模板咨询';
    (wrapper.vm as unknown as { paymentOrderForm: { amountYuan: string; subject: string; adminRemark: string } }).paymentOrderForm.adminRemark = '9.9 元测试订单';
    const createButton = wrapper.findAll('button').find((button) => button.text().includes('创建待支付订单'));
    await createButton?.trigger('click');
    await flushAsyncUpdates();

    expect(createLegalServicePaymentOrderMock).toHaveBeenCalledWith(1001, {
      amountTotal: 990,
      subject: '合同模板咨询',
      adminRemark: '9.9 元测试订单'
    });
    expect(wrapper.text()).toContain('MPO202606150001');
  });

  it('shows existing order and refund handling hint in service request detail', async () => {
    getLegalServiceRequestDetailMock.mockResolvedValueOnce({
      ...serviceRequest,
      status: 'submitted',
      paymentStatus: 'paid',
      orderId: 3002,
      orderNo: 'MPO202606150002',
      amountTotal: 990,
      orderStatus: 'paid'
    });
    const wrapper = mountPage(['admin:legal-service-request:view', 'admin:legal-service-request:manage']);

    await flushAsyncUpdates();
    const detailButton = wrapper.findAll('button').find((button) => button.text().includes('查看详情'));
    await detailButton?.trigger('click');
    await flushAsyncUpdates();

    expect(wrapper.text()).toContain('MPO202606150002');
    expect(wrapper.text()).toContain('9.90 元');
    expect(wrapper.text()).toContain('退款处理');
    expect(pageAdminOrderRefundsMock).toHaveBeenCalledWith(expect.objectContaining({
      keywords: 'MPO202606150002'
    }));
  });

  it('shows terminal refund handling copy for fully refunded service request detail', async () => {
    getLegalServiceRequestDetailMock.mockResolvedValueOnce({
      ...serviceRequest,
      status: 'closed',
      paymentStatus: 'paid',
      orderId: 3002,
      orderNo: 'MPO202606150002',
      amountTotal: 990,
      orderStatus: 'refunded'
    });
    pageAdminOrderRefundsMock.mockResolvedValueOnce({
      dataList: [refundRecord({ status: 'success' })],
      totalCount: 1
    });
    const wrapper = mountPage(['admin:legal-service-request:view', 'admin:legal-service-request:manage']);

    await flushAsyncUpdates();
    const detailButton = wrapper.findAll('button').find((button) => button.text().includes('查看详情'));
    await detailButton?.trigger('click');
    await flushAsyncUpdates();

    expect(wrapper.text()).toContain('已完成退款');
    expect(wrapper.text()).not.toContain('当前订单可在此创建退款申请并推进审核、发起、同步。');
    expect(wrapper.findAll('button').map((button) => button.text())).not.toContain('创建退款申请');
  });

  it('refreshes service request detail and refund records from drawer header', async () => {
    getLegalServiceRequestDetailMock
      .mockResolvedValueOnce({
        ...serviceRequest,
        status: 'waiting_pay',
        paymentStatus: 'pending_pay',
        orderId: 3002,
        orderNo: 'MPO202606150002',
        amountTotal: 990,
        orderStatus: 'pending_pay'
      })
      .mockResolvedValueOnce({
        ...serviceRequest,
        status: 'submitted',
        paymentStatus: 'paid',
        orderId: 3002,
        orderNo: 'MPO202606150002',
        amountTotal: 990,
        orderStatus: 'paid',
        updatedAt: '2026-06-15T17:08:28'
      });
    pageAdminOrderRefundsMock
      .mockResolvedValueOnce({
        dataList: [],
        totalCount: 0
      })
      .mockResolvedValueOnce({
        dataList: [refundRecord({ status: 'pending_review' })],
        totalCount: 1
      });
    const wrapper = mountPage(['admin:legal-service-request:view', 'admin:legal-service-request:manage']);

    await flushAsyncUpdates();
    const detailButton = wrapper.findAll('button').find((button) => button.text().includes('查看详情'));
    await detailButton?.trigger('click');
    await flushAsyncUpdates();

    expect(wrapper.text()).toContain('待支付');
    pageLegalServiceRequestsMock.mockClear();

    const refreshButton = wrapper.findAll('button').find((button) => button.text().includes('刷新'));
    expect(refreshButton?.exists()).toBe(true);
    await refreshButton?.trigger('click');
    await flushAsyncUpdates();

    expect(getLegalServiceRequestDetailMock).toHaveBeenCalledTimes(2);
    expect(pageAdminOrderRefundsMock).toHaveBeenCalledTimes(2);
    expect(pageLegalServiceRequestsMock).toHaveBeenCalledTimes(1);
    expect(wrapper.text()).toContain('已支付待服务');
    expect(wrapper.text()).toContain('MPR202606150001');
  });

  it('creates and processes full refund from paid service request detail', async () => {
    const paidDetail = {
      ...serviceRequest,
      status: 'submitted',
      paymentStatus: 'paid',
      orderId: 3002,
      orderNo: 'MPO202606150002',
      amountTotal: 990,
      orderStatus: 'paid'
    };
    getLegalServiceRequestDetailMock
      .mockResolvedValueOnce(paidDetail)
      .mockResolvedValueOnce(paidDetail)
      .mockResolvedValueOnce(paidDetail)
      .mockResolvedValueOnce(paidDetail)
      .mockResolvedValueOnce({
        ...paidDetail,
        orderStatus: 'refunded',
        updatedAt: '2026-06-15T17:10:46'
      });
    pageAdminOrderRefundsMock.mockResolvedValueOnce({
      dataList: [],
      totalCount: 0
    }).mockResolvedValueOnce({
      dataList: [refundRecord()],
      totalCount: 1
    }).mockResolvedValueOnce({
      dataList: [refundRecord({ status: 'approved', reason: '同意退款' })],
      totalCount: 1
    }).mockResolvedValueOnce({
      dataList: [refundRecord({ status: 'processing', reason: '发起微信退款' })],
      totalCount: 1
    }).mockResolvedValueOnce({
      dataList: [refundRecord({ status: 'success', reason: '发起微信退款' })],
      totalCount: 1
    });
    updateAdminOrderRefundStatusMock
      .mockResolvedValueOnce({
        ...refundRecord({ status: 'approved', reason: '同意退款' })
      })
      .mockResolvedValueOnce({
        ...refundRecord({ status: 'processing', reason: '发起微信退款' })
      });
    const wrapper = mountPage(['admin:legal-service-request:view', 'admin:legal-service-request:manage']);

    await flushAsyncUpdates();
    const detailButton = wrapper.findAll('button').find((button) => button.text().includes('查看详情'));
    await detailButton?.trigger('click');
    await flushAsyncUpdates();

    (wrapper.vm as unknown as { refundForm: { refundAmountYuan: string; reason: string } }).refundForm.refundAmountYuan = '9.9';
    (wrapper.vm as unknown as { refundForm: { refundAmountYuan: string; reason: string } }).refundForm.reason = '用户申请退款';
    const createRefundButton = wrapper.findAll('button').find((button) => button.text().includes('创建退款申请'));
    await createRefundButton?.trigger('click');
    await flushAsyncUpdates();

    expect(createAdminOrderRefundMock).toHaveBeenCalledWith({
      orderId: 3002,
      refundAmount: 990,
      reason: '用户申请退款'
    });
    expect(wrapper.text()).toContain('MPR202606150001');

    const approveButton = wrapper.findAll('button').find((button) => button.text().includes('审核通过'));
    await approveButton?.trigger('click');
    await flushAsyncUpdates();
    const processingButton = wrapper.findAll('button').find((button) => button.text().includes('发起退款'));
    await processingButton?.trigger('click');
    await flushAsyncUpdates();
    const syncButton = wrapper.findAll('button').find((button) => button.text().includes('同步退款'));
    await syncButton?.trigger('click');
    await flushAsyncUpdates();

    expect(updateAdminOrderRefundStatusMock).toHaveBeenCalledWith(1, {
      status: 'approved',
      reason: '同意退款'
    });
    expect(updateAdminOrderRefundStatusMock).toHaveBeenCalledWith(1, {
      status: 'processing',
      reason: '发起微信退款'
    });
    expect(syncAdminOrderRefundMock).toHaveBeenCalledWith(1);
    expect(getLegalServiceRequestDetailMock).toHaveBeenCalledTimes(5);
    expect(wrapper.text()).toContain('已完成退款');
  });

  it('hides status update entry when manage permission is missing', async () => {
    const wrapper = mountPage(['admin:legal-service-request:view']);

    await flushAsyncUpdates();
    const detailButton = wrapper.findAll('button').find((button) => button.text().includes('查看详情'));
    await detailButton?.trigger('click');
    await flushAsyncUpdates();

    expect(wrapper.text()).not.toContain('保存状态');
  });
});
