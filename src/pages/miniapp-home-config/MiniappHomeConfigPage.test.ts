import { mount } from '@vue/test-utils';
import ElementPlus from 'element-plus';
import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { nextTick } from 'vue';
import {
  disableMiniappHomeBanner,
  disableMiniappHomeMenuItem,
  disableMiniappHomeModule,
  pageMiniappHomeBanners,
  pageMiniappHomeMenuItems,
  pageMiniappHomeModules,
  saveMiniappHomeBanner,
  saveMiniappHomeMenuItem,
  saveMiniappHomeModule
} from '../../api/miniappHomeConfig';
import { useAuthStore } from '../../stores/auth';
import { useWorkspaceStore } from '../../stores/workspace';
import MiniappHomeConfigPage from './MiniappHomeConfigPage.vue';

vi.mock('../../api/miniappHomeConfig', () => ({
  pageMiniappHomeModules: vi.fn(),
  saveMiniappHomeModule: vi.fn(),
  disableMiniappHomeModule: vi.fn(),
  pageMiniappHomeMenuItems: vi.fn(),
  saveMiniappHomeMenuItem: vi.fn(),
  disableMiniappHomeMenuItem: vi.fn(),
  pageMiniappHomeBanners: vi.fn(),
  saveMiniappHomeBanner: vi.fn(),
  disableMiniappHomeBanner: vi.fn()
}));

const pageMiniappHomeModulesMock = vi.mocked(pageMiniappHomeModules);
const saveMiniappHomeModuleMock = vi.mocked(saveMiniappHomeModule);
const disableMiniappHomeModuleMock = vi.mocked(disableMiniappHomeModule);
const pageMiniappHomeMenuItemsMock = vi.mocked(pageMiniappHomeMenuItems);
const saveMiniappHomeMenuItemMock = vi.mocked(saveMiniappHomeMenuItem);
const disableMiniappHomeMenuItemMock = vi.mocked(disableMiniappHomeMenuItem);
const pageMiniappHomeBannersMock = vi.mocked(pageMiniappHomeBanners);
const saveMiniappHomeBannerMock = vi.mocked(saveMiniappHomeBanner);
const disableMiniappHomeBannerMock = vi.mocked(disableMiniappHomeBanner);

const homeModule = {
  id: 1,
  appCode: 'lawsuit-material-assistant',
  moduleKey: 'tools',
  title: '工具类',
  description: '常用诉讼辅助计算与办事指引',
  tone: 'teal',
  visibleLimit: 8,
  showMoreEnabled: false,
  sortOrder: 10,
  enabled: true,
  createdAt: '2026-05-27T20:00:00',
  updatedAt: '2026-05-27T20:00:00'
};

const menuItem = {
  id: 2,
  moduleId: 1,
  itemKey: 'interest',
  title: '利息计算',
  description: '按本金、利率和期间估算利息',
  targetPath: '/pages/interest/interest',
  action: 'navigate',
  status: 'open',
  statusText: '可用',
  iconKey: 'calculator',
  iconUrl: '',
  fontWeight: 'bold',
  sortOrder: 10,
  enabled: true,
  createdAt: '2026-05-27T20:00:00',
  updatedAt: '2026-05-27T20:00:00'
};

const banner = {
  id: 3,
  appCode: 'lawsuit-material-assistant',
  bannerKey: 'launch_notice',
  title: '试运行公告',
  subtitle: '首页入口将逐步支持后台配置',
  announcementText: '材料内容请自行核对',
  imageUrl: '',
  targetPath: '/pages/notice-detail/notice-detail?noticeKey=launch_notice',
  detailTitle: '试运行公告',
  detailContent: '详情',
  sortOrder: 10,
  enabled: true,
  createdAt: '2026-05-27T20:00:00',
  updatedAt: '2026-05-27T20:00:00'
};

