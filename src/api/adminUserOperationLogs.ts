import { request } from './http';
import type { PageResult } from './adminUsers';

export interface UserOperationLogPageQuery {
  pageNo: number;
  pageSize: number;
  orderBy: string;
  order: 'asc' | 'desc';
  userId?: number;
  operationType?: string;
}

export interface UserOperationLogItem {
  id: number;
  userId: number;
  operationType: string;
  beforeValue: string;
  afterValue: string;
  reason: string;
  operatorId: string;
  operatorName: string;
  createdAt: string;
}

export function pageUserOperationLogs(
  query: UserOperationLogPageQuery
): Promise<PageResult<UserOperationLogItem>> {
  return request<PageResult<UserOperationLogItem>>('/api/admin/user-operation-logs/page', {
    method: 'POST',
    body: JSON.stringify(query)
  });
}
