import { mount } from '@vue/test-utils';
import ElementPlus from 'element-plus';
import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { nextTick } from 'vue';
import {
  pageAnnualCommonDataRevisions,
  pageAnnualCommonDataSyncBatches,
  pageLprRateRevisions,
  pageLprSyncBatches,
  getAnnualCommonDataCoverageMatrix,
  getProductionStatus,
  previewLprRates,
  syncAnnualCommonData,
  syncLprRates
} from '../../api/dataGovernance';
import { useAuthStore } from '../../stores/auth';
import DataGovernancePage from './DataGovernancePage.vue';

vi.mock('../../api/dataGovernance', () => ({
  pageLprSyncBatches: vi.fn(),
  pageLprRateRevisions: vi.fn(),
  previewLprRates: vi.fn(),
  syncLprRates: vi.fn(),
  pageAnnualCommonDataSyncBatches: vi.fn(),
  pageAnnualCommonDataRevisions: vi.fn(),
  getAnnualCommonDataCoverageMatrix: vi.fn(),
  getProductionStatus: vi.fn(),
  syncAnnualCommonData: vi.fn()
}));

const pageLprSyncBatchesMock = vi.mocked(pageLprSyncBatches);
const pageLprRateRevisionsMock = vi.mocked(pageLprRateRevisions);
const previewLprRatesMock = vi.mocked(previewLprRates);
const syncLprRatesMock = vi.mocked(syncLprRates);
const pageAnnualCommonDataSyncBatchesMock = vi.mocked(pageAnnualCommonDataSyncBatches);
const pageAnnualCommonDataRevisionsMock = vi.mocked(pageAnnualCommonDataRevisions);
const getAnnualCommonDataCoverageMatrixMock = vi.mocked(getAnnualCommonDataCoverageMatrix);
const getProductionStatusMock = vi.mocked(getProductionStatus);
const syncAnnualCommonDataMock = vi.mocked(syncAnnualCommonData);

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

const annualBatch = {
  id: 11,
  appCode: 'lawsuit-material-assistant',
  requestId: 'crawler-annual-2024',
  sourceKey: 'annual_public_stats',
  sourceVersion: 'public-stats-2024',
  payloadHash: 'hash-annual-2024',
  itemCount: 1,
  status: 'completed',
  createdCount: 1,
  updatedCount: 0,
  skippedCount: 0,
  conflictCount: 0,
  errorMessage: '',
  sourceClient: 'crawler-local',
  collectedAt: '2026-06-02T02:00:00+08:00',
  lastCheckedDate: '2026-06-02',
  createdAt: '2026-06-02T10:00:00',
  updatedAt: '2026-06-02T10:00:00'
};

const annualRevision = {
  id: 12,
  annualDataId: 21,
  batchId: 11,
  appCode: 'lawsuit-material-assistant',
  regionCode: 'cn-shanghai',
  year: 2024,
  metricKey: 'average_salary',
  beforeSnapshotJson: '{}',
  afterSnapshotJson: '{}',
  changeType: 'created',
  message: 'created',
  createdAt: '2026-06-02T10:00:00'
};

const productionStatus = {
  appCode: 'lawsuit-material-assistant',
  checkedAt: '2026-06-09T20:00:00',
  ready: true,
  flyway: {
    version: '131',
    description: 'import complete civil cause catalog',
    success: true
  },
  brand: {
    oldBrandBannerCount: 0,
    oldBrandCapabilityCount: 0
  },
  lpr: {
    count: 82,
    minQuoteDate: '2019-08-20',
    maxQuoteDate: '2026-05-20'
  },
  annualCommonData: {
    count: 13,
    minYear: 2024,
    maxYear: 2024
  },
  elementTemplate: {
    sourceKey: 'element_template_docimax_practical_2025',
    sourceName: 'Docimax 法律文书助手要素式文本实用树源',
    sourceVersion: 'element-template-docimax-practical-2025',
    lastCheckedDate: '2026-06-10',
    expectedCount: 226,
    count: 226,
    filePathCount: 226,
    missingFileMetadataCount: 0,
    ready: true
  },
  civilCause: {
    count: 1043
  }
};

