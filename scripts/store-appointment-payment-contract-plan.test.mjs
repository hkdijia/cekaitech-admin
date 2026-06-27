import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const contractPath = 'docs/store-appointment-payment-contract-plan.md';

function readProjectFile(relativePath) {
  return readFileSync(resolve(projectRoot, relativePath), 'utf8');
}

describe('store appointment payment contract plan', () => {
  it('exists as a commercial payment planning asset only', () => {
    expect(existsSync(resolve(projectRoot, contractPath))).toBe(true);
  });

  it('defines the future payment backend contract without adding admin implementation', () => {
    const content = readProjectFile(contractPath);
    const apiClient = readProjectFile('src/api/storeAppointments.ts');
    const page = readProjectFile('src/pages/store-appointments/StoreAppointmentsPage.vue');

    expect(content).toContain('支付商业闭环包');
    expect(content).toContain('规划态');
    expect(content).toContain('最终需要实现');
    expect(content).toContain('不新增 API client');
    expect(content).toContain('不新增页面入口');
    expect(content).toContain('不调用真实支付');
    expect(content).toContain('微信支付或服务商模式');
    expect(content).toContain('订单生成');
    expect(content).toContain('支付状态同步');
    expect(content).toContain('退款规则');
    expect(content).toContain('对账');
    expect(apiClient).not.toContain('store-appointment-payment');
    expect(apiClient).not.toContain('createStoreAppointmentPaymentOrder');
    expect(page).not.toContain('支付商业闭环');
    expect(page).not.toContain('创建支付订单');
  });

  it('separates payment contract stages from current base appointment package', () => {
    const content = readProjectFile(contractPath);

    expect(content).toContain('支付产品设计');
    expect(content).toContain('后端订单模型');
    expect(content).toContain('权限码');
    expect(content).toContain('审计');
    expect(content).toContain('异常补偿');
    expect(content).toContain('验收门禁');
    expect(content).toContain('不得用 `priceText` 伪装真实金额');
    expect(content).toContain('基础预约包不得出现半成品支付入口');
  });

  it('links the payment plan from pack index and checkpoint documents', () => {
    const packIndex = readProjectFile('docs/store-appointment-admin-pack-contract-index.md');
    const checkpoint = [
      readProjectFile('tasks/current-task.md'),
      readProjectFile('codex-handoff.md')
    ].join('\n');

    expect(packIndex).toContain(contractPath);
    expect(packIndex).toContain('支付商业闭环包契约规划');
    expect(checkpoint).toContain(contractPath);
    expect(checkpoint).toContain('scripts/store-appointment-payment-contract-plan.test.mjs');
    expect(checkpoint).toContain('Refs: none');
  });
});
