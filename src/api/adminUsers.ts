import { request } from './http';

export interface AdminUserPageQuery {
  pageNo: number;
  pageSize: number;
  orderBy: string;
  order: 'asc' | 'desc';
  userId?: number;
  keywords?: string;
  status?: string;
  appCode?: string;
}

export interface AdminUserItem {
  id: number;
  primaryPhone: string;
  unionId: string;
  status: string;
  provider: string;
  appCode: string;
  providerUserId: string;
  phoneBindingStatus: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminUserIdentity {
  id: number;
  provider: string;
  appCode: string;
  providerUserId: string;
  unionId: string;
  phoneSnapshot: string;
  phoneBindingStatus: string;
  role: string;
  identityKey: string;
}

export interface AdminUserPhone {
  id: number;
  phone: string;
  sourceProvider: string;
  sourceAppCode: string;
  verifiedAt: string;
  status: string;
}

export interface AdminUserDetail extends AdminUserItem {
  identities: AdminUserIdentity[];
  phones: AdminUserPhone[];
}

export interface AdminSeedUsersResult {
  createdCount: number;
  totalCount: number;
  seededAt: string;
}

export interface AdminUserStatusUpdateRequest {
  userId: number;
  status: string;
  reason: string;
}

export interface PageResult<T> {
  dataList: T[];
  totalCount: number;
}

export function pageAdminUsers(query: AdminUserPageQuery): Promise<PageResult<AdminUserItem>> {
  return request<PageResult<AdminUserItem>>('/api/admin/users/page', {
    method: 'POST',
    body: JSON.stringify(query)
  });
}

export function getAdminUserDetail(userId: number): Promise<AdminUserDetail> {
  return request<AdminUserDetail>(`/api/admin/users/${userId}/detail`);
}

export function seedAdminUsers(): Promise<AdminSeedUsersResult> {
  return request<AdminSeedUsersResult>('/api/admin/dev/seed-users', {
    method: 'POST'
  });
}

export function updateAdminUserStatus(requestBody: AdminUserStatusUpdateRequest): Promise<AdminUserDetail> {
  return request<AdminUserDetail>('/api/admin/users/update-status', {
    method: 'POST',
    body: JSON.stringify(requestBody)
  });
}
