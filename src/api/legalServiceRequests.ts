import { request } from './http';

export interface LegalServiceRequestPageQuery {
  pageNo: number;
  pageSize: number;
  appCode?: string;
  userId?: number;
  serviceType?: string;
  status?: string;
  contactPhone?: string;
  keywords?: string;
  order: 'asc' | 'desc';
  orderBy: string;
}

export interface LegalServiceRequestItem {
  requestId: number;
  appCode: string;
  userId: number;
  identityId: number;
  userCode?: string;
  serviceType: string;
  sourceRecordId: number | string | null;
  clientRecordId: string;
  contactName: string;
  contactPhoneMasked: string;
  memo: string;
  status: string;
  paymentStatus?: string | null;
  orderId?: number | null;
  orderNo?: string | null;
  amountTotal?: number | null;
  orderStatus?: string | null;
  handler: string;
  handlerId: string | number | null;
  adminRemark: string;
  createdAt: string;
  updatedAt: string;
  handledAt: string;
}

export interface LegalServiceRequestDetail extends LegalServiceRequestItem {
  contactPhone?: string;
}

export interface UpdateLegalServiceRequestStatusPayload {
  status: string;
  adminRemark: string;
}

export interface CreateLegalServicePaymentOrderPayload {
  amountTotal: number;
  subject: string;
  adminRemark: string;
}

export interface PageResult<T> {
  dataList: T[];
  totalCount: number;
}

export function pageLegalServiceRequests(
  query: LegalServiceRequestPageQuery
): Promise<PageResult<LegalServiceRequestItem>> {
  return request<PageResult<LegalServiceRequestItem>>('/api/admin/legal/service-requests/page', {
    method: 'POST',
    body: JSON.stringify(query)
  });
}

export function getLegalServiceRequestDetail(requestId: number): Promise<LegalServiceRequestDetail> {
  return request<LegalServiceRequestDetail>(`/api/admin/legal/service-requests/${requestId}`, {
    method: 'GET'
  });
}

export function viewLegalServiceRequestContact(requestId: number): Promise<LegalServiceRequestDetail> {
  return request<LegalServiceRequestDetail>(`/api/admin/legal/service-requests/${requestId}/contact-view`, {
    method: 'POST'
  });
}

export function updateLegalServiceRequestStatus(
  requestId: number,
  payload: UpdateLegalServiceRequestStatusPayload
): Promise<LegalServiceRequestDetail> {
  return request<LegalServiceRequestDetail>(`/api/admin/legal/service-requests/${requestId}/status`, {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export function createLegalServicePaymentOrder(
  requestId: number,
  payload: CreateLegalServicePaymentOrderPayload
): Promise<LegalServiceRequestDetail> {
  return request<LegalServiceRequestDetail>(`/api/admin/legal/service-requests/${requestId}/payment-order`, {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}
