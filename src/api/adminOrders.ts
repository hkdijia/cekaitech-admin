import { request } from './http';
import type { PageResult } from './legalServiceRequests';

export interface AdminOrder {
  id: number;
  orderId: number;
  orderNo: string;
  appCode: string;
  payerUserId: number;
  payerUserCode: string;
  payerIdentityId: number;
  businessType: string;
  businessId: number;
  productCode: string;
  subject: string;
  amountTotal: number;
  refundedAmount: number;
  refundableAmount: number;
  currency: string;
  status: string;
  payChannel: string;
  wechatAppId: string;
  merchantId: string;
  wechatPrepayId: string;
  wechatTransactionId: string;
  wechatTradeState: string;
  paymentNotifyCount: number;
  refundCount: number;
  refundNotifyCount: number;
  latestRefundStatus: string;
  paidAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminOrderPageQuery {
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

export interface AdminOrderSummaryQuery {
  appCode?: string;
  businessType?: string;
  productCode?: string;
}

export interface AdminOrderSummaryGroup {
  id: string;
  appCode: string;
  businessType: string;
  paidCount: number;
  paidAmountTotal: number;
  pendingCount: number;
  pendingAmountTotal: number;
}

export interface AdminOrderSummary {
  paidCount: number;
  paidAmountTotal: number;
  pendingCount: number;
  pendingAmountTotal: number;
  refundedAmount?: number;
  groups: AdminOrderSummaryGroup[];
}

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

export interface AdminOrderRefundSummaryQuery {
  appCode?: string;
  businessType?: string;
  productCode?: string;
}

export interface AdminOrderRefundSummaryGroup {
  id: string;
  appCode: string;
  businessType: string;
  totalCount: number;
  totalRefundAmount: number;
  pendingReviewCount: number;
  pendingReviewAmount: number;
  successCount: number;
  successAmount: number;
  syncAbnormalCount: number;
}

export interface AdminOrderRefundSummary {
  totalCount: number;
  totalRefundAmount: number;
  pendingReviewCount: number;
  pendingReviewAmount: number;
  successCount: number;
  successAmount: number;
  successRefundAmount?: number;
  syncAbnormalCount: number;
  groups: AdminOrderRefundSummaryGroup[];
}

export interface AdminOrderRefundNotify {
  id: number;
  notifyId: number;
  eventId: string;
  refundNo: string;
  orderNo: string;
  wechatRefundId: string;
  refundStatus: string;
  amountTotal: number;
  refundAmount: number;
  processStatus: string;
  errorMessage: string;
  retryCount: number;
  lastRetryAt: string;
  retryStatus: string;
  lastRetryError: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminOrderRefundNotifyPageQuery {
  pageNo: number;
  pageSize: number;
  orderBy: string;
  order: 'asc' | 'desc';
  processStatus?: string;
  refundNo?: string;
  orderNo?: string;
  keywords?: string;
}

export interface AdminOrderRefundNotifySummary {
  totalCount: number;
  successCount: number;
  failedCount: number;
  ignoredCount: number;
  latestFailedAt: string;
  retryableFailedCount: number;
  latestFailed: AdminOrderRefundNotify | null;
}

export interface AdminOrderRefundSyncAbnormalQuery {
  appCode?: string;
  businessType?: string;
  productCode?: string;
}

export interface AdminOrderRefundSyncAbnormalGroup {
  appCode: string;
  businessType: string;
  abnormalCount: number;
  readyToRetryCount: number;
  earliestNextSyncAt: string;
}

export interface AdminOrderRefundSyncAbnormal {
  abnormalCount: number;
  readyToRetryCount: number;
  earliestNextSyncAt: string;
  latestRefunds: AdminOrderRefund[];
  groups: AdminOrderRefundSyncAbnormalGroup[];
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

export function pageAdminOrders(query: AdminOrderPageQuery): Promise<PageResult<AdminOrder>> {
  return request<PageResult<AdminOrder>>('/api/admin/orders/page', {
    method: 'POST',
    body: JSON.stringify(query)
  });
}

export function summarizeAdminOrders(query: AdminOrderSummaryQuery = {}): Promise<AdminOrderSummary> {
  return request<AdminOrderSummary>('/api/admin/orders/summary', {
    method: 'POST',
    body: JSON.stringify(query)
  });
}

export function syncAdminOrderPayment(orderId: number): Promise<AdminOrder> {
  return request<AdminOrder>(`/api/admin/orders/${orderId}/sync-payment`, {
    method: 'POST'
  });
}

export function pageAdminOrderRefunds(query: AdminOrderRefundPageQuery): Promise<PageResult<AdminOrderRefund>> {
  return request<PageResult<AdminOrderRefund>>('/api/admin/order-refunds/page', {
    method: 'POST',
    body: JSON.stringify(query)
  });
}

export function summarizeAdminOrderRefunds(
  query: AdminOrderRefundSummaryQuery = {}
): Promise<AdminOrderRefundSummary> {
  return request<AdminOrderRefundSummary>('/api/admin/order-refunds/summary', {
    method: 'POST',
    body: JSON.stringify(query)
  });
}

export function pageAdminOrderRefundNotifies(
  query: AdminOrderRefundNotifyPageQuery
): Promise<PageResult<AdminOrderRefundNotify>> {
  return request<PageResult<AdminOrderRefundNotify>>('/api/admin/order-refund-notifies/page', {
    method: 'POST',
    body: JSON.stringify(query)
  });
}

export function summarizeAdminOrderRefundNotifies(): Promise<AdminOrderRefundNotifySummary> {
  return request<AdminOrderRefundNotifySummary>('/api/admin/order-refund-notifies/summary', {
    method: 'POST'
  });
}

export function getAdminOrderRefundSyncAbnormal(
  query: AdminOrderRefundSyncAbnormalQuery = {}
): Promise<AdminOrderRefundSyncAbnormal> {
  return request<AdminOrderRefundSyncAbnormal>('/api/admin/order-refunds/sync-abnormal', {
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
