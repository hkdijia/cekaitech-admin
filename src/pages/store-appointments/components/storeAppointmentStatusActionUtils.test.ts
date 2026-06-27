import { describe, expect, it } from 'vitest';
import { getStoreAppointmentStatusActions } from './storeAppointmentStatusActionUtils';

describe('storeAppointmentStatusActionUtils', () => {
  it('returns controlled status actions without exposing forbidden operations', () => {
    expect(getStoreAppointmentStatusActions('pending', true)).toEqual([
      { label: '确认预约', status: 'confirmed', type: 'primary', iconKey: 'check' },
      { label: '取消预约', status: 'cancelled', type: 'danger', iconKey: 'close' }
    ]);
    expect(getStoreAppointmentStatusActions('confirmed', true)).toEqual([
      { label: '标记到店', status: 'arrived', type: 'success', iconKey: 'check' },
      { label: '取消预约', status: 'cancelled', type: 'danger', iconKey: 'close' }
    ]);
    expect(getStoreAppointmentStatusActions('arrived', true)).toEqual([
      { label: '完成', status: 'completed', type: 'success', iconKey: 'finished' }
    ]);
    expect(getStoreAppointmentStatusActions('completed', true)).toEqual([]);
    expect(getStoreAppointmentStatusActions('pending', false)).toEqual([]);
    expect(getStoreAppointmentStatusActions('cancelled', true)).toEqual([]);

    const actionText = getStoreAppointmentStatusActions('pending', true)
      .map((action) => action.label)
      .join(' ');
    expect(actionText).not.toContain('支付');
    expect(actionText).not.toContain('会员');
    expect(actionText).not.toContain('核销');
    expect(actionText).not.toContain('客户资料');
  });
});
