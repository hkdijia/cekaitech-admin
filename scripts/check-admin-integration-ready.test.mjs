import { describe, expect, it } from 'vitest';
import {
  buildAdminIntegrationReadinessReport,
  createFileProbe,
  createTextProbe,
  formatAdminIntegrationReadinessReport
} from './check-admin-integration-ready.mjs';

const projectFiles = new Map([
  ['vite.config.ts', "proxy: { '/api': 'http://127.0.0.1:8080' }"],
  ['src/router/menu.ts', '/legal-service-requests\n/user-operation-logs\n/generation-records\n/users\n/store-appointments'],
  ['src/router/index.ts', '/login\n/legal-service-requests\n/user-operation-logs\n/generation-records\n/users\n/store-appointments'],
  ['src/api/legalServiceRequests.ts', 'export function pageLegalServiceRequests() {}'],
  ['src/api/adminUserOperationLogs.ts', 'export function pageAdminUserOperationLogs() {}'],
  ['src/api/storeAppointments.ts', 'export function pageStoreAppointments() {}'],
  ['src/pages/legal-service-requests/LegalServiceRequestsPage.vue', '<template />'],
  ['src/pages/store-appointments/StoreAppointmentsPage.vue', '<template />'],
  ['src/pages/user-operation-logs/UserOperationLogsPage.vue', '<template />']
]);

describe('admin integration readiness report', () => {
  it('checks backend health, vite proxy, core routes and required modules', async () => {
    const report = await buildAdminIntegrationReadinessReport({
      backendBaseUrl: 'http://127.0.0.1:8080',
      fetchHealth: async () => ({
        ok: true,
        status: 200,
        detail: 'OK'
      }),
      readText: createTextProbe(projectFiles),
      fileExists: createFileProbe(projectFiles)
    });

    expect(report.backend.status).toBe('pass');
    expect(report.viteProxy.status).toBe('pass');
    expect(report.routes.every((item) => item.status === 'pass')).toBe(true);
    expect(report.modules.every((item) => item.status === 'pass')).toBe(true);
    expect(report.routes.some((item) => item.name.includes('/miniapp-document-catalog'))).toBe(false);
    expect(report.modules.some((item) => item.name.includes('miniappDocumentCatalog'))).toBe(false);
    expect(report.nextSteps).toContain('启动后台前端后访问 /legal-service-requests，验证分页、详情脱敏、联系方式审计查看和状态更新。');
  });

  it('keeps diagnostics non-blocking when backend is unavailable', async () => {
    const report = await buildAdminIntegrationReadinessReport({
      backendBaseUrl: 'http://127.0.0.1:8080',
      fetchHealth: async () => ({
        ok: false,
        status: 0,
        detail: 'connect ECONNREFUSED'
      }),
      readText: createTextProbe(projectFiles),
      fileExists: createFileProbe(projectFiles)
    });

    expect(report.backend.status).toBe('warn');
    expect(report.summary.warn).toBe(1);
    expect(report.summary.fail).toBe(0);
  });

  it('formats clear command-line output', async () => {
    const report = await buildAdminIntegrationReadinessReport({
      backendBaseUrl: 'http://127.0.0.1:8080',
      fetchHealth: async () => ({
        ok: true,
        status: 200,
        detail: 'OK'
      }),
      readText: createTextProbe(projectFiles),
      fileExists: createFileProbe(projectFiles)
    });

    const output = formatAdminIntegrationReadinessReport(report);

    expect(output).toContain('cekaitech-admin 联调准备检查');
    expect(output).toContain('[PASS] 后端健康检查');
    expect(output).not.toContain('/miniapp-document-catalog');
    expect(output).toContain('/legal-service-requests');
    expect(output).toContain('下一步');
  });

  it('prechecks store appointment admin integration boundary before page work', async () => {
    const report = await buildAdminIntegrationReadinessReport({
      backendBaseUrl: 'http://127.0.0.1:8080',
      fetchHealth: async () => ({
        ok: true,
        status: 200,
        detail: 'OK'
      }),
      readText: createTextProbe(projectFiles),
      fileExists: createFileProbe(projectFiles)
    });

    expect(report.storeAppointment).toEqual({
      name: '门店预约 admin 接入前置预检',
      status: 'pass',
      detail: '后端契约已具备，admin 首片按只读列表 + 详情抽屉接入。'
    });
    expect(report.storeAppointmentContract).toMatchObject({
      backendEndpoints: [
        'POST /api/admin/store-appointments/page',
        'GET /api/admin/store-appointments/{appointmentId}',
        'POST /api/admin/store-appointments/{appointmentId}/status'
      ],
      permissions: ['admin:store-appointment:view', 'admin:store-appointment:manage'],
      firstSlice: 'read-only-list-and-detail-drawer'
    });
    expect(report.storeAppointmentContract.excludedCapabilities).toContain('real payment');
    expect(report.nextSteps).toContain('门店预约 admin 首片先实现只读列表和详情抽屉；状态流转、支付、会员、核销、客户资料另行设计。');
  });

  it('checks store appointment read-only modules after first slice lands', async () => {
    const report = await buildAdminIntegrationReadinessReport({
      backendBaseUrl: 'http://127.0.0.1:8080',
      fetchHealth: async () => ({
        ok: true,
        status: 200,
        detail: 'OK'
      }),
      readText: createTextProbe(projectFiles),
      fileExists: createFileProbe(projectFiles)
    });

    expect(report.routes.some((item) => item.name.includes('/store-appointments') && item.status === 'pass')).toBe(true);
    expect(report.modules.some((item) => item.name.includes('src/api/storeAppointments.ts') && item.status === 'pass')).toBe(true);
    expect(report.modules.some((item) => item.name.includes('StoreAppointmentsPage.vue') && item.status === 'pass')).toBe(true);
  });
});
