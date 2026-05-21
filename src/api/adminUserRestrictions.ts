import { request } from './http';
import type { PageResult } from './adminUsers';

export interface UserRestrictionPageQuery {
  pageNo: number;
  pageSize: number;
  orderBy: string;
  order: 'asc' | 'desc';
  userId?: number;
  appCode?: string;
  restrictionType?: string;
  status?: string;
}

export interface UserRestrictionCreateRequest {
  userId: number;
  appCode: string;
  restrictionType: string;
  reason: string;
}

export interface UserRestrictionItem {
  id: number;
  userId: number;
  appCode: string;
  restrictionType: string;
  reason: string;
  status: string;
  startAt: string;
  endAt: string;
  createdAt: string;
  updatedAt: string;
}

export function pageUserRestrictions(
  query: UserRestrictionPageQuery
): Promise<PageResult<UserRestrictionItem>> {
  return request<PageResult<UserRestrictionItem>>('/api/admin/user-restrictions/page', {
    method: 'POST',
    body: JSON.stringify(query)
  });
}

export function createUserRestriction(requestBody: UserRestrictionCreateRequest): Promise<UserRestrictionItem> {
  return request<UserRestrictionItem>('/api/admin/user-restrictions/create', {
    method: 'POST',
    body: JSON.stringify(requestBody)
  });
}

export function cancelUserRestriction(id: number): Promise<UserRestrictionItem> {
  return request<UserRestrictionItem>('/api/admin/user-restrictions/cancel', {
    method: 'POST',
    body: JSON.stringify({ id })
  });
}
