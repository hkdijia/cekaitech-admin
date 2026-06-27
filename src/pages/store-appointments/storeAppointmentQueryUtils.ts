import type { StoreAppointmentPageRequest } from '../../api/storeAppointments';

export type StoreAppointmentPageQuery = {
  pageNo: number;
  pageSize: number;
  storeCode: string;
  projectCode: string;
  staffCode: string;
  status: string;
  appointmentDate: string;
};

function normalizedText(value: string) {
  const trimmed = value.trim();
  return trimmed || undefined;
}

export function buildStoreAppointmentPageRequest(query: StoreAppointmentPageQuery): StoreAppointmentPageRequest {
  return {
    pageNo: query.pageNo,
    pageSize: Math.min(query.pageSize, 100),
    storeCode: normalizedText(query.storeCode),
    projectCode: normalizedText(query.projectCode),
    staffCode: normalizedText(query.staffCode),
    status: normalizedText(query.status),
    appointmentDate: normalizedText(query.appointmentDate)
  };
}
