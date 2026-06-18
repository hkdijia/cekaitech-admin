import { request } from './http';
import type { PageResult } from './legalServiceRequests';

export interface MiniappAccessListPageRequest {
  pageNo: number;
  pageSize: number;
  appCode?: string;
  capabilityCode?: string;
  listType?: string;
  status?: string;
  keywords?: string;
  orderBy: string;
  order: 'asc' | 'desc';
}

export interface MiniappAccessListEntry {
  entryId: number;
  appCode: string;
  capabilityCode: string;
  listType: string;
  userId: number;
  identityId: number;
  userCode?: string | null;
  sourceType: string;
  sourceRefId?: string | null;
  reason: string;
  status: string;
  createdByAdminId?: string | null;
  disabledByAdminId?: string | null;
  disabledReason?: string | null;
  disabledAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface MiniappAccessListCreateRequest {
  appCode: string;
  capabilityCode: string;
  listType: 'allow' | 'deny';
  userId: number;
  identityId: number;
  reason: string;
}

export interface MiniappAccessListDisableRequest {
  reason: string;
}

export interface MiniappAccessListImportRequest {
  appCode: string;
  capabilityCode: string;
  reason: string;
  auditIds?: number[];
}

export interface MiniappAccessListImportResponse {
  importedCount: number;
  skippedCount: number;
}

export interface MiniappAccessListCandidatePageRequest {
  pageNo: number;
  pageSize: number;
  appCode: string;
  capabilityCode: string;
  keywords?: string;
}

export interface MiniappAccessListCandidate {
  auditId: number;
  userId: number;
  identityId: number;
  userCode?: string | null;
  name?: string | null;
  phone?: string | null;
  licenseNo?: string | null;
  reviewedAt?: string | null;
}

export function pageMiniappAccessListEntries(
  payload: MiniappAccessListPageRequest
): Promise<PageResult<MiniappAccessListEntry>> {
  return request<PageResult<MiniappAccessListEntry>>('/api/admin/miniapp-access-list/page', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export function createMiniappAccessListEntry(
  payload: MiniappAccessListCreateRequest
): Promise<MiniappAccessListEntry> {
  return request<MiniappAccessListEntry>('/api/admin/miniapp-access-list/entries', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export function disableMiniappAccessListEntry(
  entryId: number,
  payload: MiniappAccessListDisableRequest
): Promise<MiniappAccessListEntry> {
  return request<MiniappAccessListEntry>(`/api/admin/miniapp-access-list/entries/${entryId}/disable`, {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export function importApprovedLawyersToAccessList(
  payload: MiniappAccessListImportRequest
): Promise<MiniappAccessListImportResponse> {
  return request<MiniappAccessListImportResponse>('/api/admin/miniapp-access-list/import-approved-lawyers', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export function pageApprovedLawyerAccessListCandidates(
  payload: MiniappAccessListCandidatePageRequest
): Promise<PageResult<MiniappAccessListCandidate>> {
  return request<PageResult<MiniappAccessListCandidate>>('/api/admin/miniapp-access-list/approved-lawyer-candidates', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}
