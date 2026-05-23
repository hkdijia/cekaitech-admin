import { describe, expect, it } from 'vitest';
import { adminMenuItems, filterAdminMenuItems } from './menu';
import { routes } from './index';

describe('admin routes', () => {
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

  it('declares permission code for protected routes', () => {
    const usersRoute = routes.find((route) => route.path === '/users');
    const restrictionsRoute = routes.find((route) => route.path === '/restrictions');

    expect(usersRoute?.meta?.permissionCode).toBe('admin:user:view');
    expect(restrictionsRoute?.meta?.permissionCode).toBe('admin:user-restriction:view');
  });
});
