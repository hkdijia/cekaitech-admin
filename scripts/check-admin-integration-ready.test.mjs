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

  it('reports store appointment config surface readiness before edit entry work', async () => {
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

    expect(report.storeAppointmentContract.configSurfaces).toEqual([
      expect.objectContaining({ key: 'store-profile', status: 'candidate' }),
      expect.objectContaining({ key: 'service-catalog', status: 'candidate' }),
      expect.objectContaining({ key: 'staff-roster', status: 'candidate' }),
      expect.objectContaining({ key: 'appointment-rules', status: 'candidate-with-caution' }),
      expect.objectContaining({ key: 'operation-summary', status: 'blocked-by-production-design' }),
      expect.objectContaining({ key: 'feedback-follow-up', status: 'blocked-by-production-design' }),
      expect.objectContaining({ key: 'service-record', status: 'blocked-by-production-design' })
    ]);
    expect(report.storeAppointmentContract.demoOnlyExcluded).toContain('demo virtual stores and staff');
    expect(report.storeAppointmentContract.demoOnlyExcluded).toContain('sales showcase copy');
    expect(report.storeAppointmentContract.demoOnlyExcluded).toContain('simulated payment/writeoff/member content');
  });

  it('reports backend-ready config admin contract without treating frontend forms as implemented', async () => {
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

    expect(report.storeAppointmentContract.adminConfigContract).toEqual([
      expect.objectContaining({
        surfaceKey: 'store-profile',
        requiredPermission: 'admin:store-appointment-config:manage',
        status: 'backend-ready-frontend-pending'
      }),
      expect.objectContaining({
        surfaceKey: 'service-catalog',
        requiredPermission: 'admin:store-appointment-config:manage',
        status: 'backend-ready-frontend-pending'
      }),
      expect.objectContaining({
        surfaceKey: 'staff-roster',
        requiredPermission: 'admin:store-appointment-config:manage',
        status: 'backend-ready-frontend-pending'
      }),
      expect.objectContaining({
        surfaceKey: 'appointment-rules',
        requiredPermission: 'admin:store-appointment-config:manage',
        status: 'backend-ready-frontend-pending'
      })
    ]);
    expect(report.storeAppointmentContract.adminConfigContract[3].endpoints).toContain('GET /api/admin/store-appointment-config/rules/{storeCode}');
    expect(report.storeAppointmentContract.adminConfigContract[3].endpoints).toContain('PUT /api/admin/store-appointment-config/rules/{storeCode}');
    expect(report.storeAppointmentContract.adminConfigContract[3].endpoints).not.toContain('GET /api/admin/store-appointment-config/stores/{storeCode}/rules');
    expect(report.storeAppointmentContract.adminConfigContract[0].excludedFields).toContain('tenantId');
    expect(report.storeAppointmentContract.adminConfigContract[1].excludedFields).toContain('paymentAmount');
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
