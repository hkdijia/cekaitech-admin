import { describe, expect, it } from 'vitest';
import { getLegalCreditQueryStatusMeta } from './legalCreditQueryStatus';

describe('legal credit query status meta', () => {
  it('maps known backend statuses to labels and tag types', () => {
    expect(getLegalCreditQueryStatusMeta('pending_review')).toEqual({ label: '待审核', tagType: 'primary' });
    expect(getLegalCreditQueryStatusMeta('queued')).toEqual({ label: '待处理', tagType: 'info' });
    expect(getLegalCreditQueryStatusMeta('claimed')).toEqual({ label: '已领取', tagType: 'warning' });
    expect(getLegalCreditQueryStatusMeta('running')).toEqual({ label: '查询中', tagType: 'warning' });
    expect(getLegalCreditQueryStatusMeta('result_ready')).toEqual({ label: '待复核', tagType: 'primary' });
    expect(getLegalCreditQueryStatusMeta('published')).toEqual({ label: '已发布', tagType: 'success' });
    expect(getLegalCreditQueryStatusMeta('failed')).toEqual({ label: '查询失败', tagType: 'danger' });
    expect(getLegalCreditQueryStatusMeta('cancelled')).toEqual({ label: '已取消', tagType: 'info' });
    expect(getLegalCreditQueryStatusMeta('rejected')).toEqual({ label: '已拒绝', tagType: 'danger' });
  });

  it('returns raw status for unknown values', () => {
    expect(getLegalCreditQueryStatusMeta('archived')).toEqual({ label: 'archived', tagType: 'info' });
  });
});
