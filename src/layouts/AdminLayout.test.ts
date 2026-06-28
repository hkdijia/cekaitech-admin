import { flushPromises, mount } from '@vue/test-utils';
import ElementPlus from 'element-plus';
import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { useWorkspaceStore } from '../stores/workspace';
import AdminLayout from './AdminLayout.vue';

vi.mock('vue-router', () => ({
  RouterView: { template: '<main />' },
  useRoute: () => ({ path: '/dashboard' }),
  useRouter: vi.fn()
}));

describe('AdminLayout', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it('opens first backend workspace menu after switching from global workspace to legal miniapp', async () => {
    const push = vi.fn();
    const resolve = vi.fn((path: string) => ({ matched: path === '/miniapp-workbench' ? [{}] : [], name: undefined }));
    vi.mocked(useRouter).mockReturnValue({ push, resolve } as unknown as ReturnType<typeof useRouter>);
    const auth = useAuthStore();
    auth.operator = {
      id: 'admin',
      name: '管理员',
      roleCode: 'super_admin',
      roleName: '超级管理员',
      permissions: ['admin:workspace:view']
    };
    auth.token = 'token';
    const workspace = useWorkspaceStore();
    workspace.options = [
      { id: 0, code: 'global', name: '全局后台', appCode: 'global', status: 'enabled' },
      { id: 1, code: 'legal-material-assistant', name: '阳律通', appCode: 'lawsuit-material-assistant', status: 'enabled' }
    ];
    workspace.loadWorkspaces = vi.fn();
    workspace.switchWorkspace = vi.fn(async (code: string) => {
      workspace.currentCode = code;
      workspace.currentMenus = [
        {
          menuCode: 'miniapp-workbench',
          menuName: '小程序工作台',
          route: '/miniapp-workbench',
          permissionCode: 'admin:workspace:view',
          sortOrder: 10
        }
      ];
    });

    const wrapper = mount(AdminLayout, {
      global: {
        plugins: [ElementPlus],
        stubs: {
          RouterView: true
        }
      }
    });
    await nextTick();
    await wrapper.findComponent({ name: 'ElSelect' }).vm.$emit('change', 'legal-material-assistant');
    await flushPromises();

    expect(workspace.switchWorkspace).toHaveBeenCalledWith('legal-material-assistant');
    expect(push).toHaveBeenCalledWith('/miniapp-workbench');
  });

  it('opens real legal credit query page from backend workspace menu', async () => {
    const push = vi.fn();
    const resolve = vi.fn((path: string) => ({ matched: path === '/legal-credit-query-tasks' ? [{}] : [], name: undefined }));
    vi.mocked(useRouter).mockReturnValue({ push, resolve } as unknown as ReturnType<typeof useRouter>);
    const auth = useAuthStore();
    auth.operator = {
      id: 'admin',
      name: '管理员',
      roleCode: 'super_admin',
      roleName: '超级管理员',
      permissions: ['admin:workspace:view', 'admin:legal-credit-query:view']
    };
    auth.token = 'token';
    const workspace = useWorkspaceStore();
    workspace.currentCode = 'legal-material-assistant';
    workspace.options = [
      { id: 0, code: 'global', name: '全局后台', appCode: 'global', status: 'enabled' },
      { id: 1, code: 'legal-material-assistant', name: '阳律通', appCode: 'lawsuit-material-assistant', status: 'enabled' }
    ];
    workspace.currentMenus = [
      {
        menuCode: 'credit-restriction-queries',
        menuName: '失信限高查询',
        route: '/legal/credit-restriction-queries',
        permissionCode: 'admin:legal-credit-query:view',
        sortOrder: 70
      }
    ];
    workspace.loadWorkspaces = vi.fn();

    const wrapper = mount(AdminLayout, {
      global: {
        plugins: [ElementPlus],
        stubs: {
          RouterView: true
        }
      }
    });
    await nextTick();
    await wrapper.find('button.workspace-menu-item').trigger('click');

    expect(push).toHaveBeenCalledWith('/legal-credit-query-tasks');
  });

  it('uses backend workspace menus as the only business workspace sidebar source', async () => {
    const push = vi.fn();
    const resolve = vi.fn((path: string) => ({ matched: path === '/party-score' ? [{}] : [], name: undefined }));
    vi.mocked(useRouter).mockReturnValue({ push, resolve } as unknown as ReturnType<typeof useRouter>);
    const auth = useAuthStore();
    auth.operator = {
      id: 'admin',
      name: '管理员',
      roleCode: 'super_admin',
      roleName: '超级管理员',
      permissions: ['admin:workspace:view', 'admin:party-score:view']
    };
    auth.token = 'token';
    const workspace = useWorkspaceStore();
    workspace.currentCode = 'scorekeeper';
    workspace.options = [
      { id: 0, code: 'global', name: '全局后台', appCode: 'global', status: 'enabled' },
      { id: 4, code: 'scorekeeper', name: '朋友局计分', appCode: 'party-scorekeeper-miniapp', status: 'enabled' }
    ];
    workspace.currentMenus = [
      {
        menuCode: 'party-score',
        menuName: '朋友局计分',
        route: '/party-score',
        permissionCode: 'admin:party-score:view',
        sortOrder: 10
      }
    ];
    workspace.loadWorkspaces = vi.fn();

    const wrapper = mount(AdminLayout, {
      global: {
        plugins: [ElementPlus],
        stubs: {
          RouterView: true
        }
      }
    });
    await nextTick();

    expect(wrapper.findAll('.sidebar-menu .el-menu-item')).toHaveLength(0);
    expect(wrapper.findAll('button.workspace-menu-item')).toHaveLength(1);
    expect(wrapper.text()).toContain('当前工作区菜单');
    expect(wrapper.text()).toContain('朋友局计分');
  });

  it('does not open legacy miniapp workbench when business workspace has no backend menus', async () => {
    const push = vi.fn();
    const resolve = vi.fn(() => ({ matched: [], name: undefined }));
    vi.mocked(useRouter).mockReturnValue({ push, resolve } as unknown as ReturnType<typeof useRouter>);
    const auth = useAuthStore();
    auth.operator = {
      id: 'admin',
      name: '管理员',
      roleCode: 'super_admin',
      roleName: '超级管理员',
      permissions: ['admin:workspace:view']
    };
    auth.token = 'token';
    const workspace = useWorkspaceStore();
    workspace.options = [
      { id: 0, code: 'global', name: '全局后台', appCode: 'global', status: 'enabled' },
      { id: 4, code: 'scorekeeper', name: '朋友局计分', appCode: 'party-scorekeeper-miniapp', status: 'enabled' }
    ];
    workspace.currentMenus = [];
    workspace.loadWorkspaces = vi.fn();
    workspace.switchWorkspace = vi.fn(async (code: string) => {
      workspace.currentCode = code;
      workspace.currentMenus = [];
    });

    const wrapper = mount(AdminLayout, {
      global: {
        plugins: [ElementPlus],
        stubs: {
          RouterView: true
        }
      }
    });
    await nextTick();
    await wrapper.findComponent({ name: 'ElSelect' }).vm.$emit('change', 'scorekeeper');
    await flushPromises();

    expect(push).toHaveBeenCalledWith('/dashboard');
    expect(push).not.toHaveBeenCalledWith('/miniapp-workbench');
  });

  it('keeps backend workspace placeholder for routes without a real admin page', async () => {
    const push = vi.fn();
    const resolve = vi.fn(() => ({ matched: [], name: undefined }));
    vi.mocked(useRouter).mockReturnValue({ push, resolve } as unknown as ReturnType<typeof useRouter>);
    const auth = useAuthStore();
    auth.operator = {
      id: 'admin',
      name: '管理员',
      roleCode: 'super_admin',
      roleName: '超级管理员',
      permissions: ['admin:workspace:view', 'legal:case:view']
    };
    auth.token = 'token';
    const workspace = useWorkspaceStore();
    workspace.currentCode = 'legal-material-assistant';
    workspace.currentMenus = [
      {
        menuCode: 'legal-cases',
        menuName: '法律案件',
        route: '/legal/cases',
        permissionCode: 'legal:case:view',
        sortOrder: 10
      }
    ];
    workspace.loadWorkspaces = vi.fn();

    const wrapper = mount(AdminLayout, {
      global: {
        plugins: [ElementPlus],
        stubs: {
          RouterView: true
        }
      }
    });
    await nextTick();
    await wrapper.find('button.workspace-menu-item').trigger('click');

    expect(push).toHaveBeenCalledWith({
      name: 'workspace-menu',
      params: {
        workspaceCode: 'legal-material-assistant',
        menuCode: 'legal-cases'
      }
    });
  });
});
