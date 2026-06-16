<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { Refresh, Upload } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import {
  getAnnualCommonDataCoverageMatrix,
  getProductionStatus,
  pageAnnualCommonDataRevisions,
  pageAnnualCommonDataSyncBatches,
  pageLprRateRevisions,
  pageLprSyncBatches,
  previewLprRates,
  syncAnnualCommonData,
  type AnnualCommonDataRevisionItem,
  type AnnualCommonDataCoverageMatrix,
  type AnnualCommonDataYearCoverage,
  type AnnualCommonDataSyncBatchItem,
  type AnnualCommonDataSyncItem,
  type AnnualCommonDataSyncPayload,
  type ProductionStatus,
  syncLprRates,
  type LprRateRevisionItem,
  type LprRateSyncItem,
  type LprRateSyncPayload,
  type LprRateSyncResult,
  type LprSyncBatchItem
} from '../../api/dataGovernance';

const APP_CODE = 'lawsuit-material-assistant';
const PAGE_SIZE = 50;
const ANNUAL_METRIC_LABELS: Record<string, string> = {
  annual_employees_average_wage: '就业人员年平均工资',
  per_capita_disposable_income: '居民人均可支配收入',
  per_capita_consumption_expenditure: '居民人均消费支出'
};

const activeTab = ref('batches');
const appCode = ref(APP_CODE);
const loadingStatus = ref(false);
const loadingBatches = ref(false);
const loadingRevisions = ref(false);
const publishing = ref(false);
const previewingLpr = ref(false);
const loadError = ref('');
const batches = ref<LprSyncBatchItem[]>([]);
const revisions = ref<LprRateRevisionItem[]>([]);
const productionStatus = ref<ProductionStatus | null>(null);
const annualBatches = ref<AnnualCommonDataSyncBatchItem[]>([]);
const annualRevisions = ref<AnnualCommonDataRevisionItem[]>([]);
const annualCoverageMatrix = ref<AnnualCommonDataCoverageMatrix | null>(null);
const lprPreviewResult = ref<LprRateSyncResult | null>(null);
const lprSyncJson = ref(JSON.stringify({
  requestId: 'lpr-preview-2026-01-01-2026-06-11',
  sourceKey: 'lpr_chinamoney',
  sourceVersion: 'lpr-chinamoney-preview-2026-06-11',
  sourceClient: 'crawler-preview-local',
  collectedAt: '2026-06-11T02:00:00+08:00',
  lastCheckedDate: '2026-06-11',
  mode: 'strict',
  payloadHash: 'replace-with-preview-payload-hash',
  items: [
    {
      quoteDate: '2026-05-20',
      oneYearRate: 3,
      fiveYearPlusRate: 3.5,
      sourceUrl: 'https://www.chinamoney.com.cn/chinese/bklpr/',
      sourceRecordId: 'chinamoney-lpr-2026-05-20',
      payloadHash: 'replace-with-item-payload-hash'
    }
  ]
}, null, 2));
const annualCommonDataSyncJson = ref(JSON.stringify({
  requestId: 'crawler-annual-2024',
  sourceKey: 'annual_public_stats',
  sourceVersion: 'public-stats-2024',
  sourceClient: 'crawler-local',
  collectedAt: '2026-06-02T02:00:00+08:00',
  lastCheckedDate: '2026-06-02',
  mode: 'strict',
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
}, null, 2));

function currentAppCode() {
  const value = appCode.value.trim();
  if (value) {
    return value;
  }
  return APP_CODE;
}

function formatTime(value: string) {
  if (!value) {
    return '-';
  }
  return value.replace('T', ' ').replace(/\.\d+$/, '');
}

function statusTagType(status: string) {
  if (status === 'published' || status === 'success') {
    return 'success';
  }
  if (status === 'failed') {
    return 'danger';
  }
  return 'info';
}

function readinessTagType(ready: boolean) {
  if (ready) {
    return 'success';
  }
  return 'danger';
}

function coverageTagType(status: string) {
  if (status === 'complete') {
    return 'success';
  }
  return 'warning';
}

function coverageStatusLabel(status: string) {
  if (status === 'complete') {
    return '完整';
  }
  return '待补齐';
}

