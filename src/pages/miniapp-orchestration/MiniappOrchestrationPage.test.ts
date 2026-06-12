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

const litigationFeeEntry: MiniappOrchestrationNode = {
  nodeType: 'feature',
  sourceType: 'home_menu_item',
  sourceId: 14,
  key: 'litigation_fee',
  title: '诉讼费计算',
  description: '估算财产案件受理费',
  targetPath: '/pages/litigation-fee/litigation-fee',
  action: 'navigate',
  status: 'open',
  statusText: '可用',
  visibility: 'public',
  releaseStage: 'public',
  iconKey: 'calculator',
  sortOrder: 10,
  enabled: true,
  capabilityKey: '',
  children: []
};

const lprEntry: MiniappOrchestrationNode = {
  ...litigationFeeEntry,
  sourceType: 'legal_tool_exposure_item',
  sourceId: 21,
  key: 'lpr',
  title: 'LPR',
  description: '贷款市场报价利率',
  targetPath: '/pages/lpr/lpr',
  iconKey: 'search-check',
  capabilityKey: 'lpr'
};

const pendingLprEntry: MiniappOrchestrationNode = {
  ...lprEntry,
  status: 'pending_release',
  statusText: '待发布',
  releaseStage: 'pilot'
};

const profileAuditsEntry: MiniappOrchestrationNode = {
  nodeType: 'feature',
  sourceType: 'profile_local_feature',
  sourceId: null,
  key: 'audits',
  title: '我的审核',
  description: '查看需要处理的服务审核',
  targetPath: '/pages/audits/audits',
  action: 'navigate',
  status: 'open',
  statusText: '查看',
  visibility: 'public',
  releaseStage: 'local',
  iconKey: 'clipboard-check',
  sortOrder: 10,
  enabled: true,
  capabilityKey: '',
  children: []
};

const profileOrdersEntry: MiniappOrchestrationNode = {
  ...profileAuditsEntry,
  key: 'orders',
  title: '我的生成记录',
  description: '查看本机生成记录',
  targetPath: '/pages/orders/orders',
  statusText: '本机',
  iconKey: 'file-clock',
  sortOrder: 20
};

const profileFavoritesEntry: MiniappOrchestrationNode = {
  ...profileAuditsEntry,
  key: 'favorites',
  title: '我的收藏',
  description: '查看已收藏的法律工具',
  targetPath: '/pages/favorites/favorites',
  iconKey: 'star',
  sortOrder: 30
};

const profileAgreementEntry: MiniappOrchestrationNode = {
  ...profileAuditsEntry,
  key: 'agreement',
  title: '用户协议与免责声明',
  description: '查看用户协议与免责声明',
  targetPath: '/pages/agreement/agreement',
  iconKey: 'file-text',
  sortOrder: 40
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
      nodeType: 'tab',
      sourceType: 'miniapp_tab',
      sourceId: null,
      key: 'tab_common',
      title: '常用功能',
      description: '底部导航中的常用功能页',
      targetPath: '/pages/index/index',
      action: 'switch_tab',
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
          children: [litigationFeeEntry]
        }
      ]
    },
    {
      nodeType: 'tab',
      sourceType: 'miniapp_tab',
      sourceId: null,
      key: 'tab_me',
      title: '我的',
      description: '底部导航中的账号中心页',
      targetPath: '/pages/me/me',
      action: 'switch_tab',
      status: '',
      statusText: '',
      visibility: 'public',
      releaseStage: 'public',
      iconKey: '',
      sortOrder: 20,
      enabled: true,
      capabilityKey: '',
      children: [
        profileAuditsEntry,
        profileOrdersEntry,
        profileFavoritesEntry,
        profileAgreementEntry
      ]
    }
  ]
};

const treeWithToolFeatures: MiniappOrchestrationNode = {
  ...tree,
  children: [
    {
      ...tree.children[0],
      children: [
        {
          ...tree.children[0].children[0],
          children: [
            ...tree.children[0].children[0].children,
            lprEntry
          ]
        }
      ]
    },
    tree.children[1]
  ]
};

