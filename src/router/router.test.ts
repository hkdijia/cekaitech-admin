import { setActivePinia, createPinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { adminMenuItems, filterAdminMenuItems } from './menu';
import { router, routes } from './index';
import { useAuthStore } from '../stores/auth';

async function moveToLoginRoute() {
  await router.push('/login');
  await router.isReady();
}

describe('admin routes', () => {
  beforeEach(async () => {
    setActivePinia(createPinia());
    localStorage.clear();
    vi.restoreAllMocks();
    await moveToLoginRoute();
  });

  it('has one route for every sidebar menu item', () => {
    const routePaths = routes.map((route) => route.path);

    for (const item of adminMenuItems) {
      expect(routePaths).toContain(item.path);
    }
  });

  it('has a dynamic route for backend workspace menu entries', () => {
    expect(routes.some((route) => route.path === '/workspace-menu/:workspaceCode/:menuCode')).toBe(true);
  });

  it('filters sidebar menu items by current operator permissions', () => {
    const visibleItems = filterAdminMenuItems((permissionCode) => permissionCode === 'admin:user:view');

    expect(visibleItems.map((item) => item.path)).toEqual(['/users']);
  });

  it('declares legal form events menu and route permission', () => {
    const menuItem = adminMenuItems.find((item) => item.path === '/legal-form-events');
    const route = routes.find((item) => item.path === '/legal-form-events');

    expect(menuItem?.title).toBe('法律表单事件');
    expect(menuItem?.permissionCode).toBe('admin:legal-form-event:view');
    expect(route?.meta?.permissionCode).toBe('admin:legal-form-event:view');
  });

  it('declares generation records menu and route permission', () => {
    const menuItem = adminMenuItems.find((item) => item.path === '/generation-records');
    const route = routes.find((item) => item.path === '/generation-records');

    expect(menuItem?.title).toBe('生成记录');
    expect(menuItem?.permissionCode).toBe('admin:generation-record:view');
    expect(route?.meta?.permissionCode).toBe('admin:generation-record:view');
  });

  it('declares legal service requests menu and route permission', () => {
    const menuItem = adminMenuItems.find((item) => item.path === '/legal-service-requests');
    const route = routes.find((item) => item.path === '/legal-service-requests');

    expect(menuItem?.title).toBe('服务请求');
    expect(menuItem?.permissionCode).toBe('admin:legal-service-request:view');
    expect(route?.meta?.permissionCode).toBe('admin:legal-service-request:view');
  });

  it('declares miniapp home config menu and route permission', () => {
    const menuItem = adminMenuItems.find((item) => item.path === '/miniapp-home-config');
    const route = routes.find((item) => item.path === '/miniapp-home-config');

    expect(menuItem?.title).toBe('首页配置');
    expect(menuItem?.permissionCode).toBe('admin:miniapp-home-config:view');
    expect(route?.meta?.permissionCode).toBe('admin:miniapp-home-config:view');
  });

  it('declares miniapp orchestration menu and route permission', () => {
    const menuItem = adminMenuItems.find((item) => item.path === '/miniapp-orchestration');
    const route = routes.find((item) => item.path === '/miniapp-orchestration');

    expect(menuItem?.title).toBe('小程序配置中心');
    expect(menuItem?.description).toBe('按页面、模块和功能入口编排对客展示');
    expect(menuItem?.permissionCode).toBe('admin:miniapp-home-config:view');
    expect(route?.meta?.permissionCode).toBe('admin:miniapp-home-config:view');
  });

  it('declares miniapp document catalog menu and route permission', () => {
    const menuItem = adminMenuItems.find((item) => item.path === '/miniapp-document-catalog');
    const route = routes.find((item) => item.path === '/miniapp-document-catalog');

    expect(menuItem?.title).toBe('文书目录配置');
    expect(menuItem?.permissionCode).toBe('admin:miniapp-document-catalog:view');
    expect(route?.meta?.permissionCode).toBe('admin:miniapp-document-catalog:view');
  });

  it('declares legal tool center menu and route permission', () => {
    const menuItem = adminMenuItems.find((item) => item.path === '/legal-tool-center');
    const route = routes.find((item) => item.path === '/legal-tool-center');

    expect(menuItem?.title).toBe('法律工具中心');
    expect(menuItem?.permissionCode).toBe('admin:legal-tool-center:view');
    expect(route?.meta?.permissionCode).toBe('admin:legal-tool-center:view');
  });

  it('declares data governance menu and route permission', () => {
    const menuItem = adminMenuItems.find((item) => item.path === '/data-governance');
    const route = routes.find((item) => item.path === '/data-governance');

    expect(menuItem?.title).toBe('数据同步/发布');
    expect(menuItem?.permissionCode).toBe('admin:data-governance:view');
    expect(route?.meta?.permissionCode).toBe('admin:data-governance:view');
  });

  it('declares private lending result template menu and route permission', () => {
    const menuItem = adminMenuItems.find((item) => item.path === '/private-lending-result-template');
    const route = routes.find((item) => item.path === '/private-lending-result-template');

    expect(menuItem?.title).toBe('结果模板配置');
    expect(menuItem?.permissionCode).toBe('admin:private-lending-result-template:view');
    expect(route?.meta?.permissionCode).toBe('admin:private-lending-result-template:view');
  });

  it('declares user operation logs menu and route permission', () => {
    const menuItem = adminMenuItems.find((item) => item.path === '/user-operation-logs');
    const route = routes.find((item) => item.path === '/user-operation-logs');

    expect(menuItem?.title).toBe('操作审计');
    expect(menuItem?.permissionCode).toBe('admin:user-operation-log:view');
    expect(route?.meta?.permissionCode).toBe('admin:user-operation-log:view');
  });

  it('declares permission code for protected routes', () => {
    const usersRoute = routes.find((route) => route.path === '/users');
    const restrictionsRoute = routes.find((route) => route.path === '/restrictions');

    expect(usersRoute?.meta?.permissionCode).toBe('admin:user:view');
    expect(restrictionsRoute?.meta?.permissionCode).toBe('admin:user-restriction:view');
  });

  it('restores current operator from stored token before checking protected route permissions', async () => {
    localStorage.setItem('cekaitech-admin-token', 'stored-token');
    useAuthStore().token = 'stored-token';
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({
        success: true,
        code: '0',
        msg: '',
        data: {
          authenticated: true,
          id: 'admin-1',
          name: '策凯管理员',
          roleCode: 'operator',
          roleName: '运营',
          permissions: ['admin:legal-form-event:view']
        }
      })
    } as Response);

    await router.push('/legal-form-events');

    expect(fetchMock).toHaveBeenCalledWith('/api/admin/auth/current-operator', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer stored-token'
      }
    });
    expect(router.currentRoute.value.path).toBe('/legal-form-events');
  });

  it('redirects to login and clears stale token when current operator cannot be restored', async () => {
    localStorage.setItem('cekaitech-admin-token', 'expired-token');
    useAuthStore().token = 'expired-token';
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => ({
        success: false,
        code: '401',
        msg: '后台登录已失效'
      })
    } as Response);

    await router.push('/legal-form-events');

    expect(router.currentRoute.value.path).toBe('/login');
    expect(localStorage.getItem('cekaitech-admin-token')).toBeNull();
  });
});
