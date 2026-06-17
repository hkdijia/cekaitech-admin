import { mount } from '@vue/test-utils';
import ElementPlus from 'element-plus';
import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { nextTick } from 'vue';
import {
  cancelLegalCreditQueryTask,
  getLegalCreditQueryTask,
  pageLegalCreditQueryTasks,
  publishLegalCreditQueryTask,
  requeueLegalCreditQueryTask,
  viewLegalCreditQuerySensitive
} from '../../api/legalCreditQueries';
import { useAuthStore } from '../../stores/auth';
import LegalCreditQueriesPage from './LegalCreditQueriesPage.vue';

vi.mock('../../api/legalCreditQueries', () => ({
  pageLegalCreditQueryTasks: vi.fn(),
  getLegalCreditQueryTask: vi.fn(),
  cancelLegalCreditQueryTask: vi.fn(),
  requeueLegalCreditQueryTask: vi.fn(),
  publishLegalCreditQueryTask: vi.fn(),
  viewLegalCreditQuerySensitive: vi.fn()
}));

const pageLegalCreditQueryTasksMock = vi.mocked(pageLegalCreditQueryTasks);
const getLegalCreditQueryTaskMock = vi.mocked(getLegalCreditQueryTask);
const cancelLegalCreditQueryTaskMock = vi.mocked(cancelLegalCreditQueryTask);
const requeueLegalCreditQueryTaskMock = vi.mocked(requeueLegalCreditQueryTask);
const publishLegalCreditQueryTaskMock = vi.mocked(publishLegalCreditQueryTask);
const viewLegalCreditQuerySensitiveMock = vi.mocked(viewLegalCreditQuerySensitive);

const taskSummary = {
  taskId: 12,
  requestNo: 'LCQ202606170001',
  appCode: 'lawsuit-material-assistant',
  userId: 14,
  userCode: 'lma-abcd1234',
  subjectType: 'person',
  subjectName: '张三',
  identityNumberMasked: '3301********0012',
  queryReason: '律师白名单查询',
  status: 'result_ready',
  resultSummary: '命中 1 条信用风险记录',
  createdBy: 'admin',
  createdAt: '2026-06-17T08:00:00',
  updatedAt: '2026-06-17T08:30:00'
};

const taskDetail = {
  ...taskSummary,
  identityNumber: null,
  result: {
    resultId: 31,
    resultStatus: 'success_with_result',
    resultSummary: '命中 1 条信用风险记录',
    resultJson: {
      totalCount: 1,
      records: [{ title: '限制高消费', court: '测试法院' }]
    },
    resultHash: 'sha256:abc',
    sourceSystem: 'crawler',
    schemaVersion: '1.0',
    queriedAt: '2026-06-17T08:20:00',
    publishedAt: ''
  },
  operationLogs: [
    {
      logId: 1,
      operationType: 'result',
      operatorType: 'worker',
      operatorId: 'local-credit-worker',
      operatorName: 'local-credit-worker',
      remark: 'worker wrote result',
      createdAt: '2026-06-17T08:20:00'
    }
  ]
};

function mountPage(permissions: string[] = ['admin:legal-credit-query:view', 'admin:legal-credit-query:manage']) {
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
  return mount(LegalCreditQueriesPage, {
    global: {
      plugins: [pinia, ElementPlus]
    }
  });
}

async function flushAsyncUpdates() {
  for (let index = 0; index < 8; index += 1) {
    await Promise.resolve();
    await nextTick();
  }
}

