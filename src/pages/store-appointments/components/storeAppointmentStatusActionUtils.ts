type StoreAppointmentStatusActionType = 'primary' | 'success' | 'danger';

type StoreAppointmentStatusActionIconKey = 'check' | 'close' | 'finished';

export type StoreAppointmentStatusAction = {
  label: string;
  status: string;
  type: StoreAppointmentStatusActionType;
  iconKey: StoreAppointmentStatusActionIconKey;
};

export function getStoreAppointmentStatusActions(status: string, canManageStatus: boolean): StoreAppointmentStatusAction[] {
  if (!canManageStatus) {
    return [];
  }
  if (status === 'pending') {
    return [
      { label: '确认预约', status: 'confirmed', type: 'primary', iconKey: 'check' },
      { label: '取消预约', status: 'cancelled', type: 'danger', iconKey: 'close' }
    ];
  }
  if (status === 'confirmed') {
    return [
      { label: '标记到店', status: 'arrived', type: 'success', iconKey: 'check' },
      { label: '取消预约', status: 'cancelled', type: 'danger', iconKey: 'close' }
    ];
  }
  if (status === 'arrived') {
    return [
      { label: '完成', status: 'completed', type: 'success', iconKey: 'finished' }
    ];
  }
  return [];
}