function missingMetricLabel(row: AnnualCommonDataYearCoverage) {
  if (!row.missingMetricKeys.length) {
    return '无';
  }
  return `缺少${row.missingMetricKeys.map(metricLabel).join('、')}`;
}

function metricLabel(metricKey: string) {
  return ANNUAL_METRIC_LABELS[metricKey] ?? metricKey;
}

function annualCoverageReason(row: AnnualCommonDataYearCoverage) {
  if (row.status === 'complete') {
    return '覆盖完整';
  }
  if (row.missingMetricKeys.includes('annual_employees_average_wage')) {
    return `${row.year} 年平均工资暂未形成完整批次`;
  }
  if (row.missingRegionCount > 0) {
    return `缺少 ${row.missingRegionCount} 个省级地区`;
  }
  return '指标或地区覆盖未达完整口径';
}

function annualCoverageDecision(row: AnnualCommonDataYearCoverage) {
  if (row.status === 'complete') {
    return '可作为当前有效数据';
  }
  return '暂缓导入';
}

function expectedElementTemplateCount(status: ProductionStatus) {
  if (status.elementTemplate.expectedCount) {
    return status.elementTemplate.expectedCount;
  }
  return status.elementTemplate.count;
}

function elementTemplateSourceLabel(status: ProductionStatus) {
  if (status.elementTemplate.sourceName) {
    return status.elementTemplate.sourceName;
  }
  return '当前示范文本来源';
}

function parseLprSyncJson(value: string): Omit<LprRateSyncPayload, 'appCode'> {
  const parsed = JSON.parse(value) as {
    requestId?: unknown;
    sourceKey?: unknown;
    sourceVersion?: unknown;
    sourceClient?: unknown;
    collectedAt?: unknown;
    lastCheckedDate?: unknown;
    mode?: unknown;
    payloadHash?: unknown;
    items?: unknown;
  };
  if (!Array.isArray(parsed.items)) {
    throw new Error('LPR JSON 必须包含 items 数组');
  }
  return {
    requestId: typeof parsed.requestId === 'string' ? parsed.requestId : undefined,
    sourceKey: typeof parsed.sourceKey === 'string' ? parsed.sourceKey : undefined,
    sourceVersion: typeof parsed.sourceVersion === 'string' ? parsed.sourceVersion : undefined,
    sourceClient: typeof parsed.sourceClient === 'string' ? parsed.sourceClient : undefined,
    collectedAt: typeof parsed.collectedAt === 'string' ? parsed.collectedAt : undefined,
    lastCheckedDate: typeof parsed.lastCheckedDate === 'string' ? parsed.lastCheckedDate : undefined,
    mode: typeof parsed.mode === 'string' ? parsed.mode : undefined,
    payloadHash: typeof parsed.payloadHash === 'string' ? parsed.payloadHash : undefined,
    items: parsed.items as LprRateSyncItem[]
  };
}

function parseAnnualCommonDataSyncJson(value: string): Omit<AnnualCommonDataSyncPayload, 'appCode'> {
  const parsed = JSON.parse(value) as {
    requestId?: unknown;
    sourceKey?: unknown;
    sourceVersion?: unknown;
    sourceClient?: unknown;
    collectedAt?: unknown;
    lastCheckedDate?: unknown;
    mode?: unknown;
    payloadHash?: unknown;
    items?: unknown;
  };
  if (!Array.isArray(parsed.items)) {
    throw new Error('年度数据 JSON 必须包含 items 数组');
  }
  return {
    requestId: String(parsed.requestId ?? ''),
    sourceKey: String(parsed.sourceKey ?? ''),
    sourceVersion: typeof parsed.sourceVersion === 'string' ? parsed.sourceVersion : undefined,
    sourceClient: typeof parsed.sourceClient === 'string' ? parsed.sourceClient : undefined,
    collectedAt: typeof parsed.collectedAt === 'string' ? parsed.collectedAt : undefined,
    lastCheckedDate: typeof parsed.lastCheckedDate === 'string' ? parsed.lastCheckedDate : undefined,
    mode: typeof parsed.mode === 'string' ? parsed.mode : undefined,
    payloadHash: String(parsed.payloadHash ?? ''),
    items: parsed.items as AnnualCommonDataSyncItem[]
  };
}