describe('LegalCreditQueriesPage', () => {
  beforeEach(() => {
    localStorage.clear();
    pageLegalCreditQueryTasksMock.mockReset();
    getLegalCreditQueryTaskMock.mockReset();
    cancelLegalCreditQueryTaskMock.mockReset();
    requeueLegalCreditQueryTaskMock.mockReset();
    publishLegalCreditQueryTaskMock.mockReset();
    viewLegalCreditQuerySensitiveMock.mockReset();
    pageLegalCreditQueryTasksMock.mockResolvedValue({
      dataList: [taskSummary],
      totalCount: 1
    });
    getLegalCreditQueryTaskMock.mockResolvedValue(taskDetail);
    cancelLegalCreditQueryTaskMock.mockResolvedValue({ ...taskDetail, status: 'cancelled' });
    requeueLegalCreditQueryTaskMock.mockResolvedValue({ ...taskDetail, status: 'queued' });
    publishLegalCreditQueryTaskMock.mockResolvedValue({ ...taskDetail, status: 'published' });
    viewLegalCreditQuerySensitiveMock.mockResolvedValue({
      taskId: 12,
      subjectName: '张三',
      identityNumber: '330100199001010012',
      queryReason: '律师白名单查询'
    });
  });

  it('loads tasks on mount and renders rows', async () => {
    const wrapper = mountPage();

    await flushAsyncUpdates();

    expect(pageLegalCreditQueryTasksMock).toHaveBeenCalledWith({
      pageNo: 1,
      pageSize: 10,
      appCode: undefined,
      keyword: undefined,
      subjectType: undefined,
      status: undefined,
      createdFrom: undefined,
      createdTo: undefined,
      orderBy: 'createdAt',
      order: 'desc'
    });
    expect(wrapper.text()).toContain('LCQ202606170001');
    expect(wrapper.text()).toContain('张三');
    expect(wrapper.text()).toContain('待复核');
  });

  it('loads detail drawer after clicking a row action', async () => {
    const wrapper = mountPage();
    await flushAsyncUpdates();

    const detailButton = wrapper.findAll('button').find((button) => button.text().includes('查看详情'));
    await detailButton?.trigger('click');
    await flushAsyncUpdates();

    expect(getLegalCreditQueryTaskMock).toHaveBeenCalledWith(12);
    expect(wrapper.text()).toContain('命中 1 条信用风险记录');
    expect(wrapper.text()).toContain('crawler');
    expect(wrapper.text()).toContain('测试法院');
  });

  it('publishes only result-ready task and refreshes list', async () => {
    const wrapper = mountPage();
    await flushAsyncUpdates();

    const publishButton = wrapper.findAll('button').find((button) => button.text().includes('发布结果'));
    await publishButton?.trigger('click');
    await flushAsyncUpdates();

    expect(publishLegalCreditQueryTaskMock).toHaveBeenCalledWith(12, { remark: '后台复核发布' });
    expect(pageLegalCreditQueryTasksMock).toHaveBeenCalledTimes(2);
  });

  it('calls cancel and requeue task actions', async () => {
    const wrapper = mountPage();
    await flushAsyncUpdates();

    const cancelButton = wrapper.findAll('button').find((button) => button.text().includes('取消'));
    await cancelButton?.trigger('click');
    await flushAsyncUpdates();
    const requeueButton = wrapper.findAll('button').find((button) => button.text().includes('重排队'));
    await requeueButton?.trigger('click');
    await flushAsyncUpdates();

    expect(cancelLegalCreditQueryTaskMock).toHaveBeenCalledWith(12, { reason: '后台人工取消' });
    expect(requeueLegalCreditQueryTaskMock).toHaveBeenCalledWith(12, { reason: '后台重新排队' });
  });

  it('reveals sensitive fields only after explicit click', async () => {
    const wrapper = mountPage();
    await flushAsyncUpdates();

    const detailButton = wrapper.findAll('button').find((button) => button.text().includes('查看详情'));
    await detailButton?.trigger('click');
    await flushAsyncUpdates();

    expect(wrapper.text()).toContain('3301********0012');
    expect(wrapper.text()).not.toContain('330100199001010012');

    const sensitiveButton = wrapper.findAll('button').find((button) => button.text().includes('查看敏感信息'));
    await sensitiveButton?.trigger('click');
    await flushAsyncUpdates();

    expect(viewLegalCreditQuerySensitiveMock).toHaveBeenCalledWith(12, { reason: '后台人工复核' });
    expect(wrapper.text()).toContain('330100199001010012');
  });

  it('hides manage actions when operator only has view permission', async () => {
    const wrapper = mountPage(['admin:legal-credit-query:view']);
    await flushAsyncUpdates();

    expect(wrapper.text()).toContain('查看详情');
    expect(wrapper.text()).not.toContain('发布结果');
    expect(wrapper.text()).not.toContain('取消');
    expect(wrapper.text()).not.toContain('重排队');
  });
});
