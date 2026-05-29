import { describe, expect, it } from 'vitest';
import {
  buildAdminIntegrationReadinessReport,
  createFileProbe,
  createTextProbe,
  formatAdminIntegrationReadinessReport
} from './check-admin-integration-ready.mjs';

const projectFiles = new Map([
  ['vite.config.ts', "proxy: { '/api': 'http://127.0.0.1:8080' }"],
  ['src/router/menu.ts', '/legal-service-requests\n/user-operation-logs\n/generation-records\n/miniapp-document-catalog\n/users'],
  ['src/router/index.ts', '/login\n/legal-service-requests\n/user-operation-logs\n/generation-records\n/miniapp-document-catalog\n/users'],
  ['src/api/legalServiceRequests.ts', 'export function pageLegalServiceRequests() {}'],
  ['src/api/adminUserOperationLogs.ts', 'export function pageAdminUserOperationLogs() {}'],
  ['src/api/miniappDocumentCatalog.ts', 'export function pageMiniappDocumentCatalogItems() {}'],
  ['src/pages/legal-service-requests/LegalServiceRequestsPage.vue', '<template />'],
  ['src/pages/user-operation-logs/UserOperationLogsPage.vue', '<template />'],
  ['src/pages/miniapp-document-catalog/MiniappDocumentCatalogPage.vue', '<template />']
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
    expect(report.nextSteps).toContain('访问 /miniapp-document-catalog，验证文书目录分页、保存、软禁用和权限按钮显隐。');
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
    expect(output).toContain('/miniapp-document-catalog');
    expect(output).toContain('/legal-service-requests');
    expect(output).toContain('下一步');
  });
});
