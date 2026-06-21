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

export interface StoreAppointmentStatusUpdateRequest {
  status: string;
}

export interface StoreAppointmentBookingStore {
  storeCode: string;
  name: string;
  industry: string;
  phone: string;
  address: string;
  businessHours: string;
  staffLabel: string;
  projectLabel: string;
  showPrice: boolean;
}

export interface StoreAppointmentBookingProject {
  projectCode: string;
  categoryId: string;
  name: string;
  summary: string;
  durationMinutes: number;
  priceText: string;
  showPrice: boolean;
}

export interface StoreAppointmentBookingStaff {
  staffCode: string;
  name: string;
  role: string;
  bio: string;
  avatarUrl: string;
  trustHighlights: string;
}

export interface StoreAppointmentBookingStaffProject {
  staffCode: string;
  projectCode: string;
}

export interface StoreAppointmentBookingRule {
  bookingWindowDays: number;
  defaultDurationMinutes: number;
  defaultSlots: string[];
  confirmationHint: string;
  cancelHint: string;
}

export interface StoreAppointmentBookingConfig {
  store: StoreAppointmentBookingStore;
  serviceProjects: StoreAppointmentBookingProject[];
  staffMembers: StoreAppointmentBookingStaff[];
  staffProjects: StoreAppointmentBookingStaffProject[];
  appointmentRule: StoreAppointmentBookingRule;
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

export function updateStoreAppointmentStatus(
  appointmentId: number,
  payload: StoreAppointmentStatusUpdateRequest
): Promise<StoreAppointmentItem> {
  return request<StoreAppointmentItem>(`/api/admin/store-appointments/${appointmentId}/status`, {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export function getStoreAppointmentBookingConfig(
  appCode: string,
  storeCode: string
): Promise<StoreAppointmentBookingConfig> {
  return request<StoreAppointmentBookingConfig>(`/api/miniapps/${appCode}/stores/${storeCode}/booking-config`, {
    method: 'GET'
  });
}
