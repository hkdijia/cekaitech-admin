import { describe, expect, it } from 'vitest';
import { buildStoreAppointmentPageRequest } from './storeAppointmentQueryUtils';

describe('storeAppointmentQueryUtils', () => {
  it('normalizes appointment list query into backend page request', () => {
    expect(buildStoreAppointmentPageRequest({
      pageNo: 3,
      pageSize: 150,
      storeCode: ' luyu-nail ',
      projectCode: ' ',
      staffCode: ' staff-amy ',
      status: 'pending',
      appointmentDate: '2026-06-20'
    })).toEqual({
      pageNo: 3,
      pageSize: 100,
      storeCode: 'luyu-nail',
      projectCode: undefined,
      staffCode: 'staff-amy',
      status: 'pending',
      appointmentDate: '2026-06-20'
    });
  });
});
