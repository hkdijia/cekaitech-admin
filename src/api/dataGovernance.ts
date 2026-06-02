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

export interface AnnualCommonDataSyncBatchItem {
  id: number;
  appCode: string;
  requestId: string;
  sourceKey: string;
  sourceVersion: string;
  payloadHash: string;
  itemCount: number;
  status: string;
  createdCount: number;
  updatedCount: number;
  skippedCount: number;
  conflictCount: number;
  errorMessage: string;
  sourceClient: string;
  collectedAt: string;
  lastCheckedDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface AnnualCommonDataRevisionItem {
  id: number;
  annualDataId: number;
  batchId: number;
  appCode: string;
  regionCode: string;
  year: number;
  metricKey: string;
  beforeSnapshotJson: string;
  afterSnapshotJson: string;
  changeType: string;
  message: string;
  createdAt: string;
}

export interface AnnualCommonDataSyncItem {
  regionCode: string;
  regionName: string;
  year: number;
  metricKey: string;
  metricName: string;
  value: number;
  unit: string;
  sourceName: string;
  sourceUrl: string;
  usageScope?: string;
  notice?: string;
  sourceRecordId?: string;
  payloadHash?: string;
}

export interface AnnualCommonDataSyncPayload {
  appCode: string;
  requestId: string;
  sourceKey: string;
  sourceVersion?: string;
  sourceClient?: string;
  collectedAt?: string;
  lastCheckedDate?: string;
  mode?: string;
  payloadHash: string;
  items: AnnualCommonDataSyncItem[];
}

export interface AnnualCommonDataSyncResult {
  batchId?: number;
  requestId: string;
  status?: string;
  createdCount: number;
  updatedCount?: number;
  skippedCount?: number;
  conflictCount?: number;
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

export function pageAnnualCommonDataSyncBatches(
  query: DataGovernancePageQuery
): Promise<PageResult<AnnualCommonDataSyncBatchItem>> {
  return request<PageResult<AnnualCommonDataSyncBatchItem>>('/api/admin/data-governance/annual-common-data-sync-batches/page', {
    method: 'POST',
    body: JSON.stringify(query)
  });
}

export function pageAnnualCommonDataRevisions(
  query: DataGovernancePageQuery
): Promise<PageResult<AnnualCommonDataRevisionItem>> {
  return request<PageResult<AnnualCommonDataRevisionItem>>('/api/admin/data-governance/annual-common-data-revisions/page', {
    method: 'POST',
    body: JSON.stringify(query)
  });
}

export function syncAnnualCommonData(payload: AnnualCommonDataSyncPayload): Promise<AnnualCommonDataSyncResult> {
  return request<AnnualCommonDataSyncResult>('/api/admin/data-governance/annual-common-data/sync', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}
