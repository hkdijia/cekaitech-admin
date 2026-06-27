import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import { useAuthStore } from '../stores/auth';

export const routes: RouteRecordRaw[] = [
  { path: '/', redirect: '/dashboard' },
  { path: '/login', component: () => import('../pages/login/LoginPage.vue'), meta: { public: true } },
  {
    path: '/dashboard',
    component: () => import('../layouts/AdminLayout.vue'),
    meta: { permissionCode: 'admin:workspace:view' },
    children: [{ path: '', component: () => import('../pages/dashboard/DashboardPage.vue') }]
  },
  {
    path: '/users',
    component: () => import('../layouts/AdminLayout.vue'),
    meta: { permissionCode: 'admin:user:view' },
    children: [{ path: '', component: () => import('../pages/users/UsersPage.vue') }]
  },
  {
    path: '/restrictions',
    component: () => import('../layouts/AdminLayout.vue'),
    meta: { permissionCode: 'admin:user-restriction:view' },
    children: [{ path: '', component: () => import('../pages/restrictions/RestrictionsPage.vue') }]
  },
  {
    path: '/order-operations',
    component: () => import('../layouts/AdminLayout.vue'),
    meta: { permissionCode: 'admin:order:view' },
    children: [{ path: '', component: () => import('../pages/order-operations/OrderOperationsPage.vue') }]
  },
  {
    path: '/store-appointments',
    component: () => import('../layouts/AdminLayout.vue'),
    meta: { permissionCode: 'admin:store-appointment:view' },
    children: [{ path: '', component: () => import('../pages/store-appointments/StoreAppointmentsPage.vue') }]
  },
  {
    path: '/party-score',
    component: () => import('../layouts/AdminLayout.vue'),
    meta: { permissionCode: 'admin:party-score:view' },
    children: [{ path: '', component: () => import('../pages/party-score/PartyScorePage.vue') }]
  },
  {
    path: '/lawyer-audits',
    component: () => import('../layouts/AdminLayout.vue'),
    meta: { permissionCode: 'admin:lawyer-audit:view' },
    children: [{ path: '', component: () => import('../pages/lawyer-audits/LawyerAuditsPage.vue') }]
  },
  {
    path: '/miniapp-access-list',
    component: () => import('../layouts/AdminLayout.vue'),
    meta: { permissionCode: 'admin:miniapp-access-list:view' },
    children: [{ path: '', component: () => import('../pages/miniapp-access-list/MiniappAccessListPage.vue') }]
  },
  {
    path: '/legal-form-events',
    component: () => import('../layouts/AdminLayout.vue'),
    meta: { permissionCode: 'admin:legal-form-event:view' },
    children: [{ path: '', component: () => import('../pages/legal-form-events/LegalFormEventsPage.vue') }]
  },
  {
    path: '/generation-records',
    component: () => import('../layouts/AdminLayout.vue'),
    meta: { permissionCode: 'admin:generation-record:view' },
    children: [{ path: '', component: () => import('../pages/generation-records/GenerationRecordsPage.vue') }]
  },
  {
    path: '/legal-service-requests',
    component: () => import('../layouts/AdminLayout.vue'),
    meta: { permissionCode: 'admin:legal-service-request:view' },
    children: [{ path: '', component: () => import('../pages/legal-service-requests/LegalServiceRequestsPage.vue') }]
  },
  {
    path: '/legal-credit-query-tasks',
    component: () => import('../layouts/AdminLayout.vue'),
    meta: { permissionCode: 'admin:legal-credit-query:view' },
    children: [{ path: '', component: () => import('../pages/legal-credit-queries/LegalCreditQueriesPage.vue') }]
  },
  {
    path: '/miniapp-workbench',
    component: () => import('../layouts/AdminLayout.vue'),
    meta: { permissionCode: 'admin:workspace:view' },
    children: [{ path: '', component: () => import('../pages/miniapp-workbench/MiniappWorkbenchPage.vue') }]
  },
  {
    path: '/miniapp-home-config',
    component: () => import('../layouts/AdminLayout.vue'),
    meta: { permissionCode: 'admin:miniapp-home-config:view' },
    children: [{ path: '', component: () => import('../pages/miniapp-home-config/MiniappHomeConfigPage.vue') }]
  },
  {
    path: '/miniapp-orchestration',
    component: () => import('../layouts/AdminLayout.vue'),
    meta: { permissionCode: 'admin:miniapp-home-config:view' },
    children: [{ path: '', component: () => import('../pages/miniapp-orchestration/MiniappOrchestrationPage.vue') }]
  },
  {
    path: '/legal-tool-center',
    component: () => import('../layouts/AdminLayout.vue'),
    meta: { permissionCode: 'admin:legal-tool-center:view' },
    children: [{ path: '', component: () => import('../pages/legal-tool-center/LegalToolCenterPage.vue') }]
  },
  {
    path: '/data-governance',
    component: () => import('../layouts/AdminLayout.vue'),
    meta: { permissionCode: 'admin:data-governance:view' },
    children: [{ path: '', component: () => import('../pages/data-governance/DataGovernancePage.vue') }]
  },
  {
    path: '/private-lending-result-template',
    component: () => import('../layouts/AdminLayout.vue'),
    meta: { permissionCode: 'admin:private-lending-result-template:view' },
    children: [{ path: '', component: () => import('../pages/private-lending-result-template/PrivateLendingResultTemplatePage.vue') }]
  },
  {
    path: '/user-operation-logs',
    component: () => import('../layouts/AdminLayout.vue'),
    meta: { permissionCode: 'admin:user-operation-log:view' },
    children: [{ path: '', component: () => import('../pages/user-operation-logs/UserOperationLogsPage.vue') }]
  },
  {
    path: '/data-import',
    component: () => import('../layouts/AdminLayout.vue'),
    meta: { permissionCode: 'admin:data-import:view' },
    children: [{ path: '', component: () => import('../pages/data-import/DataImportPage.vue') }]
  },
  {
    path: '/settings',
    component: () => import('../layouts/AdminLayout.vue'),
    meta: { permissionCode: 'admin:settings:view' },
    children: [{ path: '', component: () => import('../pages/settings/SettingsPage.vue') }]
  },
  {
    path: '/workspace-menu/:workspaceCode/:menuCode',
    component: () => import('../layouts/AdminLayout.vue'),
    meta: { permissionCode: 'admin:workspace:view' },
    children: [{ path: '', name: 'workspace-menu', component: () => import('../pages/workspace-menu/WorkspaceMenuPage.vue') }]
  }
];

export const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach(async (to) => {
  const auth = useAuthStore();
  if (to.meta.public) {
    return true;
  }
  if (!auth.isAuthenticated && auth.token) {
    try {
      await auth.refreshCurrentOperator();
    } catch {
      auth.logout();
      return '/login';
    }
  }
  if (!auth.isAuthenticated) {
    return '/login';
  }
  const permissionCode = typeof to.meta.permissionCode === 'string' ? to.meta.permissionCode : '';
  if (!auth.hasPermission(permissionCode)) {
    if (to.path === '/dashboard') {
      return true;
    }
    return '/dashboard';
  }
  return true;
});
