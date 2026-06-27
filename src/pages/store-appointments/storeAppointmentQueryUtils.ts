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

export function createDefaultStoreAppointmentPageQuery(): StoreAppointmentPageQuery {
  return {
    pageNo: 1,
    pageSize: 10,
    storeCode: '',
    projectCode: '',
    staffCode: '',
    status: '',
    appointmentDate: ''
  };
}

export function resetStoreAppointmentPageQuery(query: StoreAppointmentPageQuery) {
  query.pageNo = 1;
  query.storeCode = '';
  query.projectCode = '';
  query.staffCode = '';
  query.status = '';
  query.appointmentDate = '';
}

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
