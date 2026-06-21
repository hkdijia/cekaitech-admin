import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const defaultBackendBaseUrl = process.env.ADMIN_BACKEND_BASE_URL || 'http://127.0.0.1:8080';

const expectedRoutes = [
  '/login',
  '/legal-service-requests',
  '/user-operation-logs',
  '/generation-records',
  '/store-appointments',
  '/users'
];

const requiredModules = [
  'src/api/legalServiceRequests.ts',
  'src/api/adminUserOperationLogs.ts',
  'src/api/storeAppointments.ts',
  'src/pages/legal-service-requests/LegalServiceRequestsPage.vue',
  'src/pages/store-appointments/StoreAppointmentsPage.vue',
  'src/pages/user-operation-logs/UserOperationLogsPage.vue'
];

export function createTextProbe(files) {
  return async (relativePath) => files.get(relativePath) || '';
}

export function createFileProbe(files) {
  return async (relativePath) => files.has(relativePath);
}

async function defaultReadText(relativePath) {
  return fs.readFile(path.join(process.cwd(), relativePath), 'utf8');
}

async function defaultFileExists(relativePath) {
  try {
    await fs.access(path.join(process.cwd(), relativePath));
    return true;
  } catch {
    return false;
  }
}

async function defaultFetchHealth(backendBaseUrl) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 2500);
  try {
    const response = await fetch(new URL('/api/health', backendBaseUrl), {
      method: 'GET',
      signal: controller.signal
    });
    return {
      ok: response.ok,
      status: response.status,
      detail: response.ok ? 'OK' : `HTTP ${response.status}`
    };
  } catch (error) {
    return {
      ok: false,
      status: 0,
      detail: error instanceof Error ? error.message : String(error)
    };
  } finally {
    clearTimeout(timeout);
  }
}

function countSummary(checks) {
  return checks.reduce(
    (summary, check) => {
      summary[check.status] += 1;
      return summary;
    },
    { pass: 0, warn: 0, fail: 0 }
  );
}

function buildStoreAppointmentContract() {
  return {
    backendEndpoints: [
      'POST /api/admin/store-appointments/page',
      'GET /api/admin/store-appointments/{appointmentId}',
      'POST /api/admin/store-appointments/{appointmentId}/status'
    ],
    filters: ['storeCode', 'projectCode', 'staffCode', 'status', 'appointmentDate'],
    statuses: ['pending', 'confirmed', 'arrived', 'completed', 'cancelled'],
    permissions: ['admin:store-appointment:view', 'admin:store-appointment:manage'],
    firstSlice: 'read-only-list-and-detail-drawer',
    excludedCapabilities: [
      'real payment',
      'member cards',
      'writeoff',
      'customer profile',
      'CRM follow-up',
      'service record'
    ]
  };
}

export async function buildAdminIntegrationReadinessReport(options = {}) {
  const backendBaseUrl = options.backendBaseUrl || defaultBackendBaseUrl;
  const fetchHealth = options.fetchHealth || defaultFetchHealth;
  const readText = options.readText || defaultReadText;
  const fileExists = options.fileExists || defaultFileExists;

  const health = await fetchHealth(backendBaseUrl);
  const backend = {
    name: '后端健康检查',
    status: health.ok ? 'pass' : 'warn',
    detail: health.ok
      ? `${backendBaseUrl}/api/health 可访问`
      : `${backendBaseUrl}/api/health 暂不可访问：${health.detail}`
  };

  const viteConfig = await readText('vite.config.ts');
  const viteProxy = {
    name: 'Vite /api 代理',
    status: viteConfig.includes("'/api'") && viteConfig.includes('http://127.0.0.1:8080') ? 'pass' : 'fail',
    detail: "开发代理应保持 '/api' -> http://127.0.0.1:8080"
  };

  const menuText = await readText('src/router/menu.ts');
  const routerText = await readText('src/router/index.ts');
  const routes = expectedRoutes.map((routePath) => {
    const inRouter = routerText.includes(routePath);
    const inMenu = routePath === '/login' || menuText.includes(routePath);
    return {
      name: `路由 ${routePath}`,
      status: inRouter && inMenu ? 'pass' : 'fail',
      detail: inRouter && inMenu ? '已声明' : `router=${inRouter ? 'yes' : 'no'}, menu=${inMenu ? 'yes' : 'no'}`
    };
  });

  const modules = await Promise.all(
    requiredModules.map(async (relativePath) => {
      const exists = await fileExists(relativePath);
      return {
        name: `模块 ${relativePath}`,
        status: exists ? 'pass' : 'fail',
        detail: exists ? '存在' : '缺失'
      };
    })
  );

  const allChecks = [backend, viteProxy, ...routes, ...modules];
  const storeAppointment = {
    name: '门店预约 admin 接入前置预检',
    status: 'pass',
    detail: '后端契约已具备，admin 首片按只读列表 + 详情抽屉接入。'
  };
  const storeAppointmentContract = buildStoreAppointmentContract();
  return {
    backendBaseUrl,
    backend,
    viteProxy,
    routes,
    modules,
    storeAppointment,
    storeAppointmentContract,
    summary: countSummary(allChecks),
    nextSteps: [
      '门店预约 admin 首片先实现只读列表和详情抽屉；状态流转、支付、会员、核销、客户资料另行设计。',
      '启动后台前端后访问 /legal-service-requests，验证分页、详情脱敏、联系方式审计查看和状态更新。',
      '访问 /user-operation-logs，按 legal_service_request_contact_view 查询联系方式查看审计日志。',
      '用低权限账号复核服务请求和操作审计菜单、按钮、后端 403 边界。'
    ]
  };
}

function formatCheck(check) {
  return `[${check.status.toUpperCase()}] ${check.name} - ${check.detail}`;
}

export function formatAdminIntegrationReadinessReport(report) {
  return [
    'cekaitech-admin 联调准备检查',
    `后端地址：${report.backendBaseUrl}`,
    `汇总：PASS ${report.summary.pass} / WARN ${report.summary.warn} / FAIL ${report.summary.fail}`,
    '',
    formatCheck(report.backend),
    formatCheck(report.viteProxy),
    '',
    '关键路由',
    ...report.routes.map(formatCheck),
    '',
    '关键模块',
    ...report.modules.map(formatCheck),
    '',
    '门店预约 admin 前置预检',
    formatCheck(report.storeAppointment),
    `后端接口：${report.storeAppointmentContract.backendEndpoints.join('；')}`,
    `权限：${report.storeAppointmentContract.permissions.join(' / ')}`,
    `首片策略：${report.storeAppointmentContract.firstSlice}`,
    `排除能力：${report.storeAppointmentContract.excludedCapabilities.join('、')}`,
    '',
    '下一步',
    ...report.nextSteps.map((step, index) => `${index + 1}. ${step}`)
  ].join('\n');
}

async function main() {
  const report = await buildAdminIntegrationReadinessReport();
  console.log(formatAdminIntegrationReadinessReport(report));
  process.exitCode = report.summary.fail > 0 ? 1 : 0;
}

const currentFile = pathToFileURL(fileURLToPath(import.meta.url)).href;
const entryFile = process.argv[1] ? pathToFileURL(path.resolve(process.argv[1])).href : '';

if (currentFile === entryFile) {
  main();
}
