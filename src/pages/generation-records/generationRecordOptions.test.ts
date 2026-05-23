import { describe, expect, it } from 'vitest';
import {
  generationRecordTypeOptions,
  generationStatusOptions,
  generationStatusTagType,
  generationStatusText,
  generationRecordTypeText
} from './generationRecordOptions';

describe('generation record page options', () => {
  it('uses backend generation status values and labels', () => {
    expect(generationStatusOptions.slice(1)).toEqual([
      { label: '待填写/草稿', value: 'draft' },
      { label: '已生成', value: 'generated' },
      { label: '已过期', value: 'expired' }
    ]);

    expect(generationStatusText('draft')).toBe('待填写/草稿');
    expect(generationStatusText('generated')).toBe('已生成');
    expect(generationStatusText('expired')).toBe('已过期');
    expect(generationStatusText('custom_status')).toBe('custom_status');
  });

  it('maps backend generation statuses to tag types', () => {
    expect(generationStatusTagType('draft')).toBe('warning');
    expect(generationStatusTagType('generated')).toBe('success');
    expect(generationStatusTagType('expired')).toBe('info');
    expect(generationStatusTagType('custom_status')).toBe('info');
  });

  it('uses miniapp caseType values for record type options', () => {
    expect(generationRecordTypeOptions.map((item) => item.value)).toEqual([
      '',
      'private_lending',
      'divorce_agreement',
      'generic_template',
      'contract_template'
    ]);

    expect(generationRecordTypeText('private_lending')).toBe('民间借贷');
    expect(generationRecordTypeText('divorce_agreement')).toBe('离婚协议');
    expect(generationRecordTypeText('generic_template')).toBe('通用模板');
    expect(generationRecordTypeText('contract_template')).toBe('合同模板');
    expect(generationRecordTypeText('unknown_case_type')).toBe('unknown_case_type');
  });
});
