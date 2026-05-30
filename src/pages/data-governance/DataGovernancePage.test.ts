import { mount } from '@vue/test-utils';
import ElementPlus from 'element-plus';
import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { nextTick } from 'vue';
import {
  pageLprRateRevisions,
  pageLprSyncBatches,
  syncLprRates
} from '../../api/dataGovernance';
import { useAuthStore } from '../../stores/auth';
import DataGovernancePage from './DataGovernancePage.vue';

vi.mock('../../api/dataGovernance', () => ({
  pageLprSyncBatches: vi.fn(),
  pageLprRateRevisions: vi.fn(),
  syncLprRates: vi.fn()
}));

const pageLprSyncBatchesMock = vi.mocked(pageLprSyncBatches);
const pageLprRateRevisionsMock = vi.mocked(pageLprRateRevisions);
const syncLprRatesMock = vi.mocked(syncLprRates);

const syncBatch = {
  id: 1,
  appCode: 'lawsuit-material-assistant',
  batchNo: 'LPR-20260531-001',
  sourceVersion: 'pbc-2025-05-20',
  itemCount: 2,
  importedCount: 2,
  status: 'published',
  message: '同步完成',
  createdAt: '2026-05-31T10:00:00',
  updatedAt: '2026-05-31T10:00:00'
};

const revision = {
  id: 2,
  appCode: 'lawsuit-material-assistant',
  batchNo: 'LPR-20260531-001',
  quoteDate: '2025-05-20',
  oneYearRate: 3,
  fiveYearPlusRate: 3.5,
  revisionType: 'upsert',
  sourceVersion: 'pbc-2025-05-20',
  createdAt: '2026-05-31T10:00:00'
};

function mountPage() {
  const pinia = createPinia();
  setActivePinia(pinia);
  const auth = useAuthStore();
  auth.token = 'token';
  auth.operator = {
    id: 'admin-1',
    name: '管理员',
    roleCode: 'operator',
    roleName: '运营',
    permissions: ['admin:data-governance:view']
  };
  return mount(DataGovernancePage, {
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

describe('DataGovernancePage', () => {
  beforeEach(() => {
    localStorage.clear();
    pageLprSyncBatchesMock.mockReset();
    pageLprRateRevisionsMock.mockReset();
    syncLprRatesMock.mockReset();

    pageLprSyncBatchesMock.mockResolvedValue({ dataList: [syncBatch], totalCount: 1 });
    pageLprRateRevisionsMock.mockResolvedValue({ dataList: [revision], totalCount: 1 });
    syncLprRatesMock.mockResolvedValue({
      batchNo: 'LPR-20260531-002',
      importedCount: 2,
      revisionCount: 2
    });
  });

  it('loads LPR sync batches and revisions on mount', async () => {
    const wrapper = mountPage();

    await flushAsyncUpdates();

    expect(pageLprSyncBatchesMock).toHaveBeenCalledWith({
      appCode: 'lawsuit-material-assistant',
      pageNo: 1,
      pageSize: 50
    });
    expect(pageLprRateRevisionsMock).toHaveBeenCalledWith({
      appCode: 'lawsuit-material-assistant',
      pageNo: 1,
      pageSize: 50
    });
    expect(wrapper.text()).toContain('数据同步/发布');
    expect(wrapper.text()).toContain('同步批次');
    expect(wrapper.text()).toContain('修订记录');
    expect(wrapper.text()).toContain('LPR JSON 发布');
    expect(wrapper.find('input').element.value).toBe('lawsuit-material-assistant');
    expect(wrapper.text()).toContain('LPR-20260531-001');
    expect(wrapper.text()).toContain('2025-05-20');
  });

  it('publishes valid LPR JSON and refreshes batch list', async () => {
    const wrapper = mountPage();
    await flushAsyncUpdates();
    pageLprSyncBatchesMock.mockClear();
    (wrapper.vm as unknown as { activeTab: string }).activeTab = 'json';
    await nextTick();

    const jsonText = JSON.stringify({
      items: [
        { quoteDate: '2025-04-20', oneYearRate: 3.1, fiveYearPlusRate: 3.6 },
        { quoteDate: '2025-05-20', oneYearRate: 3, fiveYearPlusRate: 3.5 }
      ]
    });
    await wrapper.find('[data-test="lpr-sync-json"]').setValue(jsonText);
    await wrapper.find('[data-test="publish-lpr-sync"]').trigger('click');
    await flushAsyncUpdates();

    expect(syncLprRatesMock).toHaveBeenCalledWith({
      appCode: 'lawsuit-material-assistant',
      items: [
        { quoteDate: '2025-04-20', oneYearRate: 3.1, fiveYearPlusRate: 3.6 },
        { quoteDate: '2025-05-20', oneYearRate: 3, fiveYearPlusRate: 3.5 }
      ]
    });
    expect(pageLprSyncBatchesMock).toHaveBeenCalledWith({
      appCode: 'lawsuit-material-assistant',
      pageNo: 1,
      pageSize: 50
    });
  });

  it('rejects LPR JSON without items array before calling backend', async () => {
    const wrapper = mountPage();
    await flushAsyncUpdates();
    (wrapper.vm as unknown as { activeTab: string }).activeTab = 'json';
    await nextTick();

    await wrapper.find('[data-test="lpr-sync-json"]').setValue('{"data":[]}');
    await wrapper.find('[data-test="publish-lpr-sync"]').trigger('click');
    await flushAsyncUpdates();

    expect(syncLprRatesMock).not.toHaveBeenCalled();
    expect(wrapper.text()).toContain('LPR JSON 必须包含 items 数组');
  });
});
