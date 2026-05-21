import { defineStore } from 'pinia';

interface Operator {
  id: string;
  name: string;
  role: string;
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    operator: null as Operator | null
  }),
  getters: {
    isAuthenticated: (state) => Boolean(state.operator)
  },
  actions: {
    login(username: string, password: string) {
      if (!username.trim()) {
        throw new Error('请输入账号');
      }
      if (!password.trim()) {
        throw new Error('请输入密码');
      }
      this.operator = {
        id: 'mock-admin',
        name: '策凯管理员',
        role: '系统管理员'
      };
    },
    logout() {
      this.operator = null;
    }
  }
});
