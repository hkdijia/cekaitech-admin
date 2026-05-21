import { defineStore } from 'pinia';
import { getCurrentOperator, loginAdmin, type AdminOperator } from '../api/adminAuth';

const TOKEN_STORAGE_KEY = 'cekaitech-admin-token';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    operator: null as AdminOperator | null,
    token: localStorage.getItem(TOKEN_STORAGE_KEY)
  }),
  getters: {
    isAuthenticated: (state) => Boolean(state.operator && state.token)
  },
  actions: {
    async login(username: string, password: string) {
      if (!username.trim()) {
        throw new Error('请输入账号');
      }
      if (!password.trim()) {
        throw new Error('请输入密码');
      }
      const result = await loginAdmin(username, password);
      this.token = result.token;
      this.operator = result.operator;
      localStorage.setItem(TOKEN_STORAGE_KEY, result.token);
    },
    async refreshCurrentOperator() {
      if (!this.token) {
        this.logout();
        return;
      }
      const result = await getCurrentOperator(this.token);
      if (!result.authenticated) {
        this.logout();
        return;
      }
      this.operator = result;
    },
    logout() {
      this.operator = null;
      this.token = null;
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    }
  }
});
