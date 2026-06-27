import { defineStore } from 'pinia';
import {
  listAccessibleWorkspaces,
  listWorkspaceMenus,
  type BackendWorkspace,
  type BackendWorkspaceMenu
} from '../api/adminWorkspace';
import { useAuthStore } from './auth';

export interface WorkspaceOption {
  id: number;
  code: string;
  name: string;
  appCode: string;
  status: string;
}

export const workspaceOptions: WorkspaceOption[] = [
  { id: 0, code: 'global', name: '全局后台', appCode: 'global', status: 'enabled' },
  { id: 1, code: 'legal-material-assistant', name: '阳律通', appCode: 'lawsuit-material-assistant', status: 'enabled' },
  { id: 2, code: 'scorekeeper', name: '朋友局计分', appCode: 'party-scorekeeper-miniapp', status: 'enabled' },
  { id: 3, code: 'appointment', name: '预约服务', appCode: 'rehab-appointment-miniapp', status: 'enabled' }
];

export const useWorkspaceStore = defineStore('workspace', {
  state: () => ({
    currentCode: 'global',
    options: [...workspaceOptions] as WorkspaceOption[],
    currentMenus: [] as BackendWorkspaceMenu[],
    loading: false,
    loadError: '',
    menuLoading: false,
    menuLoadError: ''
  }),
  getters: {
    currentWorkspace: (state) =>
      state.options.find((item) => item.code === state.currentCode) ?? state.options[0]
  },
  actions: {
    async loadWorkspaces() {
      this.loading = true;
      this.loadError = '';
      try {
        const backendWorkspaces = await listAccessibleWorkspaces();
        const options = mergeGlobalWorkspace(backendWorkspaces.map(toWorkspaceOption));
        this.options = options;
        if (!this.options.some((item) => item.code === this.currentCode)) {
          this.currentCode = 'global';
        }
        await this.loadCurrentWorkspaceMenus();
      } catch (error) {
        this.loadError = error instanceof Error ? error.message : '工作区加载失败';
      } finally {
        this.loading = false;
      }
    },
    async switchWorkspace(code: string) {
      if (!this.options.some((item) => item.code === code)) {
        return;
      }
      this.currentCode = code;
      await this.loadCurrentWorkspaceMenus();
    },
    async loadCurrentWorkspaceMenus() {
      this.currentMenus = [];
      this.menuLoadError = '';
      const workspace = this.currentWorkspace;
      if (!workspace || workspace.id <= 0) {
        return;
      }
      this.menuLoading = true;
      try {
        const auth = useAuthStore();
        this.currentMenus = filterWorkspaceMenus(await listWorkspaceMenus(workspace.id), auth.hasPermission);
      } catch (error) {
        this.menuLoadError = error instanceof Error ? error.message : '菜单加载失败';
      } finally {
        this.menuLoading = false;
      }
    }
  }
});

function toWorkspaceOption(item: BackendWorkspace): WorkspaceOption {
  return {
    id: item.id,
    code: item.workspaceCode,
    name: item.workspaceName,
    appCode: item.appCode,
    status: item.status
  };
}

function mergeGlobalWorkspace(options: WorkspaceOption[]): WorkspaceOption[] {
  const globalWorkspace = workspaceOptions[0];
  const businessWorkspaces = options.filter((item) => item.code !== globalWorkspace.code);
  return [globalWorkspace, ...businessWorkspaces];
}

export function filterWorkspaceMenus(
  menus: BackendWorkspaceMenu[],
  hasPermission: (permissionCode: string) => boolean
): BackendWorkspaceMenu[] {
  return menus.filter((item) => hasPermission(item.permissionCode));
}