async function loadBatches() {
  loadingBatches.value = true;
  loadError.value = '';
  try {
    const result = await pageLprSyncBatches({
      appCode: currentAppCode(),
      pageNo: 1,
      pageSize: PAGE_SIZE
    });
    batches.value = result.dataList;
  } catch (error) {
    loadError.value = error instanceof Error ? error.message : '同步批次加载失败';
    batches.value = [];
  } finally {
    loadingBatches.value = false;
  }
}

async function loadRevisions() {
  loadingRevisions.value = true;
  loadError.value = '';
  try {
    const result = await pageLprRateRevisions({
      appCode: currentAppCode(),
      pageNo: 1,
      pageSize: PAGE_SIZE
    });
    revisions.value = result.dataList;
  } catch (error) {
    loadError.value = error instanceof Error ? error.message : '修订记录加载失败';
    revisions.value = [];
  } finally {
    loadingRevisions.value = false;
  }
}

async function loadAnnualBatches() {
  loadingBatches.value = true;
  loadError.value = '';
  try {
    const result = await pageAnnualCommonDataSyncBatches({
      appCode: currentAppCode(),
      pageNo: 1,
      pageSize: PAGE_SIZE
    });
    annualBatches.value = result.dataList;
  } catch (error) {
    loadError.value = error instanceof Error ? error.message : '年度数据同步批次加载失败';
    annualBatches.value = [];
  } finally {
    loadingBatches.value = false;
  }
}

async function loadAnnualRevisions() {
  loadingRevisions.value = true;
  loadError.value = '';
  try {
    const result = await pageAnnualCommonDataRevisions({
      appCode: currentAppCode(),
      pageNo: 1,
      pageSize: PAGE_SIZE
    });
    annualRevisions.value = result.dataList;
  } catch (error) {
    loadError.value = error instanceof Error ? error.message : '年度数据修订记录加载失败';
    annualRevisions.value = [];
  } finally {
    loadingRevisions.value = false;
  }
}

async function loadProductionStatus() {
  loadingStatus.value = true;
  loadError.value = '';
  try {
    productionStatus.value = await getProductionStatus({
      appCode: currentAppCode()
    });
  } catch (error) {
    loadError.value = error instanceof Error ? error.message : '生产巡检状态加载失败';
    productionStatus.value = null;
  } finally {
    loadingStatus.value = false;
  }
}

async function loadAnnualCoverageMatrix() {
  loadingStatus.value = true;
  loadError.value = '';
  try {
    annualCoverageMatrix.value = await getAnnualCommonDataCoverageMatrix({
      appCode: currentAppCode()
    });
  } catch (error) {
    loadError.value = error instanceof Error ? error.message : '年度覆盖矩阵加载失败';
    annualCoverageMatrix.value = null;
  } finally {
    loadingStatus.value = false;
  }
}

async function refreshAll() {
  await Promise.all([
    loadProductionStatus(),
    loadAnnualCoverageMatrix(),
    loadBatches(),
    loadRevisions(),
    loadAnnualBatches(),
    loadAnnualRevisions()
  ]);
}

async function publishLprSync() {
  publishing.value = true;
  loadError.value = '';
  try {
    const parsed = parseLprSyncJson(lprSyncJson.value);
    const result = await syncLprRates({
      appCode: currentAppCode(),
      ...parsed
    });
    ElMessage.success(`LPR JSON 已发布：${result.batchNo ?? result.requestId ?? '已完成'}`);
    await refreshAll();
  } catch (error) {
    loadError.value = error instanceof Error ? error.message : 'LPR JSON 发布失败';
  } finally {
    publishing.value = false;
  }
}

async function previewLprSync() {
  previewingLpr.value = true;
  loadError.value = '';
  try {
    const parsed = parseLprSyncJson(lprSyncJson.value);
    lprPreviewResult.value = await previewLprRates({
      appCode: currentAppCode(),
      ...parsed
    });
  } catch (error) {
    loadError.value = error instanceof Error ? error.message : 'LPR JSON 预览失败';
    lprPreviewResult.value = null;
  } finally {
    previewingLpr.value = false;
  }
}

