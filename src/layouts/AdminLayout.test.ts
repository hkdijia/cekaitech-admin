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

  it('opens miniapp workbench after switching from global workspace to legal miniapp', async () => {
    const push = vi.fn();
    vi.mocked(useRouter).mockReturnValue({ push } as unknown as ReturnType<typeof useRouter>);
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
});
