export interface LegalCreditQueryStatusMeta {
  label: string;
  tagType: 'success' | 'warning' | 'info' | 'primary' | 'danger';
}

const statusMeta: Record<string, LegalCreditQueryStatusMeta> = {
  queued: { label: '待处理', tagType: 'info' },
  claimed: { label: '已领取', tagType: 'warning' },
  running: { label: '查询中', tagType: 'warning' },
  result_ready: { label: '待复核', tagType: 'primary' },
  published: { label: '已发布', tagType: 'success' },
  failed: { label: '查询失败', tagType: 'danger' },
  cancelled: { label: '已取消', tagType: 'info' }
};

export function getLegalCreditQueryStatusMeta(status: string): LegalCreditQueryStatusMeta {
  return statusMeta[status] ?? { label: status, tagType: 'info' };
}
