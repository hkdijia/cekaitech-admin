import { describe, expect, it, vi } from 'vitest';
import {
  cancelLegalCreditQueryTask,
  createLegalCreditQueryTask,
  getLegalCreditQueryTask,
  pageLegalCreditQueryTasks,
  publishLegalCreditQueryTask,
  requeueLegalCreditQueryTask,
  viewLegalCreditQuerySensitive
} from './legalCreditQueries';

describe('legal credit queries api', () => {
  it('posts page query to legal credit query tasks endpoint', async () => {
    const fetchMock = mockSuccess({
      dataList: [
        {
          taskId: 12,
          requestNo: 'LCQ202606170001',
          appCode: 'lawsuit-material-assistant',
          subjectType: 'person',
          subjectName: '张三',
          status: 'queued',
          resultSummary: '',
          createdBy: 'admin',
          createdAt: '2026-06-17T08:00:00',
          updatedAt: '2026-06-17T08:00:00'
        }
      ],
      totalCount: 1
    });

    const result = await pageLegalCreditQueryTasks({
      pageNo: 1,
      pageSize: 20,
      appCode: 'lawsuit-material-assistant',
      keyword: '张三',
      subjectType: 'person',
      status: 'queued',
      createdFrom: '2026-06-01',
      createdTo: '2026-06-17',
      orderBy: 'createdAt',
      order: 'desc'
    });

    expect(fetchMock).toHaveBeenCalledWith('/api/admin/legal/credit-query-tasks/page', {
      method: 'POST',
      body: JSON.stringify({
        pageNo: 1,
        pageSize: 20,
        appCode: 'lawsuit-material-assistant',
        keyword: '张三',
        subjectType: 'person',
        status: 'queued',
        createdFrom: '2026-06-01',
        createdTo: '2026-06-17',
        orderBy: 'createdAt',
        order: 'desc'
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    expect(result.totalCount).toBe(1);
    expect(result.dataList[0].requestNo).toBe('LCQ202606170001');
  });

  it('gets task detail by task id', async () => {
    const fetchMock = mockSuccess({
      taskId: 12,
      requestNo: 'LCQ202606170001',
      appCode: 'lawsuit-material-assistant',
      subjectType: 'person',
      subjectName: '张三',
      status: 'result_ready',
      resultSummary: '命中 1 条信用风险记录',
      result: {
        resultId: 30,
        resultStatus: 'success_with_result',
        resultJson: { totalCount: 1 },
        queriedAt: '2026-06-17T08:20:00',
        sourceSystem: 'crawler'
      },
      operationLogs: []
    });

    const result = await getLegalCreditQueryTask(12);

    expect(fetchMock).toHaveBeenCalledWith('/api/admin/legal/credit-query-tasks/12', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    expect(result.result?.resultStatus).toBe('success_with_result');
  });

  it('posts create task payload to backend endpoint', async () => {
    const fetchMock = mockSuccess({ taskId: 13, requestNo: 'LCQ202606170002', status: 'queued' });

    const result = await createLegalCreditQueryTask({
      appCode: 'lawsuit-material-assistant',
      subjectType: 'company',
      subjectName: '测试公司',
      identityNumber: '91330000TEST',
      queryReason: '律师白名单查询'
    });

    expect(fetchMock).toHaveBeenCalledWith('/api/admin/legal/credit-query-tasks', {
      method: 'POST',
      body: JSON.stringify({
        appCode: 'lawsuit-material-assistant',
        subjectType: 'company',
        subjectName: '测试公司',
        identityNumber: '91330000TEST',
        queryReason: '律师白名单查询'
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    expect(result.taskId).toBe(13);
  });

  it('posts task action requests to exact action endpoints', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(successResponse({ taskId: 12, status: 'cancelled' }))
      .mockResolvedValueOnce(successResponse({ taskId: 12, status: 'queued' }))
      .mockResolvedValueOnce(successResponse({ taskId: 12, status: 'published' }))
      .mockResolvedValueOnce(successResponse({ taskId: 12, subjectName: '张三', identityNumber: '3301********0012' }));

    await cancelLegalCreditQueryTask(12, { reason: '重复提交' });
    await requeueLegalCreditQueryTask(12, { reason: '重新查询' });
    await publishLegalCreditQueryTask(12, { remark: '复核通过' });
    await viewLegalCreditQuerySensitive(12, { reason: '人工复核' });

    expect(fetchMock).toHaveBeenNthCalledWith(1, '/api/admin/legal/credit-query-tasks/12/cancel', {
      method: 'POST',
      body: JSON.stringify({ reason: '重复提交' }),
      headers: { 'Content-Type': 'application/json' }
    });
    expect(fetchMock).toHaveBeenNthCalledWith(2, '/api/admin/legal/credit-query-tasks/12/requeue', {
      method: 'POST',
      body: JSON.stringify({ reason: '重新查询' }),
      headers: { 'Content-Type': 'application/json' }
    });
    expect(fetchMock).toHaveBeenNthCalledWith(3, '/api/admin/legal/credit-query-tasks/12/publish', {
      method: 'POST',
      body: JSON.stringify({ remark: '复核通过' }),
      headers: { 'Content-Type': 'application/json' }
    });
    expect(fetchMock).toHaveBeenNthCalledWith(4, '/api/admin/legal/credit-query-tasks/12/sensitive-view', {
      method: 'POST',
      body: JSON.stringify({ reason: '人工复核' }),
      headers: { 'Content-Type': 'application/json' }
    });
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