const disabledArchiveModule: MiniappOrchestrationNode = {
  nodeType: 'module',
  sourceType: 'home_module',
  sourceId: 99,
  key: 'archive_tools',
  title: '历史工具模块',
  description: '历史停用配置',
  targetPath: '',
  action: '',
  status: '',
  statusText: '',
  visibility: 'hidden',
  releaseStage: 'draft',
  iconKey: 'teal',
  sortOrder: 15,
  enabled: false,
  capabilityKey: '',
  children: []
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
    loadMiniappOrchestrationTreeMock.mockResolvedValue(treeWithToolFeatures);
    saveMiniappOrchestrationEntryMock.mockResolvedValue(litigationFeeEntry);
  });

  it('loads and renders tab-module-feature menu tree on mount', async () => {
    const wrapper = mountPage();

    await flushAsyncUpdates();

    expect(loadMiniappOrchestrationTreeMock).toHaveBeenCalledWith('lawsuit-material-assistant', false);
    expect(wrapper.text()).toContain('页面菜单管理');
    expect(wrapper.text()).toContain('常用功能');
    expect(wrapper.text()).toContain('工具类');
    expect(wrapper.text()).toContain('诉讼费计算');
    expect(wrapper.text()).toContain('我的');
    expect(wrapper.text()).toContain('我的审核');
    expect(wrapper.text()).toContain('LPR');
    expect(wrapper.text()).not.toContain('诉讼计算');
    expect(wrapper.text()).not.toContain('底部 Tab：工具页');
    expect(wrapper.text()).not.toContain('首页快捷入口');
    expect(wrapper.find('.menu-tree-shell').exists()).toBe(true);
    expect(wrapper.find('.tree-node-accent').exists()).toBe(true);
    expect(wrapper.text()).toContain('2 项');
  });

  it('filters the tree so operators can locate a feature by title or path', async () => {
    const wrapper = mountPage();

    await flushAsyncUpdates();
    await wrapper.find('[data-test="tree-search"]').setValue('诉讼费');
    await nextTick();

    expect(wrapper.text()).toContain('诉讼费计算');
    expect(wrapper.text()).toContain('常用功能');
    expect(wrapper.text()).toContain('工具类');
    expect(wrapper.text()).not.toContain('我的审核');
  });

  it('renders profile tab local features as readonly menu nodes', async () => {
    const wrapper = mountPage();

    await flushAsyncUpdates();
    await wrapper.find('[data-test="node-feature-audits"]').trigger('click');
    await nextTick();

    expect(wrapper.text()).toContain('我的审核');
    expect(wrapper.text()).toContain('账号页本地功能');
    expect(wrapper.text()).toContain('当前功能来自小程序本地页面');
    expect(wrapper.find('[data-test="save-entry"]').exists()).toBe(false);
  });

  it('shows selected node summary before configuration details', async () => {
    const wrapper = mountPage();

    await flushAsyncUpdates();
    await wrapper.find('[data-test="node-feature-litigation_fee"]').trigger('click');
    await nextTick();

    expect(wrapper.find('.detail-hero').exists()).toBe(true);
    expect(wrapper.text()).toContain('菜单层级');
    expect(wrapper.text()).toContain('功能');
    expect(wrapper.text()).toContain('生命周期');
    expect(wrapper.text()).toContain('已上线');
    expect(wrapper.text()).toContain('目标页面');
    expect(wrapper.text()).toContain('/pages/litigation-fee/litigation-fee');
  });

  it('uses menu lifecycle status as the publishing control for feature nodes', async () => {
    loadMiniappOrchestrationTreeMock.mockResolvedValueOnce({
      ...tree,
      children: [
        {
          ...tree.children[0],
          children: [
            {
              ...tree.children[0].children[0],
              children: [pendingLprEntry]
            }
          ]
        },
        tree.children[1]
      ]
    });
    const wrapper = mountPage();

    await flushAsyncUpdates();
    await wrapper.find('[data-test="node-feature-lpr"]').trigger('click');
    await nextTick();

    expect(wrapper.text()).toContain('生命周期');
    expect(wrapper.text()).toContain('待发布');
    expect(wrapper.text()).not.toContain('业务状态');
  });

  it('collapses and expands module children to keep the menu tree readable', async () => {
    const wrapper = mountPage();

    await flushAsyncUpdates();

    expect(wrapper.text()).toContain('诉讼费计算');
    expect(wrapper.text()).toContain('LPR');

    await wrapper.find('[data-test="toggle-module-tools"]').trigger('click');
    await nextTick();

    expect(wrapper.text()).not.toContain('诉讼费计算');
    expect(wrapper.text()).not.toContain('LPR');

    await wrapper.find('[data-test="toggle-module-tools"]').trigger('click');
    await nextTick();

    expect(wrapper.text()).toContain('诉讼费计算');
    expect(wrapper.text()).toContain('LPR');
  });

  it('edits selected home entry through backend and refreshes tree', async () => {
    const wrapper = mountPage();

    await flushAsyncUpdates();
    loadMiniappOrchestrationTreeMock.mockClear();

    await wrapper.find('[data-test="node-feature-litigation_fee"]').trigger('click');
    await wrapper.find('[data-test="entry-title"]').setValue('诉讼费估算');
    await wrapper.find('[data-test="miniapp-icon-scale"]').trigger('click');
    await wrapper.find('[data-test="save-entry"]').trigger('click');
    await flushAsyncUpdates();

    expect(saveMiniappOrchestrationEntryMock).toHaveBeenCalledWith({
      sourceType: 'home_menu_item',
      sourceId: 14,
      title: '诉讼费估算',
      description: '估算财产案件受理费',
      targetPath: '/pages/litigation-fee/litigation-fee',
      action: 'navigate',
      status: 'published',
      statusText: '已上线',
      iconKey: 'scale',
      visibility: 'public',
      releaseStage: 'public',
      sortOrder: 10,
      enabled: true
    });
    expect(loadMiniappOrchestrationTreeMock).toHaveBeenCalledWith('lawsuit-material-assistant', false);
  });

  it('hides save action when selected entry lacks matching manage permission', async () => {
    const wrapper = mountPage(['admin:miniapp-home-config:view']);

    await flushAsyncUpdates();
    await wrapper.find('[data-test="node-feature-litigation_fee"]').trigger('click');
    await nextTick();

    expect(wrapper.text()).toContain('统一开源图标库');
    expect(wrapper.text()).toContain('图标库 50+');
    expect(wrapper.find('[data-test="miniapp-icon-gavel"]').exists()).toBe(true);
    expect(wrapper.find('[data-test="save-entry"]').exists()).toBe(false);

    await wrapper.find('[data-test="miniapp-icon-calculator"]').trigger('click');
    await nextTick();

    expect(wrapper.text()).toContain('当前图标：calculator');
  });

  it('loads disabled nodes only after operator enables recovery view', async () => {
    loadMiniappOrchestrationTreeMock.mockResolvedValueOnce(treeWithToolFeatures).mockResolvedValueOnce({
      ...treeWithToolFeatures,
      children: [
        {
          ...treeWithToolFeatures.children[0],
          children: [
            ...treeWithToolFeatures.children[0].children,
            disabledArchiveModule
          ]
        },
        treeWithToolFeatures.children[1]
      ]
    });
    const wrapper = mountPage();

    await flushAsyncUpdates();

    expect(loadMiniappOrchestrationTreeMock).toHaveBeenCalledWith('lawsuit-material-assistant', false);
    expect(wrapper.text()).not.toContain('历史工具模块');

    await wrapper.find('[data-test="include-disabled-toggle"]').trigger('click');
    await flushAsyncUpdates();

    expect(loadMiniappOrchestrationTreeMock).toHaveBeenLastCalledWith('lawsuit-material-assistant', true);
    expect(wrapper.text()).toContain('历史工具模块');
    expect(wrapper.text()).toContain('已停用');
  });
});
