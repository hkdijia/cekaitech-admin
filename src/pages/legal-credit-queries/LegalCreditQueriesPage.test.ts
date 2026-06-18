import { mount } from '@vue/test-utils';
import ElementPlus from 'element-plus';
import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { nextTick } from 'vue';
import {
  cancelLegalCreditQueryTask,
  approveLegalCreditQueryTask,
  getLegalCreditQueryTask,
  pageLegalCreditQueryTasks,
  publishLegalCreditQueryTask,
  requeueLegalCreditQueryTask,
  rejectLegalCreditQueryTask,
  viewLegalCreditQuerySensitive
} from '../../api/legalCreditQueries';
import { createMiniappAccessListEntry } from '../../api/miniappAccessList';
import { useAuthStore } from '../../stores/auth';
import LegalCreditQueriesPage from './LegalCreditQueriesPage.vue';

vi.mock('../../api/legalCreditQueries', () => ({
  pageLegalCreditQueryTasks: vi.fn(),
  getLegalCreditQueryTask: vi.fn(),
  approveLegalCreditQueryTask: vi.fn(),
  cancelLegalCreditQueryTask: vi.fn(),
  requeueLegalCreditQueryTask: vi.fn(),
  publishLegalCreditQueryTask: vi.fn(),
  rejectLegalCreditQueryTask: vi.fn(),
  viewLegalCreditQuerySensitive: vi.fn()
}));

vi.mock('../../api/miniappAccessList', () => ({
  createMiniappAccessListEntry: vi.fn()
}));

const pageLegalCreditQueryTasksMock = vi.mocked(pageLegalCreditQueryTasks);
const getLegalCreditQueryTaskMock = vi.mocked(getLegalCreditQueryTask);
const approveLegalCreditQueryTaskMock = vi.mocked(approveLegalCreditQueryTask);
const cancelLegalCreditQueryTaskMock = vi.mocked(cancelLegalCreditQueryTask);
const requeueLegalCreditQueryTaskMock = vi.mocked(requeueLegalCreditQueryTask);
const publishLegalCreditQueryTaskMock = vi.mocked(publishLegalCreditQueryTask);
const rejectLegalCreditQueryTaskMock = vi.mocked(rejectLegalCreditQueryTask);
const viewLegalCreditQuerySensitiveMock = vi.mocked(viewLegalCreditQuerySensitive);
const createMiniappAccessListEntryMock = vi.mocked(createMiniappAccessListEntry);

