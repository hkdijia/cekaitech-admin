import { mount } from '@vue/test-utils';
import ElementPlus from 'element-plus';
import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { nextTick } from 'vue';
import {
  getLegalServiceRequestDetail,
  pageLegalServiceRequests,
  updateLegalServiceRequestStatus
} from '../../api/legalServiceRequests';
import { useAuthStore } from '../../stores/auth';
import LegalServiceRequestsPage from './LegalServiceRequestsPage.vue';

const routerPushMock = vi.hoisted(() => vi.fn());

vi.mock('../../api/legalServiceRequests', () => ({
  pageLegalServiceRequests: vi.fn(),
  getLegalServiceRequestDetail: vi.fn(),
  updateLegalServiceRequestStatus: vi.fn()
}));

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: routerPushMock
  })
}));

const pageLegalServiceRequestsMock = vi.mocked(pageLegalServiceRequests);
const getLegalServiceRequestDetailMock = vi.mocked(getLegalServiceRequestDetail);
const updateLegalServiceRequestStatusMock = vi.mocked(updateLegalServiceRequestStatus);

const serviceRequest = {
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
};

const serviceRequestDetail = {
  ...serviceRequest,
  contactPhone: '13800000001'
};

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
  for (let index = 0; index < 4; index += 1) {
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
    routerPushMock.mockReset();
    pageLegalServiceRequestsMock.mockResolvedValue({
      dataList: [serviceRequest],
      totalCount: 1
    });
    getLegalServiceRequestDetailMock.mockResolvedValue(serviceRequestDetail);
    updateLegalServiceRequestStatusMock.mockResolvedValue({
      ...serviceRequestDetail,
      status: 'handled',
      handler: '管理员',
      handlerId: 'admin-1',
      adminRemark: '已电话回访',
      handledAt: '2026-05-24T10:30:00'
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
    expect(wrapper.text()).toContain('13800000001');

    const userButton = wrapper.findAll('button').find((button) => button.text().includes('查看用户'));
    await userButton?.trigger('click');

    expect(routerPushMock).toHaveBeenCalledWith({
      path: '/users',
      query: { userId: '11' }
    });
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

  it('hides status update entry when manage permission is missing', async () => {
    const wrapper = mountPage(['admin:legal-service-request:view']);

    await flushAsyncUpdates();
    const detailButton = wrapper.findAll('button').find((button) => button.text().includes('查看详情'));
    await detailButton?.trigger('click');
    await flushAsyncUpdates();

    expect(wrapper.text()).not.toContain('保存状态');
  });
});
