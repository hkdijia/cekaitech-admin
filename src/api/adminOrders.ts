import { request } from './http';
import type { PageResult } from './legalServiceRequests';

export interface AdminOrderRefund {
  id: number;
  refundId: number;
  refundNo: string;
  orderId: number;
  orderNo: string;
  appCode: string;
  payerUserId: number;
  payerIdentityId: number;
  businessType: string;
  businessId: number;
  productCode: string;
  orderAmountTotal: number;
  refundAmount: number;
  currency: string;
  status: string;
  reason: string;
  wechatRefundId: string;
  wechatRefundStatus: string;
  syncFailureCount: number;
  nextSyncAt: string;
  lastSyncError: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminOrderRefundPageQuery {
  pageNo: number;
  pageSize: number;
  orderBy: string;
  order: 'asc' | 'desc';
  appCode?: string;
  businessType?: string;
  status?: string;
  payerUserId?: number;
  productCode?: string;
  keywords?: string;
}

export interface CreateAdminOrderRefundPayload {
  orderId: number;
  refundAmount: number;
  reason: string;
}

export interface UpdateAdminOrderRefundStatusPayload {
  status: string;
  reason: string;
}

export function pageAdminOrderRefunds(query: AdminOrderRefundPageQuery): Promise<PageResult<AdminOrderRefund>> {
  return request<PageResult<AdminOrderRefund>>('/api/admin/order-refunds/page', {
    method: 'POST',
    body: JSON.stringify(query)
  });
}

export function createAdminOrderRefund(payload: CreateAdminOrderRefundPayload): Promise<AdminOrderRefund> {
  return request<AdminOrderRefund>('/api/admin/order-refunds/create', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export function updateAdminOrderRefundStatus(
  refundId: number,
  payload: UpdateAdminOrderRefundStatusPayload
): Promise<AdminOrderRefund> {
  return request<AdminOrderRefund>(`/api/admin/order-refunds/${refundId}/status`, {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export function syncAdminOrderRefund(refundId: number): Promise<AdminOrderRefund> {
  return request<AdminOrderRefund>(`/api/admin/order-refunds/${refundId}/sync`, {
    method: 'POST'
  });
}
