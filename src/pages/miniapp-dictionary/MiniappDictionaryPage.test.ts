import { mount } from '@vue/test-utils';
import ElementPlus from 'element-plus';
import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { nextTick } from 'vue';
import {
  pageMiniappDictionaryGroups,
  pageMiniappDictionaryItems
} from '../../api/miniappDictionary';
import { useAuthStore } from '../../stores/auth';
import { useWorkspaceStore } from '../../stores/workspace';
import MiniappDictionaryPage from './MiniappDictionaryPage.vue';

vi.mock('../../api/miniappDictionary', () => ({
  pageMiniappDictionaryGroups: vi.fn(),
  pageMiniappDictionaryItems: vi.fn()
}));

const pageMiniappDictionaryGroupsMock = vi.mocked(pageMiniappDictionaryGroups);
const pageMiniappDictionaryItemsMock = vi.mocked(pageMiniappDictionaryItems);

function mountPage(appCode = 'party-scorekeeper-miniapp') {
  const pinia = createPinia();
  setActivePinia(pinia);
  const auth = useAuthStore();
  auth.token = 'token';
  auth.operator = {
    id: 'admin-1',
    name: '管理员',
    roleCode: 'operator',
    roleName: '运营',
    permissions: ['admin:miniapp-dictionary:view']
  };
  const workspace = useWorkspaceStore();
  workspace.currentCode = 'scorekeeper';
  workspace.options = [
    { id: 0, code: 'global', name: '全局后台', appCode: 'global', status: 'enabled' },
    { id: 4, code: 'scorekeeper', name: '朋友局计分', appCode, status: 'enabled' }
  ];
  return mount(MiniappDictionaryPage, {
    global: {
      plugins: [pinia, ElementPlus]
    }
  });
}

async function flushAsyncUpdates() {
  for (let index = 0; index < 6; index += 1) {
    await Promise.resolve();
    await nextTick();
  }
}

describe('MiniappDictionaryPage', () => {
  beforeEach(() => {
    localStorage.clear();
    pageMiniappDictionaryGroupsMock.mockReset();
    pageMiniappDictionaryItemsMock.mockReset();
    pageMiniappDictionaryGroupsMock.mockResolvedValue({
      dataList: [
        {
          groupId: 1,
          appCode: 'party-scorekeeper-miniapp',
          groupCode: 'party_score_room_status',
          groupName: '朋友局计分房间状态',
          scopeType: 'admin_display',
          description: '后台房间状态说明',
          enabled: true,
          sortOrder: 10,
          createdAt: '2026-06-29T08:00:00',
          updatedAt: '2026-06-29T08:00:00'
        }
      ],
      totalCount: 1
    });
    pageMiniappDictionaryItemsMock.mockResolvedValue({
      dataList: [
        {
          itemId: 1,
          appCode: 'party-scorekeeper-miniapp',
          groupCode: 'party_score_room_status',
          itemCode: 'playing',
          itemLabel: '进行中',
          itemValue: 'playing',
          description: '房间仍在计分或等待结算。',
          tagType: 'success',
          colorToken: 'success',
          sortOrder: 10,
          enabled: true,
          systemBuiltin: true,
          createdAt: '2026-06-29T08:00:00',
          updatedAt: '2026-06-29T08:00:00'
        }
      ],
      totalCount: 1
    });
  });

  it('loads dictionary groups and selected group items for current workspace app', async () => {
    const wrapper = mountPage();

    await flushAsyncUpdates();

    expect(pageMiniappDictionaryGroupsMock).toHaveBeenCalledWith({
      appCode: 'party-scorekeeper-miniapp',
      enabled: 'enabled',
      pageNo: 1,
      pageSize: 50
    });
    expect(pageMiniappDictionaryItemsMock).toHaveBeenCalledWith({
      appCode: 'party-scorekeeper-miniapp',
      groupCode: 'party_score_room_status',
      pageNo: 1,
      pageSize: 50
    });
    expect(wrapper.text()).toContain('字典管理');
    expect(wrapper.text()).toContain('朋友局计分房间状态');
    expect(wrapper.text()).toContain('进行中');
    expect(wrapper.text()).toContain('房间仍在计分');
    expect(wrapper.text()).not.toContain('新增');
    expect(wrapper.text()).not.toContain('保存');
  });
});
