import { request } from './http';

export interface LegalFormEventPageQuery {
  pageNo: number;
  pageSize: number;
  orderBy: string;
  order: 'asc' | 'desc';
  appCode?: string;
  formType?: string;
  qualityStatus?: string;
  keywords?: string;
}

export interface LegalFormEventItem {
  id: number;
  userId: number;
  identityId: number;
  appCode: string;
  clientEventId: string;
  eventType: string;
  formType: string;
  qualityStatus: string;
  filledFieldCount: number;
  payloadPreview: string;
  createdAt: string;
}

export interface PageResult<T> {
  dataList: T[];
  totalCount: number;
}

export function pageLegalFormEvents(query: LegalFormEventPageQuery): Promise<PageResult<LegalFormEventItem>> {
  return request<PageResult<LegalFormEventItem>>('/api/admin/legal/form-events/page', {
    method: 'POST',
    body: JSON.stringify(query)
  });
}