const annualCoverageMatrix = {
  appCode: 'lawsuit-material-assistant',
  expectedRegionCount: 31,
  expectedMetricCount: 3,
  expectedMetricKeys: [
    'annual_employees_average_wage',
    'per_capita_disposable_income',
    'per_capita_consumption_expenditure'
  ],
  years: [
    {
      year: 2025,
      itemCount: 62,
      regionCount: 31,
      metricCount: 2,
      status: 'partial',
      missingMetricKeys: ['annual_employees_average_wage'],
      missingRegionCount: 0,
      missingRegionSamples: [],
      latestBatch: {
        id: 3,
        requestId: 'annual-nbs-2025-gap',
        sourceKey: 'annual_nbs_province_2025',
        sourceVersion: 'nbs-province-annual-2025',
        itemCount: 62,
        createdCount: 62,
        updatedCount: 0,
        skippedCount: 0,
        conflictCount: 0,
        status: 'completed',
        lastCheckedDate: '2026-06-16'
      }
    },
    {
      year: 2024,
      itemCount: 93,
      regionCount: 31,
      metricCount: 3,
      status: 'complete',
      missingMetricKeys: [],
      missingRegionCount: 0,
      missingRegionSamples: [],
      latestBatch: {
        id: 2,
        requestId: 'annual-nbs-2024-0e5f97b4d58b',
        sourceKey: 'annual_nbs_province_2024',
        sourceVersion: 'nbs-province-annual-2024',
        itemCount: 93,
        createdCount: 88,
        updatedCount: 5,
        skippedCount: 0,
        conflictCount: 0,
        status: 'completed',
        lastCheckedDate: '2026-06-16'
      }
    }
  ]
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
    previewLprRatesMock.mockReset();
    syncLprRatesMock.mockReset();
    pageAnnualCommonDataSyncBatchesMock.mockReset();
    pageAnnualCommonDataRevisionsMock.mockReset();
    getAnnualCommonDataCoverageMatrixMock.mockReset();
    getProductionStatusMock.mockReset();
    syncAnnualCommonDataMock.mockReset();

    pageLprSyncBatchesMock.mockResolvedValue({ dataList: [syncBatch], totalCount: 1 });
    pageLprRateRevisionsMock.mockResolvedValue({ dataList: [revision], totalCount: 1 });
    previewLprRatesMock.mockResolvedValue({
      batchId: null,
      requestId: 'crawler-lpr-preview',
      status: 'conflict',
      createdCount: 1,
      updatedCount: 0,
      skippedCount: 1,
      conflictCount: 1,
      items: [
        { quoteDate: '2026-05-20', action: 'skipped', message: 'same_rate' },
        { quoteDate: '2026-04-20', action: 'created', message: 'missing_in_current' },
        { quoteDate: '2026-03-20', action: 'conflict', message: 'verified_rate_differs' }
      ]
    });
    syncLprRatesMock.mockResolvedValue({
      batchNo: 'LPR-20260531-002',
      importedCount: 2,
      revisionCount: 2
    });
    pageAnnualCommonDataSyncBatchesMock.mockResolvedValue({ dataList: [annualBatch], totalCount: 1 });
    pageAnnualCommonDataRevisionsMock.mockResolvedValue({ dataList: [annualRevision], totalCount: 1 });
    getAnnualCommonDataCoverageMatrixMock.mockResolvedValue(annualCoverageMatrix);
    getProductionStatusMock.mockResolvedValue(productionStatus);
    syncAnnualCommonDataMock.mockResolvedValue({
      requestId: 'crawler-annual-2024',
      createdCount: 1,
      updatedCount: 0,
      skippedCount: 0,
      conflictCount: 0
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
    expect(pageAnnualCommonDataSyncBatchesMock).toHaveBeenCalledWith({
      appCode: 'lawsuit-material-assistant',
      pageNo: 1,
      pageSize: 50
    });
    expect(pageAnnualCommonDataRevisionsMock).toHaveBeenCalledWith({
      appCode: 'lawsuit-material-assistant',
      pageNo: 1,
      pageSize: 50
    });
    expect(getAnnualCommonDataCoverageMatrixMock).toHaveBeenCalledWith({
      appCode: 'lawsuit-material-assistant'
    });
    expect(getProductionStatusMock).toHaveBeenCalledWith({
      appCode: 'lawsuit-material-assistant'
    });
    expect(wrapper.text()).toContain('数据同步/发布');
    expect(wrapper.text()).toContain('生产巡检');
    expect(wrapper.text()).toContain('就绪');
    expect(wrapper.text()).toContain('Flyway V131');
    expect(wrapper.text()).toContain('LPR 82 条');
    expect(wrapper.text()).toContain('民事案由 1043 项');
    expect(wrapper.text()).toContain('示范文本 226 / 226 份');
    expect(wrapper.text()).toContain('文件元数据 226 / 226');
    expect(wrapper.text()).toContain('Docimax 法律文书助手要素式文本实用树源');
    expect(wrapper.text()).toContain('element-template-docimax-practical-2025');
    expect(wrapper.text()).toContain('同步批次');
    expect(wrapper.text()).toContain('修订记录');
    expect(wrapper.text()).toContain('LPR JSON 发布');
    expect(wrapper.text()).toContain('年度数据同步批次');
    expect(wrapper.text()).toContain('年度覆盖矩阵');
    expect(wrapper.text()).toContain('年度数据修订记录');
    expect(wrapper.text()).toContain('年度数据 JSON 导入');
    expect(wrapper.find('input').element.value).toBe('lawsuit-material-assistant');
    expect(wrapper.text()).toContain('LPR-20260531-001');
    expect(wrapper.text()).toContain('2025-05-20');
    expect(wrapper.text()).toContain('crawler-annual-2024');
    expect(wrapper.text()).toContain('average_salary');
    expect(wrapper.text()).toContain('2025');
    expect(wrapper.text()).toContain('缺少 annual_employees_average_wage');
    expect(wrapper.text()).toContain('annual-nbs-2025-gap');
    expect(wrapper.text()).toContain('2024');
    expect(wrapper.text()).toContain('完整');
  });

  it('publishes valid LPR JSON and refreshes batch list', async () => {
    const wrapper = mountPage();
    await flushAsyncUpdates();
    pageLprSyncBatchesMock.mockClear();
    (wrapper.vm as unknown as { activeTab: string }).activeTab = 'json';
    await nextTick();

    const jsonText = JSON.stringify({
      requestId: 'crawler-lpr-2025',
      sourceKey: 'lpr_chinamoney',
      payloadHash: 'hash-lpr-2025',
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
      requestId: 'crawler-lpr-2025',
      sourceKey: 'lpr_chinamoney',
      payloadHash: 'hash-lpr-2025',
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

  it('publishes valid annual common data JSON and refreshes annual lists', async () => {
    const wrapper = mountPage();
    await flushAsyncUpdates();
    pageAnnualCommonDataSyncBatchesMock.mockClear();
    (wrapper.vm as unknown as { activeTab: string }).activeTab = 'annual-json';
    await nextTick();

    const jsonText = JSON.stringify({
      requestId: 'crawler-annual-2024',
      sourceKey: 'annual_public_stats',
      payloadHash: 'hash-annual-2024',
      items: [
        {
          regionCode: 'cn-shanghai',
          regionName: '上海市',
          year: 2024,
          metricKey: 'average_salary',
          metricName: '平均工资',
          value: 120000,
          unit: '元/年',
          sourceName: '统计公报',
          sourceUrl: 'https://tjj.sh.gov.cn/'
        }
      ]
    });
    await wrapper.find('[data-test="annual-common-data-sync-json"]').setValue(jsonText);
    await wrapper.find('[data-test="publish-annual-common-data-sync"]').trigger('click');
    await flushAsyncUpdates();

    expect(syncAnnualCommonDataMock).toHaveBeenCalledWith({
      appCode: 'lawsuit-material-assistant',
      requestId: 'crawler-annual-2024',
      sourceKey: 'annual_public_stats',
      payloadHash: 'hash-annual-2024',
      items: [
        {
          regionCode: 'cn-shanghai',
          regionName: '上海市',
          year: 2024,
          metricKey: 'average_salary',
          metricName: '平均工资',
          value: 120000,
          unit: '元/年',
          sourceName: '统计公报',
          sourceUrl: 'https://tjj.sh.gov.cn/'
        }
      ]
    });
    expect(pageAnnualCommonDataSyncBatchesMock).toHaveBeenCalledWith({
      appCode: 'lawsuit-material-assistant',
      pageNo: 1,
      pageSize: 50
    });
  });

  it('previews valid LPR JSON without refreshing batch list', async () => {
    const wrapper = mountPage();
    await flushAsyncUpdates();
    pageLprSyncBatchesMock.mockClear();
    (wrapper.vm as unknown as { activeTab: string }).activeTab = 'json';
    await nextTick();

    const jsonText = JSON.stringify({
      requestId: 'crawler-lpr-preview',
      sourceKey: 'lpr_chinamoney',
      payloadHash: 'hash-lpr-preview',
      items: [
        {
          quoteDate: '2026-05-20',
          oneYearRate: 3,
          fiveYearPlusRate: 3.5,
          sourceUrl: 'https://www.chinamoney.com.cn/chinese/bklpr/'
        }
      ]
    });
    await wrapper.find('[data-test="lpr-sync-json"]').setValue(jsonText);
    await wrapper.find('[data-test="preview-lpr-sync"]').trigger('click');
    await flushAsyncUpdates();

    expect(previewLprRatesMock).toHaveBeenCalledWith({
      appCode: 'lawsuit-material-assistant',
      requestId: 'crawler-lpr-preview',
      sourceKey: 'lpr_chinamoney',
      payloadHash: 'hash-lpr-preview',
      items: [
        {
          quoteDate: '2026-05-20',
          oneYearRate: 3,
          fiveYearPlusRate: 3.5,
          sourceUrl: 'https://www.chinamoney.com.cn/chinese/bklpr/'
        }
      ]
    });
    expect(syncLprRatesMock).not.toHaveBeenCalled();
    expect(pageLprSyncBatchesMock).not.toHaveBeenCalled();
    expect(wrapper.text()).toContain('预览结果');
    expect(wrapper.text()).toContain('新增 1');
    expect(wrapper.text()).toContain('跳过 1');
    expect(wrapper.text()).toContain('冲突 1');
    expect(wrapper.text()).toContain('2026-03-20');
    expect(wrapper.text()).toContain('verified_rate_differs');
  });

  it('rejects annual common data JSON without items array before calling backend', async () => {
    const wrapper = mountPage();
    await flushAsyncUpdates();
    (wrapper.vm as unknown as { activeTab: string }).activeTab = 'annual-json';
    await nextTick();

    await wrapper.find('[data-test="annual-common-data-sync-json"]').setValue('{"data":[]}');
    await wrapper.find('[data-test="publish-annual-common-data-sync"]').trigger('click');
    await flushAsyncUpdates();

    expect(syncAnnualCommonDataMock).not.toHaveBeenCalled();
    expect(wrapper.text()).toContain('年度数据 JSON 必须包含 items 数组');
  });
});
