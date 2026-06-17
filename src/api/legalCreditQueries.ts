import { request } from './http';
import type { PageResult } from './legalServiceRequests';

export interface LegalCreditQueryPageRequest {
  pageNo: number;
  pageSize: number;
  appCode?: string;
  keyword?: string;
  subjectType?: string;
  status?: string;
  createdFrom?: string;
  createdTo?: string;
  orderBy: string;
  order: 'asc' | 'desc';
}

export interface LegalCreditQueryTaskSummary {
  taskId: number;
  requestNo: string;
  appCode: string;
  userId?: number | null;
  userCode?: string | null;
  subjectType: string;
  subjectName: string;
  identityNumberMasked?: string | null;
  queryReason?: string | null;
  status: string;
  resultSummary?: string | null;
  createdBy?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface LegalCreditQueryResult {
  resultId: number;
  resultStatus: string;
  resultSummary?: string | null;
  resultJson?: unknown | string | null;
  resultHash?: string | null;
  sourceSystem?: string | null;
  schemaVersion?: string | null;
  queriedAt?: string | null;
  publishedAt?: string | null;
}

export interface LegalCreditQueryOperationLog {
  logId: number;
  operationType: string;
  operatorType: string;
  operatorId?: string | number | null;
  operatorName?: string | null;
  remark?: string | null;
  createdAt: string;
}

export interface LegalCreditQueryTaskDetail extends LegalCreditQueryTaskSummary {
  identityNumber?: string | null;
  result?: LegalCreditQueryResult | null;
  operationLogs: LegalCreditQueryOperationLog[];
}

export interface LegalCreditQueryCreateRequest {
  appCode: string;
  subjectType: string;
  subjectName: string;
  identityNumber?: string;
  queryReason: string;
}

export interface LegalCreditQueryActionRequest {
  reason?: string;
  remark?: string;
}

export interface LegalCreditQuerySensitiveViewRequest {
  reason: string;
}

export interface LegalCreditQuerySensitiveViewResult {
  taskId: number;
  subjectName?: string | null;
  identityNumber?: string | null;
  queryReason?: string | null;
}

export function pageLegalCreditQueryTasks(
  payload: LegalCreditQueryPageRequest
): Promise<PageResult<LegalCreditQueryTaskSummary>> {
  return request<PageResult<LegalCreditQueryTaskSummary>>('/api/admin/legal/credit-query-tasks/page', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export function getLegalCreditQueryTask(taskId: number): Promise<LegalCreditQueryTaskDetail> {
  return request<LegalCreditQueryTaskDetail>(`/api/admin/legal/credit-query-tasks/${taskId}`, {
    method: 'GET'
  });
}

export function createLegalCreditQueryTask(
  payload: LegalCreditQueryCreateRequest
): Promise<LegalCreditQueryTaskSummary> {
  return request<LegalCreditQueryTaskSummary>('/api/admin/legal/credit-query-tasks', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export function cancelLegalCreditQueryTask(
  taskId: number,
  payload: LegalCreditQueryActionRequest
): Promise<LegalCreditQueryTaskDetail> {
  return postTaskAction(taskId, 'cancel', payload);
}

export function requeueLegalCreditQueryTask(
  taskId: number,
  payload: LegalCreditQueryActionRequest
): Promise<LegalCreditQueryTaskDetail> {
  return postTaskAction(taskId, 'requeue', payload);
}

export function publishLegalCreditQueryTask(
  taskId: number,
  payload: LegalCreditQueryActionRequest
): Promise<LegalCreditQueryTaskDetail> {
  return postTaskAction(taskId, 'publish', payload);
}

export function viewLegalCreditQuerySensitive(
  taskId: number,
  payload: LegalCreditQuerySensitiveViewRequest
): Promise<LegalCreditQuerySensitiveViewResult> {
  return request<LegalCreditQuerySensitiveViewResult>(
    `/api/admin/legal/credit-query-tasks/${taskId}/sensitive-view`,
    {
      method: 'POST',
      body: JSON.stringify(payload)
    }
  );
}

function postTaskAction(
  taskId: number,
  action: 'cancel' | 'requeue' | 'publish',
  payload: LegalCreditQueryActionRequest
): Promise<LegalCreditQueryTaskDetail> {
  return request<LegalCreditQueryTaskDetail>(`/api/admin/legal/credit-query-tasks/${taskId}/${action}`, {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}
