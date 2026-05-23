export interface OptionItem {
  label: string;
  value: string;
}

export const generationStatusOptions: OptionItem[] = [
  { label: '全部状态', value: '' },
  { label: '待填写/草稿', value: 'draft' },
  { label: '已生成', value: 'generated' },
  { label: '已过期', value: 'expired' }
];

export const generationRecordTypeOptions: OptionItem[] = [
  { label: '全部类型', value: '' },
  { label: '民间借贷', value: 'private_lending' },
  { label: '离婚协议', value: 'divorce_agreement' },
  { label: '离婚纠纷', value: 'divorce' },
  { label: '劳动争议', value: 'labor' },
  { label: '合同纠纷', value: 'contract' },
  { label: '侵权纠纷', value: 'tort' },
  { label: '合同模板', value: 'contract_template' }
];

export function generationStatusText(value: string) {
  const found = generationStatusOptions.find((item) => item.value === value);
  return found?.label ?? (value || '-');
}

export function generationStatusTagType(value: string) {
  if (value === 'generated') {
    return 'success';
  }
  if (value === 'draft') {
    return 'warning';
  }
  return 'info';
}

export function generationRecordTypeText(value: string) {
  const found = generationRecordTypeOptions.find((item) => item.value === value);
  return found?.label ?? (value || '-');
}
