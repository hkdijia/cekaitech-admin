import { mount } from '@vue/test-utils';
import ElementPlus from 'element-plus';
import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { nextTick } from 'vue';
import { pageUserOperationLogs } from '../../api/adminUserOperationLogs';
import UserOperationLogsPage from './UserOperationLogsPage.vue';

vi.mock('../../api/adminUserOperationLogs', () => ({
  pageUserOperationLogs: vi.fn()
}));

const pageUserOperationLogsMock = vi.mocked(pageUserOperationLogs);

const operationLog = {
  id: 1,
  userId: 11,
  operationType: 'legal_service_request_contact_view',
  beforeValue: '138****0001',
  afterValue: '13900000002',
  reason: '服务请求查看完整手机号',
  operatorId: 'admin-1',
  operatorName: '策凯管理员',
  createdAt: '2026-05-24T12:00:00'
};

function mountPage() {
  const pinia = createPinia();
  setActivePinia(pinia);
  return mount(UserOperationLogsPage, {
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

describe('UserOperationLogsPage', () => {
  beforeEach(() => {
    localStorage.clear();
    pageUserOperationLogsMock.mockReset();
    pageUserOperationLogsMock.mockResolvedValue({
      dataList: [operationLog],
      totalCount: 1
    });
  });

  it('loads operation logs on mount with normalized empty filters', async () => {
    mountPage();

    await flushAsyncUpdates();

    expect(pageUserOperationLogsMock).toHaveBeenCalledWith({
      pageNo: 1,
      pageSize: 10,
      userId: undefined,
      operationType: undefined,
      orderBy: 'createdAt',
      order: 'desc'
    });
  });

  it('sends numeric user id and selected operation type when searching', async () => {
    const wrapper = mountPage();

    await flushAsyncUpdates();
    pageUserOperationLogsMock.mockClear();

    await wrapper.find('.user-id-input input').setValue('11');
    setPageQuery(wrapper, {
      operationType: 'legal_service_request_contact_view'
    });
    await wrapper.find('button.el-button--primary').trigger('click');
    await flushAsyncUpdates();

    expect(pageUserOperationLogsMock).toHaveBeenCalledWith({
      pageNo: 1,
      pageSize: 10,
      userId: 11,
      operationType: 'legal_service_request_contact_view',
      orderBy: 'createdAt',
      order: 'desc'
    });
  });

  it.each(['0', '-1', '12.3', '9007199254740993', 'abc'])(
    'does not send invalid user id %s to backend',
    async (userId) => {
      const wrapper = mountPage();

      await flushAsyncUpdates();
      pageUserOperationLogsMock.mockClear();

      await wrapper.find('.user-id-input input').setValue(userId);
      await wrapper.find('button.el-button--primary').trigger('click');
      await flushAsyncUpdates();

      expect(pageUserOperationLogsMock).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: undefined
        })
      );
    }
  );

  it('renders operation type label, masked audit values, reason, operator and created time', async () => {
    const wrapper = mountPage();

    await flushAsyncUpdates();

    expect(wrapper.text()).toContain('服务请求联系方式查看');
    expect(wrapper.text()).toContain('138****0001');
    expect(wrapper.text()).toContain('139****0002');
    expect(wrapper.text()).not.toContain('13900000002');
    expect(wrapper.text()).toContain('服务请求查看完整手机号');
    expect(wrapper.text()).toContain('策凯管理员');
    expect(wrapper.text()).toContain('2026-05-24 12:00:00');
  });
});
