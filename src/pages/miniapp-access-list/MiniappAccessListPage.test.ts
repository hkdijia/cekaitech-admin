import { mount } from '@vue/test-utils';
import ElementPlus from 'element-plus';
import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { nextTick } from 'vue';
import {
  createMiniappAccessListEntry,
  disableMiniappAccessListEntry,
  importApprovedLawyersToAccessList,
  pageMiniappAccessListEntries
} from '../../api/miniappAccessList';
import { useAuthStore } from '../../stores/auth';
import MiniappAccessListPage from './MiniappAccessListPage.vue';

vi.mock('../../api/miniappAccessList', () => ({
  pageMiniappAccessListEntries: vi.fn(),
  createMiniappAccessListEntry: vi.fn(),
  disableMiniappAccessListEntry: vi.fn(),
  importApprovedLawyersToAccessList: vi.fn()
}));

const pageMiniappAccessListEntriesMock = vi.mocked(pageMiniappAccessListEntries);
const createMiniappAccessListEntryMock = vi.mocked(createMiniappAccessListEntry);
const disableMiniappAccessListEntryMock = vi.mocked(disableMiniappAccessListEntry);
const importApprovedLawyersToAccessListMock = vi.mocked(importApprovedLawyersToAccessList);

const accessListEntry = {
  entryId: 1,
  appCode: 'lawsuit-material-assistant',
  capabilityCode: 'legal_credit_query',
  listType: 'allow',
  userId: 14,
  identityId: 15,
  userCode: 'lma-abcd1234',
  sourceType: 'manual',
  sourceRefId: '',
  reason: '可信律师',
  status: 'active',
  createdByAdminId: 'admin-1',
  disabledByAdminId: '',
  disabledReason: '',
  disabledAt: '',
  createdAt: '2026-06-18T10:00:00',
  updatedAt: '2026-06-18T10:00:00'
};

function mountPage(permissions: string[] = ['admin:miniapp-access-list:view', 'admin:miniapp-access-list:manage']) {
  const pinia = createPinia();
  setActivePinia(pinia);
  const auth = useAuthStore();
  auth.token = 'token';
  auth.operator = {
    id: 'admin-1',
    name: '管理员',
    roleCode: 'operator',
    roleName: '运营',
    permissions
  };
  return mount(MiniappAccessListPage, {
    global: {
      plugins: [pinia, ElementPlus]
    }
  });
}

async function flushAsyncUpdates() {
  for (let index = 0; index < 8; index += 1) {
    await Promise.resolve();
    await nextTick();
  }
}

describe('MiniappAccessListPage', () => {
  beforeEach(() => {
    localStorage.clear();
    pageMiniappAccessListEntriesMock.mockReset();
    createMiniappAccessListEntryMock.mockReset();
    disableMiniappAccessListEntryMock.mockReset();
    importApprovedLawyersToAccessListMock.mockReset();
    pageMiniappAccessListEntriesMock.mockResolvedValue({
      dataList: [accessListEntry],
      totalCount: 1
    });
    createMiniappAccessListEntryMock.mockResolvedValue(accessListEntry);
    disableMiniappAccessListEntryMock.mockResolvedValue({ ...accessListEntry, status: 'disabled' });
    importApprovedLawyersToAccessListMock.mockResolvedValue({ importedCount: 2, skippedCount: 1 });
  });

  it('loads legal credit query access list by default and renders entries', async () => {
    const wrapper = mountPage();

    await flushAsyncUpdates();

    expect(pageMiniappAccessListEntriesMock).toHaveBeenCalledWith({
      pageNo: 1,
      pageSize: 10,
      appCode: 'lawsuit-material-assistant',
      capabilityCode: 'legal_credit_query',
      listType: undefined,
      status: 'active',
      keywords: undefined,
      orderBy: 'createdAt',
      order: 'desc'
    });
    expect(wrapper.text()).toContain('小程序名单管理');
    expect(wrapper.text()).toContain('失信限高查询');
    expect(wrapper.text()).toContain('lma-abcd1234');
    expect(wrapper.text()).toContain('允许');
    expect(wrapper.text()).toContain('生效中');
  });

  it('creates manual access list entry from dialog form', async () => {
    const wrapper = mountPage();
    await flushAsyncUpdates();

    await wrapper.findAll('button').find((button) => button.text().includes('新增名单'))?.trigger('click');
    await flushAsyncUpdates();
    const numberInputs = wrapper.findAll('input[type="number"]');
    await numberInputs[0].setValue('14');
    await numberInputs[1].setValue('15');
    const textarea = wrapper.find('textarea');
    await textarea.setValue('后台加入可信名单');
    await wrapper.findAll('button').find((button) => button.text() === '保存')?.trigger('click');
    await flushAsyncUpdates();

    expect(createMiniappAccessListEntryMock).toHaveBeenCalledWith({
      appCode: 'lawsuit-material-assistant',
      capabilityCode: 'legal_credit_query',
      listType: 'allow',
      userId: 14,
      identityId: 15,
      reason: '后台加入可信名单'
    });
    expect(pageMiniappAccessListEntriesMock).toHaveBeenCalledTimes(2);
  });

  it('disables active entry and imports approved lawyers', async () => {
    const wrapper = mountPage();
    await flushAsyncUpdates();

    await wrapper.findAll('button').find((button) => button.text().includes('停用'))?.trigger('click');
    await flushAsyncUpdates();
    await wrapper.findAll('button').find((button) => button.text().includes('导入已通过律师'))?.trigger('click');
    await flushAsyncUpdates();

    expect(disableMiniappAccessListEntryMock).toHaveBeenCalledWith(1, { reason: '后台停用名单记录' });
    expect(importApprovedLawyersToAccessListMock).toHaveBeenCalledWith({
      appCode: 'lawsuit-material-assistant',
      capabilityCode: 'legal_credit_query',
      reason: '从已通过律师认证导入失信限高可信名单'
    });
  });

  it('hides manage actions without manage permission', async () => {
    const wrapper = mountPage(['admin:miniapp-access-list:view']);

    await flushAsyncUpdates();

    expect(wrapper.text()).toContain('lma-abcd1234');
    expect(wrapper.text()).not.toContain('新增名单');
    expect(wrapper.text()).not.toContain('导入已通过律师');
    expect(wrapper.findAll('button').some((button) => button.text().includes('停用'))).toBe(false);
  });
});
