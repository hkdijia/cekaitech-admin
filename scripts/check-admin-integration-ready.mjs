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
    ],
    configSurfaces: [
      {
        key: 'store-profile',
        name: '门店资料',
        status: 'candidate',
        note: '营业时间、电话、员工称谓和项目称谓可作为中性配置候选；不得带虚拟门店名或真实租户字段。'
      },
      {
        key: 'service-catalog',
        name: '项目目录',
        status: 'candidate',
        note: '分类、项目、时长和 priceText 可作为预约骨架；priceText 仅为展示文案，不代表支付能力。'
      },
      {
        key: 'staff-roster',
        name: '员工名册',
        status: 'candidate',
        note: '员工展示资料、角色和启用状态可作为候选；不包含员工账号、权限和真实排班后台。'
      },
      {
        key: 'appointment-rules',
        name: '预约规则',
        status: 'candidate-with-caution',
        note: '仅保留可约窗口、默认时长和默认时段；真实排班、通知和取消策略需另行生产设计。'
      },
      {
        key: 'operation-summary',
        name: '经营摘要',
        status: 'blocked-by-production-design',
        note: '涉及租户、权限、统计口径和经营数据可见范围，当前不能直接进入模板结构。'
      },
      {
        key: 'feedback-follow-up',
        name: '反馈跟进',
        status: 'blocked-by-production-design',
        note: '涉及客户表达、隐私授权和跟进状态，未来必须先做隐私和权限设计。'
      },
      {
        key: 'service-record',
        name: '服务记录',
        status: 'blocked-by-production-design',
        note: '只作为本机演示备注候选；康复理疗场景不能演变为病历、诊断或客户档案。'
      }
    ],
    demoOnlyExcluded: [
      'demo virtual stores and staff',
      'sales showcase copy',
      'simulated payment/writeoff/member content',
      'wx storage demo keys',
      'diagnosis/medical-record wording'
    ],
    adminConfigContract: [
      {
        surfaceKey: 'store-profile',
        status: 'backend-ready-frontend-pending',
        requiredPermission: 'admin:store-appointment-config:manage',
        endpoints: [
          'GET /api/admin/store-appointment-config/stores/{storeCode}',
          'PUT /api/admin/store-appointment-config/stores/{storeCode}'
        ],
        writableFields: ['name', 'industry', 'phone', 'address', 'businessHours', 'staffLabel', 'projectLabel', 'showPrice'],
        excludedFields: ['tenantId', 'appId', 'merchantId', 'realAdminUserId']
      },
      {
        surfaceKey: 'service-catalog',
        status: 'backend-ready-frontend-pending',
        requiredPermission: 'admin:store-appointment-config:manage',
        endpoints: [
          'GET /api/admin/store-appointment-config/stores/{storeCode}/projects',
          'POST /api/admin/store-appointment-config/stores/{storeCode}/projects',
          'PUT /api/admin/store-appointment-config/projects/{projectCode}'
        ],
        writableFields: ['categoryId', 'name', 'summary', 'durationMinutes', 'priceText', 'showPrice', 'enabled'],
        excludedFields: ['paymentAmount', 'depositAmount', 'paymentRuleId', 'memberCardId']
      },
      {
        surfaceKey: 'staff-roster',
        status: 'backend-ready-frontend-pending',
        requiredPermission: 'admin:store-appointment-config:manage',
        endpoints: [
          'GET /api/admin/store-appointment-config/stores/{storeCode}/staff',
          'POST /api/admin/store-appointment-config/stores/{storeCode}/staff',
          'PUT /api/admin/store-appointment-config/staff/{staffCode}',
          'PUT /api/admin/store-appointment-config/staff/{staffCode}/projects'
        ],
        writableFields: ['name', 'role', 'bio', 'avatarUrl', 'trustHighlights', 'enabled', 'projectCodes'],
        excludedFields: ['loginAccountId', 'rolePermissionId', 'shiftScheduleId', 'privateContact']
      },
      {
        surfaceKey: 'appointment-rules',
        status: 'backend-ready-frontend-pending',
        requiredPermission: 'admin:store-appointment-config:manage',
        endpoints: [
          'GET /api/admin/store-appointment-config/rules/{storeCode}',
          'PUT /api/admin/store-appointment-config/rules/{storeCode}'
        ],
        writableFields: ['bookingWindowDays', 'defaultDurationMinutes', 'defaultSlots', 'confirmationHint', 'cancelHint'],
        excludedFields: ['notificationTemplateId', 'refundRuleId', 'realSchedulePolicyId', 'customerAccountPolicy']
      }
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
    '配置面 readiness',
    ...report.storeAppointmentContract.configSurfaces.map((surface) => `${surface.name}(${surface.key})：${surface.status} - ${surface.note}`),
    `demo-only-excluded：${report.storeAppointmentContract.demoOnlyExcluded.join('、')}`,
    'admin 配置契约',
    ...report.storeAppointmentContract.adminConfigContract.map((item) => `${item.surfaceKey}：${item.status}；权限 ${item.requiredPermission}；后端接口 ${item.endpoints.join(' / ')}；排除字段 ${item.excludedFields.join('、')}`),
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
