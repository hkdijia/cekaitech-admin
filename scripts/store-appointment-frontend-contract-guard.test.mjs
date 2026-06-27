import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const guardedSourceFiles = [
  'src/api/storeAppointments.ts',
  'src/pages/store-appointments/StoreAppointmentsPage.vue',
  'src/pages/store-appointments/components/StoreAppointmentAdminConfigContractPanel.vue',
  'src/pages/store-appointments/components/StoreAppointmentBookingConfigSnapshotPanel.vue',
  'src/pages/store-appointments/components/StoreAppointmentConfigReadinessPanel.vue',
  'src/pages/store-appointments/components/StoreAppointmentConfigRollbackPanel.vue',
  'src/pages/store-appointments/components/StoreAppointmentDetailDrawer.vue',
  'src/pages/store-appointments/components/StoreAppointmentFilterPanel.vue',
  'src/pages/store-appointments/components/StoreAppointmentListPanel.vue',
  'src/pages/store-appointments/components/StoreAppointmentRulesPanel.vue',
  'src/pages/store-appointments/components/StoreAppointmentServiceCatalogPanel.vue',
  'src/pages/store-appointments/components/StoreAppointmentStaffRosterPanel.vue',
  'src/pages/store-appointments/components/StoreAppointmentStoreProfilePanel.vue'
];

const checkpointFiles = [
  'tasks/current-task.md',
  'codex-handoff.md'
];

const forbiddenEndpointFragments = [
  '/api/admin/store-appointment/config',
  '/api/admin/store-appointment-config/stores/{storeCode}/rules'
];

const forbiddenEntryLabels = [
  '支付配置',
  '会员配置',
  '核销配置',
  'CRM配置',
  '客户资料配置',
  '服务记录配置',
  '员工账号配置',
  '真实排班配置',
  '消息通知配置',
  '退款配置',
  '客户账户策略配置',
  '创建支付',
  '创建会员',
  '创建核销',
  '创建CRM',
  '创建客户资料',
  '创建服务记录',
  '创建员工账号',
  '创建真实排班',
  '创建消息通知',
  '创建退款'
];

function readProjectFile(relativePath) {
  return readFileSync(resolve(projectRoot, relativePath), 'utf8');
}

describe('store appointment frontend contract guard', () => {
  it('keeps admin config endpoints on the current backend contract path', () => {
    const combinedSource = guardedSourceFiles.map(readProjectFile).join('\n');

    expect(combinedSource).toContain('/api/admin/store-appointment-config');
    for (const endpoint of forbiddenEndpointFragments) {
      expect(combinedSource).not.toContain(endpoint);
    }
  });

  it('does not expose forbidden production capability entries in store appointment admin UI', () => {
    const combinedSource = guardedSourceFiles.map(readProjectFile).join('\n');

    for (const label of forbiddenEntryLabels) {
      expect(combinedSource).not.toContain(label);
    }
  });

  it('keeps checkpoint documents aligned with the current frontend contract guard task', () => {
    const combinedCheckpoint = checkpointFiles.map(readProjectFile).join('\n');

    expect(combinedCheckpoint).toContain('scripts/store-appointment-frontend-contract-guard.test.mjs');
    expect(combinedCheckpoint).toContain('Refs: none');
    expect(combinedCheckpoint).not.toContain('待本地提交本轮商业化可移植性规划切片');
  });
});
