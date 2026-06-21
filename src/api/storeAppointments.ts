import { request } from './http';
import type { PageResult } from './legalServiceRequests';

export interface StoreAppointmentPageRequest {
  pageNo: number;
  pageSize: number;
  storeCode?: string;
  projectCode?: string;
  staffCode?: string;
  status?: string;
  appointmentDate?: string;
}

export interface StoreAppointmentItem {
  appointmentId: number;
  storeCode: string;
  storeName: string;
  projectCode: string;
  projectName: string;
  staffCode: string;
  staffName: string;
  customerDisplayName: string;
  customerContact: string;
  appointmentDate: string;
  timeSlot: string;
  status: string;
  remark: string;
  createdAt: string;
  updatedAt: string;
}

export interface StoreAppointmentStatusLog {
  fromStatus: string;
  toStatus: string;
  operatorType: string;
  operatorId: string;
  createdAt: string;
}

export interface StoreAppointmentDetail {
  appointment: StoreAppointmentItem;
  statusLogs: StoreAppointmentStatusLog[];
}

export function pageStoreAppointments(
  payload: StoreAppointmentPageRequest
): Promise<PageResult<StoreAppointmentItem>> {
  return request<PageResult<StoreAppointmentItem>>('/api/admin/store-appointments/page', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export function getStoreAppointmentDetail(appointmentId: number): Promise<StoreAppointmentDetail> {
  return request<StoreAppointmentDetail>(`/api/admin/store-appointments/${appointmentId}`, {
    method: 'GET'
  });
}
