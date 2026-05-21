import { setActivePinia, createPinia } from 'pinia';
import { beforeEach, describe, expect, it } from 'vitest';
import { useAuthStore } from './auth';

describe('useAuthStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('logs in with a mock operator and logs out', () => {
    const auth = useAuthStore();

    expect(auth.isAuthenticated).toBe(false);
    auth.login('admin', '123456');

    expect(auth.isAuthenticated).toBe(true);
    expect(auth.operator?.name).toBe('策凯管理员');

    auth.logout();
    expect(auth.isAuthenticated).toBe(false);
    expect(auth.operator).toBeNull();
  });
});
