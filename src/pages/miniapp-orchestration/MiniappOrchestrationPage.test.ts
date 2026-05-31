import { mount } from '@vue/test-utils';
import ElementPlus from 'element-plus';
import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { nextTick } from 'vue';
import {
  loadMiniappOrchestrationTree,
  saveMiniappOrchestrationEntry,
  type MiniappOrchestrationNode
} from '../../api/miniappOrchestration';
import { useAuthStore } from '../../stores/auth';
import MiniappOrchestrationPage from './MiniappOrchestrationPage.vue';

vi.mock('../../api/miniappOrchestration', () => ({
  loadMiniappOrchestrationTree: vi.fn(),
  saveMiniappOrchestrationEntry: vi.fn()
}));

const loadMiniappOrchestrationTreeMock = vi.mocked(loadMiniappOrchestrationTree);
const saveMiniappOrchestrationEntryMock = vi.mocked(saveMiniappOrchestrationEntry);

const recentToolsEntry: MiniappOrchestrationNode = {
  nodeType: 'entry',
  sourceType: 'home_menu_item',
  sourceId: 14,
  key: 'codex_test_entry_2159',
  title: '近期法律工具',
  description: '查看近期吸收的法律工具',
  targetPath: '/pages/tools/tools',
  action: 'navigate',
  status: 'open',
  statusText: '可用',
  visibility: 'public',
  releaseStage: 'public',
  iconKey: 'scale',
  sortOrder: 10,
  enabled: true,
  capabilityKey: '',
  children: []
};

const lprEntry: MiniappOrchestrationNode = {
  ...recentToolsEntry,
  sourceType: 'legal_tool_exposure_item',
  sourceId: 21,
  key: 'lpr',
  title: 'LPR',
  description: '贷款市场报价利率',
  targetPath: '/pages/lpr/lpr',
  iconKey: 'search-check',
  capabilityKey: 'lpr'
};

const tree: MiniappOrchestrationNode = {
  nodeType: 'app',
  sourceType: 'app',
  sourceId: null,
  key: 'lawsuit-material-assistant',
  title: 'lawsuit-material-assistant',
  description: '',
  targetPath: '',
  action: '',
  status: '',
  statusText: '',
  visibility: 'public',
  releaseStage: 'public',
  iconKey: '',
  sortOrder: 0,
  enabled: true,
  capabilityKey: '',
  children: [
    {
      nodeType: 'page',
      sourceType: 'home_page',
      sourceId: null,
      key: 'home',
      title: '首页',
      description: '/pages/index/index',
      targetPath: '/pages/index/index',
      action: '',
      status: '',
      statusText: '',
      visibility: 'public',
      releaseStage: 'public',
      iconKey: '',
      sortOrder: 10,
      enabled: true,
      capabilityKey: '',
      children: [
        {
          nodeType: 'module',
          sourceType: 'home_module',
          sourceId: 1,
          key: 'tools',
          title: '工具类',
          description: '常用工具',
          targetPath: '',
          action: '',
          status: '',
          statusText: '',
          visibility: 'public',
          releaseStage: 'public',
          iconKey: 'teal',
          sortOrder: 10,
          enabled: true,
          capabilityKey: '',
          children: [recentToolsEntry]
        }
      ]
    },
    {
      nodeType: 'page',
      sourceType: 'tools_page',
      sourceId: null,
      key: 'tools',
      title: '工具页',
      description: '/pages/tools/tools',
      targetPath: '/pages/tools/tools',
      action: '',
      status: '',
      statusText: '',
      visibility: 'public',
      releaseStage: 'public',
      iconKey: '',
      sortOrder: 20,
      enabled: true,
      capabilityKey: '',
      children: [
        {
          nodeType: 'module',
          sourceType: 'legal_tool_exposure_group',
          sourceId: 11,
          key: 'legal_calculators',
          title: '诉讼计算',
          description: '常用诉讼计算',
          targetPath: '',
          action: '',
          status: '',
          statusText: '',
          visibility: 'public',
          releaseStage: 'public',
          iconKey: 'teal',
          sortOrder: 10,
          enabled: true,
          capabilityKey: '',
          children: [lprEntry]
        }
      ]
    }
  ]
};

function mountPage(permissions: string[] = [
  'admin:miniapp-home-config:view',
  'admin:miniapp-home-config:manage',
  'admin:legal-tool-center:manage'
]) {
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
  return mount(MiniappOrchestrationPage, {
    global: {
      plugins: [pinia, ElementPlus]
    }
  });
}

async function flushAsyncUpdates() {
  for (let index = 0; index < 5; index += 1) {
    await Promise.resolve();
    await nextTick();
  }
}

describe('MiniappOrchestrationPage', () => {
  beforeEach(() => {
    localStorage.clear();
    loadMiniappOrchestrationTreeMock.mockReset();
    saveMiniappOrchestrationEntryMock.mockReset();
    loadMiniappOrchestrationTreeMock.mockResolvedValue(tree);
    saveMiniappOrchestrationEntryMock.mockResolvedValue(recentToolsEntry);
  });

  it('loads and renders page-module-entry orchestration tree on mount', async () => {
    const wrapper = mountPage();

    await flushAsyncUpdates();

    expect(loadMiniappOrchestrationTreeMock).toHaveBeenCalledWith('lawsuit-material-assistant');
    expect(wrapper.text()).toContain('小程序配置中心');
    expect(wrapper.text()).toContain('首页');
    expect(wrapper.text()).toContain('工具类');
    expect(wrapper.text()).toContain('近期法律工具');
    expect(wrapper.text()).toContain('工具页');
    expect(wrapper.text()).toContain('诉讼计算');
    expect(wrapper.text()).toContain('LPR');
  });

  it('edits selected home entry through backend and refreshes tree', async () => {
    const wrapper = mountPage();

    await flushAsyncUpdates();
    loadMiniappOrchestrationTreeMock.mockClear();

    await wrapper.find('[data-test="node-entry-codex_test_entry_2159"]').trigger('click');
    await wrapper.find('[data-test="entry-title"]').setValue('近期工具');
    await wrapper.find('[data-test="miniapp-icon-calculator"]').trigger('click');
    await wrapper.find('[data-test="save-entry"]').trigger('click');
    await flushAsyncUpdates();

    expect(saveMiniappOrchestrationEntryMock).toHaveBeenCalledWith({
      sourceType: 'home_menu_item',
      sourceId: 14,
      title: '近期工具',
      description: '查看近期吸收的法律工具',
      targetPath: '/pages/tools/tools',
      action: 'navigate',
      status: 'open',
      statusText: '可用',
      iconKey: 'calculator',
      visibility: 'public',
      releaseStage: 'public',
      sortOrder: 10,
      enabled: true
    });
    expect(loadMiniappOrchestrationTreeMock).toHaveBeenCalledWith('lawsuit-material-assistant');
  });

  it('hides save action when selected entry lacks matching manage permission', async () => {
    const wrapper = mountPage(['admin:miniapp-home-config:view']);

    await flushAsyncUpdates();
    await wrapper.find('[data-test="node-entry-codex_test_entry_2159"]').trigger('click');
    await nextTick();

    expect(wrapper.text()).toContain('统一开源图标库');
    expect(wrapper.find('[data-test="save-entry"]').exists()).toBe(false);

    await wrapper.find('[data-test="miniapp-icon-calculator"]').trigger('click');
    await nextTick();

    expect(wrapper.text()).toContain('当前图标：scale');
  });
});
