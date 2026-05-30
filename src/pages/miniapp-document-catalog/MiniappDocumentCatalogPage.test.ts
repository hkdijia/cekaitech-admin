import { mount } from '@vue/test-utils';
import ElementPlus from 'element-plus';
import { ElMessageBox } from 'element-plus';
import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { nextTick } from 'vue';
import {
  disableMiniappDocumentCatalogItem,
  pageMiniappDocumentCatalogItems,
  saveMiniappDocumentCatalogItem
} from '../../api/miniappDocumentCatalog';
import { useAuthStore } from '../../stores/auth';
import MiniappDocumentCatalogPage from './MiniappDocumentCatalogPage.vue';

vi.mock('../../api/miniappDocumentCatalog', () => ({
  pageMiniappDocumentCatalogItems: vi.fn(),
  saveMiniappDocumentCatalogItem: vi.fn(),
  disableMiniappDocumentCatalogItem: vi.fn()
}));

const pageMiniappDocumentCatalogItemsMock = vi.mocked(pageMiniappDocumentCatalogItems);
const saveMiniappDocumentCatalogItemMock = vi.mocked(saveMiniappDocumentCatalogItem);
const disableMiniappDocumentCatalogItemMock = vi.mocked(disableMiniappDocumentCatalogItem);

const catalogItem = {
  id: 1,
  appCode: 'lawsuit-material-assistant',
  caseType: 'private_lending',
  title: '民间借贷纠纷',
  description: '借款和还款材料整理',
  targetPath: '/pages/order/order?caseType=private_lending',
  action: 'free_document',
  status: 'open',
  statusText: '已开放',
  iconKey: 'file-text',
  sortOrder: 10,
  enabled: true,
  createdAt: '2026-05-28T20:00:00',
  updatedAt: '2026-05-28T20:00:00'
};

function mountPage(
  permissions: string[] = ['admin:miniapp-document-catalog:view', 'admin:miniapp-document-catalog:manage']
) {
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
  return mount(MiniappDocumentCatalogPage, {
    global: {
      plugins: [pinia, ElementPlus]
    }
  });
}

async function flushAsyncUpdates() {
  for (let index = 0; index < 4; index += 1) {
    await Promise.resolve();
    await nextTick();
  }
}

describe('MiniappDocumentCatalogPage', () => {
  beforeEach(() => {
    localStorage.clear();
    pageMiniappDocumentCatalogItemsMock.mockReset();
    saveMiniappDocumentCatalogItemMock.mockReset();
    disableMiniappDocumentCatalogItemMock.mockReset();

    pageMiniappDocumentCatalogItemsMock.mockResolvedValue({ dataList: [catalogItem], totalCount: 1 });
    saveMiniappDocumentCatalogItemMock.mockResolvedValue(catalogItem);
    disableMiniappDocumentCatalogItemMock.mockResolvedValue({ ...catalogItem, enabled: false });
    vi.spyOn(ElMessageBox, 'confirm').mockResolvedValue({ action: 'confirm' } as Awaited<ReturnType<typeof ElMessageBox.confirm>>);
  });

  it('loads document catalog rows on mount', async () => {
    const wrapper = mountPage();

    await flushAsyncUpdates();

    expect(pageMiniappDocumentCatalogItemsMock).toHaveBeenCalledWith({
      appCode: 'lawsuit-material-assistant',
      pageNo: 1,
      pageSize: 50
    });
    expect(wrapper.text()).toContain('文书目录配置');
    expect(wrapper.text()).toContain('民间借贷纠纷');
    expect(wrapper.text()).toContain('private_lending');
    expect(wrapper.text()).toContain('已开放');
  });

  it('saves document catalog form through backend and refreshes table', async () => {
    const wrapper = mountPage();

    await flushAsyncUpdates();
    pageMiniappDocumentCatalogItemsMock.mockClear();

    const vm = wrapper.vm as unknown as {
      openItemDialog: () => void;
      itemForm: typeof catalogItem;
      submitItem: () => Promise<void>;
    };
    vm.openItemDialog();
    Object.assign(vm.itemForm, {
      id: 1,
      appCode: 'lawsuit-material-assistant',
      caseType: 'private_lending',
      title: '民间借贷纠纷',
      description: '借款和还款材料整理',
      targetPath: '/pages/order/order?caseType=private_lending',
      action: 'free_document',
      status: 'open',
      statusText: '已开放',
      iconKey: 'file-text',
      sortOrder: 10,
      enabled: true
    });
    await vm.submitItem();
    await flushAsyncUpdates();

    expect(saveMiniappDocumentCatalogItemMock).toHaveBeenCalledWith({
      id: 1,
      appCode: 'lawsuit-material-assistant',
      caseType: 'private_lending',
      title: '民间借贷纠纷',
      description: '借款和还款材料整理',
      targetPath: '/pages/order/order?caseType=private_lending',
      action: 'free_document',
      status: 'open',
      statusText: '已开放',
      iconKey: 'file-text',
      sortOrder: 10,
      enabled: true
    });
    expect(pageMiniappDocumentCatalogItemsMock).toHaveBeenCalledWith({
      appCode: 'lawsuit-material-assistant',
      pageNo: 1,
      pageSize: 50
    });
  });

  it('hides write actions when operator lacks manage permission', async () => {
    const wrapper = mountPage(['admin:miniapp-document-catalog:view']);

    await flushAsyncUpdates();

    expect(wrapper.text()).not.toContain('新增目录');
    expect(wrapper.text()).not.toContain('禁用');
  });

  it('uses the shared miniapp icon picker for catalog icon keys', async () => {
    const wrapper = mountPage();

    await flushAsyncUpdates();

    const vm = wrapper.vm as unknown as {
      openItemDialog: (row?: typeof catalogItem) => void;
      itemForm: typeof catalogItem;
    };
    vm.openItemDialog(catalogItem);
    await nextTick();

    expect(wrapper.text()).toContain('统一开源图标库');
    expect(wrapper.text()).toContain('文书');
    expect(wrapper.text()).toContain('材料整理');
    expect(wrapper.find('[data-test="miniapp-icon-file-text"]').exists()).toBe(true);

    await wrapper.find('[data-test="miniapp-icon-folder-check"]').trigger('click');
    await nextTick();

    expect(vm.itemForm.iconKey).toBe('folder-check');
    expect(wrapper.text()).toContain('当前图标：folder-check');
  });

  it('disables document catalog rows with scoped app code', async () => {
    const wrapper = mountPage();

    await flushAsyncUpdates();
    pageMiniappDocumentCatalogItemsMock.mockClear();

    const vm = wrapper.vm as unknown as {
      disableItem: (row: typeof catalogItem) => Promise<void>;
    };
    await vm.disableItem(catalogItem);
    await flushAsyncUpdates();

    expect(disableMiniappDocumentCatalogItemMock).toHaveBeenCalledWith(1, 'lawsuit-material-assistant');
    expect(pageMiniappDocumentCatalogItemsMock).toHaveBeenCalledWith({
      appCode: 'lawsuit-material-assistant',
      pageNo: 1,
      pageSize: 50
    });
  });
});