async function publishAnnualCommonDataSync() {
  publishing.value = true;
  loadError.value = '';
  try {
    const parsed = parseAnnualCommonDataSyncJson(annualCommonDataSyncJson.value);
    const result = await syncAnnualCommonData({
      appCode: currentAppCode(),
      ...parsed
    });
    ElMessage.success(`年度数据 JSON 已导入：${result.requestId}`);
    await Promise.all([loadAnnualBatches(), loadAnnualRevisions()]);
  } catch (error) {
    loadError.value = error instanceof Error ? error.message : '年度数据 JSON 导入失败';
  } finally {
    publishing.value = false;
  }
}

onMounted(refreshAll);
</script>

<template>
  <section>
    <h1 class="page-title">数据同步/发布</h1>
    <p class="page-subtitle">通过 miniapp-backend 受控 API 管理法律助手业务数据同步批次、修订记录、LPR JSON 发布和年度数据 JSON 导入。</p>

    <el-alert v-if="loadError" class="error-alert" type="error" :title="loadError" show-icon />

    <el-card shadow="never" class="status-panel" v-loading="loadingStatus">
      <div class="status-header">
        <div>
          <div class="toolbar-title">生产巡检</div>
          <div class="toolbar-subtitle">只读汇总生产测试库关键数据状态，不触发采集或写入。</div>
        </div>
        <el-tag v-if="productionStatus" :type="readinessTagType(productionStatus.ready)" effect="plain">
          {{ productionStatus.ready ? '就绪' : '需处理' }}
        </el-tag>
      </div>
      <div v-if="productionStatus" class="status-grid">
        <div class="status-item">
          <div class="status-label">数据库迁移</div>
          <div class="status-value">Flyway V{{ productionStatus.flyway.version }}</div>
          <div class="status-note">{{ productionStatus.flyway.success ? '迁移成功' : '迁移异常' }}</div>
        </div>
        <div class="status-item">
          <div class="status-label">品牌残留</div>
          <div class="status-value">
            {{ productionStatus.brand.oldBrandBannerCount + productionStatus.brand.oldBrandCapabilityCount }} 处
          </div>
          <div class="status-note">公告 / 工具来源旧文案</div>
        </div>
        <div class="status-item">
          <div class="status-label">LPR</div>
          <div class="status-value">LPR {{ productionStatus.lpr.count }} 条</div>
          <div class="status-note">{{ productionStatus.lpr.minQuoteDate }} 至 {{ productionStatus.lpr.maxQuoteDate }}</div>
        </div>
        <div class="status-item">
          <div class="status-label">年度数据</div>
          <div class="status-value">年度数据 {{ productionStatus.annualCommonData.count }} 条</div>
          <div class="status-note">{{ productionStatus.annualCommonData.minYear }} 至 {{ productionStatus.annualCommonData.maxYear }}</div>
        </div>
        <div class="status-item">
          <div class="status-label">示范文本</div>
          <div class="status-value">
            示范文本 {{ productionStatus.elementTemplate.count }} / {{ expectedElementTemplateCount(productionStatus) }} 份
          </div>
          <div class="status-note">
            文件元数据 {{ productionStatus.elementTemplate.filePathCount ?? productionStatus.elementTemplate.count }} /
            {{ expectedElementTemplateCount(productionStatus) }}，缺失 {{ productionStatus.elementTemplate.missingFileMetadataCount }} 份
          </div>
          <div class="status-note">{{ elementTemplateSourceLabel(productionStatus) }}</div>
          <div v-if="productionStatus.elementTemplate.sourceVersion" class="status-note">
            {{ productionStatus.elementTemplate.sourceVersion }} · {{ productionStatus.elementTemplate.lastCheckedDate || '-' }}
          </div>
        </div>
        <div class="status-item">
          <div class="status-label">民事案由</div>
          <div class="status-value">民事案由 {{ productionStatus.civilCause.count }} 项</div>
          <div class="status-note">官方目录与业务别名合并口径</div>
        </div>
      </div>
      <el-empty v-else description="暂无生产巡检数据" />
    </el-card>

    <el-card shadow="never" class="governance-panel">
      <div class="toolbar">
        <el-form class="app-form" label-width="72px" inline>
          <el-form-item label="appCode">
            <el-input v-model="appCode" class="app-code-input" />
          </el-form-item>
        </el-form>
        <div class="toolbar-actions">
          <el-button :icon="Refresh" @click="refreshAll">刷新</el-button>
        </div>
      </div>

      <el-tabs v-model="activeTab">
        <el-tab-pane label="同步批次" name="batches">
          <div class="section-heading">
            <div class="toolbar-title">LPR 同步批次</div>
            <div class="toolbar-subtitle">展示后端受控同步或发布动作形成的批次记录。</div>
          </div>
          <el-table v-loading="loadingBatches" :data="batches" row-key="id">
            <el-table-column prop="batchNo" label="批次号" min-width="190" show-overflow-tooltip />
            <el-table-column prop="sourceVersion" label="来源版本" min-width="160" show-overflow-tooltip />
            <el-table-column prop="itemCount" label="条目数" width="90" />
            <el-table-column prop="importedCount" label="导入数" width="90" />
            <el-table-column label="状态" width="120">
              <template #default="{ row }">
                <el-tag :type="statusTagType(row.status)" effect="plain">{{ row.status }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="message" label="说明" min-width="180" show-overflow-tooltip />
            <el-table-column label="创建时间" width="180">
              <template #default="{ row }">{{ formatTime(row.createdAt) }}</template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="修订记录" name="revisions">
          <div class="section-heading">
            <div class="toolbar-title">LPR 修订记录</div>
            <div class="toolbar-subtitle">按批次跟踪每个报价日期的新增、更新和复核结果。</div>
          </div>
          <el-table v-loading="loadingRevisions" :data="revisions" row-key="id">
            <el-table-column prop="batchNo" label="批次号" min-width="190" show-overflow-tooltip />
            <el-table-column prop="quoteDate" label="报价日期" width="130" />
            <el-table-column prop="oneYearRate" label="一年期 LPR" width="130" />
            <el-table-column prop="fiveYearPlusRate" label="五年期以上" width="130" />
            <el-table-column prop="revisionType" label="修订类型" width="120" />
            <el-table-column prop="sourceVersion" label="来源版本" min-width="160" show-overflow-tooltip />
            <el-table-column label="创建时间" width="180">
              <template #default="{ row }">{{ formatTime(row.createdAt) }}</template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="年度数据同步批次" name="annual-batches">
          <div class="section-heading">
            <div class="toolbar-title">年度数据同步批次</div>
            <div class="toolbar-subtitle">展示年度常用数据受控同步形成的批次、状态和冲突统计。</div>
          </div>
          <el-table v-loading="loadingBatches" :data="annualBatches" row-key="id">
            <el-table-column prop="requestId" label="请求标识" min-width="190" show-overflow-tooltip />
            <el-table-column prop="sourceKey" label="来源标识" min-width="160" show-overflow-tooltip />
            <el-table-column prop="sourceVersion" label="来源版本" min-width="160" show-overflow-tooltip />
            <el-table-column prop="itemCount" label="条目数" width="90" />
            <el-table-column prop="createdCount" label="新增" width="80" />
            <el-table-column prop="updatedCount" label="更新" width="80" />
            <el-table-column prop="conflictCount" label="冲突" width="80" />
            <el-table-column label="状态" width="120">
              <template #default="{ row }">
                <el-tag :type="statusTagType(row.status)" effect="plain">{{ row.status }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="创建时间" width="180">
              <template #default="{ row }">{{ formatTime(row.createdAt) }}</template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="年度覆盖矩阵" name="annual-coverage">
          <div class="section-heading">
            <div class="toolbar-title">年度覆盖矩阵</div>
            <div class="toolbar-subtitle">按年份核对省级地区、指标覆盖和最近同步批次，辅助判断是否可进入下一批导入。</div>
          </div>
          <el-table
            v-if="annualCoverageMatrix"
            v-loading="loadingStatus"
            :data="annualCoverageMatrix.years"
            row-key="year"
            data-test="annual-coverage-matrix"
          >
            <el-table-column prop="year" label="年度" width="90" />
            <el-table-column label="状态" width="110">
              <template #default="{ row }">
                <el-tag :type="coverageTagType(row.status)" effect="plain">{{ coverageStatusLabel(row.status) }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="数据条数" width="110">
              <template #default="{ row }">{{ row.itemCount }}</template>
            </el-table-column>
            <el-table-column label="地区覆盖" width="140">
              <template #default="{ row }">{{ row.regionCount }} / {{ annualCoverageMatrix.expectedRegionCount }}</template>
            </el-table-column>
            <el-table-column label="指标覆盖" width="140">
              <template #default="{ row }">{{ row.metricCount }} / {{ annualCoverageMatrix.expectedMetricCount }}</template>
            </el-table-column>
            <el-table-column label="缺失指标" min-width="220" show-overflow-tooltip>
              <template #default="{ row }">{{ missingMetricLabel(row) }}</template>
            </el-table-column>
            <el-table-column label="缺口原因" min-width="220" show-overflow-tooltip>
              <template #default="{ row }">{{ annualCoverageReason(row) }}</template>
            </el-table-column>
            <el-table-column label="治理建议" width="130">
              <template #default="{ row }">{{ annualCoverageDecision(row) }}</template>
            </el-table-column>
            <el-table-column prop="missingRegionCount" label="缺失地区" width="110" />
            <el-table-column label="最近同步批次" min-width="220" show-overflow-tooltip>
              <template #default="{ row }">{{ row.latestBatch?.requestId || '-' }}</template>
            </el-table-column>
            <el-table-column label="来源版本" min-width="190" show-overflow-tooltip>
              <template #default="{ row }">{{ row.latestBatch?.sourceVersion || '-' }}</template>
            </el-table-column>
            <el-table-column label="最近核验" width="130">
              <template #default="{ row }">{{ row.latestBatch?.lastCheckedDate || '-' }}</template>
            </el-table-column>
            <el-table-column label="批次状态" width="120">
              <template #default="{ row }">
                <el-tag v-if="row.latestBatch" :type="statusTagType(row.latestBatch.status)" effect="plain">
                  {{ row.latestBatch.status }}
                </el-tag>
                <span v-else>-</span>
              </template>
            </el-table-column>
          </el-table>
          <el-empty v-else description="暂无年度覆盖矩阵" />
        </el-tab-pane>

        <el-tab-pane label="年度数据修订记录" name="annual-revisions">
          <div class="section-heading">
            <div class="toolbar-title">年度数据修订记录</div>
            <div class="toolbar-subtitle">按地区、年度和指标跟踪新增、更新、跳过和冲突记录。</div>
          </div>
          <el-table v-loading="loadingRevisions" :data="annualRevisions" row-key="id">
            <el-table-column prop="batchId" label="批次 ID" width="100" />
            <el-table-column prop="regionCode" label="地区编码" min-width="140" show-overflow-tooltip />
            <el-table-column prop="year" label="年度" width="90" />
            <el-table-column prop="metricKey" label="指标标识" min-width="180" show-overflow-tooltip />
            <el-table-column prop="changeType" label="修订类型" width="120" />
            <el-table-column prop="message" label="说明" min-width="160" show-overflow-tooltip />
            <el-table-column label="创建时间" width="180">
              <template #default="{ row }">{{ formatTime(row.createdAt) }}</template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="LPR JSON 发布" name="json">
          <div class="section-heading">
            <div class="toolbar-title">LPR JSON 发布</div>
            <div class="toolbar-subtitle">粘贴结构化 JSON，由后端校验、落库并形成同步批次。</div>
          </div>
          <textarea
            v-model="lprSyncJson"
            data-test="lpr-sync-json"
            class="json-editor"
            rows="14"
            spellcheck="false"
          />
          <div class="publish-actions">
            <el-button
              data-test="preview-lpr-sync"
              :loading="previewingLpr"
              @click="previewLprSync"
            >
              预览 LPR JSON
            </el-button>
            <el-button
              data-test="publish-lpr-sync"
              type="primary"
              :icon="Upload"
              :loading="publishing"
              @click="publishLprSync"
            >
              发布 LPR JSON
            </el-button>
          </div>
          <div v-if="lprPreviewResult" class="preview-result" data-test="lpr-preview-result">
            <div class="toolbar-title">预览结果</div>
            <div class="preview-summary">
              <el-tag type="success" effect="plain">新增 {{ lprPreviewResult.createdCount ?? 0 }}</el-tag>
              <el-tag effect="plain">跳过 {{ lprPreviewResult.skippedCount ?? 0 }}</el-tag>
              <el-tag type="warning" effect="plain">更新 {{ lprPreviewResult.updatedCount ?? 0 }}</el-tag>
              <el-tag type="danger" effect="plain">冲突 {{ lprPreviewResult.conflictCount ?? 0 }}</el-tag>
            </div>
            <el-table :data="lprPreviewResult.items ?? []" row-key="quoteDate" size="small">
              <el-table-column prop="quoteDate" label="报价日期" width="130" />
              <el-table-column prop="oneYearRate" label="一年期" width="100" />
              <el-table-column prop="fiveYearPlusRate" label="五年期以上" width="120" />
              <el-table-column prop="action" label="动作" width="100" />
              <el-table-column prop="message" label="说明" min-width="180" show-overflow-tooltip />
            </el-table>
          </div>
        </el-tab-pane>

        <el-tab-pane label="年度数据 JSON 导入" name="annual-json">
          <div class="section-heading">
            <div class="toolbar-title">年度数据 JSON 导入</div>
            <div class="toolbar-subtitle">粘贴 crawler 规范化年度数据快照，由后端校验、落库并形成同步批次。</div>
          </div>
          <textarea
            v-model="annualCommonDataSyncJson"
            data-test="annual-common-data-sync-json"
            class="json-editor"
            rows="14"
            spellcheck="false"
          />
          <div class="publish-actions">
            <el-button
              data-test="publish-annual-common-data-sync"
              type="primary"
              :icon="Upload"
              :loading="publishing"
              @click="publishAnnualCommonDataSync"
            >
              导入年度数据 JSON
            </el-button>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </section>
</template>

<style scoped>
.error-alert {
  margin-bottom: 16px;
}

.governance-panel {
  min-height: 560px;
}

.status-panel {
  margin-bottom: 16px;
}

.status-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 12px;
}

.status-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.status-item {
  border: 1px solid #eaecf0;
  border-radius: 6px;
  padding: 12px;
  background: #fcfcfd;
}

.status-label {
  color: #667085;
  font-size: 12px;
}

.status-value {
  margin-top: 6px;
  color: #101828;
  font-size: 17px;
  font-weight: 600;
}

.status-note {
  margin-top: 4px;
  color: #667085;
  font-size: 12px;
}

.toolbar {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 12px;
}

.app-form {
  min-width: 360px;
}

.app-code-input {
  width: 300px;
}

.toolbar-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-heading {
  margin-bottom: 12px;
}

.toolbar-title {
  color: #344054;
  font-size: 15px;
  font-weight: 600;
}

.toolbar-subtitle {
  margin-top: 4px;
  color: #667085;
  font-size: 13px;
}

.json-editor {
  width: 100%;
  min-height: 320px;
  resize: vertical;
  color: #1d2939;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  padding: 10px 12px;
  font-family: "SFMono-Regular", Consolas, "Liberation Mono", monospace;
  font-size: 13px;
  line-height: 1.6;
}

.json-editor:focus {
  border-color: #409eff;
  outline: none;
}

.publish-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 12px;
}

.preview-result {
  margin-top: 16px;
  border: 1px solid #eaecf0;
  border-radius: 6px;
  padding: 12px;
  background: #fcfcfd;
}

.preview-summary {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 10px 0 12px;
}

@media (max-width: 720px) {
  .toolbar {
    flex-direction: column;
  }

  .status-grid {
    grid-template-columns: 1fr;
  }

  .app-form,
  .app-code-input {
    width: 100%;
    min-width: 0;
  }
}
</style>
