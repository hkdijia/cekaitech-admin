import { request } from './http';
import type { PageResult } from './legalServiceRequests';

export interface LawyerAuditPageRequest {
  pageNo: number;
  pageSize: number;
  appCode?: string;
  auditType?: string;
  status?: string;
  keywords?: string;
  orderBy: string;
  order: 'asc' | 'desc';
}

export interface LawyerAuditItem {
  auditId: number;
  userId: number;
  identityId: number;
  userCode?: string | null;
  appCode: string;
  auditType: string;
  status: string;
  payload: Record<string, unknown>;
  reviewNote?: string | null;
  reviewedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface LawyerAuditReviewRequest {
  reviewNote?: string;
}

export function pageLawyerAudits(payload: LawyerAuditPageRequest): Promise<PageResult<LawyerAuditItem>> {
  return request<PageResult<LawyerAuditItem>>('/api/admin/user-audits/page', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export function approveLawyerAudit(
  auditId: number,
  payload: LawyerAuditReviewRequest
): Promise<LawyerAuditItem> {
  return request<LawyerAuditItem>(`/api/admin/user-audits/${auditId}/approve`, {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export function rejectLawyerAudit(
  auditId: number,
  payload: LawyerAuditReviewRequest
): Promise<LawyerAuditItem> {
  return request<LawyerAuditItem>(`/api/admin/user-audits/${auditId}/reject`, {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}
