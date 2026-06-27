import { readFileSync } from 'node:fs';
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const indexPath = 'docs/store-appointment-admin-pack-contract-index.md';

function readProjectFile(relativePath) {
  return readFileSync(resolve(projectRoot, relativePath), 'utf8');
}

describe('store appointment admin pack contract index', () => {
  it('exists as the portable admin pack entry point', () => {
    expect(existsSync(resolve(projectRoot, indexPath))).toBe(true);
  });

  it('links the core portability assets and current frontend guard', () => {
    const content = readProjectFile(indexPath);

    expect(content).toContain('Store Appointment Admin Pack');
    expect(content).toContain('docs/store-appointment-admin-commercial-portability-guide.md');
    expect(content).toContain('scripts/store-appointment-frontend-contract-guard.test.mjs');
    expect(content).toContain('src/api/storeAppointments.ts');
    expect(content).toContain('src/pages/store-appointments/StoreAppointmentsPage.vue');
  });

  it('keeps portable package scope split from future commercial capabilities', () => {
    const content = readProjectFile(indexPath);

    expect(content).toContain('基础预约包');
    expect(content).toContain('商业闭环包');
    expect(content).toContain('增长运营包');
    expect(content).toContain('当前不实现');
    expect(content).toContain('支付、会员、核销、客户资料、CRM、服务记录、员工账号、真实排班、消息通知、退款、客户账户策略');
  });

  it('records migration verification commands and checkpoint state', () => {
    const content = readProjectFile(indexPath);
    const checkpoint = [
      readProjectFile('tasks/current-task.md'),
      readProjectFile('codex-handoff.md')
    ].join('\n');

    expect(content).toContain('npm.cmd run test -- --run scripts/store-appointment-admin-pack-contract-index.test.mjs');
    expect(content).toContain('npm.cmd run test -- --run scripts/store-appointment-frontend-contract-guard.test.mjs');
    expect(content).toContain('npm.cmd run admin:check');
    expect(content).toContain('npm.cmd run quality');
    expect(checkpoint).toContain('门店预约 admin 可移植能力包契约索引');
    expect(checkpoint).toContain('Refs: none');
  });
});