const taskSummary = {
  taskId: 12,
  requestNo: 'LCQ202606170001',
  appCode: 'lawsuit-material-assistant',
  userId: 14,
  identityId: 15,
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
    approveLegalCreditQueryTaskMock.mockReset();
    cancelLegalCreditQueryTaskMock.mockReset();
    requeueLegalCreditQueryTaskMock.mockReset();
    publishLegalCreditQueryTaskMock.mockReset();
    rejectLegalCreditQueryTaskMock.mockReset();
    viewLegalCreditQuerySensitiveMock.mockReset();
    createMiniappAccessListEntryMock.mockReset();
    pageLegalCreditQueryTasksMock.mockResolvedValue({
      dataList: [taskSummary],
      totalCount: 1
    });
    getLegalCreditQueryTaskMock.mockResolvedValue(taskDetail);
    approveLegalCreditQueryTaskMock.mockResolvedValue({ ...taskDetail, status: 'queued' });
    cancelLegalCreditQueryTaskMock.mockResolvedValue({ ...taskDetail, status: 'cancelled' });
    requeueLegalCreditQueryTaskMock.mockResolvedValue({ ...taskDetail, status: 'queued' });
    publishLegalCreditQueryTaskMock.mockResolvedValue({ ...taskDetail, status: 'published' });
    rejectLegalCreditQueryTaskMock.mockResolvedValue({ ...taskDetail, status: 'rejected' });
    viewLegalCreditQuerySensitiveMock.mockResolvedValue({
      taskId: 12,
      subjectName: '张三',
      identityNumber: '330100199001010012',
      queryReason: '律师白名单查询'
    });
    createMiniappAccessListEntryMock.mockResolvedValue({
      entryId: 8,
      appCode: 'lawsuit-material-assistant',
      capabilityCode: 'legal_credit_query',
      listType: 'allow',
      userId: 14,
      identityId: 15,
      userCode: 'lma-abcd1234',
      sourceType: 'manual',
      sourceRefId: '',
      reason: '失信限高查询审核通过后加入可信名单',
      status: 'active',
      createdAt: '2026-06-18T09:00:00',
      updatedAt: '2026-06-18T09:00:00'
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

  it('previews first result item from crawler result json shapes', async () => {
    getLegalCreditQueryTaskMock.mockResolvedValue({
      ...taskDetail,
      result: {
        ...taskDetail.result,
        resultJson: {
          totalCount: 1,
          items: [{ title: '限制高消费', court: '生产法院' }]
        }
      }
    });
    const wrapper = mountPage();
    await flushAsyncUpdates();

    const detailButton = wrapper.findAll('button').find((button) => button.text().includes('查看详情'));
    await detailButton?.trigger('click');
    await flushAsyncUpdates();

    expect(wrapper.text()).toContain('生产法院');
    expect(wrapper.text()).not.toContain('totalCount');
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
    expect(wrapper.text()).toContain('重新进入队列');
    expect(wrapper.text()).not.toContain('重排队');

    const requeueButton = wrapper.findAll('button').find((button) => button.text().includes('重新进入队列'));
    await requeueButton?.trigger('click');
    await flushAsyncUpdates();

    expect(cancelLegalCreditQueryTaskMock).toHaveBeenCalledWith(12, { reason: '后台人工取消' });
    expect(requeueLegalCreditQueryTaskMock).toHaveBeenCalledWith(12, { reason: '后台重新进入查询队列' });
  });

  it('approves and rejects pending review tasks', async () => {
    pageLegalCreditQueryTasksMock.mockResolvedValue({
      dataList: [{ ...taskSummary, status: 'pending_review', resultSummary: '' }],
      totalCount: 1
    });
    const wrapper = mountPage();
    await flushAsyncUpdates();

    expect(wrapper.text()).toContain('待审核');

    const approveButton = wrapper.findAll('button').find((button) => button.text().includes('通过并入队'));
    await approveButton?.trigger('click');
    await flushAsyncUpdates();
    const rejectButton = wrapper.findAll('button').find((button) => button.text().includes('驳回查询'));
    await rejectButton?.trigger('click');
    await flushAsyncUpdates();

    expect(approveLegalCreditQueryTaskMock).toHaveBeenCalledWith(12, { reason: '后台审核通过并进入查询队列' });
    expect(rejectLegalCreditQueryTaskMock).toHaveBeenCalledWith(12, { reason: '后台驳回本次查询' });
  });

  it('adds pending review requester to trusted list before approving into queue', async () => {
    pageLegalCreditQueryTasksMock.mockResolvedValue({
      dataList: [{ ...taskSummary, status: 'pending_review', resultSummary: '' }],
      totalCount: 1
    });
    const wrapper = mountPage();
    await flushAsyncUpdates();

    const trustButton = wrapper.findAll('button').find((button) => button.text().includes('加入可信并入队'));
    await trustButton?.trigger('click');
    await flushAsyncUpdates();

    expect(createMiniappAccessListEntryMock).toHaveBeenCalledWith({
      appCode: 'lawsuit-material-assistant',
      capabilityCode: 'legal_credit_query',
      listType: 'allow',
      userId: 14,
      identityId: 15,
      reason: '失信限高查询审核通过后加入可信名单'
    });
    expect(approveLegalCreditQueryTaskMock).toHaveBeenCalledWith(12, { reason: '加入可信名单后审核通过并进入查询队列' });
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
    expect(wrapper.text()).not.toContain('通过并入队');
    expect(wrapper.text()).not.toContain('驳回查询');
    expect(wrapper.text()).not.toContain('取消');
    expect(wrapper.text()).not.toContain('重新进入队列');
  });
});
