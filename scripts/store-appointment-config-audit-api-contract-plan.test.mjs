import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const contractPath = 'docs/store-appointment-config-audit-api-contract-plan.md';

function readProjectFile(relativePath) {
  return readFileSync(resolve(projectRoot, relativePath), 'utf8');
}

describe('store appointment config audit api contract plan', () => {
  it('exists as an implementation-before-contract-test planning asset only', () => {
    expect(existsSync(resolve(projectRoot, contractPath))).toBe(true);
  });

  it('defines backend contract tests before audit api implementation', () => {
    const content = readProjectFile(contractPath);
    const apiClient = readProjectFile('src/api/storeAppointments.ts');
    const page = readProjectFile('src/pages/store-appointments/StoreAppointmentsPage.vue');

    expect(content).toContain('配置审计记录列表后端接口契约测试规划');
    expect(content).toContain('规划态');
    expect(content).toContain('先补后端契约测试');
    expect(content).toContain('GET /api/admin/store-appointment-config/stores/{storeCode}/audit-logs');
    expect(content).toContain('admin:store-appointment-config:manage');
    expect(content).toContain('不实现后端接口');
    expect(content).toContain('不新增 API client');
    expect(content).toContain('不新增页面入口');
    expect(apiClient).not.toContain('audit-logs');
    expect(apiClient).not.toContain('pageStoreAppointmentConfigAuditLogs');
    expect(page).not.toContain('审计记录列表');
    expect(page).not.toContain('audit-logs');
  });

  it('covers required backend contract cases and forbidden data exposure', () => {
    const content = readProjectFile(contractPath);

    expect(content).toContain('分页参数');
    expect(content).toContain('surface 白名单');
    expect(content).toContain('storeCode 范围');
    expect(content).toContain('权限 403');
    expect(content).toContain('空列表');
    expect(content).toContain('rollbackAvailable');
    expect(content).toContain('raw payload');
    expect(content).toContain('跨门店查询');
    expect(content).toContain('跨租户查询');
    expect(content).toContain('支付、会员、核销、客户资料、CRM、服务记录、员工账号、真实排班、消息通知、退款、客户账户策略');
  });

  it('links the audit api contract plan from pack index and checkpoint documents', () => {
    const packIndex = readProjectFile('docs/store-appointment-admin-pack-contract-index.md');
    const checkpoint = [
      readProjectFile('tasks/current-task.md'),
      readProjectFile('codex-handoff.md')
    ].join('\n');

    expect(packIndex).toContain(contractPath);
    expect(packIndex).toContain('配置审计记录列表后端接口契约测试规划');
    expect(checkpoint).toContain('门店预约配置审计记录列表后端接口契约测试规划');
    expect(checkpoint).toContain('scripts/store-appointment-config-audit-api-contract-plan.test.mjs');
    expect(checkpoint).toContain('Refs: none');
  });
});
