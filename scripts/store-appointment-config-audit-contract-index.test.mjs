import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const contractPath = 'docs/store-appointment-config-audit-contract-design.md';

function readProjectFile(relativePath) {
  return readFileSync(resolve(projectRoot, relativePath), 'utf8');
}

describe('store appointment config audit contract index', () => {
  it('exists as a backend contract design asset only', () => {
    expect(existsSync(resolve(projectRoot, contractPath))).toBe(true);
  });

  it('defines the future audit list contract without adding frontend implementation', () => {
    const content = readProjectFile(contractPath);
    const apiClient = readProjectFile('src/api/storeAppointments.ts');
    const page = readProjectFile('src/pages/store-appointments/StoreAppointmentsPage.vue');

    expect(content).toContain('配置审计记录列表');
    expect(content).toContain('设计态');
    expect(content).toContain('GET /api/admin/store-appointment-config/stores/{storeCode}/audit-logs');
    expect(content).toContain('admin:store-appointment-config:manage');
    expect(content).toContain('不新增 API client');
    expect(content).toContain('不新增页面入口');
    expect(apiClient).not.toContain('audit-logs');
    expect(apiClient).not.toContain('pageStoreAppointmentConfigAuditLogs');
    expect(page).not.toContain('审计记录列表');
    expect(page).not.toContain('audit-logs');
  });

  it('keeps audit list scope limited to neutral config surfaces and excludes forbidden capabilities', () => {
    const content = readProjectFile(contractPath);

    expect(content).toContain('store-profile');
    expect(content).toContain('service-catalog');
    expect(content).toContain('staff-roster');
    expect(content).toContain('appointment-rules');
    expect(content).toContain('支付、会员、核销、客户资料、CRM、服务记录、员工账号、真实排班、消息通知、退款、客户账户策略');
    expect(content).toContain('不得暴露 raw payload');
    expect(content).toContain('不得跨 storeCode');
  });

  it('links the audit design from pack index and checkpoint documents', () => {
    const packIndex = readProjectFile('docs/store-appointment-admin-pack-contract-index.md');
    const checkpoint = [
      readProjectFile('tasks/current-task.md'),
      readProjectFile('codex-handoff.md')
    ].join('\n');

    expect(packIndex).toContain(contractPath);
    expect(packIndex).toContain('配置审计记录列表后端契约设计');
    expect(checkpoint).toContain(contractPath);
    expect(checkpoint).toContain('scripts/store-appointment-config-audit-contract-index.test.mjs');
    expect(checkpoint).toContain('Refs: none');
  });
});
