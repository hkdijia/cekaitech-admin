import { describe, expect, it } from 'vitest';
import {
  buildStoreAppointmentPageRequest,
  createDefaultStoreAppointmentPageQuery,
  resetStoreAppointmentPageQuery
} from './storeAppointmentQueryUtils';

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

  it('creates and resets appointment list query without preserving stale filters', () => {
    expect(createDefaultStoreAppointmentPageQuery()).toEqual({
      pageNo: 1,
      pageSize: 10,
      storeCode: '',
      projectCode: '',
      staffCode: '',
      status: '',
      appointmentDate: ''
    });

    const query = {
      pageNo: 4,
      pageSize: 50,
      storeCode: 'luyu-nail',
      projectCode: 'basic-nail',
      staffCode: 'staff-amy',
      status: 'pending',
      appointmentDate: '2026-06-20'
    };

    resetStoreAppointmentPageQuery(query);

    expect(query).toEqual({
      pageNo: 1,
      pageSize: 50,
      storeCode: '',
      projectCode: '',
      staffCode: '',
      status: '',
      appointmentDate: ''
    });
  });
});
