import { mount } from '@vue/test-utils';
import ElementPlus from 'element-plus';
import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { nextTick } from 'vue';
import { pageAdminUsers } from '../../api/adminUsers';
import UsersPage from './UsersPage.vue';

const routeMock = vi.hoisted(() => ({
  query: {} as Record<string, string | string[] | undefined>
}));

vi.mock('vue-router', () => ({
  useRoute: () => ({
    query: routeMock.query
  })
}));

vi.mock('../../api/adminUsers', () => ({
  pageAdminUsers: vi.fn(),
  getAdminUserDetail: vi.fn(),
  seedAdminUsers: vi.fn(),
  updateAdminUserStatus: vi.fn()
}));

vi.mock('../../api/adminUserOperationLogs', () => ({
  pageUserOperationLogs: vi.fn()
}));

const pageAdminUsersMock = vi.mocked(pageAdminUsers);

const adminUser = {
  id: 123,
  primaryPhone: '13800000123',
  unionId: 'union-123',
  status: 'normal',
  provider: 'wechat',
  appCode: 'lawsuit-material-assistant',
  providerUserId: 'openid-123',
  phoneBindingStatus: 'bound',
  role: 'user',
  createdAt: '2026-05-23T08:00:00',
  updatedAt: '2026-05-23T08:10:00'
};

function mountPage() {
  const pinia = createPinia();
  setActivePinia(pinia);
  return mount(UsersPage, {
    global: {
      plugins: [pinia, ElementPlus]
    }
  });
}

async function flushAsyncUpdates() {
  for (let index = 0; index < 3; index += 1) {
    await Promise.resolve();
    await nextTick();
  }
}

describe('UsersPage', () => {
  beforeEach(() => {
    routeMock.query = {};
    localStorage.clear();
    pageAdminUsersMock.mockReset();
    pageAdminUsersMock.mockResolvedValue({
      dataList: [adminUser],
      totalCount: 1
    });
  });

  it('uses a userId query value as exact user id filter without polluting keywords', async () => {
    routeMock.query = { userId: '123' };
    const wrapper = mountPage();

    await flushAsyncUpdates();

    expect(pageAdminUsersMock).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: 123,
        keywords: undefined
      })
    );
    expect(wrapper.text()).toContain('用户 ID 123');
    expect(wrapper.text()).toContain('精确筛选');
    expect(wrapper.find('.keyword-input input').element).toHaveProperty('value', '');
    expect(wrapper.find('.user-id-input input').element).toHaveProperty('value', '123');
  });

  it('normalizes empty text filters to undefined while preserving exact user id', async () => {
    routeMock.query = { userId: '123' };

    mountPage();

    await flushAsyncUpdates();

    expect(pageAdminUsersMock).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: 123,
        keywords: undefined,
        status: undefined,
        appCode: undefined
      })
    );
  });

  it.each([
    ['0'],
    ['-1'],
    ['12.3'],
    ['   '],
    ['abc'],
    ['9007199254740993'],
    [['0', '123']]
  ])('ignores invalid userId query value %s', async (userId) => {
    routeMock.query = { userId };
    const wrapper = mountPage();

    await flushAsyncUpdates();

    expect(pageAdminUsersMock).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: undefined,
        keywords: undefined
      })
    );
    expect(wrapper.text()).not.toContain('用户 ID 精确筛选');
  });

  it('uses the first valid userId when router provides an array query value', async () => {
    routeMock.query = { userId: ['456', '789'] };
    const wrapper = mountPage();

    await flushAsyncUpdates();

    expect(pageAdminUsersMock).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: 456,
        keywords: undefined
      })
    );
    expect(wrapper.text()).toContain('用户 ID 456');
    expect(wrapper.text()).toContain('精确筛选');
  });
});