function mountPage(permissions: string[] = ['admin:miniapp-home-config:view', 'admin:miniapp-home-config:manage']) {
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
  return mount(MiniappHomeConfigPage, {
    global: {
      plugins: [pinia, ElementPlus]
    }
  });
}

function setWorkspaceApp(appCode: string, code = 'scorekeeper') {
  const workspace = useWorkspaceStore();
  workspace.currentCode = code;
  workspace.options = [
    { id: 0, code: 'global', name: '全局后台', appCode: 'global', status: 'enabled' },
    { id: 4, code, name: '朋友局计分', appCode, status: 'enabled' }
  ];
}

async function flushAsyncUpdates() {
  for (let index = 0; index < 4; index += 1) {
    await Promise.resolve();
    await nextTick();
  }
}

describe('MiniappHomeConfigPage', () => {
  beforeEach(() => {
    localStorage.clear();
    pageMiniappHomeModulesMock.mockReset();
    saveMiniappHomeModuleMock.mockReset();
    disableMiniappHomeModuleMock.mockReset();
    pageMiniappHomeMenuItemsMock.mockReset();
    saveMiniappHomeMenuItemMock.mockReset();
    disableMiniappHomeMenuItemMock.mockReset();
    pageMiniappHomeBannersMock.mockReset();
    saveMiniappHomeBannerMock.mockReset();
    disableMiniappHomeBannerMock.mockReset();

    pageMiniappHomeModulesMock.mockResolvedValue({ dataList: [homeModule], totalCount: 1 });
    pageMiniappHomeMenuItemsMock.mockResolvedValue({ dataList: [menuItem], totalCount: 1 });
    pageMiniappHomeBannersMock.mockResolvedValue({ dataList: [banner], totalCount: 1 });
    saveMiniappHomeModuleMock.mockResolvedValue(homeModule);
    saveMiniappHomeMenuItemMock.mockResolvedValue(menuItem);
    saveMiniappHomeBannerMock.mockResolvedValue(banner);
    disableMiniappHomeModuleMock.mockResolvedValue({ ...homeModule, enabled: false });
    disableMiniappHomeMenuItemMock.mockResolvedValue({ ...menuItem, enabled: false });
    disableMiniappHomeBannerMock.mockResolvedValue({ ...banner, enabled: false });
  });

  it('loads modules, first module menu items and banners on mount', async () => {
    const wrapper = mountPage();

    await flushAsyncUpdates();

    expect(pageMiniappHomeModulesMock).toHaveBeenCalledWith({
      appCode: 'lawsuit-material-assistant',
      pageNo: 1,
      pageSize: 50
    });
    expect(pageMiniappHomeMenuItemsMock).toHaveBeenCalledWith({
      moduleId: 1,
      pageNo: 1,
      pageSize: 50
    });
    expect(pageMiniappHomeBannersMock).toHaveBeenCalledWith({
      appCode: 'lawsuit-material-assistant',
      pageNo: 1,
      pageSize: 50
    });
    expect(wrapper.text()).toContain('首页配置');
    expect(wrapper.text()).toContain('模块配置');
    expect(wrapper.text()).toContain('功能入口');
    expect(wrapper.text()).toContain('Banner 公告');
    expect(wrapper.text()).toContain('工具类');
    expect(wrapper.text()).toContain('全量展示');
    expect(wrapper.text()).toContain('试运行公告');
  });

  it('loads current workspace app home config instead of hardcoded legal app', async () => {
    const pinia = createPinia();
    setActivePinia(pinia);
    const auth = useAuthStore();
    auth.token = 'token';
    auth.operator = {
      id: 'admin-1',
      name: '管理员',
      roleCode: 'operator',
      roleName: '运营',
      permissions: ['admin:miniapp-home-config:view', 'admin:miniapp-home-config:manage']
    };
    setWorkspaceApp('party-scorekeeper-miniapp');

    mount(MiniappHomeConfigPage, {
      global: {
        plugins: [pinia, ElementPlus]
      }
    });

    await flushAsyncUpdates();

    expect(pageMiniappHomeModulesMock).toHaveBeenCalledWith({
      appCode: 'party-scorekeeper-miniapp',
      pageNo: 1,
      pageSize: 50
    });
    expect(pageMiniappHomeBannersMock).toHaveBeenCalledWith({
      appCode: 'party-scorekeeper-miniapp',
      pageNo: 1,
      pageSize: 50
    });
  });

  it('saves module form through backend and refreshes modules', async () => {
    const wrapper = mountPage();

    await flushAsyncUpdates();
    pageMiniappHomeModulesMock.mockClear();

    const vm = wrapper.vm as unknown as {
      openModuleDialog: () => void;
      moduleForm: typeof homeModule;
      submitModule: () => Promise<void>;
    };
    vm.openModuleDialog();
    Object.assign(vm.moduleForm, {
      id: 1,
      appCode: 'lawsuit-material-assistant',
      moduleKey: 'tools',
      title: '工具类',
      description: '常用诉讼辅助计算与办事指引',
      tone: 'teal',
      visibleLimit: 8,
      showMoreEnabled: false,
      sortOrder: 10,
      enabled: true
    });
    await vm.submitModule();
    await flushAsyncUpdates();

    expect(saveMiniappHomeModuleMock).toHaveBeenCalledWith({
      id: 1,
      appCode: 'lawsuit-material-assistant',
      moduleKey: 'tools',
      title: '工具类',
      description: '常用诉讼辅助计算与办事指引',
      tone: 'teal',
      visibleLimit: 8,
      showMoreEnabled: false,
      sortOrder: 10,
      enabled: true
    });
    expect(pageMiniappHomeModulesMock).toHaveBeenCalledWith({
      appCode: 'lawsuit-material-assistant',
      pageNo: 1,
      pageSize: 50
    });
  });

  it('hides write actions when operator lacks manage permission', async () => {
    const wrapper = mountPage(['admin:miniapp-home-config:view']);

    await flushAsyncUpdates();

    expect(wrapper.text()).not.toContain('新增模块');
    expect(wrapper.text()).not.toContain('新增 Banner');
    expect(wrapper.text()).not.toContain('禁用');
  });

  it('offers a controlled icon library for menu item icon keys', async () => {
    const wrapper = mountPage();

    await flushAsyncUpdates();

    const vm = wrapper.vm as unknown as {
      openMenuItemDialog: (row?: typeof menuItem) => void;
      menuItemForm: typeof menuItem;
    };
    vm.openMenuItemDialog(menuItem);
    await nextTick();

    expect(wrapper.text()).toContain('统一开源图标库');
    expect(wrapper.text()).toContain('图标库 50+');
    expect(wrapper.text()).toContain('计算器');
    expect(wrapper.text()).toContain('天平');
    expect(wrapper.text()).toContain('表单清单');
    expect(wrapper.find('[data-test="miniapp-icon-calculator"]').exists()).toBe(true);
    expect(wrapper.find('[data-test="miniapp-icon-scale"]').exists()).toBe(true);
    expect(wrapper.find('[data-test="miniapp-icon-gavel"]').exists()).toBe(true);
    expect(wrapper.find('[data-test="miniapp-icon-scroll-text"]').exists()).toBe(true);

    await wrapper.find('[data-test="miniapp-icon-search"]').setValue('法院');
    await nextTick();

    expect(wrapper.find('[data-test="miniapp-icon-landmark"]').exists()).toBe(true);
    expect(wrapper.find('[data-test="miniapp-icon-calculator"]').exists()).toBe(false);

    await wrapper.find('[data-test="miniapp-icon-search"]').setValue('');
    await nextTick();
    await wrapper.find('[data-test="miniapp-icon-scale"]').trigger('click');
    await nextTick();

    expect(vm.menuItemForm.iconKey).toBe('scale');
    expect(wrapper.text()).toContain('当前图标：scale');
  });
});
