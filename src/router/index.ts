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
    path: '/lawyer-audits',
    component: () => import('../layouts/AdminLayout.vue'),
    meta: { permissionCode: 'admin:lawyer-audit:view' },
    children: [{ path: '', component: () => import('../pages/lawyer-audits/LawyerAuditsPage.vue') }]
  },
  {
    path: '/legal-form-events',
    component: () => import('../layouts/AdminLayout.vue'),
    meta: { permissionCode: 'admin:legal-form-event:view' },
    children: [{ path: '', component: () => import('../pages/legal-form-events/LegalFormEventsPage.vue') }]
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

router.beforeEach((to) => {
  const auth = useAuthStore();
  if (to.meta.public) {
    return true;
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
