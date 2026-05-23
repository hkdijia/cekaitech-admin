import { request } from './http';

export interface GenerationRecordPageQuery {
  pageNo: number;
  pageSize: number;
  appCode?: string;
  userId?: number;
  status?: string;
  recordType?: string;
  keywords?: string;
  order: 'asc' | 'desc';
  orderBy: string;
}

export interface GenerationRecordItem {
  id: number;
  userId: number;
  identityId: number;
  appCode: string;
  clientRecordId: string;
  recordType: string;
  title: string;
  status: string;
  resultSummary: string;
  createdAt: string;
  updatedAt: string;
}

export interface PageResult<T> {
  dataList: T[];
  totalCount: number;
}

export function pageGenerationRecords(query: GenerationRecordPageQuery): Promise<PageResult<GenerationRecordItem>> {
  return request<PageResult<GenerationRecordItem>>('/api/admin/generation-records/page', {
    method: 'POST',
    body: JSON.stringify(query)
  });
}
