import { defineStore } from 'pinia';

export interface WorkspaceOption {
  code: string;
  name: string;
}

export const workspaceOptions: WorkspaceOption[] = [
  { code: 'global', name: '全局后台' },
  { code: 'legal', name: '阳光法律助手' },
  { code: 'scorekeeper', name: '聚会计分器' },
  { code: 'appointment', name: '预约服务' }
];

export const useWorkspaceStore = defineStore('workspace', {
  state: () => ({
    currentCode: 'global'
  }),
  getters: {
    currentWorkspace: (state) =>
      workspaceOptions.find((item) => item.code === state.currentCode) ?? workspaceOptions[0]
  },
  actions: {
    switchWorkspace(code: string) {
      if (!workspaceOptions.some((item) => item.code === code)) {
        return;
      }
      this.currentCode = code;
    }
  }
});
