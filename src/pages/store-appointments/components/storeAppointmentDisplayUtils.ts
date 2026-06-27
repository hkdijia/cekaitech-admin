export const storeAppointmentStatusOptions = [
  { label: '全部状态', value: '', tagType: 'info' },
  { label: '待确认', value: 'pending', tagType: 'warning' },
  { label: '已确认', value: 'confirmed', tagType: 'primary' },
  { label: '已到店', value: 'arrived', tagType: 'success' },
  { label: '已完成', value: 'completed', tagType: 'success' },
  { label: '已取消', value: 'cancelled', tagType: 'info' }
];

export function storeAppointmentStatusMeta(value: string) {
  const found = storeAppointmentStatusOptions.find((item) => item.value === value);
  return found ?? { label: value || '-', value, tagType: 'info' };
}

export function storeAppointmentStatusText(value: string) {
  return storeAppointmentStatusMeta(value).label;
}

export function formatStoreAppointmentStatusTransition(fromStatus: string, toStatus: string) {
  const fromText = fromStatus ? storeAppointmentStatusText(fromStatus) : '创建';
  return `${fromText} -> ${storeAppointmentStatusText(toStatus)}`;
}

export function formatStoreAppointmentTime(value: string) {
  if (!value) {
    return '-';
  }
  return value.replace('T', ' ').replace(/\.\d+$/, '');
}
