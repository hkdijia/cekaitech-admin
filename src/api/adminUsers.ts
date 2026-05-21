import { request } from './http';

export interface AdminUserPageQuery {
  pageNo: number;
  pageSize: number;
  orderBy: string;
  order: 'asc' | 'desc';
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
