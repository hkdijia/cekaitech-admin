import { request } from './http';

export interface PageResult<T> {
  dataList: T[];
  totalCount: number;
}

export interface DataGovernancePageQuery {
  appCode: string;
  pageNo: number;
  pageSize: number;
}

export interface LprSyncBatchItem {
  id: number;
  appCode: string;
  batchNo: string;
  sourceVersion: string;
  itemCount: number;
  importedCount: number;
  status: string;
  message: string;
  createdAt: string;
  updatedAt: string;
}

export interface LprRateRevisionItem {
  id: number;
  appCode: string;
  batchNo: string;
  quoteDate: string;
  oneYearRate: number;
  fiveYearPlusRate: number;
  revisionType: string;
  sourceVersion: string;
  createdAt: string;
}

export interface LprRateSyncItem {
  quoteDate: string;
  oneYearRate: number;
  fiveYearPlusRate: number;
  sourceKey?: string;
  sourceName?: string;
  sourceUrl?: string;
  sourceVersion?: string;
  lastCheckedDate?: string;
  status?: string;
  sortOrder?: number;
  enabled?: boolean;
}

export interface LprRateSyncPayload {
  appCode: string;
  items: LprRateSyncItem[];
}

export interface LprRateSyncResult {
  batchNo: string;
  importedCount: number;
  revisionCount?: number;
}

export function pageLprSyncBatches(
  query: DataGovernancePageQuery
): Promise<PageResult<LprSyncBatchItem>> {
  return request<PageResult<LprSyncBatchItem>>('/api/admin/data-governance/lpr-sync-batches/page', {
    method: 'POST',
    body: JSON.stringify(query)
  });
}

export function pageLprRateRevisions(
  query: DataGovernancePageQuery
): Promise<PageResult<LprRateRevisionItem>> {
  return request<PageResult<LprRateRevisionItem>>('/api/admin/data-governance/lpr-rate-revisions/page', {
    method: 'POST',
    body: JSON.stringify(query)
  });
}

export function syncLprRates(payload: LprRateSyncPayload): Promise<LprRateSyncResult> {
  return request<LprRateSyncResult>('/api/admin/data-governance/lpr-rates/sync', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}
