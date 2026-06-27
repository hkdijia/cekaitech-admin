import { describe, expect, it } from 'vitest';
import { formatStoreAppointmentStatusTransition, formatStoreAppointmentTime, storeAppointmentStatusMeta } from './storeAppointmentDisplayUtils';

describe('storeAppointmentDisplayUtils', () => {
  it('formats appointment status labels, tag types, transitions and timestamps', () => {
    expect(storeAppointmentStatusMeta('pending')).toEqual({ label: '待确认', value: 'pending', tagType: 'warning' });
    expect(storeAppointmentStatusMeta('confirmed')).toEqual({ label: '已确认', value: 'confirmed', tagType: 'primary' });
    expect(storeAppointmentStatusMeta('arrived')).toEqual({ label: '已到店', value: 'arrived', tagType: 'success' });
    expect(storeAppointmentStatusMeta('unknown-status')).toEqual({ label: 'unknown-status', value: 'unknown-status', tagType: 'info' });
    expect(formatStoreAppointmentStatusTransition('', 'pending')).toBe('创建 -> 待确认');
    expect(formatStoreAppointmentStatusTransition('pending', 'confirmed')).toBe('待确认 -> 已确认');
    expect(formatStoreAppointmentTime('2026-06-19T09:30:00.000')).toBe('2026-06-19 09:30:00');
    expect(formatStoreAppointmentTime('')).toBe('-');
  });
});
